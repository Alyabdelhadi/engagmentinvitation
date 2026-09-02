/* =====================================================================
   Botanical line art, drawn rather than pasted.  Leaves are distributed
   along a bezier stem with a seeded jitter, so no two sprigs repeat and
   nothing has the evenness of clip art.
   ===================================================================== */
(function (root) {

/* deterministic PRNG — same seed, same drawing, every build */
function rng(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const R = (n) => Math.round(n * 100) / 100;

function bez(p, t) {
  const u = 1 - t, a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
  return [a * p[0][0] + b * p[1][0] + c * p[2][0] + d * p[3][0],
          a * p[0][1] + b * p[1][1] + c * p[2][1] + d * p[3][1]];
}
function tan(p, t) {
  const u = 1 - t, a = 3 * u * u, b = 6 * u * t, c = 3 * t * t;
  return Math.atan2(a * (p[1][1] - p[0][1]) + b * (p[2][1] - p[1][1]) + c * (p[3][1] - p[2][1]),
                    a * (p[1][0] - p[0][0]) + b * (p[2][0] - p[1][0]) + c * (p[3][0] - p[2][0]));
}
function stemPath(p) {
  return `M${R(p[0][0])} ${R(p[0][1])}C${R(p[1][0])} ${R(p[1][1])} ${R(p[2][0])} ${R(p[2][1])} ${R(p[3][0])} ${R(p[3][1])}`;
}

/* a pointed oval, drawn as two opposing quadratics */
function leaf(x, y, ang, len, wid) {
  const tx = x + Math.cos(ang) * len, ty = y + Math.sin(ang) * len;
  const mx = x + Math.cos(ang) * len * 0.45, my = y + Math.sin(ang) * len * 0.45;
  const px = Math.cos(ang + Math.PI / 2) * wid, py = Math.sin(ang + Math.PI / 2) * wid;
  return `M${R(x)} ${R(y)}Q${R(mx + px)} ${R(my + py)} ${R(tx)} ${R(ty)}` +
         `Q${R(mx - px)} ${R(my - py)} ${R(x)} ${R(y)}Z`;
}

/* leaves marching along a stem, alternating sides, jittered */
function sprig(o) {
  const p = o.stem, r = rng(o.seed || 7), n = o.count || 9;
  const t0 = o.t0 == null ? 0.16 : o.t0, t1 = o.t1 == null ? 0.97 : o.t1;
  const cls = o.warm ? "leaf warm" : "leaf";
  let out = `<path class="ink ${o.warm ? "faint" : "soft"}" stroke-width="${o.stemW || 2.4}" d="${stemPath(p)}"/>`;
  for (let i = 0; i < n; i++) {
    const t = t0 + (t1 - t0) * (i / (n - 1 || 1));
    const [x, y] = bez(p, t);
    const a = tan(p, t);
    const side = i % 2 ? 1 : -1;
    const spread = (o.spread || 0.72) + (r() - 0.5) * 0.3;
    const taper = 1 - 0.5 * t;                       /* smaller toward the tip */
    const len = (o.len || 54) * taper * (0.82 + r() * 0.36);
    const wid = (o.wid || 15) * taper * (0.8 + r() * 0.4);
    out += `<path class="${cls}" d="${leaf(x, y, a + side * spread, len, wid)}"/>`;
    out += `<path class="ink faint" stroke-width="1.1" d="M${R(x)} ${R(y)}L${R(x + Math.cos(a + side * spread) * len * 0.9)} ${R(y + Math.sin(a + side * spread) * len * 0.9)}"/>`;
  }
  return out;
}

function svg(vb, inner, style) {
  return `<svg class="art" style="${style}" viewBox="${vb}" fill="none" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
}

/* ---------------------------------------------------------- motifs */
const M = {};

M.sprig = (s) => svg("0 0 300 420", sprig({
  seed: 21, count: 11, len: 62, wid: 17,
  stem: [[150, 410], [122, 300], [176, 176], [150, 34]]
}), s);

M.branch = (s) => svg("0 0 340 300",
  sprig({ seed: 44, count: 10, len: 56, wid: 15, stem: [[16, 250], [104, 224], [214, 190], [322, 74]] }) +
  sprig({ seed: 91, count: 6, len: 40, wid: 11, stem: [[92, 244], [140, 268], [206, 268], [258, 226]] }), s);

M.olive = (s) => {
  let o = sprig({ seed: 61, count: 12, len: 50, wid: 12, warm: true,
                  stem: [[26, 286], [120, 254], [230, 222], [312, 96]] });
  const r = rng(3);
  for (let i = 0; i < 5; i++) {
    const t = 0.3 + i * 0.15, p = bez([[26, 286], [120, 254], [230, 222], [312, 96]], t);
    o += `<ellipse class="leaf warm" cx="${R(p[0] + (r() - 0.5) * 16)}" cy="${R(p[1] + 20 + r() * 12)}" rx="9.5" ry="12.5"/>`;
  }
  return svg("0 0 340 300", o, s);
};

M.wreath = (s) => {
  let o = "", r = rng(12);
  for (let i = 0; i < 2; i++) {
    const dir = i ? 1 : -1;
    const p = [[150, 288], [150 + dir * 150, 262], [150 + dir * 150, 62], [150, 34]];
    o += sprig({ seed: 30 + i * 17, count: 13, len: 42, wid: 11, spread: 0.95, stem: p });
  }
  o += `<circle class="ink faint" stroke-width="1" cx="150" cy="161" r="126" stroke-dasharray="1.5 9"/>`;
  const st = r();
  return svg("0 0 300 322", o, s);
};

M.rings = (s) => {
  let o = "";
  o += `<circle class="ink soft" stroke-width="3.2" cx="118" cy="120" r="62"/>`;
  o += `<circle class="ink faint" stroke-width="1.4" cx="118" cy="120" r="55"/>`;
  o += `<circle class="ink soft" stroke-width="3.2" cx="196" cy="150" r="62"/>`;
  o += `<circle class="ink faint" stroke-width="1.4" cx="196" cy="150" r="55"/>`;
  /* the little stone, and its glint */
  o += `<path class="leaf warm" d="M118 44l17 17-17 18-17-18z"/>`;
  o += `<path class="ink faint" stroke-width="1.3" d="M228 44l0 22M217 55l22 0M246 78l0 13M239.5 84.5l13 0"/>`;
  o += sprig({ seed: 8, count: 6, len: 34, wid: 9, stem: [[36, 236], [92, 224], [166, 226], [232, 208]] });
  return svg("0 0 300 270", o, s);
};

M.arch = (s) => {
  let o = "";
  /* an arch you could walk through, with planting either side */
  o += `<path class="ink soft" stroke-width="3" d="M52 300V148a98 98 0 0 1 196 0v152"/>`;
  o += `<path class="ink faint" stroke-width="1.3" d="M72 300V150a78 78 0 0 1 156 0v150"/>`;
  o += `<path class="ink faint" stroke-width="1.2" d="M40 300h220"/>`;
  o += sprig({ seed: 15, count: 8, len: 40, wid: 11, stem: [[52, 298], [30, 232], [66, 176], [44, 118]] });
  o += sprig({ seed: 52, count: 8, len: 40, wid: 11, stem: [[248, 298], [270, 232], [234, 176], [256, 118]] });
  o += `<path class="ink faint" stroke-width="1.2" d="M150 300v-58M136 258l14 14 14-14"/>`;
  return svg("0 0 300 320", o, s);
};

M.envelope = (s) => {
  let o = "";
  o += `<rect class="ink soft" stroke-width="2.8" x="30" y="58" width="240" height="158" rx="7"/>`;
  o += `<path class="ink soft" stroke-width="2.4" d="M30 68l120 88 120-88"/>`;
  o += `<path class="ink faint" stroke-width="1.2" d="M30 210l86-66M270 210l-86-66"/>`;
  o += `<circle class="leaf warm" cx="150" cy="152" r="26"/>`;
  o += `<path class="ink faint" stroke-width="1.4" d="M140 152h20M150 142v20"/>`;
  o += sprig({ seed: 71, count: 5, len: 32, wid: 9, stem: [[48, 250], [104, 240], [180, 244], [252, 232]] });
  return svg("0 0 300 268", o, s);
};

M.bloom = (s) => {
  let o = "", r = rng(99);
  /* concentric, slightly irregular petals opening from a centre */
  for (let ring = 5; ring >= 1; ring--) {
    const rad = 20 + ring * 21, n = 4 + ring * 2;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + ring * 0.42 + r() * 0.12;
      const cx = 150 + Math.cos(a) * rad * 0.42, cy = 158 + Math.sin(a) * rad * 0.42;
      o += `<path class="leaf${ring > 3 ? " warm" : ""}" d="${leaf(cx, cy, a, rad * 0.72, rad * 0.3)}"/>`;
    }
  }
  o += `<circle class="ink faint" stroke-width="1.4" cx="150" cy="158" r="13"/>`;
  o += sprig({ seed: 5, count: 7, len: 44, wid: 12, stem: [[150, 300], [140, 262], [162, 232], [150, 202]] });
  return svg("0 0 300 320", o, s);
};

M.cover = (s) => {
  let o = "";
  o += sprig({ seed: 33, count: 12, len: 66, wid: 18, stem: [[24, 400], [70, 300], [30, 196], [96, 70]] });
  o += sprig({ seed: 77, count: 9, len: 52, wid: 14, stem: [[36, 386], [128, 344], [190, 268], [212, 152]] });
  o += `<path class="ink faint" stroke-width="1.1" d="M14 418c68-26 132-84 168-160" stroke-dasharray="2 10"/>`;
  return svg("0 0 260 430", o, s);
};

root.MOTIFS = M;
if (typeof module === "object" && module.exports) module.exports = M;

})(typeof globalThis !== "undefined" ? globalThis : this);
