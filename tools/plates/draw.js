/* =====================================================================
   Lays one spread out at native 1760x1240.  The sheet is drawn (deckle
   edge, grain, gutter), the text is set in the real fonts, then a
   shrink-to-fit pass guarantees nothing clips — Arabic runs longer than
   English and must never be cropped.
   ===================================================================== */
(function () {

const Q = new URLSearchParams(location.search);
const lang = Q.get("lang") === "ar" ? "ar" : "en";
const i = Math.max(0, Math.min(INVITATION.plates.length - 1, parseInt(Q.get("i") || "0", 10)));
const P = INVITATION.plates[i];
const V = INVITATION.invitation;
const T = INVITATION.translations[lang];
const L = (o) => (o && o[lang]) || "";

const variant = Q.get("v") === "narrow" ? "narrow" : "wide";

const plate = document.getElementById("plate");
plate.dataset.lang = lang;
plate.dataset.variant = variant;

const artSide  = lang === "ar" ? "r" : "l";
const textSide = lang === "ar" ? "l" : "r";

/* ------------------------------------------------------- the sheet */
const SW = 1580.48, SH = 699.36, HALF = SW / 2;
function sheet() {
  const pageRect = (x) =>
    `<rect x="${x}" y="0" width="${HALF}" height="${SH}" rx="5" fill="url(#paper)" filter="url(#deckle)"/>`;
  /* a few offset strokes at each outer edge read as a stack of leaves */
  let edges = "";
  for (let k = 1; k <= 4; k++) {
    const o = k * 2.4, a = 0.16 - k * 0.028;
    edges += `<path d="M${2 - o} ${10 + o}v${SH - 20 - o * 2}" stroke="rgba(43,39,33,${a})" stroke-width="1.4"/>`;
    edges += `<path d="M${SW - 2 + o} ${10 + o}v${SH - 20 - o * 2}" stroke="rgba(43,39,33,${a})" stroke-width="1.4"/>`;
  }
  return `
<svg viewBox="0 0 ${SW} ${SH}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
  <defs>
    <linearGradient id="paper" x1="0" y1="0" x2="0.35" y2="1">
      <stop offset="0" stop-color="#f8f3e8"/>
      <stop offset="0.52" stop-color="#f3ecdd"/>
      <stop offset="1" stop-color="#ece4d2"/>
    </linearGradient>
    <filter id="deckle" x="-6%" y="-8%" width="112%" height="116%">
      <feTurbulence type="fractalNoise" baseFrequency="0.011 0.021" numOctaves="3" seed="6" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="9" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" seed="3"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.17 0 0 0 0 0.15 0 0 0 0 0.12 0 0 0 0.055 0"/>
    </filter>
    <linearGradient id="gutL" x1="1" y1="0" x2="0" y2="0">
      <stop offset="0" stop-color="rgba(60,45,24,0.30)"/>
      <stop offset="0.42" stop-color="rgba(60,45,24,0.07)"/>
      <stop offset="1" stop-color="rgba(60,45,24,0)"/>
    </linearGradient>
    <linearGradient id="gutR" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="rgba(60,45,24,0.26)"/>
      <stop offset="0.42" stop-color="rgba(60,45,24,0.06)"/>
      <stop offset="1" stop-color="rgba(60,45,24,0)"/>
    </linearGradient>
    <radialGradient id="vig" cx="0.5" cy="0.5" r="0.72">
      <stop offset="0.55" stop-color="rgba(90,70,40,0)"/>
      <stop offset="1" stop-color="rgba(90,70,40,0.09)"/>
    </radialGradient>
  </defs>
  ${pageRect(0)}${pageRect(HALF)}
  <rect x="0" y="0" width="${SW}" height="${SH}" fill="url(#vig)"/>
  <rect x="0" y="0" width="${SW}" height="${SH}" filter="url(#grain)" opacity="0.34"/>
  <rect x="${HALF - 96}" y="4" width="96" height="${SH - 8}" fill="url(#gutL)"/>
  <rect x="${HALF}" y="4" width="86" height="${SH - 8}" fill="url(#gutR)"/>
  <path d="M${HALF} 6v${SH - 12}" stroke="rgba(52,38,20,0.34)" stroke-width="1.2"/>
  ${edges}
</svg>`;
}

/* ------------------------------------------------------ text blocks */
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const kick = (s) => `<p class="kicker">${esc(s)}</p>`;
const rule = () => `<div class="rule-s"></div>`;
const names = (cls) =>
  `<h1 class="${cls}">${esc(L(V.couple.bride))}</h1>` +
  `<div class="amp">${lang === "ar" ? "و" : "&amp;"}</div>` +
  `<h1 class="${cls}">${esc(L(V.couple.groom))}</h1>`;
const note = (text) => text
  ? `<p class="note">${esc(text)}</p>` : "";
const rows = (list) =>
  `<dl class="rows">` + list.map((r) =>
    `<div class="row"><dt>${esc(r.k)}</dt><span class="lead"></span><dd>${esc(r.v)}</dd></div>`).join("") + `</dl>`;

function content() {
  switch (P.id) {
    case "cover":
      return kick(L({ en: "An engagement dinner", ar: "عشاء خطوبة" })) +
             `<h1 class="t-huge">${esc(L(P.title))}</h1>` + rule() + names("t-mid") +
             `<p class="body" style="margin-top:26px">${esc(L(V.dateBig))} · ${esc(L(V.location))}</p>`;
    case "invitation":
      return kick(L(P.title)) + `<h1 class="t-big">${esc(L(P.head))}</h1>` +
             `<p class="body" style="margin-top:28px">${esc(L(P.body))}</p>`;
    case "date":
      return kick(L(P.title)) + `<h1 class="t-huge">${esc(L(V.dateBig))}</h1>` + rule() +
             `<p class="body">${esc(L(V.date))}<br>${esc(L(V.time))}</p>`;
    case "celebration":
      return kick(L(P.title)) + rows([
        { k: L({ en: "Date", ar: "التاريخ" }),   v: L(V.date) },
        { k: L({ en: "Doors", ar: "الأبواب" }),   v: L(V.time) },
        { k: L({ en: "Entrance", ar: "الدخول" }), v: L(V.entrance) },
        { k: L({ en: "Venue", ar: "المكان" }),   v: L(V.venue) },
        { k: L({ en: "Location", ar: "الموقع" }), v: L(V.location) }
      ]) + note(L(P.note));
    case "story":
      return kick(L(P.title)) + `<p class="body">${esc(L(P.body))}</p>`;
    case "venue":
      return kick(L(P.title)) + `<h1 class="t-big">${esc(L(V.venue))}</h1>` + rule() +
             `<p class="body">${esc(L(V.location))}<br>${esc(L(V.date))} · ${esc(L(V.time))}</p>`;
    case "details":
      return kick(L(P.title)) + rows(V.details.map((d) => ({ k: L(d.label), v: L(d.value) })));
    case "rsvp":
      return kick(L(P.title)) + `<h1 class="t-big">${esc(L(P.head))}</h1>` +
             `<p class="body" style="margin-top:26px">${esc(L(P.body))}</p>`;
    case "closing":
      return kick(L(P.title)) + `<h1 class="t-mid">${esc(L(P.head))}</h1>` + rule() + names("t-mid");
    default:
      return `<h1 class="t-big">${esc(L(P.title))}</h1>`;
  }
}

/* ------------------------------------------------------------ build */
plate.innerHTML =
  `<div class="sheet">${sheet()}</div>` +
  `<div class="page ${artSide}" style="position:absolute"></div>` +
  `<div class="page ${textSide}"><div class="inner" id="txt">${content()}</div></div>` +
  `<div class="folio ${textSide}">${esc(L(P.place))}</div>`;

/* the art is placed inside the art page so it mirrors with the layout */
const artPage = plate.querySelector(".page." + artSide);
artPage.style.position = "absolute";
artPage.innerHTML = P.art === "photo" && P.photo
  ? `<figure class="print" style="--rot:${P.tilt || -2}deg">` +
      `<img src="/public/landing-pages/meng-to-sketchbook-engagement/${P.photo}" alt="">` +
      `<span class="tape tl"></span><span class="tape br"></span></figure>`
  : (MOTIFS[P.art] ? MOTIFS[P.art]("position:relative;width:100%;height:100%;opacity:.92") : "");
artPage.style.alignItems = "center";
artPage.style.justifyContent = "center";
artPage.style.padding = "78px 118px";

/* ---- shrink-to-fit: never let a language overflow its page ---- */
(function fit() {
  const box = document.getElementById("txt");
  const page = box.parentElement;
  const avail = page.clientHeight - 16;          /* padding already excluded */
  let scale = 1;
  /* zoom re-lays-out at the new size, so height must be re-read each pass */
  for (let n = 0; n < 24 && scale > 0.56; n++) {
    const fits = box.getBoundingClientRect().height <= avail &&
                 box.scrollWidth <= box.clientWidth + 1;
    if (fits) break;
    scale -= 0.04;
    box.style.zoom = scale;
  }
  document.documentElement.dataset.fit = scale.toFixed(3);
})();

/* signal readiness only once the real fonts are in */
(async function () {
  try { await document.fonts.ready; } catch (e) {}
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  document.documentElement.dataset.ready = "1";
})();

})();
