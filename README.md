# Our Engagement — Alaa & Ali

A bilingual (English / العربية) engagement invitation, forked from the real
ThreeUI `meng-to-sketchbook` landing page and adapted into an interactive
sketchbook invitation.

## Provenance

There is no `MengToSketchbookEngagementInvitation` in `@designcodeio/threeui`.
This is a **derivation**, not the shipped component:

| Piece | Origin |
|---|---|
| `src/shaders/landing-pages/pageTypography.ts` | upstream, byte-for-byte |
| `src/shaders/landing-pages/pageRecipes.ts` | upstream + `ENGAGEMENT_TYPOGRAPHY` appended |
| `src/shaders/landing-pages/LandingPageFrame.tsx` | upstream `LandingPageFrame`, extracted to its own file |
| `src/shaders/landing-pages/LandingPages.tsx` | upstream, re-exporting the frame + the engagement component |
| `public/landing-pages/meng-to-sketchbook-engagement.html` | fork of upstream `meng-to-sketchbook.html` |
| `bg-wash.jpg`, `divider.png`, `bloom.png`, `botany-*.png`, the three Latin `.woff2` | upstream, byte-for-byte, original filenames |

The page-turn, drag, magnifier, zoom, tilt, riffle-intro and index code is the
authored upstream implementation. The changes to it are the bilingual layer,
the RTL turn mapping, and one inherited-bug fix (below).

## Customising

Everything the couple might change lives in one file:

    public/landing-pages/meng-to-sketchbook-engagement/invitation.js

Names, date, time, venue, location, the message, the RSVP and map URLs, the
detail rows and all nine plates' copy are there, in both languages. The same
file is read by the page **and** by the plate renderer, so artwork and DOM
cannot drift apart.

After editing anything that appears **on a plate**, re-bake the artwork:

    npm run plates        # 18 PNGs: 9 plates x 2 languages
    npm run build

Text that only appears in the page chrome (nav, index, RSVP section) needs no
re-bake.

## RSVP → Google Sheet

Guests reply **on the invitation itself** — full name, number of guests, one
confirm button. No redirect, no second page.

The form is write-only from the browser (the response is opaque either way),
so a resolved request is the success signal. Until `rsvp.endpoint` is filled
in, the form refuses to pretend: it says it is not connected yet and sends
nothing.

### Wiring it up (Apps Script — recommended)

1. Make a Google Sheet for the replies.
2. **Extensions → Apps Script**, paste `tools/rsvp/Code.gs`, Save.
3. Run `setup` once and accept the permission prompt (it writes the header row).
4. **Deploy → New deployment → Web app**, *Execute as* **Me**, *Who has access*
   **Anyone**. Copy the `/exec` URL.
5. Put it in `invitation.js`:

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

Responses land in whatever sheet the form is linked to.

### Behaviour

* Empty name is refused before anything is sent; the field is flagged.
* Guests is clamped to 1…`maxGuests` by the steppers and by hand-typing.
* After a successful reply the fields are replaced by a thank-you, with a
  quiet "reply again" if someone needs to change their answer.
* The reply is remembered in `localStorage`, so a guest returning to the page
  sees that they already replied rather than a blank form.

## Phones

The whole spread stays on screen at phone width. The room that costs is
bought back in the artwork: the `*.narrow.png` plates run their text across
**both pages in two columns**, the way a book does, so the measure is a
column rather than half a phone. The column gap straddles the spine, so no
line crosses the gutter and a turning leaf never tears a sentence.

Body copy lands at about **13.7px** on a 390px phone (it was 6.9px with the
wide plates). `npm run plates` bakes both sets — 36 PNGs — and crossing the
breakpoint swaps between them without disturbing the page you are on.

Two things the renderer now guards, both of which silently cropped text
before:

* **Fit runs after `document.fonts.ready`.** Instrument Serif, Newsreader
  and Amiri all set wider than the fallback they replace, so measuring
  before they arrive fits the wrong text and lets the real words spill.
* **Multi-column overflow is detected with an end marker**, not
  `scrollWidth` — an overflowing column box does not report a wider
  scrollWidth, so the old check passed while the last line was being cut
  off the plate.

If any plate still cannot fit its text, `npm run plates` names it and exits
non-zero rather than shipping a cropped invitation.

Run `node tools/measure-mobile.mjs` against a running preview to check the
on-screen type sizes.

## How the two languages work

One DOM, one set of strings. `[data-i18n]` / `[data-i18n-aria]` pull from
`translations`, `[data-inv]` / `[data-inv-href]` pull from `invitation`.
Switching sets `<html lang dir>`, swaps every marked node, repoints the plate
images at the other language's PNGs and repaints — keeping the current plate,
any turn in flight, the zoom level and the magnifier's position.

The choice is kept in `sessionStorage` and outranks the component's
`defaultLanguage` on the next page view in that session.

The book itself stays physically left-to-right: the leaf geometry, the drag
maths and the magnifier all work in stage pixels. What mirrors in Arabic is
which arrow *advances* — the left arrow moves forward, as in a printed Arabic
book — plus the type stack, the tracking and the page chrome.

## Fixed upstream bug

`stage.setPointerCapture()` fired on every press inside the stage, including
presses on the arrows and the toolbar, which retargets their `click` to the
stage and swallows it. The arrows are dead in the upstream original; verified
in headful Chrome with real mouse events. The capture is now taken only for a
press that lands on the book.

## Deploying to Vercel

Import the repo — the defaults in `vercel.json` are already correct
(framework `vite`, build `npm run build`, output `dist`). No environment
variables are needed; the RSVP endpoint is a public URL that lives in
`invitation.js`.

**`cleanUrls` must stay `false`.** The React wrapper points its iframe at
`/landing-pages/meng-to-sketchbook-engagement.html?lang=…`. With `cleanUrls`
on, Vercel redirects that to the extension-less path, and the invitation
either fails to frame or loses its `?lang` query. `vercel.json` pins it off;
don't override it in the dashboard.

Caching is set so the parts that change stay fresh:

| Path | Policy |
|---|---|
| `/assets/*` | one year, immutable — Vite fingerprints these |
| plate PNGs, photos, fonts | 1 h, then `stale-while-revalidate` for a week |
| `invitation.js` | always revalidate — it holds the content and the RSVP endpoint |
| `*.html` | always revalidate |

Plate artwork keeps stable filenames but its *contents* change every time you
run `npm run plates`, which is why it revalidates rather than pinning for a
year.

The deployment is ~19 MB, about 5.6 MB of which is `couple-photo-1/2.png`.
Those are inputs to the plate renderer, never fetched by a visitor, so they
cost deploy size but no bandwidth.

## Commands

    npm install
    npm run dev       # vite dev server
    npm run build     # tsc -b && vite build
    npm run preview   # serve dist
    npm run plates    # re-bake plate artwork from invitation.js
