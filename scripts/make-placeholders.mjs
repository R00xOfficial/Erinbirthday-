// Generates soft illustrated placeholder "photos" in public/photos so the site
// looks finished before the real pictures are dropped in.
// Run with: node scripts/make-placeholders.mjs
// Replace any file with a real photo (same name, or update birthdayContent.js).
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'photos');
mkdirSync(out, { recursive: true });

const palettes = [
  ['#FBD3DF', '#F4A7BB', '#C94F78'],
  ['#E8DFF8', '#C9B8EE', '#7E62B8'],
  ['#FFE6CF', '#F8C49C', '#C9785A'],
  ['#D9F0E6', '#A6D8C2', '#4E9C7E'],
  ['#DCEBFA', '#A9CDEE', '#4F86B8'],
  ['#FFF1C9', '#F6D77E', '#B98E1E'],
];

const doodles = {
  heart: (c) =>
    `<path d="M0 30 C-40 -10 -20 -45 0 -22 C20 -45 40 -10 0 30Z" fill="${c}"/>`,
  star: (c) =>
    `<path d="M0 -34 L9 -10 L34 -10 L14 5 L21 30 L0 15 L-21 30 L-14 5 L-34 -10 L-9 -10Z" fill="${c}"/>`,
  flower: (c) =>
    [0, 72, 144, 216, 288]
      .map((a) => `<ellipse rx="12" ry="22" cy="-20" fill="${c}" opacity=".85" transform="rotate(${a})"/>`)
      .join('') + `<circle r="11" fill="#fff"/>`,
  moon: (c) => `<path d="M10 -32 A32 32 0 1 0 10 32 A24 24 0 1 1 10 -32Z" fill="${c}"/>`,
  cup: (c) =>
    `<rect x="-24" y="-18" width="40" height="40" rx="8" fill="${c}"/><path d="M16 -8 a12 12 0 0 1 0 20" stroke="${c}" stroke-width="6" fill="none"/><path d="M-12 -30 q6 -8 0 -16 M0 -30 q6 -8 0 -16" stroke="${c}" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  camera: (c) =>
    `<rect x="-34" y="-20" width="68" height="46" rx="10" fill="${c}"/><rect x="-14" y="-30" width="28" height="12" rx="4" fill="${c}"/><circle cy="3" r="14" fill="#fff"/><circle cy="3" r="8" fill="${c}"/>`,
  plane: (c) =>
    `<path d="M-36 4 L36 -14 L-10 22 L-8 6Z" fill="${c}"/><path d="M-8 6 L36 -14 L-2 30Z" fill="${c}" opacity=".7"/>`,
  pizza: (c) =>
    `<path d="M0 -34 L30 26 Q0 36 -30 26Z" fill="${c}"/><circle cx="-4" cy="2" r="5" fill="#fff"/><circle cx="8" cy="16" r="5" fill="#fff"/><circle cx="-10" cy="18" r="4" fill="#fff"/>`,
  music: (c) =>
    `<path d="M-14 22 a9 7 0 1 1 0 -1 V-26 L22 -34 V14 a9 7 0 1 1 0 -1 V-20 L-14 -12" stroke="${c}" stroke-width="6" fill="${c}"/>`,
  sun: (c) =>
    `<circle r="18" fill="${c}"/>` +
    Array.from({ length: 8 }, (_, i) => `<rect x="-3" y="-36" width="6" height="12" rx="3" fill="${c}" transform="rotate(${i * 45})"/>`).join(''),
};

function placeholder({ name, w, h, palette, doodle, label }) {
  const [bg1, bg2, ink] = palettes[palette % palettes.length];
  const cx = w / 2;
  const cy = h / 2 - 30;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${bg1}"/><stop offset="1" stop-color="${bg2}"/>
    </linearGradient>
    <pattern id="dots" width="36" height="36" patternUnits="userSpaceOnUse">
      <circle cx="4" cy="4" r="2.2" fill="#fff" opacity=".45"/>
    </pattern>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <rect width="${w}" height="${h}" fill="url(#dots)"/>
  <circle cx="${w * 0.18}" cy="${h * 0.2}" r="${w * 0.09}" fill="#fff" opacity=".35"/>
  <circle cx="${w * 0.85}" cy="${h * 0.78}" r="${w * 0.14}" fill="#fff" opacity=".25"/>
  <g transform="translate(${cx} ${cy}) scale(${w / 260})">${doodles[doodle](ink)}</g>
  <text x="${cx}" y="${h * 0.8}" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="${w * 0.055}" fill="${ink}">${label}</text>
  <text x="${cx}" y="${h * 0.8 + w * 0.06}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="${w * 0.03}" fill="${ink}" opacity=".7">replace with ${name.replace('.svg', '.jpg')}</text>
</svg>`;
  writeFileSync(join(out, name), svg);
}

