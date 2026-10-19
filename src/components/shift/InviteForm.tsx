"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { contactEmail } from "@/content/event";
import { FOCUS, INTERESTS, SEATS } from "@/content/register";
import { cta } from "@/content/story";
import { normalizeLinkedIn } from "@/lib/linkedin";

type State = { kind: "idle" } | { kind: "sending" } | { kind: "done"; name: string; updated: boolean } | { kind: "failed"; message: string };

/**
 * Request an invitation. Three typed fields; everything else is a tap.
 * Submissions are stored (POST /api/register → Neon Postgres) and listed for
 * the organisers at /register/response. `preset` preselects a practice
 * (from /register?interest=velocity|synthia|select).
 */
export function InviteForm({ source = "site", preset }: { source?: string; preset?: string }) {
  const [state, setState] = useState<State>({ kind: "idle" });
  const [errors, setErrors] = useState<Record<string, string>>({});
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

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const v = (k: string) => String(fd.get(k) ?? "").trim();
    const local: Record<string, string> = {};
    if (!v("name")) local.name = "Please add your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("email"))) local.email = "Please add a valid work email.";
    if (!v("organisation")) local.organisation = "Please add your organisation.";
    if (!v("role")) local.role = "Please choose your seat.";
    const li = normalizeLinkedIn(v("linkedin"));
    if (!li.ok) local.linkedin = li.error;
    if (Object.keys(local).length) {
      setErrors(local);
      form.querySelector<HTMLElement>(`[name="${Object.keys(local)[0]}"]`)?.focus();
      return;
    }
    setErrors({});
    setState({ kind: "sending" });
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
          source,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; updated?: boolean; errors?: Record<string, string>; error?: string };
      if (res.ok && json.ok) {
        setState({ kind: "done", name: v("name").split(" ")[0], updated: !!json.updated });
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
            : "Your request is with the ViaMagus team. Places are confirmed by invitation — we’ll be in touch once the date and venue are set."}
        </p>
        <p className="rf__small">
          Questions in the meantime? <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
        </p>
      </div>
    );
  }

  const sending = state.kind === "sending";
  const id = (k: string) => `${k}-${source}`;
  return (
    <form className="rf" onSubmit={submit} noValidate aria-labelledby={id("rf-h")} aria-busy={sending}>
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
          <input name="name" autoComplete="name" required maxLength={120} {...a("name")} />
          {err("name")}
        </label>
        <label className="rf__field">
          <span>Work email</span>
          <input name="email" type="email" autoComplete="email" inputMode="email" required maxLength={200} {...a("email")} />
          {err("email")}
        </label>
      </div>
      <label className="rf__field">
        <span>Organisation</span>
        <input name="organisation" autoComplete="organization" required maxLength={160} {...a("organisation")} />
        {err("organisation")}
      </label>
      <label className="rf__field">
        <span>LinkedIn profile</span>
        <input
          name="linkedin"
          type="url"
          inputMode="url"
          autoComplete="url"
          spellCheck={false}
          required
          maxLength={300}
          placeholder="https://www.linkedin.com/in/your-profile"
          {...a("linkedin")}
          aria-describedby={errors.linkedin ? `linkedin-${source}-err` : `linkedin-${source}-help`}
        />
        {err("linkedin") ?? (
          <span className="rf__help" id={`linkedin-${source}-help`}>
            Helps the ViaMagus team confirm professional details when reviewing requests.
          </span>
        )}
      </label>

      <fieldset className="rf__set" aria-describedby={errors.role ? `role-${source}-err` : undefined}>
        <legend>Your seat</legend>
        <div className="rf__chips">
          {SEATS.map((s) => (
            <label key={s} className="chip">
              <input type="radio" name="role" value={s} required />
              <span>{s}</span>
            </label>
          ))}
        </div>
        {err("role")}
      </fieldset>

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

      {/* honeypot — hidden from people and assistive tech */}
      <div className="hp" aria-hidden="true">
        <label>
          Website <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {state.kind === "failed" ? (
        <p className="rf__fail" role="alert">
          {state.message} Please try again, or email <a href={`mailto:${contactEmail}?subject=${encodeURIComponent("The NEXT Order — invitation request")}`}>{contactEmail}</a>.
        </p>
      ) : null}
      <button type="submit" className="btn btn--shift rf__go" disabled={sending}>
        {sending ? "Sending…" : cta.submit} <span className="btn__arr" aria-hidden="true">→</span>
      </button>
      <p className="rf__small">Places are confirmed by invitation. Your details go only to the ViaMagus team, to review requests for this event.</p>
    </form>
  );
}
