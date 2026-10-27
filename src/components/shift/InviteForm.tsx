"use client";

import { useEffect, useRef, useState, type FormEvent, type MouseEvent, type ReactNode } from "react";
import { FilmButton } from "@/components/film/FilmOverlay";
import { contactEmail, shareMailto } from "@/content/event";
import { FOCUS, INTERESTS, SEATS } from "@/content/register";
import { cta } from "@/content/story";
import { greetingName } from "@/lib/confirmation-email";
import { normalizeLinkedIn } from "@/lib/linkedin";

type State = { kind: "idle" } | { kind: "sending" } | { kind: "done"; name: string; updated: boolean } | { kind: "failed"; message: string };

/** A conversation chosen elsewhere on the page: the form ticks it (detail: the INTERESTS value). */
const PICK_INTEREST = "nxo:pick-interest";

/**
 * Where the visitor came from (?ref= or ?utm_source=), kept for the visit so
 * it survives a click through to /register. Stored with the request as
 * "site:linkedin", so each invitation channel can be traced.
 */
function referral(): string {
  try {
    const q = new URLSearchParams(window.location.search);
    const ref = (q.get("ref") ?? q.get("utm_source") ?? "")
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, "-")
      .slice(0, 24);
    if (ref) sessionStorage.setItem("nxo-ref", ref);
    return ref || sessionStorage.getItem("nxo-ref") || "";
  } catch {
    return "";
  }
}

/** "Know a GCC leader who should be in the room?" — an email the visitor sends a colleague. */
function Share() {
  return (
    <p className="rf__share">
      Know a GCC leader who should be in the room?{" "}
      <a href={shareMailto}>
        Send them the invitation <span aria-hidden="true">→</span>
      </a>
    </p>
  );
}

/**
 * A theme's "Request a place": on the home page it ticks that conversation in
 * the form and goes there; elsewhere (or without script) it opens /register
 * with the conversation ticked.
 */
