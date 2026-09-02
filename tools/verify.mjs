import puppeteer from "puppeteer-core";
const URL = "http://localhost:4173/landing-pages/meng-to-sketchbook-engagement.html";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const out = []; let fails = 0;
const ok  = (n, c, d = "") => { out.push(`${c ? "PASS" : "FAIL"}  ${n}${d ? "  — " + d : ""}`); if (!c) fails++; };

const b = await puppeteer.launch({ executablePath: CHROME, headless: "shell", args: ["--no-sandbox"] });
const p = await b.newPage();
const errs = [];
p.on("pageerror", e => errs.push(e.message));
p.on("console", m => { if (m.type() === "error") errs.push(m.text()); });

async function ready() { await p.waitForFunction('document.body.dataset.ready === "1"', { timeout: 30000 }); }

/* ---------- desktop, English ---------- */
await p.setViewport({ width: 1440, height: 900 });
await p.goto(URL + "?nointro", { waitUntil: "networkidle0" });
await ready();

let s = await p.evaluate(() => ({
  lang: document.documentElement.lang, dir: document.documentElement.dir,
  title: document.title,
  name: document.querySelector(".top .name").textContent.replace(/\s+/g, " ").trim(),
  kicker: document.querySelector(".hero-kicker").textContent.trim(),
  caption: document.querySelector(".sb-caption").textContent.trim(),
  plates: [...document.querySelectorAll(".plate .t")].map(e => e.textContent),
  img: document.querySelector(".sb-full img")?.getAttribute("src"),
  rows: document.querySelectorAll(".inv-row").length,
  rsvpOffline: (()=>{const f=document.getElementById("rsvpForm");
    document.getElementById("rsvpName").value="Test Guest";
    f.dispatchEvent(new Event("submit",{cancelable:true,bubbles:true}));
    const m=document.getElementById("rsvpMsg").textContent;
    document.getElementById("rsvpName").value="";
    return m;})(),
  map: document.getElementById("mapBtn").getAttribute("href"),
  rsvpText: document.getElementById("rsvpBtn").textContent.trim(),
  overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  ld: JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent)
}));
ok("html lang/dir is en/ltr", s.lang === "en" && s.dir === "ltr", `${s.lang}/${s.dir}`);
ok("title names the couple", /Alaa/.test(s.title) && /Ali/.test(s.title), s.title);
ok("header shows both names", /Alaa Hasan/.test(s.name) && /Ali Abdelhadi/.test(s.name), s.name);
ok("english plate captions", s.caption === "Our Engagement", s.caption);
ok("index lists 9 plates", s.plates.length === 9, `${s.plates.length}`);
ok("english plate art loaded", /01-cover\.en\.png$/.test(s.img || ""), s.img);
ok("detail rows built", s.rows === 10, `${s.rows} rows`);
ok("unconfigured endpoint says so, sends nothing", /not connected yet/.test(s.rsvpOffline), s.rsvpOffline);
ok("map href from config", /google\.com\/maps\/@33\.8690048,35\.5172352/.test(s.map), s.map);
ok("rsvp button label (en)", s.rsvpText === "Confirm Attendance", s.rsvpText);
ok("no horizontal overflow (1440)", s.overflowX <= 0, `${s.overflowX}px`);
ok("schema.org Event valid", s.ld["@type"] === "Event" && s.ld.startDate === "2026-10-16T18:00:00+03:00", s.ld.startDate);
ok("schema venue matches config", s.ld.location.name === "Diamond Wedding Venue", s.ld.location.name);

/* ---------- page turning ---------- */
const before = await p.evaluate(() => document.querySelector(".sb-caption").textContent.trim());
await p.click("#sbRight");
await p.waitForFunction(`document.querySelector('.sb-caption')?.textContent.trim() !== ${JSON.stringify(before)}`, { timeout: 8000 });
const after = await p.evaluate(() => document.querySelector(".sb-caption").textContent.trim());
ok("arrow turns the page (en fwd)", after === "The Invitation", `${before} -> ${after}`);

/* ---------- zoom controls ---------- */
await p.click("#zIn");
await new Promise(r => setTimeout(r, 700));
const z1 = await p.evaluate(() => document.getElementById("zRead").textContent);
await p.click("#zOut");
await new Promise(r => setTimeout(r, 700));
const z2 = await p.evaluate(() => document.getElementById("zRead").textContent);
ok("zoom in changes readout", z1 !== "100%", z1);
ok("zoom out returns", z2 === "100%", z2);

/* ---------- loupe ---------- */
const loupe = await p.evaluate(() => {
  const l = document.getElementById("loupe");
  return { on: l.classList.contains("on"), tf: l.style.transform, pressed: document.getElementById("loupeBtn").getAttribute("aria-pressed") };
});
ok("magnifier is placed and on", loupe.on && /translate3d/.test(loupe.tf), loupe.tf);
ok("magnifier toggle pressed", loupe.pressed === "true");

