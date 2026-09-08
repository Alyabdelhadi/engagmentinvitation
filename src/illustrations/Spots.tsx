/* Small cartoon motifs used around the page. Each draws inside a square
   box so they can be dropped into cards and detail rows at any size. */
import { INK } from "./Couple";
import type { DetailIcon } from "../invitation";

type SvgProps = { className?: string; title?: string };

const base = { stroke: INK, strokeWidth: 3, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

export function Rings({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 120 120" aria-hidden="true" {...base}>
      <circle cx="46" cy="66" r="26" fill="none" stroke="#e6b83c" strokeWidth={9} />
      <circle cx="46" cy="66" r="26" fill="none" />
      <circle cx="46" cy="66" r="17" fill="none" />
      <circle cx="76" cy="66" r="26" fill="none" stroke="#e6b83c" strokeWidth={9} />
      <circle cx="76" cy="66" r="26" fill="none" />
      <circle cx="76" cy="66" r="17" fill="none" />
      <path d="M 76 26 L 88 38 L 76 52 L 64 38 Z" fill="#bfe9ff" />
      <path d="M 70 38 L 82 38 M 76 32 L 76 44" fill="none" stroke="#fff" strokeWidth={2} />
      <path d="M 100 18 l 0 8 M 96 22 l 8 0 M 22 22 l 0 6 M 19 25 l 6 0" strokeWidth={2.4} />
    </svg>
  );
}

export function Calendar({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 120 120" aria-hidden="true" {...base}>
      <rect x="18" y="26" width="84" height="76" rx="12" fill="#fff8ea" />
      <path d="M 18 48 L 102 48" />
      <rect x="18" y="26" width="84" height="22" rx="12" fill="#e8788f" />
      <rect x="18" y="38" width="84" height="10" fill="#e8788f" stroke="none" />
      <rect x="34" y="16" width="10" height="20" rx="5" fill="#fff" />
      <rect x="76" y="16" width="10" height="20" rx="5" fill="#fff" />
      <path d="M 60 90 C 40 78 46 58 60 66 C 74 58 80 78 60 90 Z" fill="#f7a2b4" />
    </svg>
  );
}

export function Venue({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 240 150" aria-hidden="true" {...base}>
      {/* cypress trees either side, a lit hall with an arch, a diamond on the sign */}
      <path d="M 24 140 C 6 110 8 60 24 30 C 40 60 42 110 24 140 Z" fill="#4f8f3a" />
      <path d="M 216 140 C 198 110 200 60 216 30 C 232 60 234 110 216 140 Z" fill="#4f8f3a" />
      <rect x="48" y="60" width="144" height="80" rx="6" fill="#fff4e1" />
      <path d="M 40 60 L 120 24 L 200 60 Z" fill="#e8788f" />
      <path d="M 96 140 L 96 96 A 24 24 0 0 1 144 96 L 144 140 Z" fill="#8a6a55" />
      <path d="M 120 100 L 120 140" strokeWidth={2} />
      <rect x="60" y="76" width="22" height="26" rx="6" fill="#ffe28a" />
      <rect x="158" y="76" width="22" height="26" rx="6" fill="#ffe28a" />
      <path d="M 48 68 C 70 84 100 84 120 68 C 140 84 170 84 192 68" fill="none" strokeWidth={2} />
      {[62, 80, 98, 142, 160, 178].map((x) => <circle key={x} cx={x} cy={x < 120 ? 70 + (x - 48) / 2 : 70 + (192 - x) / 2} r="3" fill="#ffd66b" strokeWidth={1.6} />)}
      <path d="M 120 32 L 130 42 L 120 56 L 110 42 Z" fill="#bfe9ff" />
      <path d="M 24 140 L 216 140" />
      {[70, 170].map((x) => (
        <g key={x} transform={`translate(${x} 120)`}>
          <rect x="-6" y="-18" width="12" height="20" rx="4" fill="#8a6a55" />
          <circle cx="0" cy="-26" r="12" fill="#f7a2b4" />
          <circle cx="-6" cy="-22" r="3" fill="#fff" strokeWidth={1.4} />
          <circle cx="6" cy="-30" r="3" fill="#fff" strokeWidth={1.4} />
        </g>
      ))}
    </svg>
  );
}

export function DinnerTable({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 240 150" aria-hidden="true" {...base}>
      <path d="M 34 84 C 34 60 206 60 206 84 L 214 140 L 26 140 Z" fill="#fffdf7" />
      <ellipse cx="120" cy="84" rx="88" ry="20" fill="#fff" />
      <rect x="70" y="20" width="10" height="46" rx="4" fill="#fff8d6" />
      <path d="M 75 16 C 70 8 72 2 75 -2 C 78 2 80 8 75 16 Z" fill="#ffb347" />
      <rect x="160" y="20" width="10" height="46" rx="4" fill="#fff8d6" />
      <path d="M 165 16 C 160 8 162 2 165 -2 C 168 2 170 8 165 16 Z" fill="#ffb347" />
      <ellipse cx="60" cy="88" rx="16" ry="6" fill="#e9eef7" />
      <ellipse cx="180" cy="88" rx="16" ry="6" fill="#e9eef7" />
      <rect x="112" y="46" width="16" height="22" rx="5" fill="#8ec552" />
      <circle cx="108" cy="42" r="8" fill="#f7a2b4" /><circle cx="132" cy="42" r="8" fill="#ffd66b" /><circle cx="120" cy="34" r="8" fill="#fff" />
      <path d="M 96 72 C 96 60 108 60 108 72 L 108 76 L 96 76 Z" fill="#dcefff" /><path d="M 102 76 L 102 88 M 96 88 L 108 88" strokeWidth={2.4} />
      <path d="M 132 72 C 132 60 144 60 144 72 L 144 76 L 132 76 Z" fill="#dcefff" /><path d="M 138 76 L 138 88 M 132 88 L 144 88" strokeWidth={2.4} />
      <path d="M 40 108 L 30 140 M 200 108 L 210 140" strokeWidth={2.4} />
    </svg>
  );
}

export function Envelope({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 120 120" aria-hidden="true" {...base}>
      <rect x="14" y="36" width="92" height="64" rx="10" fill="#fff8ea" />
      <path d="M 14 46 L 60 80 L 106 46" fill="none" />
      <path d="M 14 46 L 60 20 L 106 46" fill="#fff8ea" />
      <path d="M 60 66 C 46 56 50 42 60 48 C 70 42 74 56 60 66 Z" fill="#e8788f" />
      <path d="M 92 14 l 0 8 M 88 18 l 8 0 M 20 22 l 0 6 M 17 25 l 6 0" strokeWidth={2.4} />
    </svg>
  );
}

export function Sprig({ className, flip }: SvgProps & { flip?: boolean }) {
  return (
    <svg className={className} viewBox="0 0 120 120" aria-hidden="true" {...base} style={flip ? { transform: "scaleX(-1)" } : undefined}>
      <path d="M 20 108 C 40 80 60 60 100 22" fill="none" stroke="#6fa845" strokeWidth={3.4} />
      {[[38, 84, -40], [56, 64, -40], [76, 44, -40], [46, 96, 40], [64, 78, 40], [86, 56, 40]].map(([x, y, r], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
          <path d="M -14 0 C -8 -8 8 -8 14 0 C 8 8 -8 8 -14 0 Z" fill="#8ec552" strokeWidth={2.2} />
        </g>
      ))}
      <circle cx="104" cy="18" r="7" fill="#f7a2b4" strokeWidth={2.2} />
      <circle cx="104" cy="18" r="2.4" fill="#ffd66b" stroke="none" />
    </svg>
  );
}

export function Flower({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 60 60" aria-hidden="true" {...base} strokeWidth={2}>
      {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx="30" cy="16" rx="7" ry="11" fill="#f7a2b4" transform={`rotate(${a} 30 30)`} />)}
      <circle cx="30" cy="30" r="7" fill="#ffd66b" />
    </svg>
  );
}

