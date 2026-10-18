"use client";

import { useState, type FormEvent } from "react";
import { contactEmail } from "@/content/event";

const ROLES = [
  "GCC CEO / MD / senior executive",
  "Site head / site leader",
  "Technology / engineering leader",
  "CHRO / HR / talent acquisition leader",
  "Other",
];

type State = { kind: "idle" } | { kind: "sending" } | { kind: "done"; name: string; updated: boolean } | { kind: "failed"; message: string };

/**
 * Request an invitation. Submissions are stored (POST /api/register → Neon
 * Postgres) and listed for the organisers at /register/response. Used on the
 * home page and on the shareable /register page; `source` records which.
 */
export function InviteForm({ source = "site", title = "Request an invitation" }: { source?: string; title?: string }) {
  const [state, setState] = useState<State>({ kind: "idle" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    // the same checks the server makes, so mistakes don't need a round trip
    const local: Record<string, string> = {};
    const v = (k: string) => String(data[k] ?? "").trim();
    if (!v("name")) local.name = "Please add your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("email"))) local.email = "Please add a valid work email.";
    if (!v("organisation")) local.organisation = "Please add your organisation.";
    if (!v("role")) local.role = "Please choose the seat closest to yours.";
    if (Object.keys(local).length) {
      setErrors(local);
      form.querySelector<HTMLElement>(`[name="${Object.keys(local)[0]}"]`)?.focus();
      return;
    }
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; updated?: boolean; errors?: Record<string, string>; error?: string };
      if (res.ok && json.ok) {
        setErrors({});
        setState({ kind: "done", name: String(data.name ?? "").trim().split(" ")[0], updated: !!json.updated });
        return;
      }
      if (json.errors) {
        setErrors(json.errors);
        setState({ kind: "idle" });
        form.querySelector<HTMLElement>(`[name="${Object.keys(json.errors)[0]}"]`)?.focus();
        return;
      }
      setState({ kind: "failed", message: json.error ?? "We couldn’t save your request just now." });
    } catch {
      setState({ kind: "failed", message: "You seem to be offline." });
    }
  };

  const err = (k: string) =>
    errors[k] ? (
      <span className="field__err" id={`${k}-err`}>
        {errors[k]}
      </span>
    ) : null;
  const a = (k: string) => ({ "aria-invalid": errors[k] ? true : undefined, "aria-describedby": errors[k] ? `${k}-err` : undefined });

  if (state.kind === "done") {
    return (
      <div className="form form--sent" role="status" tabIndex={-1} ref={(el) => el?.focus()}>
        <p className="form__k">{state.updated ? "Request updated" : "Request received"}</p>
        <p className="form__h">Thank you{state.name ? `, ${state.name}` : ""}.</p>
        <p>
          {state.updated
            ? "We already had your request — we’ve updated it with these details."
            : "Your request for an invitation to The NEXT Order is with the ViaMagus team."}
        </p>
        <p className="form__small">
          Questions in the meantime? Write to <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
        </p>
      </div>
    );
  }

  const sending = state.kind === "sending";
  return (
    <form className="form" onSubmit={submit} noValidate aria-labelledby={`form-h-${source}`} aria-busy={sending}>
      <p className="form__k" id={`form-h-${source}`}>
        {title}
      </p>
      <noscript>
        <p className="form__fail">
          This form needs JavaScript. To request an invitation, email <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
        </p>
      </noscript>
      <label className="field">
        <span>Name</span>
        <input name="name" autoComplete="name" required maxLength={120} {...a("name")} />
        {err("name")}
      </label>
      <label className="field">
        <span>Work email</span>
        <input name="email" type="email" autoComplete="email" inputMode="email" required maxLength={200} {...a("email")} />
        {err("email")}
      </label>
      <label className="field">
        <span>Organisation</span>
        <input name="organisation" autoComplete="organization" required maxLength={160} {...a("organisation")} />
        {err("organisation")}
      </label>
      <label className="field">
        <span>Your seat</span>
        <select name="role" required defaultValue="" {...a("role")}>
          <option value="" disabled>
            Choose one
          </option>
          {ROLES.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
        {err("role")}
      </label>
      <label className="field">
        <span>
          What is your centre taking on next? <em>Optional</em>
        </span>
        <textarea name="next_mandate" rows={3} maxLength={1200} />
      </label>
      {/* honeypot — hidden from people and assistive tech */}
      <div className="hp" aria-hidden="true">
        <label>
          Website <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {state.kind === "failed" ? (
        <p className="form__fail" role="alert">
          {state.message} Please try again, or email <a href={`mailto:${contactEmail}?subject=${encodeURIComponent("The NEXT Order — invitation request")}`}>{contactEmail}</a>.
        </p>
      ) : null}
      <button type="submit" className="btn btn--shift" disabled={sending}>
        {sending ? "Sending…" : "Request an invitation"} <span aria-hidden="true">→</span>
      </button>
      <p className="form__small">Your details go only to the ViaMagus team, to manage invitations for this event.</p>
    </form>
  );
}
