"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { contactEmail, shareMailto } from "@/content/event";
import { replyWords, rsvpCalendar, rsvpCopy } from "@/content/rsvp";
import { greetingName } from "@/lib/confirmation-email";
import { calendarLinks, isReply, REPLIES, type Reply } from "@/lib/rsvp";

type Fields = { name: string; email: string; organisation: string };
type State = { kind: "idle" } | { kind: "sending" } | { kind: "done"; reply: Reply; name: string; was: Reply | null } | { kind: "failed"; message: string };

/**
 * The last reply sent from this browser: it brings the fields back, so a
 * guest whose plans change needs one tap. Only ever on the guest's device;
 * the reply itself is stored by /api/rsvp.
 */
const KEPT = "nxo-rsvp";
type Kept = Fields & { reply: Reply; at: number };

function parseKept(raw: string | null): Kept | null {
  try {
    const k = JSON.parse(raw ?? "null") as Kept | null;
    return k && isReply(k.reply) && typeof k.email === "string" ? k : null;
  } catch {
    return null;
  }
}

// read as an external store: nothing on the server, the stored text once hydrated, and a reply sent from another tab
const readStored = () => {
  try {
    return localStorage.getItem(KEPT);
  } catch {
    return null;
  }
};
const onStorage = (fn: () => void) => {
  window.addEventListener("storage", fn);
  return () => window.removeEventListener("storage", fn);
};

/** The server refuses a reply sent within 2.5 s of the page's token (scripted); a quick tap waits out the rest. */
const MIN_MS = 2600;

const links = calendarLinks(rsvpCalendar);
const dayFmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", timeZone: "Asia/Kolkata" });

const GLYPH: Record<Reply, ReactNode> = {
  yes: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  tentative: (
    <>
      <path d="M9.2 9.2a2.9 2.9 0 1 1 4.2 2.6c-.9.5-1.4 1.1-1.4 2.1v.4" />
      <path d="M12 17.6v.2" />
    </>
  ),
  no: <path d="M7 7l10 10M17 7L7 17" />,
};

/**
 * The reply, as a calendar invite takes one: Yes, Tentative or No, then the
 * guest's name, work email and organisation. Stored (POST /api/rsvp → Neon
 * Postgres) and listed for the organisers at /register/response/rsvp.
 * `refKey` is the list the link was sent to (/rsvp?ref=); `preset` a reply
 * chosen in the email (/rsvp?reply=yes).
 */
