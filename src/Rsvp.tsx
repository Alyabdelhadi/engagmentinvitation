import { useEffect, useState, type FormEvent } from "react";
import { invitation, type Language, type UiStrings } from "./invitation";
import { Envelope } from "./illustrations/Spots";

type Reply = { name: string; guests: number; at: string };
type Status = "idle" | "sending" | "done";

const KEY = "invitation-rsvp";

function loadReply(): Reply | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const r = JSON.parse(raw) as Partial<Reply>;
    return typeof r.name === "string" && typeof r.guests === "number" ? (r as Reply) : null;
  } catch { return null; }
}

/* The form is write-only from the browser: Apps Script and Google Forms
   both answer with an opaque response, so a resolved request is the
   success signal. text/plain keeps the request "simple" — no preflight,
   which Apps Script cannot answer. */
async function send(name: string, guests: number, lang: Language) {
  const { mode, endpoint, formFields } = invitation.rsvp;
  if (mode === "form") {
    const body = new URLSearchParams();
    body.set(formFields.name, name);
    body.set(formFields.guests, String(guests));
    await fetch(endpoint, { method: "POST", mode: "no-cors", body });
    return;
  }
  await fetch(endpoint, {
    method: "POST", mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
    body: JSON.stringify({ name, guests, lang })
  });
}

export function Rsvp({ lang, t }: { lang: Language; t: UiStrings }) {
  const max = invitation.rsvp.maxGuests;
  const connected = invitation.rsvp.endpoint.trim().length > 0;
  const [name, setName] = useState("");
  const [guests, setGuests] = useState(1);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<"name" | "guests" | "send" | null>(null);
  const [reply, setReply] = useState<Reply | null>(null);

  useEffect(() => {
    const saved = loadReply();
    if (saved) { setReply(saved); setStatus("done"); }
  }, []);

  const clamp = (n: number) => Math.min(max, Math.max(1, Number.isFinite(n) ? Math.round(n) : 1));

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    const trimmed = name.trim();
    if (!trimmed) { setError("name"); return; }
    if (guests < 1 || guests > max) { setError("guests"); return; }
    if (!connected) { setError("send"); return; }
    setError(null);
    setStatus("sending");
    try {
      await send(trimmed, guests, lang);
      const r = { name: trimmed, guests, at: new Date().toISOString() };
      try { localStorage.setItem(KEY, JSON.stringify(r)); } catch { /* ignore */ }
      setReply(r);
      setStatus("done");
    } catch {
      setError("send");
      setStatus("idle");
    }
  }

  function again() {
    try { localStorage.removeItem(KEY); } catch { /* ignore */ }
    if (reply) { setName(reply.name); setGuests(clamp(reply.guests)); }
    setReply(null);
    setStatus("idle");
    setError(null);
  }

  if (status === "done" && reply) {
    return (
      <div className="rsvp-done card">
        <Envelope className="spot spot-sm" />
        <p className="rsvp-thanks">{t.rsvpThanks}</p>
        <p className="rsvp-summary">{reply.name} · {reply.guests}</p>
        <button type="button" className="link" onClick={again}>{t.rsvpThanksAgain}</button>
      </div>
    );
  }

  const errText = error === "name" ? t.rsvpErrName
    : error === "guests" ? t.rsvpErrGuests
    : error === "send" ? (connected ? t.rsvpErrSend : t.rsvpOffline)
    : null;

  return (
    <form className="rsvp card" onSubmit={submit} noValidate>
      <label className="field">
        <span>{t.rsvpName}</span>
        <input
          type="text" name="name" autoComplete="name" value={name}
          placeholder={t.rsvpNamePlaceholder} maxLength={120}
          aria-invalid={error === "name" || undefined}
          onChange={(e) => { setName(e.target.value); if (error === "name") setError(null); }} />
      </label>
      <div className="field">
        <span id="rsvp-guests-label">{t.rsvpGuests}</span>
        <div className="stepper" role="group" aria-labelledby="rsvp-guests-label">
          <button type="button" aria-label={t.rsvpFewer} disabled={guests <= 1} onClick={() => setGuests((g) => clamp(g - 1))}>−</button>
          <input type="number" inputMode="numeric" min={1} max={max} value={guests}
            onChange={(e) => setGuests(clamp(e.target.valueAsNumber))} />
          <button type="button" aria-label={t.rsvpMore} disabled={guests >= max} onClick={() => setGuests((g) => clamp(g + 1))}>+</button>
        </div>
      </div>
      {errText && <p className="rsvp-error" role="alert">{errText}</p>}
      {!connected && !errText && <p className="rsvp-note">{t.rsvpOffline}</p>}
      <button type="submit" className="btn" disabled={status === "sending"}>
        {status === "sending" ? t.rsvpSending : t.rsvpButton}
      </button>
    </form>
  );
}