/* one small drawing per practical detail */
export function DetailGlyph({ icon, className }: SvgProps & { icon: DetailIcon }) {
  const p = { className, viewBox: "0 0 48 48", "aria-hidden": true as const, ...base, strokeWidth: 2.4 };
  switch (icon) {
    case "door":
      return (
        <svg {...p}>
          <rect x="10" y="6" width="28" height="38" rx="4" fill="#fff8ea" />
          <path d="M 16 44 L 16 10 L 32 6 L 32 44" fill="#8a6a55" />
          <circle cx="28" cy="26" r="2.4" fill="#ffd66b" />
        </svg>
      );
    case "couple":
      return (
        <svg {...p}>
          <circle cx="17" cy="14" r="7" fill="#f3cfae" />
          <path d="M 6 42 C 6 28 28 28 28 42 Z" fill="#f9e48c" />
          <circle cx="33" cy="14" r="7" fill="#dfa77f" />
          <path d="M 22 42 C 22 28 44 28 44 42 Z" fill="#efe7d6" />
          <path d="M 24 22 C 18 18 20 12 24 14 C 28 12 30 18 24 22 Z" fill="#e8788f" strokeWidth={1.6} />
        </svg>
      );
    case "dinner":
      return (
        <svg {...p}>
          <path d="M 6 32 C 6 18 42 18 42 32 Z" fill="#e9eef7" />
          <path d="M 4 32 L 44 32" />
          <path d="M 24 12 C 22 8 22 6 24 4 C 26 6 26 8 24 12 Z" fill="#ffb347" strokeWidth={1.6} />
          <path d="M 10 40 L 38 40" strokeWidth={3} />
        </svg>
      );
    case "dress":
      return (
        <svg {...p}>
          <path d="M 4 42 L 10 14 L 18 8 L 22 14 L 22 42 Z" fill="#2f2f2f" />
          <path d="M 26 42 L 26 18 L 34 8 L 42 18 C 38 26 42 34 46 42 Z" fill="#f7a2b4" />
          <path d="M 12 14 L 16 20 L 20 14" fill="none" stroke="#fff" strokeWidth={1.6} />
        </svg>
      );
    case "car":
      return (
        <svg {...p}>
          <path d="M 6 32 L 8 22 L 14 12 L 34 12 L 40 22 L 42 32 L 42 38 L 6 38 Z" fill="#a9c9ef" />
          <path d="M 12 22 L 16 15 L 32 15 L 36 22 Z" fill="#e6f4fd" />
          <circle cx="14" cy="38" r="5" fill="#2f2f2f" /><circle cx="34" cy="38" r="5" fill="#2f2f2f" />
          <circle cx="10" cy="30" r="2" fill="#ffd66b" /><circle cx="38" cy="30" r="2" fill="#ffd66b" />
        </svg>
      );
    case "family":
      return (
        <svg {...p}>
          <path d="M 4 24 L 14 12 L 24 24 L 24 42 L 4 42 Z" fill="#fff8ea" />
          <path d="M 24 24 L 34 12 L 44 24 L 44 42 L 24 42 Z" fill="#f9e48c" />
          <path d="M 12 42 L 12 32 L 18 32 L 18 42 M 30 42 L 30 32 L 36 32 L 36 42" fill="#8a6a55" />
          <path d="M 24 12 C 20 8 22 4 24 6 C 26 4 28 8 24 12 Z" fill="#e8788f" strokeWidth={1.6} />
        </svg>
      );
  }
}