export function InterestLink({ href, interest, className, children }: { href: string; interest: string; className?: string; children: ReactNode }) {
  const go = (e: MouseEvent<HTMLAnchorElement>) => {
    const form = document.querySelector<HTMLElement>("#request form.rf");
    if (!form || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    window.dispatchEvent(new CustomEvent(PICK_INTEREST, { detail: interest }));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("request")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    // once the form has shown the ticked chip (phones open the optional details first)
    requestAnimationFrame(() =>
      form.querySelector<HTMLInputElement>(`input[name="interests"][value="${CSS.escape(interest)}"]`)?.focus({ preventScroll: true }),
    );
  };
  return (
    <a className={className} href={href} onClick={go}>
      {children}
    </a>
  );
}

/**
 * Request an invitation. Four typed fields and one tap; two optional groups
 * of taps (behind one button on phones). Submissions are stored (POST
 * /api/register → Neon Postgres) and listed for the organisers at
 * /register/response. `preset` preselects a conversation (from
 * /register?interest=talent|technology|leadership).
 */
export function InviteForm({ source = "site", preset }: { source?: string; preset?: string }) {
  const [state, setState] = useState<State>({ kind: "idle" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [role, setRole] = useState("");
  // phones: the optional groups wait behind a button — open already when a conversation was chosen
  const [more, setMore] = useState(Boolean(preset));
  const formRef = useRef<HTMLFormElement | null>(null);
  // a signed, timestamped token from the server; the API refuses submissions without it
  const token = useRef<string>("");
  const fetchToken = () =>
    fetch("/api/register/token", { cache: "no-store" })
      .then((r) => r.json())
      .then((j: { t?: string }) => {
        token.current = j.t ?? "";
      })
      .catch(() => {});
  useEffect(() => {
    void fetchToken();
  }, []);

  useEffect(() => {
    const pick = (e: Event) => {
      const box = formRef.current?.querySelector<HTMLInputElement>(`input[name="interests"][value="${CSS.escape(String((e as CustomEvent).detail))}"]`);
      if (!box) return;
      box.checked = true;
      setMore(true);
    };
    window.addEventListener(PICK_INTEREST, pick);
    return () => window.removeEventListener(PICK_INTEREST, pick);
  }, []);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const v = (k: string) => String(fd.get(k) ?? "").trim();
    const local: Record<string, string> = {};
    if (!v("name")) local.name = "Please add your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("email"))) local.email = "Please add a valid work email.";
    if (!v("organisation")) local.organisation = "Please add your organisation.";
    if (!v("role")) local.role = "Please choose your role.";
    const li = normalizeLinkedIn(v("linkedin"));
    if (!li.ok) local.linkedin = li.error;
    if (Object.keys(local).length) {
      setErrors(local);
      form.querySelector<HTMLElement>(`[name="${Object.keys(local)[0]}"]`)?.focus();
      return;
    }
    setErrors({});
    setState({ kind: "sending" });
    const ref = referral();
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: v("name"),
          email: v("email"),
          organisation: v("organisation"),
          role: v("role"),
          linkedin: li.ok ? li.url : v("linkedin"),
          t: token.current,
          interests: fd.getAll("interests"),
          focus: fd.getAll("focus"),
          website: v("website"),
          source: ref ? `${source}:${ref}` : source,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; updated?: boolean; errors?: Record<string, string>; error?: string };
      if (res.ok && json.ok) {
        setState({ kind: "done", name: greetingName(v("name")), updated: !!json.updated });
        return;
      }
      if (json.errors) {
        setErrors(json.errors);
        setState({ kind: "idle" });
        form.querySelector<HTMLElement>(`[name="${Object.keys(json.errors)[0]}"]`)?.focus();
        return;
      }
      setState({ kind: "failed", message: json.error ?? "We couldn’t save your request just now." });
      void fetchToken();
    } catch {
      setState({ kind: "failed", message: "You seem to be offline." });
    }
  };

  // remember the referral as soon as the form is seen, before any navigation
  useEffect(() => void referral(), []);

  const err = (k: string) =>
    errors[k] ? (
      <span className="rf__err" id={`${k}-${source}-err`}>
        {errors[k]}
      </span>
    ) : null;
  const a = (k: string) => ({
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `${k}-${source}-err` : undefined,
  });

  if (state.kind === "done") {
    return (
      <div className="rf rf--done" role="status" tabIndex={-1} ref={(el) => el?.focus()}>
        <svg className="rf__tick" viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="32" cy="32" r="29" />
          <path d="M19 33 l9 9 l17 -19" />
        </svg>
        <p className="rf__k">{state.updated ? "Request updated" : "Request received"}</p>
        <p className="rf__h">Thank you{state.name ? `, ${state.name}` : ""}.</p>
        <p className="rf__p">
          {state.updated
            ? "We already had your request, and we’ve updated it with these details."
            : "The Viamagus team reads every request; invitations follow before 3 December."}{" "}
          A note from Shreenath Rao is on its way. If it isn’t in your inbox, check junk.
        </p>
        <div className="rf__next">
          <a className="btn btn--shift btn--sm" href="/the-next-order.ics" download="The-NEXT-Order.ics">
            Hold the date{" "}
            <span className="btn__arr" aria-hidden="true">
              ↓
            </span>
          </a>
          {source === "register" ? (
            <a className="btn btn--shift btn--sm" href="/film">
              Watch the film{" "}
              <span className="btn__arr" aria-hidden="true">
                →
              </span>
            </a>
          ) : (
            <FilmButton className="btn btn--shift btn--sm">
              Watch the film{" "}
              <span className="btn__arr" aria-hidden="true">
                →
              </span>
            </FilmButton>
          )}
        </div>
        <p className="rf__small">Hold the date adds 3 December to your calendar, all day. Your invitation confirms your place.</p>
        <Share />
        <a className="rf__home" href={source === "register" ? "/" : "#top"}>
          Back to the top <span aria-hidden="true">→</span>
        </a>
      </div>
    );
  }

  const sending = state.kind === "sending";
  const id = (k: string) => `${k}-${source}`;
  return (
    <form ref={formRef} className="rf" onSubmit={submit} noValidate aria-labelledby={id("rf-h")} aria-busy={sending}>
      <div className="rf__head">
        <p className="rf__k" id={id("rf-h")}>
          {cta.primary}
        </p>
        <p className="rf__time">About 30 seconds</p>
      </div>
      <noscript>
        <p className="rf__fail">
          This form needs JavaScript. To request an invitation, email <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
        </p>
      </noscript>

      <div className="rf__row">
        <label className="rf__field">
          <span>Name</span>
          <input name="name" placeholder="Your name" autoComplete="name" required maxLength={120} {...a("name")} />
          {err("name")}
        </label>
        <label className="rf__field">
          <span>Work email</span>
          <input name="email" placeholder="name@company.com" type="email" autoComplete="email" inputMode="email" required maxLength={200} {...a("email")} />
          {err("email")}
        </label>
      </div>
      <label className="rf__field">
        <span>Organisation</span>
        <input name="organisation" placeholder="Company name" autoComplete="organization" required maxLength={160} {...a("organisation")} />
        {err("organisation")}
      </label>
      <label className="rf__field">
        <span>LinkedIn profile</span>
        <input
          name="linkedin"
          type="url"
          inputMode="url"
          autoComplete="url"
          autoCapitalize="none"
          spellCheck={false}
          required
          maxLength={300}
          placeholder="linkedin.com/in/your-profile"
          {...a("linkedin")}
          aria-describedby={errors.linkedin ? `linkedin-${source}-err` : `linkedin-${source}-help`}
        />
        {err("linkedin") ?? (
          <span className="rf__help" id={`linkedin-${source}-help`}>
            Your profile link, or just your handle. It helps the Viamagus team confirm professional details.
            <span className="rf__help-m"> In the LinkedIn app: your profile → ⋯ → Share via → Copy link.</span>
          </span>
        )}
      </label>
      <p className="rf__help rf__for">Requesting for someone else? Use their name, work email and LinkedIn; we’ll write to them.</p>

      <fieldset className="rf__set" aria-describedby={errors.role ? `role-${source}-err` : undefined}>
        <legend>Your role</legend>
        <div className="rf__chips">
          {SEATS.map((s) => (
            <label key={s} className="chip">
              <input type="radio" name="role" value={s} required onChange={() => setRole(s)} />
              <span>{s}</span>
            </label>
          ))}
        </div>
        {err("role")}
        <div aria-live="polite">
          {role === "Other" ? (
            <p className="rf__note">
              The evening is for GCC heads and site leaders, technology leaders and talent leaders. If your centre’s
              leader should be in the room, <a href={shareMailto}>send them the invitation</a>.
            </p>
          ) : null}
        </div>
      </fieldset>

      <button type="button" className="rf__more" aria-expanded={more} aria-controls={id("opt")} onClick={() => setMore((m) => !m)}>
        <span className="rf__more-i" aria-hidden="true">
          {more ? "−" : "+"}
        </span>
        <span>
          Add two optional details <em>(helps us plan the room)</em>
        </span>
      </button>
      <div id={id("opt")} className={`rf__opt${more ? " is-open" : ""}`}>
        <fieldset className="rf__set">
          <legend>
            At the event, I’d like to explore <em>Optional · pick any</em>
          </legend>
          <div className="rf__chips">
            {INTERESTS.map((s) => (
              <label key={s} className={`chip chip--${s.split(" ")[0].toLowerCase()}`}>
                <input type="checkbox" name="interests" value={s} defaultChecked={preset === s} />
                <span>{s}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="rf__set">
          <legend>
            My centre is taking on <em>Optional</em>
          </legend>
          <div className="rf__chips">
            {FOCUS.map((s) => (
              <label key={s} className="chip">
                <input type="checkbox" name="focus" value={s} />
                <span>{s}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      {/* honeypot — hidden from people and assistive tech */}
      <div className="hp" aria-hidden="true">
        <label>
          Website <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <p className="rf__small rf__fine">Places are by invitation. Your details are used only to review requests for this event.</p>
      {state.kind === "failed" ? (
        <p className="rf__fail" role="alert">
          {state.message} Please try again, or email <a href={`mailto:${contactEmail}?subject=${encodeURIComponent("The NEXT Order — invitation request")}`}>{contactEmail}</a>.
        </p>
      ) : null}
      <button type="submit" className="btn btn--shift rf__go" disabled={sending}>
        {sending ? "Sending…" : cta.submit} <span className="btn__arr" aria-hidden="true">→</span>
      </button>
      <Share />
    </form>
  );
}