export function RsvpForm({ refKey, preset }: { refKey: string; preset?: Reply }) {
  const [state, setState] = useState<State>({ kind: "idle" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  // a guest who has replied before finds their details, and their reply unless the link chose one
  const [sent, setSent] = useState<Kept | null>(null);
  const stored = useSyncExternalStore(onStorage, readStored, () => null);
  const kept = sent ?? parseKept(stored);
  const [picked, setPicked] = useState<Reply | null>(null);
  const reply = picked ?? preset ?? kept?.reply ?? null;
  const [edits, setEdits] = useState<Partial<Fields>>({});
  const fields: Fields = {
    name: edits.name ?? kept?.name ?? "",
    email: edits.email ?? kept?.email ?? "",
    organisation: edits.organisation ?? kept?.organisation ?? "",
  };
  const formRef = useRef<HTMLFormElement | null>(null);
  const honey = useRef<HTMLInputElement | null>(null);
  // a signed, timestamped token from the server; the API refuses replies without it
  const token = useRef({ t: "", at: 0 });
  const fetchToken = () =>
    fetch("/api/register/token", { cache: "no-store" })
      .then((r) => r.json())
      .then((j: { t?: string }) => {
        token.current = { t: j.t ?? "", at: Date.now() };
      })
      .catch(() => {});

  useEffect(() => {
    void fetchToken();
  }, []);

  const clear = (k: string) =>
    setErrors((e) => {
      if (!e[k]) return e;
      const next = { ...e };
      delete next[k];
      return next;
    });
  const set = (k: keyof Fields) => (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setEdits((f) => ({ ...f, [k]: v }));
    clear(k);
  };

  const focusFirst = (errs: Record<string, string>) => {
    const k = Object.keys(errs)[0];
    formRef.current?.querySelector<HTMLElement>(k === "reply" ? 'input[name="reply"]' : `[name="${k}"]`)?.focus();
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = { name: fields.name.trim(), email: fields.email.trim(), organisation: fields.organisation.trim() };
    const local: Record<string, string> = {};
    if (!reply) local.reply = "Please choose Yes, Tentative or No.";
    if (!f.name) local.name = "Please add your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) local.email = "Please add a valid work email.";
    if (!f.organisation) local.organisation = "Please add your organisation.";
    if (!reply || Object.keys(local).length) {
      setErrors(local);
      focusFirst(local);
      return;
    }
    setErrors({});
    setState({ kind: "sending" });
    if (!token.current.t) await fetchToken();
    const wait = MIN_MS - (Date.now() - token.current.at);
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, reply, ref: refKey, t: token.current.t, website: honey.current?.value ?? "" }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; was?: Reply | null; errors?: Record<string, string>; error?: string };
      if (res.ok && json.ok) {
        const k: Kept = { ...f, reply, at: Date.now() };
        try {
          localStorage.setItem(KEPT, JSON.stringify(k));
        } catch {}
        setSent(k);
        setState({ kind: "done", reply, name: greetingName(f.name), was: json.was ?? null });
        return;
      }
      if (json.errors) {
        setErrors(json.errors);
        setState({ kind: "idle" });
        focusFirst(json.errors);
        return;
      }
      setState({ kind: "failed", message: json.error ?? "We couldn’t save your reply just now." });
      void fetchToken();
    } catch {
      setState({ kind: "failed", message: "You seem to be offline." });
    }
  };

  const err = (k: string) =>
    errors[k] ? (
      <span className="rf__err" id={`${k}-rsvp-err`}>
        {errors[k]}
      </span>
    ) : null;
  const a = (k: string) => ({
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `${k}-rsvp-err` : undefined,
  });

  if (state.kind === "done") {
    const d = rsvpCopy.done[state.reply];
    const changed = state.was && state.was !== state.reply;
    return (
      <div className="rf rf--done rsvp-done" role="status" tabIndex={-1} ref={(el) => el?.focus()}>
        <svg className="rf__tick" viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="32" cy="32" r="29" />
          <path d="M19 33 l9 9 l17 -19" />
        </svg>
        <p className="rf__k">
          {d.k}
          {changed ? <span className="rsvp-done__was"> · changed from {replyWords[state.was!].label}</span> : null}
        </p>
        <p className="rf__h">{d.h(state.name)}</p>
        <p className="rf__p">{d.p}</p>
        {state.reply === "no" ? (
          <div className="rf__next">
            <a className="btn btn--shift btn--sm" href={shareMailto}>
              Send them the invitation{" "}
              <span className="btn__arr" aria-hidden="true">
                →
              </span>
            </a>
          </div>
        ) : (
          <ul className="rsvp-cal" aria-label="Add to your calendar">
            <li>
              <a href={links.google} target="_blank" rel="noopener noreferrer">
                Google Calendar<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href={links.outlook} target="_blank" rel="noopener noreferrer">
                Outlook<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href="/rsvp/calendar.ics" download="The-NEXT-Order.ics">
                Apple and others <span className="rsvp-cal__ext">.ics</span>
              </a>
            </li>
          </ul>
        )}
        <div className="rsvp-done__end">
          <button type="button" className="rsvp-done__change" onClick={() => setState({ kind: "idle" })}>
            Change my reply
          </button>
          <Link href="/">
            {rsvpCopy.site} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    );
  }

  const sending = state.kind === "sending";
  return (
    <form ref={formRef} className="rf rsvp-form" onSubmit={submit} noValidate aria-labelledby="rsvp-h" aria-busy={sending}>
      <noscript>
        <p className="rf__fail">
          Replying needs JavaScript. To reply, email <a href={`mailto:${contactEmail}?subject=${encodeURIComponent("The NEXT Order — RSVP")}`}>{contactEmail}</a>.
        </p>
      </noscript>
      {kept ? (
        <p className="rsvp-form__kept">
          You replied <b>{replyWords[kept.reply].label}</b> on {dayFmt.format(kept.at)}. Change it below if your plans have changed.
        </p>
      ) : null}

      <fieldset className="rf__set rsvp-pick" aria-describedby={errors.reply ? "reply-rsvp-err" : undefined}>
        <legend>{rsvpCopy.going}</legend>
        <div className="rsvp-pick__opts">
          {REPLIES.map((r) => (
            <label key={r} className={`rsvp-opt rsvp-opt--${r}`}>
              <input
                type="radio"
                name="reply"
                value={r}
                checked={reply === r}
                onChange={() => {
                  setPicked(r);
                  clear("reply");
                }}
              />
              <span className="rsvp-opt__box">
                <svg className="rsvp-opt__i" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  {GLYPH[r]}
                </svg>
                <span className="rsvp-opt__l">{replyWords[r].label}</span>
                <span className="rsvp-opt__h">{replyWords[r].hint}</span>
              </span>
            </label>
          ))}
        </div>
        {err("reply")}
      </fieldset>

      <div className="rf__row">
        <label className="rf__field">
          <span>Name</span>
          <input name="name" value={fields.name} onChange={set("name")} placeholder="Your name" autoComplete="name" required maxLength={120} {...a("name")} />
          {err("name")}
        </label>
        <label className="rf__field">
          <span>Work email</span>
          <input
            name="email"
            value={fields.email}
            onChange={set("email")}
            placeholder="name@company.com"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            maxLength={200}
            {...a("email")}
          />
          {err("email")}
        </label>
      </div>
      <label className="rf__field">
        <span>Organisation</span>
        <input
          name="organisation"
          value={fields.organisation}
          onChange={set("organisation")}
          placeholder="Company name"
          autoComplete="organization"
          required
          maxLength={160}
          {...a("organisation")}
        />
        {err("organisation")}
      </label>

      {/* honeypot — hidden from people and assistive tech */}
      <div className="hp" aria-hidden="true">
        <label>
          Website <input ref={honey} name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <p className="rf__small rf__fine">{rsvpCopy.fine}</p>
      {state.kind === "failed" ? (
        <p className="rf__fail" role="alert">
          {state.message} Please try again, or email <a href={`mailto:${contactEmail}?subject=${encodeURIComponent("The NEXT Order — RSVP")}`}>{contactEmail}</a>.
        </p>
      ) : null}
      <button type="submit" className="btn btn--shift rf__go" disabled={sending}>
        {sending ? "Sending…" : reply ? `Reply ${replyWords[reply].label}` : "Send my reply"} <span className="btn__arr" aria-hidden="true">→</span>
      </button>
    </form>
  );
}
