/* Alaa & Ali, drawn from the couple's photographs: her cream hijab and
   butter-yellow shirt, hands clasped at her chest; his swept-back hair,
   full beard, cream linen shirt and the watch on his left wrist. The
   landscape behind them is the Bekaa field from the other photograph —
   the branch overhead, the lavender mountains, the green rows. */

export const INK = "#3b2a22";

const skinAlaa = "#f3cfae";
const skinAli = "#dfa77f";
const hair = "#2b1d17";
const cream = "#f6efe1";
const yellow = "#f9e48c";
const linen = "#efe7d6";

type Props = React.SVGProps<SVGGElement>;

/** The two figures, waist up. Designed in a 390-wide box, feet at y=700. */
export function CoupleFigures(props: Props) {
  return (
    <g {...props} stroke={INK} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round">
      {/* ─── Ali (behind, right) ─── */}
      <g>
        {/* neck */}
        <rect x="233" y="404" width="26" height="34" rx="6" fill={skinAli} />
        {/* shirt body */}
        <path d="M 188 458 C 196 440 220 428 246 424 C 272 428 296 440 306 458 L 320 560 L 316 700 L 178 700 L 176 560 Z" fill={linen} />
        {/* placket + buttons */}
        <path d="M 246 452 L 246 700" fill="none" strokeWidth={2.4} />
        {[500, 545, 590, 635, 680].map((y) => <circle key={y} cx="246" cy={y} r="3.2" fill={INK} stroke="none" />)}
        {/* collar */}
        <path d="M 222 434 L 246 462 L 234 424 Z" fill={linen} />
        <path d="M 270 434 L 246 462 L 258 424 Z" fill={linen} />
        {/* right arm (viewer's right) with the watch */}
        <path d="M 296 452 C 320 470 330 520 326 580 L 322 640 L 300 640 L 298 580 C 296 540 292 500 288 470 Z" fill={linen} />
        <rect x="297" y="632" width="30" height="14" rx="4" fill={hair} />
        <circle cx="312" cy="639" r="8" fill="#fbfbf7" strokeWidth={2.4} />
        <path d="M 312 634 L 312 639 L 315 641" fill="none" strokeWidth={1.8} />
        <path d="M 299 648 C 300 668 306 684 314 692 C 324 690 332 676 330 650 Z" fill={skinAli} />
        {/* head */}
        <ellipse cx="246" cy="372" rx="33" ry="38" fill={skinAli} />
        <circle cx="212" cy="376" r="6" fill={skinAli} />
        <circle cx="280" cy="376" r="6" fill={skinAli} />
        {/* beard, with the moustache dipping under the nose */}
        <path d="M 214 384 C 216 406 228 421 246 422 C 264 421 276 406 278 384 C 274 394 266 398 259 397 C 256 390 236 390 233 397 C 226 398 218 394 214 384 Z" fill={hair} />
        {/* smile in the beard */}
        <path d="M 234 402 C 239 408 253 408 258 402 C 257 412 235 412 234 402 Z" fill="#fff" strokeWidth={2.2} />
        {/* hair, swept up and back */}
        <path d="M 213 366 C 206 350 210 334 224 326 C 236 318 258 317 272 325 C 284 332 288 350 280 366 C 272 352 260 347 246 347 C 232 347 220 352 213 366 Z" fill={hair} />
        <path d="M 228 338 C 238 332 252 331 264 334 M 236 329 C 246 326 258 326 268 330" fill="none" stroke="#5a4038" strokeWidth={2.2} />
        {/* brows, eyes, nose */}
        <path d="M 224 364 C 230 359 238 359 244 363 M 248 363 C 254 359 262 359 268 364" fill="none" strokeWidth={3.6} />
        <ellipse cx="234" cy="374" rx="3.6" ry="4.4" fill={INK} stroke="none" />
        <ellipse cx="258" cy="374" rx="3.6" ry="4.4" fill={INK} stroke="none" />
        <circle cx="235.4" cy="372.4" r="1.2" fill="#fff" stroke="none" />
        <circle cx="259.4" cy="372.4" r="1.2" fill="#fff" stroke="none" />
        <path d="M 245 378 C 242 384 242 388 247 389" fill="none" strokeWidth={2.4} />
        <circle cx="222" cy="383" r="5" fill="#e98c7a" opacity=".45" stroke="none" />
        <circle cx="270" cy="383" r="5" fill="#e98c7a" opacity=".45" stroke="none" />
      </g>

      {/* ─── Alaa (front, left) ─── */}
      <g>
        {/* shirt body */}
        <path d="M 92 505 C 108 488 132 480 150 478 C 168 480 192 488 208 505 L 236 640 C 210 654 90 654 64 640 Z" fill={yellow} />
        {/* skirt below the hem */}
        <path d="M 66 642 C 90 656 210 656 234 642 L 240 700 L 60 700 Z" fill="#8a6a55" />
        {/* hijab drape down the chest */}
        <path d="M 118 478 C 112 510 108 545 116 578 C 130 586 146 582 150 566 L 152 486 Z" fill={cream} />
        {/* hijab hood */}
        <path d="M 150 350 C 108 350 96 390 100 430 C 104 458 96 470 92 490 C 110 498 134 494 150 486 C 166 494 190 498 208 490 C 204 470 196 458 200 430 C 204 390 192 350 150 350 Z" fill={cream} />
        {/* face opening */}
        <path d="M 150 372 C 126 372 118 396 120 420 C 122 442 134 458 150 458 C 166 458 178 442 180 420 C 182 396 174 372 150 372 Z" fill={skinAlaa} />
        {/* hijab fold across the brow */}
        <path d="M 122 400 C 132 380 168 380 178 400" fill="none" strokeWidth={2.2} />
        {/* brows, eyes, lashes */}
        <path d="M 130 408 C 135 404 142 404 147 407 M 153 407 C 158 404 165 404 170 408" fill="none" strokeWidth={2.8} />
        <ellipse cx="139" cy="418" rx="3.8" ry="4.6" fill={INK} stroke="none" />
        <ellipse cx="161" cy="418" rx="3.8" ry="4.6" fill={INK} stroke="none" />
        <circle cx="140.4" cy="416.2" r="1.3" fill="#fff" stroke="none" />
        <circle cx="162.4" cy="416.2" r="1.3" fill="#fff" stroke="none" />
        <path d="M 133 413 L 131 410 M 167 413 L 169 410" fill="none" strokeWidth={2} />
        {/* nose + big smile */}
        <path d="M 150 424 C 148 430 148 433 152 434" fill="none" strokeWidth={2.2} />
        <path d="M 136 440 C 142 450 158 450 164 440 C 162 452 138 452 136 440 Z" fill="#fff" strokeWidth={2.2} />
        <circle cx="128" cy="432" r="6" fill="#f29aa2" opacity=".55" stroke="none" />
        <circle cx="172" cy="432" r="6" fill="#f29aa2" opacity=".55" stroke="none" />
        {/* arms folded up to her chest — outlined tubes over the shirt */}
        <path d="M 104 512 C 88 540 84 570 96 590 C 112 596 130 584 140 570" fill="none" stroke={INK} strokeWidth={42} />
        <path d="M 196 512 C 212 540 216 570 204 590 C 188 596 170 584 160 570" fill="none" stroke={INK} strokeWidth={42} />
        <path d="M 104 512 C 88 540 84 570 96 590 C 112 596 130 584 140 570" fill="none" stroke={yellow} strokeWidth={36} />
        <path d="M 196 512 C 212 540 216 570 204 590 C 188 596 170 584 160 570" fill="none" stroke={yellow} strokeWidth={36} />
        {/* clasped hands */}
        <path d="M 138 552 C 128 556 126 572 136 580 C 146 586 160 582 164 572 C 168 562 160 550 150 552 Z" fill={skinAlaa} />
        <path d="M 148 566 C 154 560 164 560 170 566 C 176 574 170 586 160 586 C 150 586 144 576 148 566 Z" fill={skinAlaa} />
        <path d="M 152 570 L 158 568 M 154 576 L 161 574" fill="none" strokeWidth={1.6} />
        {/* the ring */}
        <path d="M 141 567 C 143 562 148 562 150 567" fill="none" stroke="#d9a833" strokeWidth={2.8} />
        <circle cx="145.5" cy="561" r="2.2" fill="#bfe9ff" strokeWidth={1.4} />
      </g>
    </g>
  );
}

