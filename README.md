# Our Engagement — Alaa & Ali

A bilingual (English / العربية) engagement invitation in a cartoon
illustration style. One scrolling page, built for phones and framed as a
phone-width card on larger screens:

hero scene → countdown → the invitation → the date → the celebration
(venue + map) → the details → our story → RSVP → with love.

The couple are drawn from their own photographs, as SVG — her cream hijab
and butter-yellow shirt, his swept-back hair, beard and watch, the Bekaa
field with the branch overhead. There are no raster images in the page.

## Customising

Everything the couple might change lives in one file:

    src/invitation.ts

Names, date, time, venue, location, the message, the story, the map URL,
the RSVP wiring, the detail rows and every piece of UI text, in both
languages. `dateISO` is what the countdown runs to.

The drawings live in `src/illustrations/`:

| File | What it draws |
|---|---|
| `Couple.tsx` | the hero scene and `CoupleFigures`, reused in the closing medallion |
| `Story.tsx` | the field photograph as a scene |
| `Spots.tsx` | rings, calendar, venue, dinner table, envelope, sprigs, flowers, the detail glyphs |

## RSVP → Google Sheet

Guests reply **on the invitation itself** — full name, number of guests, one
confirm button. No redirect, no second page.

The form is write-only from the browser (the response is opaque either way),
so a resolved request is the success signal. Until `rsvp.endpoint` is filled
in, the form says it is not connected yet and sends nothing.

### Wiring it up (Apps Script — recommended)

1. Make a Google Sheet for the replies.
2. **Extensions → Apps Script**, paste `tools/rsvp/Code.gs`, Save.
3. Run `setup` once and accept the permission prompt (it writes the header row).
4. **Deploy → New deployment → Web app**, *Execute as* **Me**, *Who has access*
   **Anyone**. Copy the `/exec` URL.
5. Put it in `src/invitation.ts`:

       rsvp: {
         mode: "script",
         endpoint: "https://script.google.com/macros/s/AKfy…/exec",
         maxGuests: 12
       }

6. `npm run build`.

Each reply appends `Timestamp · Full name · Guests · Language`.

The page posts `text/plain` so the browser sends a *simple* request and never
attempts a CORS preflight, which Apps Script cannot answer.

### Or: an existing Google Form

Set `mode: "form"`, point `endpoint` at the form's `.../formResponse` URL, and
give the two `entry.…` ids:

    rsvp: {
      mode: "form",
      endpoint: "https://docs.google.com/forms/d/e/FORM_ID/formResponse",
      formFields: { name: "entry.1234567890", guests: "entry.0987654321" }
    }

### Behaviour

* Empty name is refused before anything is sent; the field is flagged.
* Guests is clamped to 1…`maxGuests` by the steppers and by hand-typing.
* After a successful reply the form is replaced by a thank-you, with a
  quiet "reply again" if someone needs to change their answer.
* The reply is remembered in `localStorage`, so a guest returning to the page
  sees that they already replied rather than a blank form.

## The two languages

`?lang=ar` in the link opens the Arabic version; the button in the corner
switches at any time and the choice is kept for the session. Switching sets
`<html lang dir>`, so Arabic lays out right-to-left — the corner sprigs
mirror, the detail rows flip, the countdown counts in Arabic-Indic digits.

Type is self-hosted in `public/fonts`: **Baloo Bhaijaan 2** (Arabic and
Latin, the rounded display face) and **Nunito** for Latin body copy.

## Deploying to Vercel

Import the repo — the defaults in `vercel.json` are already correct
(framework `vite`, build `npm run build`, output `dist`). No environment
variables are needed; the RSVP endpoint is a public URL that lives in
`src/invitation.ts`.

`/assets/*` and `/fonts/*` are cached for a year (Vite fingerprints the
former; the font files never change); `index.html` always revalidates.

## Commands

    npm install
    npm run dev       # vite dev server
    npm run build     # tsc -b && vite build
    npm run preview   # serve dist
