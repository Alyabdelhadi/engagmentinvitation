# Engagement of Alaa & Ali · خطوبة آلاء وعلي

A bilingual (English / العربية) engagement invitation drawn in the folk-art
style of the couple's painted portraits: maroon stripes, olive frames with
dark dots, butter-cream paper, corner hearts, tulips, roses and two birds.

The page opens on a pair of painted doors. Scrolling swings them open (GSAP +
ScrollTrigger, pinned and scrubbed) onto a sea view of the Barja coast — sun,
hills, waves that draw themselves, a boat, the birds flying in — and the
couple's names are hand-drawn, stroke by stroke, across the sky, followed by
the tagline, the date and the countdown. Then the page scrolls on:

the invitation (heart portrait) → the date → the venue → the details →
our story (sofa portrait) → RSVP → with love.

Plain HTML / CSS / JavaScript — no build step. GSAP loads from cdnjs; if it
fails to load, or the visitor prefers reduced motion, the doors simply stand
open and everything is visible.

## Files

```
public/                     everything Vercel serves
  index.html                the page — door and sea artwork are inline SVG
  css/styles.css            palette, the gate, stamp cards, typography, RTL rules
  js/invitation.js          ← names, date, venue, RSVP wiring, every string, both languages
  js/main.js                language switch, GSAP gate timeline + reveals, countdown, calendar, RSVP
  assets/portrait-heart.jpg the heart portrait (the invitation)
  assets/portrait-sofa.jpg  the sofa portrait (our story)
  assets/og-image.jpg       social-share preview
tools/rsvp/Code.gs          Apps Script that receives RSVPs into a Google Sheet
vercel.json                 static deploy of public/, cache headers
```

## The gate animation

`setupGsap()` in `public/js/main.js` builds one scrubbed timeline pinned to
`#gate` for 300 % of the viewport height:

| scroll | what happens |
|---|---|
| 0 – 30 % | the doors swing open (`rotateY` with perspective), a light leaks through the gap, the dimmed view brightens and settles |
| 10 – 45 % | the foam lines draw (`stroke-dashoffset`), the birds fly in, the boat drifts into view |
| 25 – 65 % | the names draw themselves — SVG `<text>` with a long dash that unwinds, then the fill fades in — bride, `&`, groom |
| 65 – 90 % | the other-language names, the tagline, the date and the countdown rise into place |

The names are real text (`data-t`), so the language switch redraws them in
the other script; Latin uses Great Vibes, Arabic uses Aref Ruqaa.

Phones in portrait see only the middle of the wide sea view, so `.sea.portrait`
pulls the sun, hills, boat, birds and flowers in towards the centre.

## Customising

Everything the couple might change lives in one file:

    public/js/invitation.js

Names, date, time, venue, location, the message, the story, the map URL, the
RSVP wiring, the detail rows and every piece of UI text, in both languages.
`dateISO` is what the countdown runs to; `dateParts` feeds the big date block.

Colours are the variables at the top of `public/css/styles.css`. The two
portraits are `public/assets/portrait-heart.jpg` and `portrait-sofa.jpg`; any
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

`?lang=ar` in the link opens the Arabic version; the button in the corner
switches at any time and the choice is kept for the session. Switching sets
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

then open http://localhost:8000/ (and `?lang=ar` for Arabic). Serve over HTTP
rather than opening the file from disk so the SVG assets load.
