/* The field photograph: Ali in his black tee and sunglasses, Alaa in the
   dusty-rose hijab and blue shirt, her sunglasses pushed up on her head,
   laughing at each other under the branch. */
import { INK } from "./Couple";

const skinAlaa = "#f3cfae";
const skinAli = "#dfa77f";
const hair = "#2b1d17";

export function StoryScene({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 300" aria-hidden="true">
      <defs>
        <linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b9dcf5" />
          <stop offset="1" stopColor="#e6f4fd" />
        </linearGradient>
        <clipPath id="storyClip"><rect width="400" height="300" rx="22" /></clipPath>
      </defs>
      <g clipPath="url(#storyClip)" stroke={INK} strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round">
        <rect width="400" height="300" fill="url(#sky2)" stroke="none" />
        <circle cx="340" cy="52" r="20" fill="#ffd66b" />
        <path d="M -10 190 L -10 172 C 40 150 90 168 130 162 C 180 140 230 164 280 160 C 330 146 370 156 410 168 L 410 190 Z" fill="#c9b6dc" />
        <path d="M -10 196 L -10 186 C 60 176 120 190 180 186 C 240 176 300 188 410 184 L 410 196 Z" fill="#b5c9a2" />
        <rect x="-10" y="192" width="420" height="120" fill="#8ec552" stroke="none" />
        <path d="M -10 194 L 410 194" />
        {[214, 236, 258].map((y) => <path key={y} d={`M -10 ${y} C 120 ${y - 8} 260 ${y + 6} 410 ${y - 4}`} fill="none" stroke="#a9d962" strokeWidth={4} />)}
        <path d="M -10 300 L -10 272 C 100 262 220 278 410 266 L 410 300 Z" fill="#6fa845" />
        {[22, 44, 350, 372, 388].map((x, i) => (
          <g key={x} transform={`translate(${x} ${252 + (i % 2) * 10})`}>
            <path d="M 0 30 C 2 16 -3 8 0 -2" fill="none" stroke="#e5c65a" strokeWidth={2} />
            <ellipse cx="0" cy="-4" rx="3" ry="7" fill="#f2d574" strokeWidth={1.4} />
          </g>
        ))}
        {/* branch, top left */}
        <path d="M -10 10 C 40 20 60 60 110 70 C 140 76 160 66 190 80" fill="none" stroke="#8d6b4c" strokeWidth={6} />
        <path d="M 70 46 C 62 36 60 24 62 12 M 120 70 C 126 82 128 94 126 108 M 150 70 C 148 58 150 46 156 36" fill="none" stroke="#8d6b4c" strokeWidth={3.6} />
        {[[62, 20, -70], [96, 60, 30], [126, 96, 80], [156, 44, -60], [182, 76, 20], [34, 28, 40], [8, 12, -20]].map(([x, y, r], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${r}) scale(.7)`}>
            <path d="M -16 0 C -10 -9 10 -9 16 0 C 10 9 -10 9 -16 0 Z" fill="#6fb04f" />
            <path d="M -13 0 L 13 0" fill="none" strokeWidth={1.4} />
          </g>
        ))}

        {/* ── Ali, left, leaning in toward her ── */}
        <g transform="translate(150 0)">
          {/* jeans */}
          <path d="M -30 292 L -30 206 L -6 206 L -4 292 Z" fill="#2f3b52" />
          <path d="M 0 292 L -2 206 L 24 206 L 26 292 Z" fill="#2f3b52" />
          <path d="M -30 206 L 24 206" strokeWidth={2} />
          {/* black tee, a little turned toward her */}
          <path d="M -26 134 C -18 120 -4 114 6 114 C 20 114 34 122 38 134 L 32 212 L -28 212 Z" fill="#242424" />
          <path d="M -24 132 C -42 142 -46 164 -42 180 L -30 180 C -32 166 -28 152 -22 144 Z" fill="#242424" />
          <path d="M 34 132 C 48 138 56 150 58 160 L 46 164 C 44 154 40 146 32 140 Z" fill="#242424" />
          <path d="M -6 116 C 0 124 12 124 18 116" fill="none" strokeWidth={2} />
          {/* left arm hangs; right arm raised toward her, with the watch */}
          <path d="M -42 180 C -44 188 -40 194 -34 192 C -28 190 -28 182 -30 178 Z" fill={skinAli} />
          <path d="M 48 160 C 58 154 70 152 78 158 C 80 166 74 172 64 172 L 50 170 Z" fill={skinAli} />
          <rect x="42" y="156" width="10" height="16" rx="3" fill={hair} />
          <circle cx="47" cy="164" r="4.5" fill="#fbfbf7" strokeWidth={1.6} />
          {/* head */}
          <rect x="-6" y="94" width="16" height="24" rx="5" fill={skinAli} />
          <ellipse cx="4" cy="82" rx="22" ry="25" fill={skinAli} />
          <path d="M -18 86 C -17 104 -8 112 6 112 C 18 112 26 102 24 88 C 20 96 14 98 4 98 C -6 98 -14 94 -18 86 Z" fill={hair} />
          <path d="M -18 80 C -22 58 -10 46 6 46 C 22 46 32 58 26 78 C 20 68 12 64 4 64 C -6 64 -14 70 -18 80 Z" fill={hair} />
          {/* sunglasses */}
          <path d="M -8 78 h 12 a 6 6 0 0 1 12 0 h 6" fill="none" strokeWidth={2} />
          <ellipse cx="0" cy="80" rx="6.5" ry="5.5" fill="#1d1d1d" />
          <ellipse cx="16" cy="80" rx="6.5" ry="5.5" fill="#1d1d1d" />
          <path d="M 4 100 C 10 106 18 104 20 98" fill="none" stroke="#fff" strokeWidth={2.4} />
        </g>

        {/* ── Alaa, right, head tilted back laughing ── */}
        <g transform="translate(262 0)">
          <path d="M -26 292 L -28 208 L -2 208 L 0 292 Z" fill="#6f8fc3" />
          <path d="M 4 292 L 2 208 L 28 208 L 28 292 Z" fill="#6f8fc3" />
          <path d="M -40 132 C -30 120 -10 114 0 114 C 12 114 32 122 40 134 L 42 218 C 20 226 -22 226 -42 218 Z" fill="#a9c9ef" />
          <path d="M -38 134 C -56 148 -58 172 -52 190 L -40 190 C -42 172 -40 156 -34 146 Z" fill="#a9c9ef" />
          <path d="M 36 136 C 54 148 58 170 52 186 L 40 188 C 42 172 38 158 32 148 Z" fill="#a9c9ef" />
          <path d="M -30 122 L -10 160 L 4 160 L 22 122" fill="none" strokeWidth={1.8} />
          {/* her hands gathered at her chest */}
          <path d="M -12 150 C -18 146 -22 156 -14 162 C -6 168 6 166 8 158 C 10 150 -2 146 -12 150 Z" fill={skinAlaa} />
          {/* hijab, dusty rose, framing the face, one tail over her shoulder */}
          <path d="M 30 120 C 40 140 42 164 34 186 C 26 190 18 184 18 172 L 20 130 Z" fill="#b48b86" />
          <path d="M -2 52 C -32 54 -42 80 -36 108 C -34 122 -42 132 -40 142 C -26 146 -10 142 0 136 C 12 142 28 146 40 140 C 42 130 34 120 36 106 C 42 78 30 52 -2 52 Z" fill="#b48b86" />
          <path d="M -2 70 C -20 70 -26 88 -24 104 C -22 120 -12 130 0 130 C 12 130 22 120 24 104 C 26 88 18 70 -2 70 Z" fill={skinAlaa} />
          {/* sunglasses pushed up on her head */}
          <path d="M -18 62 C -8 54 12 54 22 62" fill="none" strokeWidth={2.2} />
          <ellipse cx="-8" cy="60" rx="6" ry="4" fill="#1d1d1d" strokeWidth={1.8} />
          <ellipse cx="10" cy="60" rx="6" ry="4" fill="#1d1d1d" strokeWidth={1.8} />
          {/* laughing: eyes closed happy arcs, big open smile */}
          <path d="M -16 90 C -12 84 -6 84 -2 90 M 6 90 C 10 84 16 84 20 90" fill="none" strokeWidth={2.4} />
          <path d="M -12 106 C -4 122 12 122 18 106 C 14 104 -8 104 -12 106 Z" fill="#7a2f3f" strokeWidth={2} />
          <path d="M -9 107 C -4 109 10 109 15 107 L 13 111 L -7 111 Z" fill="#fff" stroke="none" />
          <circle cx="-18" cy="100" r="5" fill="#f29aa2" opacity=".55" stroke="none" />
          <circle cx="20" cy="100" r="5" fill="#f29aa2" opacity=".55" stroke="none" />
        </g>

        {/* laughter marks + a heart between them */}
        <path d="M 236 44 l 4 -8 M 246 50 l 8 -5 M 250 62 l 9 -1" fill="none" strokeWidth={2.2} />
        <path transform="translate(205 120) scale(.9)" d="M 0 8 C -14 -2 -10 -16 0 -10 C 10 -16 14 -2 0 8 Z" fill="#f7a2b4" className="float f2" />
      </g>
      <rect x="1.2" y="1.2" width="397.6" height="297.6" rx="21" fill="none" stroke={INK} strokeWidth={2.4} />
    </svg>
  );
}