/* ---------- language switch, state preserved ---------- */
const idxBefore = await p.evaluate(() => document.querySelector('.plate[aria-current="true"]')?.querySelector(".n").textContent);
await p.click('.lang[data-lang="ar"]');
await p.waitForFunction('document.documentElement.dir === "rtl"', { timeout: 10000 });
await new Promise(r => setTimeout(r, 500));
const a = await p.evaluate(() => ({
  lang: document.documentElement.lang, dir: document.documentElement.dir,
  title: document.title,
  caption: document.querySelector(".sb-caption")?.textContent.trim(),
  img: document.querySelector(".sb-full img")?.getAttribute("src"),
  idx: document.querySelector('.plate[aria-current="true"]')?.querySelector(".n").textContent,
  kicker: document.querySelector(".hero-kicker").textContent.trim(),
  rsvpText: document.getElementById("rsvpBtn").textContent.trim(),
  plate1: document.querySelector(".plate .t").textContent,
  font: getComputedStyle(document.querySelector(".bio")).fontFamily,
  align: getComputedStyle(document.querySelector(".bio")).textAlign,
  stageDir: getComputedStyle(document.querySelector(".sb-stage")).direction,
  overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  ss: sessionStorage.getItem("inv-lang")
}));
ok("switch sets lang/dir to ar/rtl", a.lang === "ar" && a.dir === "rtl", `${a.lang}/${a.dir}`);
ok("plate index preserved across switch", a.idx === idxBefore, `${idxBefore} -> ${a.idx}`);
ok("arabic plate art swapped", /02-invitation\.ar\.png$/.test(a.img || ""), a.img);
ok("arabic caption", a.caption === "الدعوة", a.caption);
ok("arabic index entry", a.plate1 === "خطوبتنا", a.plate1);
ok("arabic rsvp label", a.rsvpText === "تأكيد الحضور", a.rsvpText);
ok("arabic uses Amiri", /Amiri/.test(a.font), a.font);
ok("body copy aligns right in rtl", a.align === "right" || a.align === "start", a.align);
ok("book stage stays physically ltr", a.stageDir === "ltr", a.stageDir);
ok("no horizontal overflow in rtl", a.overflowX <= 0, `${a.overflowX}px`);
ok("choice persisted to session", a.ss === "ar", String(a.ss));
ok("arabic title", /خطوبتنا/.test(a.title), a.title);

/* ---------- rtl paging advances the other way ---------- */
const capA = await p.evaluate(() => document.querySelector(".sb-caption").textContent.trim());
await p.click("#sbLeft");                       // left arrow = forward in rtl
await p.waitForFunction(`document.querySelector('.sb-caption')?.textContent.trim() !== ${JSON.stringify(capA)}`, { timeout: 8000 });
const capB = await p.evaluate(() => document.querySelector(".sb-caption").textContent.trim());
ok("rtl: left arrow advances", capB === "التاريخ", `${capA} -> ${capB}`);

/* ---------- session persistence on reload ---------- */
await p.reload({ waitUntil: "networkidle0" });
await ready();
const r = await p.evaluate(() => ({ dir: document.documentElement.dir, lang: document.documentElement.lang }));
ok("language survives reload (session)", r.dir === "rtl" && r.lang === "ar", `${r.lang}/${r.dir}`);

/* ---------- mobile portrait, arabic ---------- */
await p.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
await new Promise(r => setTimeout(r, 900));
const m = await p.evaluate(() => {
  const de = document.documentElement;
  const wide = [...document.querySelectorAll("body *")].filter(e => e.getBoundingClientRect().right > de.clientWidth + 1.5)
    .map(e => e.className || e.tagName).slice(0, 6);
  return { ox: de.scrollWidth - de.clientWidth, wide, dir: de.dir,
           loupe: getComputedStyle(document.getElementById("loupe")).display };
});
ok("no horizontal overflow (390 rtl)", m.ox <= 0, `${m.ox}px  offenders: ${m.wide.join(", ")}`);
ok("loupe hidden on coarse pointer", m.loupe === "none", m.loupe);

/* ---------- mobile landscape, english ---------- */
await p.evaluate(() => sessionStorage.setItem("inv-lang", "en"));
await p.setViewport({ width: 844, height: 390, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
await p.reload({ waitUntil: "networkidle0" }); await ready();
const ml = await p.evaluate(() => ({ ox: document.documentElement.scrollWidth - document.documentElement.clientWidth, dir: document.documentElement.dir }));
ok("no horizontal overflow (844x390 ltr)", ml.ox <= 0, `${ml.ox}px`);

ok("no console/page errors", errs.length === 0, errs.slice(0, 3).join(" | "));

await b.close();
console.log(out.join("\n"));
console.log(`\n${out.length - fails}/${out.length} checks passed`);
process.exit(fails ? 1 : 0);
