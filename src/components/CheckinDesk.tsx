"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ViaMagusLogo } from "@/components/Brand";
import type { Guest } from "@/lib/attendance";

/**
 * The registration desk (/checkin). Search, tap a guest in, undo a mistake,
 * add walk-ins. The list refreshes every few seconds so several devices at
 * the desk stay in step; a tap shows at once and is saved in the background.
 */
type Filter = "all" | "yes" | "tentative" | "no" | "stage" | "walkin" | "here" | "waiting";

const FILTERS: { k: Filter; label: string }[] = [
  { k: "all", label: "Everyone" },
  { k: "waiting", label: "Not here yet" },
  { k: "here", label: "Arrived" },
  { k: "yes", label: "Said yes" },
  { k: "tentative", label: "Tentative" },
  { k: "no", label: "Said no" },
  { k: "stage", label: "On stage" },
  { k: "walkin", label: "Walk-ins" },
];

const REPLY: Record<string, string> = { yes: "Yes", tentative: "Tentative", no: "No" };
const POLL_MS = 6000;
const time = new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" });

const match = (g: Guest, f: Filter) =>
  f === "all" ||
  (f === "here" && !!g.arrivedAt) ||
  (f === "waiting" && !g.arrivedAt && g.reply !== "no") ||
  (f === "stage" && g.kind === "speaker") ||
  (f === "walkin" && g.kind === "walkin") ||
  g.reply === f;

const fold = (s: string) => s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase();

