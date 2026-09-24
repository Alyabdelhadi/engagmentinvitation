# Engagement of Alaa & Ali · خطوبة آلاء وعلي

A bilingual (English / العربية) engagement invitation built around the
couple's paintings: the door, the heart portrait and the sofa portrait.

The page opens on the painting of the door. Scrolling swings its two leaves
open (GSAP + ScrollTrigger, pinned and scrubbed) onto the sofa portrait, then
carries you through the doorway until the portrait fills the screen; the
couple's names are hand-drawn, stroke by stroke, in cream ink over it,
followed by the tagline, the date and the countdown. Then the page scrolls on:

the invitation (heart portrait) → the date → the venue, with a painted sea
view of the Barja coast → the details → our story → RSVP → with love.

Plain HTML / CSS / JavaScript — no build step. GSAP loads from cdnjs; if it
fails to load, or the visitor prefers reduced motion, the doorway is simply
already gone through and everything is visible.

## Files

```
public/                     everything Vercel serves
  index.html                the page — door and sea artwork are inline SVG
  css/styles.css            palette, the gate, stamp cards, typography, RTL rules
  js/invitation.js          ← names, date, venue, RSVP wiring, every string, both languages
  js/main.js                language from the link, GSAP gate timeline + reveals, countdown, calendar, RSVP
  assets/portrait-sofa.jpg  the sofa portrait (behind the door)
  assets/portrait-sofa-phone.jpg  the same, olive border extended to 9:19.5 for phones
  assets/og-image.jpg       social-share preview
tools/rsvp/Code.gs          Apps Script that receives RSVPs into a Google Sheet
vercel.json                 static deploy of public/, cache headers
```

## The gate animation

`public/assets/gate-wall.jpg` is the door painting; `door-left.jpg` and
`door-right.jpg` are its two leaves, cut from the same file. `layoutPortal()`
in `public/js/main.js` lays the painting over the viewport (cover on phones,
15 % taller than the screen on wide screens, with a blurred copy filling the
sides) and writes the doorway rectangle into CSS variables. The wall is
masked with a hole exactly there and the leaves hang in the hole, so what
shows through is the sofa portrait behind.

One scrubbed timeline is pinned to `#gate` for 380 % of the viewport height:

| scroll | what happens |
|---|---|
| 0 – 25 % | the leaves swing open on their hinges (`rotateY` with perspective), light leaks through the gap, the dimmed portrait brightens |
| 15 – 55 % | wall and leaves scale up about the doorway's centre until the doorway fills the screen — you walk into the painting |
| 50 – 80 % | the names draw themselves — SVG `<text>` with a long dash that unwinds, then the fill fades in — bride, `&`, groom |
| 80 – 95 % | the other-language names, the tagline, the date and the countdown rise into place |

The names are real text (`data-t`), so the language switch redraws them in
the other script; Latin uses Great Vibes, Arabic uses Aref Ruqaa. On wide
screens the portrait stands whole in the middle with the names on the left
and the countdown on the right; on phones they stack above and below.

If the door painting is replaced, update `IMG` and `DOOR` at the top of
`setupGsap()` — the image size and the leaves' rectangle and centre seam in
pixels — and re-cut the two leaf files.

## Customising

Everything the couple might change lives in one file:

    public/js/invitation.js

Names, date, time, venue, location, the message, the story, the map URL, the
RSVP wiring, the detail rows and every piece of UI text, in both languages.
`dateISO` is what the countdown runs to; `dateParts` feeds the big date block.

Colours are the variables at the top of `public/css/styles.css`. The
portrait is `public/assets/portrait-sofa.jpg` (and its phone crop); any
portrait-orientation image works, the stamp card scales to it.

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
5. Put it in `public/js/invitation.js`:

       rsvp: {
         mode: "script",
         endpoint: "https://script.google.com/macros/s/AKfy…/exec",
         maxGuests: 12
       }

6. Commit and push — Vercel redeploys.

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

The link decides: `?ar` opens the Arabic version, anything else is English.
There is no switch on the page — send each guest the link in their language.
The language sets
`<html lang dir>`, so Arabic lays out right-to-left; letter-spacing and italics
are dropped for Arabic and the countdown counts in Arabic-Indic digits.

Type comes from Google Fonts: **Cormorant Garamond** and **Great Vibes** for
Latin, **Amiri** and **Aref Ruqaa** for Arabic. Fallback stacks are declared,
so the page still reads if the fonts fail to load. Whichever language is
active, the couple's names, the venue and the tagline are also shown in the
other one.

## Deploying to Vercel

Import the repo — `vercel.json` already says it is a static site served from
`public/`, with no install or build step. Pushing to `main` redeploys. No
environment variables are needed; the RSVP endpoint is a public URL that lives
in `public/js/invitation.js`.

## Running locally

Any static server works, for example:

    python3 -m http.server 8000 --directory public

then open http://localhost:8000/ (and http://localhost:8000/?ar for Arabic).
Serve over HTTP
rather than opening the file from disk so the SVG assets load.