function Leaf({ x, y, r = 0, s = 1 }: { x: number; y: number; r?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path d="M -16 0 C -10 -9 10 -9 16 0 C 10 9 -10 9 -16 0 Z" fill="#6fb04f" />
      <path d="M -13 0 L 13 0" fill="none" strokeWidth={1.6} />
    </g>
  );
}

function Cloud({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M -34 10 C -46 10 -46 -8 -32 -8 C -32 -24 -8 -28 -2 -14 C 6 -26 30 -20 28 -6 C 42 -6 42 10 30 10 Z"
      fill="#ffffff" fillOpacity=".92" />
  );
}

function Bird({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="M -10 0 q 5 -7 10 0 q 5 -7 10 0" fill="none" strokeWidth={2} />;
}

function Heart({ x, y, s = 1, className }: { x: number; y: number; s?: number; className?: string }) {
  return (
    <path className={className} transform={`translate(${x} ${y}) scale(${s})`}
      d="M 0 8 C -14 -2 -10 -16 0 -10 C 10 -16 14 -2 0 8 Z" fill="#f7a2b4" />
  );
}

/** Full hero scene: the field, the branch overhead and the couple. */
export function HeroScene({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 390 700" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bfe0f6" />
          <stop offset="1" stopColor="#eef8ff" />
        </linearGradient>
      </defs>
      <rect width="390" height="700" fill="url(#sky)" />

      <g stroke={INK} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round">
        {/* sun */}
        <g className="sun">
          <circle cx="62" cy="90" r="30" fill="#ffd66b" />
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return <path key={i} d={`M ${62 + Math.cos(a) * 40} ${90 + Math.sin(a) * 40} L ${62 + Math.cos(a) * 52} ${90 + Math.sin(a) * 52}`} fill="none" strokeWidth={3.4} />;
          })}
        </g>
        <Cloud x={318} y={92} />
        <Cloud x={130} y={190} s={.7} />
        <Bird x={230} y={150} />
        <Bird x={258} y={138} s={.7} />

        {/* mountains */}
        <path d="M -10 420 L -10 396 C 30 366 70 386 100 380 C 140 352 180 380 215 372 C 260 344 300 380 335 374 C 360 362 380 372 400 388 L 400 420 Z" fill="#c9b6dc" />
        <path d="M -10 428 L -10 408 C 40 392 90 408 140 404 C 190 386 240 404 290 402 C 340 392 370 398 400 412 L 400 428 Z" fill="#b5c9a2" />

        {/* field */}
        <rect x="-10" y="420" width="410" height="290" fill="#8ec552" stroke="none" />
        <path d="M -10 424 L 400 424" strokeWidth={3} />
        {[452, 486, 522, 560].map((y, i) => (
          <path key={y} d={`M -10 ${y} C 100 ${y - 10 - i * 2} 250 ${y + 8} 400 ${y - 6}`} fill="none" stroke="#a9d962" strokeWidth={5} strokeLinecap="round" />
        ))}
        <path d="M -10 700 L -10 606 C 60 596 140 612 200 604 C 280 594 340 610 400 600 L 400 700 Z" fill="#6fa845" />
        {/* wheat + tufts */}
        {[30, 58, 84, 322, 352, 372].map((x, i) => (
          <g key={x} transform={`translate(${x} ${612 + (i % 3) * 8})`}>
            <path d="M 0 40 C 2 20 -4 10 0 -4" fill="none" stroke="#e5c65a" strokeWidth={2.4} />
            <ellipse cx="0" cy="-6" rx="4" ry="9" fill="#f2d574" strokeWidth={1.6} />
          </g>
        ))}
        {[110, 300].map((x) => (
          <g key={x} transform={`translate(${x} 664)`}>
            <path d="M -12 12 C -10 -4 -4 -8 0 -12 C 4 -8 10 -4 12 12" fill="#5e9a3a" />
            <path d="M -4 10 C -3 2 0 -2 0 -4 M 4 10 C 3 2 1 -2 0 -4" fill="none" strokeWidth={1.6} />
          </g>
        ))}
        {/* trees at the edges */}
        <g>
          <path d="M 22 700 L 22 470 L 40 470 L 40 700 Z" fill="#8d6b4c" />
          <path d="M 30 490 C 20 470 6 460 -12 452" fill="none" stroke="#8d6b4c" strokeWidth={7} />
          <circle cx="20" cy="440" r="52" fill="#5f9e3f" />
          <circle cx="-8" cy="470" r="40" fill="#72b04c" />
          <circle cx="56" cy="470" r="34" fill="#72b04c" />
          <circle cx="34" cy="410" r="36" fill="#86c25a" />
        </g>
        <g>
          <path d="M 352 700 L 352 480 L 368 480 L 368 700 Z" fill="#8d6b4c" />
          <circle cx="372" cy="450" r="48" fill="#5f9e3f" />
          <circle cx="335" cy="480" r="30" fill="#72b04c" />
          <circle cx="398" cy="490" r="36" fill="#72b04c" />
          <circle cx="360" cy="420" r="32" fill="#86c25a" />
        </g>

        {/* the branch overhead, as in the field photograph */}
        <path d="M 400 20 C 350 40 320 80 270 92 C 230 102 200 96 170 110" fill="none" stroke="#8d6b4c" strokeWidth={7} />
        <path d="M 318 66 C 306 62 298 48 292 40 M 262 94 C 252 104 246 116 240 128 M 220 98 C 214 88 212 78 214 66" fill="none" stroke="#8d6b4c" strokeWidth={4.5} />
        <Leaf x={296} y={40} r={-60} s={.9} />
        <Leaf x={276} y={62} r={20} s={.85} />
        <Leaf x={244} y={120} r={60} s={.85} />
        <Leaf x={216} y={70} r={-75} s={.8} />
        <Leaf x={192} y={98} r={-15} s={.9} />
        <Leaf x={334} y={44} r={30} s={.85} />
        <Leaf x={364} y={30} r={-25} s={.9} />
        <Leaf x={170} y={122} r={40} s={.7} />

        {/* hearts */}
        <Heart x={92} y={360} s={.9} className="float f1" />
        <Heart x={296} y={330} s={1.1} className="float f2" />
        <Heart x={116} y={300} s={.6} className="float f3" />
      </g>

      <CoupleFigures />
    </svg>
  );
}