// The puzzle image needs a composition that is recognisable in nine squares,
// so every tile gets its own distinct detail.
function puzzle() {
  const s = 900;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}" width="${s}" height="${s}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#E8DFF8"/><stop offset=".55" stop-color="#FBD3DF"/><stop offset="1" stop-color="#FFE6CF"/>
    </linearGradient>
  </defs>
  <rect width="${s}" height="${s}" fill="url(#sky)"/>
  <circle cx="720" cy="170" r="90" fill="#FFF1C9"/>
  <circle cx="720" cy="170" r="120" fill="#FFF1C9" opacity=".35"/>
  <g fill="#fff" opacity=".9">
    <ellipse cx="160" cy="130" rx="90" ry="34"/><ellipse cx="220" cy="110" rx="60" ry="40"/>
    <ellipse cx="470" cy="230" rx="70" ry="24"/><ellipse cx="510" cy="215" rx="44" ry="28"/>
  </g>
  <path d="M0 640 Q220 520 450 610 T900 560 V900 H0Z" fill="#A6D8C2"/>
  <path d="M0 720 Q260 640 520 720 T900 690 V900 H0Z" fill="#7FC2A5"/>
  ${Array.from({ length: 14 }, (_, i) => {
    const x = 40 + i * 63;
    const y = 780 + (i % 3) * 30;
    const col = ['#F4A7BB', '#C94F78', '#fff', '#C9B8EE'][i % 4];
    return `<g transform="translate(${x} ${y})"><rect x="-2" y="0" width="4" height="40" fill="#4E9C7E"/>${[0, 72, 144, 216, 288]
      .map((a) => `<ellipse rx="8" ry="14" cy="-12" fill="${col}" transform="rotate(${a})"/>`)
      .join('')}<circle r="6" fill="#FFF1C9"/></g>`;
  }).join('')}
  <g transform="translate(450 560)">
    <path d="M-70 -40 L-40 -330" stroke="#49343D" stroke-width="3"/>
    <path d="M70 -40 L40 -330" stroke="#49343D" stroke-width="3"/>
    <path d="M-40 -300 C-150 -400 -110 -520 -40 -450 C30 -520 70 -400 -40 -300Z" transform="translate(40 -40) scale(1.1)" fill="#C94F78"/>
    <circle cx="-90" cy="-110" r="38" fill="#FFE6CF" stroke="#49343D" stroke-width="5"/>
    <path d="M-128 -120 Q-90 -175 -52 -120" fill="#7A4B3A"/>
    <path d="M-125 -70 Q-90 -90 -55 -70 L-40 60 H-140Z" fill="#F4A7BB"/>
    <circle cx="90" cy="-110" r="38" fill="#FFE6CF" stroke="#49343D" stroke-width="5"/>
    <path d="M52 -125 Q90 -160 128 -125" fill="#3D2A22"/>
    <path d="M55 -70 Q90 -90 125 -70 L140 60 H40Z" fill="#7E62B8"/>
    <path d="M-50 -40 Q0 -10 50 -40" stroke="#49343D" stroke-width="6" fill="none" stroke-linecap="round"/>
    <circle cx="-100" cy="-112" r="4" fill="#49343D"/><circle cx="-80" cy="-112" r="4" fill="#49343D"/>
    <circle cx="80" cy="-112" r="4" fill="#49343D"/><circle cx="100" cy="-112" r="4" fill="#49343D"/>
    <path d="M-100 -96 Q-90 -88 -80 -96 M80 -96 Q90 -88 100 -96" stroke="#49343D" stroke-width="4" fill="none" stroke-linecap="round"/>
  </g>
  <text x="140" y="420" font-family="Georgia, serif" font-style="italic" font-size="54" fill="#C94F78">you</text>
  <text x="680" y="420" font-family="Georgia, serif" font-style="italic" font-size="54" fill="#7E62B8">me</text>
  <text x="450" y="880" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="24" fill="#49343D" opacity=".6">replace with puzzle.jpg (square)</text>
</svg>`;
  writeFileSync(join(out, 'puzzle.svg'), svg);
}

const list = [
  // Opening story
  { name: 'story-1.svg', w: 800, h: 1000, palette: 0, doodle: 'heart', label: 'the very beginning' },
  { name: 'story-2.svg', w: 800, h: 1000, palette: 2, doodle: 'cup', label: 'that first date' },
  { name: 'story-3.svg', w: 800, h: 1000, palette: 5, doodle: 'sun', label: 'peak silliness' },
  // Matching cards (square)
  { name: 'match-1.svg', w: 400, h: 400, palette: 4, doodle: 'plane', label: 'our trip' },
  { name: 'match-2.svg', w: 400, h: 400, palette: 2, doodle: 'pizza', label: 'fave food' },
  { name: 'match-3.svg', w: 400, h: 400, palette: 1, doodle: 'music', label: 'our song' },
  { name: 'match-4.svg', w: 400, h: 400, palette: 3, doodle: 'flower', label: 'flowers' },
  { name: 'match-5.svg', w: 400, h: 400, palette: 5, doodle: 'star', label: 'inside joke' },
  { name: 'match-6.svg', w: 400, h: 400, palette: 0, doodle: 'moon', label: 'late nights' },
  // Hidden hearts reward
  { name: 'hearts-reward.svg', w: 800, h: 1000, palette: 5, doodle: 'camera', label: 'a funny one' },
  // Scrapbook
  ...Array.from({ length: 12 }, (_, i) => ({
    name: `memory-${String(i + 1).padStart(2, '0')}.svg`,
    w: 800,
    h: i % 3 === 1 ? 800 : 1000,
    palette: i,
    doodle: Object.keys(doodles)[i % Object.keys(doodles).length],
    label: `memory ${i + 1}`,
  })),
  // Finale
  { name: 'finale.svg', w: 800, h: 1000, palette: 0, doodle: 'heart', label: 'my favourite' },
];

list.forEach(placeholder);
puzzle();
console.log(`Wrote ${list.length + 1} placeholders to ${out}`);
