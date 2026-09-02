/* Renders every plate, in every language, to a transparent 1760x1240 PNG —
   the same geometry the sketchbook's turning leaf expects. */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public/landing-pages/meng-to-sketchbook-engagement/plates");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const W = 1760, H = 1240;

const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".woff2": "font/woff2", ".png": "image/png", ".jpg": "image/jpeg" };

const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split("?")[0]));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) {
    res.writeHead(404); return res.end("nope");
  }
  res.writeHead(200, { "content-type": MIME[path.extname(p)] || "application/octet-stream" });
  fs.createReadStream(p).pipe(res);
});
await new Promise((r) => server.listen(8899, "127.0.0.1", r));

const { plates } = JSON.parse(
  JSON.stringify(await import(`file://${path.join(ROOT, "public/landing-pages/meng-to-sketchbook-engagement/invitation.js")}`)
    .then(() => globalThis.INVITATION).catch(() => null) || {}));

const cfg = await import(`file://${path.join(ROOT, "public/landing-pages/meng-to-sketchbook-engagement/invitation.js")}`);
const PLATES = globalThis.INVITATION.plates;

fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "shell",
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1"],
  defaultViewport: { width: W, height: H, deviceScaleFactor: 1 }
});

let n = 0;
const page = await browser.newPage();
await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });

async function shoot(i, lang, variant, attempt = 0) {
  const suffix = variant === "narrow" ? `.${lang}.narrow` : `.${lang}`;
  const file = path.join(OUT, `${String(i + 1).padStart(2, "0")}-${PLATES[i].id}${suffix}.png`);
  try {
    await page.goto(`http://127.0.0.1:8899/tools/plates/plate.html?i=${i}&lang=${lang}&v=${variant}`,
      { waitUntil: "load", timeout: 30000 });
    await page.waitForFunction('document.documentElement.dataset.ready === "1"', { timeout: 20000 });
    const fit = await page.evaluate(() => document.documentElement.dataset.fit);
    const raw = await page.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: W, height: H } });
    /* indexed colour, as the original plates ship — a third of the bytes,
       and the paper is flat enough that 256 entries hold it without banding */
    await sharp(raw).png({ palette: true, colours: 256, effort: 10, compressionLevel: 9 }).toFile(file);
    console.log(`${path.basename(file).padEnd(30)} fit=${fit}  ${(fs.statSync(file).size / 1024).toFixed(0)}KB`);
  } catch (e) {
    if (attempt < 2) { console.log(`retry ${path.basename(file)}`); return shoot(i, lang, variant, attempt + 1); }
    throw e;
  }
}

for (const variant of ["wide", "narrow"]) {
  for (const lang of ["en", "ar"]) {
    for (let i = 0; i < PLATES.length; i++) { await shoot(i, lang, variant); n++; }
  }
}

await browser.close();
server.close();
console.log(`\n${n} plates rendered to ${path.relative(ROOT, OUT)}`);