async function post(body: Record<string, string>) {
  const r = await fetch("/checkin/data", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const j = (await r.json().catch(() => ({}))) as { ok?: boolean; error?: string; key?: string };
  if (!r.ok || !j.ok) throw new Error(j.error || "Couldn’t save that. Check the connection and try again.");
  return j;
}

export function CheckinDesk({ initial, failed }: { initial: Guest[]; failed: boolean }) {
  const [guests, setGuests] = useState(initial);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [error, setError] = useState(failed ? "Couldn’t reach the guest list. It will keep trying." : "");
  const [synced, setSynced] = useState<Date | null>(failed ? null : new Date());
  const [adding, setAdding] = useState(false);
  const [busy, setBusy] = useState(false);
  // keys whose change hasn't been saved yet: a refresh mustn't undo what the desk just tapped
  const pending = useRef(new Map<string, string | null>());
  const search = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async () => {
    try {
      const r = await fetch("/checkin/data", { cache: "no-store" });
      const j = (await r.json()) as { ok: boolean; guests?: Guest[]; error?: string };
      if (!r.ok || !j.ok || !j.guests) throw new Error(j.error || "Couldn’t refresh the list.");
      setGuests(j.guests.map((g) => (pending.current.has(g.key) ? { ...g, arrivedAt: pending.current.get(g.key) ?? null } : g)));
      setSynced(new Date());
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn’t refresh the list.");
    }
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === "visible") void refresh();
    }, POLL_MS);
    const onVis = () => document.visibilityState === "visible" && void refresh();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [refresh]);

  const setArrived = async (g: Guest, arrived: boolean) => {
    const at = arrived ? new Date().toISOString() : null;
    pending.current.set(g.key, at);
    setGuests((all) => (!arrived && g.kind === "walkin" ? all.filter((x) => x.key !== g.key) : all.map((x) => (x.key === g.key ? { ...x, arrivedAt: at } : x))));
    try {
      await post({ action: arrived ? "in" : "undo", key: g.key });
      setError("");
    } catch (e) {
      // put it back as it was
      setGuests((all) => (all.some((x) => x.key === g.key) ? all.map((x) => (x.key === g.key ? { ...x, arrivedAt: g.arrivedAt } : x)) : [...all, g]));
      setError(`${g.name}: ${e instanceof Error ? e.message : "not saved"}`);
    } finally {
      pending.current.delete(g.key);
    }
  };

  const addWalkIn = async (form: HTMLFormElement) => {
    const d = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setBusy(true);
    try {
      const j = await post({ action: "walkin", name: d.name ?? "", organisation: d.organisation ?? "", email: d.email ?? "" });
      setGuests((all) => [
        ...all,
        { key: j.key!, kind: "walkin", name: d.name.trim(), organisation: (d.organisation ?? "").trim(), email: (d.email ?? "").trim(), reply: null, list: "Walk-in", part: null, arrivedAt: new Date().toISOString() },
      ]);
      form.reset();
      setAdding(false);
      setQ("");
      setError("");
      search.current?.focus();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn’t add the walk-in.");
    } finally {
      setBusy(false);
    }
  };

  const counts = useMemo(() => {
    const c = Object.fromEntries(FILTERS.map((f) => [f.k, guests.filter((g) => match(g, f.k)).length])) as Record<Filter, number>;
    const expected = guests.filter((g) => g.kind === "speaker" || g.reply === "yes").length;
    const expectedHere = guests.filter((g) => (g.kind === "speaker" || g.reply === "yes") && g.arrivedAt).length;
    return { c, expected, expectedHere };
  }, [guests]);

  const shown = useMemo(() => {
    const words = fold(q).split(/\s+/).filter(Boolean);
    return guests
      .filter((g) => match(g, filter))
      .filter((g) => {
        const hay = fold(`${g.name} ${g.organisation} ${g.email}`);
        return words.every((w) => hay.includes(w));
      })
      .sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }));
  }, [guests, q, filter]);

  return (
    <main className="ci">
      <header className="ci__hd">
        <ViaMagusLogo />
        <p className="ci__k">The NEXT Order · Registration desk</p>
      </header>

      <section className="ci__stats" aria-label="Arrivals">
        <div>
          <b>{counts.c.here}</b>
          <span>arrived</span>
        </div>
        <div>
          <b>
            {counts.expectedHere}
            <small>/{counts.expected}</small>
          </b>
          <span>expected here</span>
        </div>
        <div>
          <b>{counts.c.walkin}</b>
          <span>walk-ins</span>
        </div>
      </section>

      <div className="ci__bar">
        <input
          ref={search}
          className="ci__search"
          type="search"
          placeholder="Search name or company"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          aria-label="Search guests"
        />
        <button type="button" className="ci__add" onClick={() => setAdding((v) => !v)} aria-expanded={adding}>
          + Walk-in
        </button>
      </div>

      {adding ? (
        <form
          className="ci__walkin"
          onSubmit={(e) => {
            e.preventDefault();
            void addWalkIn(e.currentTarget);
          }}
        >
          <p className="ci__wk">Someone who isn’t on the list. They’re marked as arrived.</p>
          <label>
            <span>Name</span>
            <input name="name" required defaultValue={q} autoComplete="off" />
          </label>
          <label>
            <span>Organisation</span>
            <input name="organisation" autoComplete="off" />
          </label>
          <label>
            <span>Work email (optional)</span>
            <input name="email" type="email" inputMode="email" autoComplete="off" />
          </label>
          <div className="ci__wa">
            <button type="submit" className="ci__btn ci__btn--in" disabled={busy}>
              {busy ? "Adding…" : "Add and check in"}
            </button>
            <button type="button" className="ci__btn ci__btn--ghost" onClick={() => setAdding(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      <nav className="ci__chips" aria-label="Filter">
        {FILTERS.map((f) => (
          <button key={f.k} type="button" aria-pressed={filter === f.k} onClick={() => setFilter(f.k)}>
            {f.label} <span>{counts.c[f.k]}</span>
          </button>
        ))}
      </nav>

      {error ? (
        <p className="ci__err" role="alert">
          {error}
        </p>
      ) : null}

      {shown.length === 0 ? (
        <div className="ci__none">
          <p>{q ? `No one matches “${q}”.` : "No one here yet."}</p>
          {q ? (
            <button type="button" className="ci__btn ci__btn--in" onClick={() => setAdding(true)}>
              Add “{q}” as a walk-in
            </button>
          ) : null}
        </div>
      ) : (
        <ul className="ci__list">
          {shown.map((g) => (
            <li key={g.key} className={g.arrivedAt ? "is-here" : g.reply === "no" ? "is-no" : ""}>
              <div className="ci__who">
                <p className="ci__n">{g.name}</p>
                <p className="ci__o">{[g.organisation, g.email].filter(Boolean).join(" · ") || "No details"}</p>
                <p className="ci__tags">
                  {g.kind === "speaker" ? <span className="ci__tag ci__tag--stage">{g.part || "On stage"}</span> : null}
                  {g.reply ? <span className={`ci__tag ci__tag--${g.reply}`}>RSVP {REPLY[g.reply]}</span> : null}
                  {g.kind === "walkin" ? <span className="ci__tag">Walk-in</span> : null}
                  {g.kind === "rsvp" ? <span className="ci__list-name">{g.list}</span> : null}
                </p>
              </div>
              {g.arrivedAt ? (
                <div className="ci__done">
                  <span className="ci__at">✓ {time.format(new Date(g.arrivedAt))}</span>
                  <button
                    type="button"
                    className="ci__undo"
                    onClick={() => {
                      if (g.kind !== "walkin" || confirm(`Remove ${g.name} from the list?`)) void setArrived(g, false);
                    }}
                  >
                    {g.kind === "walkin" ? "Remove" : "Undo"}
                  </button>
                </div>
              ) : (
                <button type="button" className="ci__btn ci__btn--in" onClick={() => void setArrived(g, true)}>
                  Check in
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <footer className="ci__ft">
        <span>{synced ? `Up to date · ${time.format(synced)}` : "Not connected"}</span>
        <button type="button" onClick={() => void refresh()}>
          Refresh
        </button>
      </footer>
    </main>
  );
}
