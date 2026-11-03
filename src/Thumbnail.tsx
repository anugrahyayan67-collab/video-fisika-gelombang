import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BRAND} from './brand';
import {C, FONT} from './theme';

/** Panah lurus sederhana (garis + kepala segitiga). */
const Arrow: React.FC<{x1: number; y1: number; x2: number; y2: number; color: string; w?: number; head?: number}> = ({x1, y1, x2, y2, color, w = 12, head = 34}) => {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const bx = x2 - Math.cos(a) * head;
  const by = y2 - Math.sin(a) * head;
  const px = Math.cos(a + Math.PI / 2) * head * 0.6;
  const py = Math.sin(a + Math.PI / 2) * head * 0.6;
  return (
    <g>
      <line x1={x1} y1={y1} x2={bx} y2={by} stroke={color} strokeWidth={w} strokeLinecap="round" />
      <polygon points={`${x2},${y2} ${bx + px},${by + py} ${bx - px},${by - py}`} fill={color} />
    </g>
  );
};

const mono = {fontFamily: FONT.mono, fontWeight: 600} as const;

// Atas: gelombang berjalan y = A sin(kx − ωt), λ = 340 px, pola maju (v) tetapi titik medium hanya naik-turun.
// Bawah: gelombang berdiri, simpul tiap λ/2 (merah).
const L = 340;
const X1 = 1600;
const X2 = 2450;
const Y0 = 560;
const A = 150;
const wave = (y0: number, amp: number, f: (x: number) => number) =>
  Array.from({length: 171}, (_, i) => {
    const x = X1 + (i / 170) * (X2 - X1);
    return `${i ? 'L' : 'M'}${x.toFixed(1)},${(y0 - amp * f(x)).toFixed(1)}`;
  }).join(' ');
const k = (2 * Math.PI) / L;
const trav = wave(Y0, A, (x) => Math.sin(k * (x - X1)));
// puncak: sin = 1 → x = X1 + L/4 + nL
const c1 = X1 + L / 4;
const c2 = c1 + L;
const SY = 1000;
const SA = 90;
const st1 = wave(SY, SA, (x) => Math.sin(k * (x - X1)));
const st2 = wave(SY, -SA, (x) => Math.sin(k * (x - X1)));
const nodes = [0, 1, 2, 3, 4, 5].map((i) => X1 + (i * L) / 2);
const dots = [X1 + 0.62 * L, X1 + 1.12 * L, X1 + 1.62 * L, X1 + 2.12 * L];

const Visual: React.FC = () => (
  <g>
    <line x1={X1} y1={Y0} x2={X2} y2={Y0} stroke={C.line} strokeWidth={4} strokeDasharray="14 12" />
    <path d={trav} fill="none" stroke={C.cyan} strokeWidth={12} strokeLinecap="round" />
    {/* λ antara dua puncak */}
    <line x1={c1} y1={Y0 - A - 40} x2={c2} y2={Y0 - A - 40} stroke={C.press} strokeWidth={6} />
    <line x1={c1} y1={Y0 - A - 60} x2={c1} y2={Y0 - A - 10} stroke={C.press} strokeWidth={6} />
    <line x1={c2} y1={Y0 - A - 60} x2={c2} y2={Y0 - A - 10} stroke={C.press} strokeWidth={6} />
    <text x={(c1 + c2) / 2} y={Y0 - A - 65} textAnchor="middle" fill={C.press} fontSize={60} fontFamily={FONT.serif} fontStyle="italic">λ</text>
    <Arrow x1={2230} y1={Y0 - A - 50} x2={2420} y2={Y0 - A - 50} color={C.work} />
    <text x={2325} y={Y0 - A - 80} textAnchor="middle" fill={C.work} fontSize={52} fontFamily={FONT.serif} fontStyle="italic">v</text>
    {/* titik medium: hanya naik-turun */}
    {dots.map((x, i) => {
      const y = Y0 - A * Math.sin(k * (x - X1));
      return (
        <g key={i}>
          <line x1={x} y1={y - 52} x2={x} y2={y + 52} stroke={C.gold} strokeWidth={4} />
          <polygon points={`${x},${y - 66} ${x - 12},${y - 46} ${x + 12},${y - 46}`} fill={C.gold} />
          <polygon points={`${x},${y + 66} ${x - 12},${y + 46} ${x + 12},${y + 46}`} fill={C.gold} />
          <circle cx={x} cy={y} r={15} fill={C.white} />
        </g>
      );
    })}
    {/* gelombang berdiri */}
    <path d={st1} fill="none" stroke={C.white} strokeWidth={8} />
    <path d={st2} fill="none" stroke={C.white} strokeOpacity={0.4} strokeWidth={8} />
    {nodes.map((x, i) => <circle key={i} cx={x} cy={SY} r={16} fill={C.heat} />)}
    <text x={nodes[1]} y={SY + SA + 70} textAnchor="middle" fill={C.heat} fontSize={44} style={mono}>simpul</text>
    <text x={nodes[3]} y={SY + SA + 70} textAnchor="middle" fill={C.press} fontSize={44} style={mono}>λ/2</text>
    <line x1={nodes[2] + 10} y1={SY + SA + 20} x2={nodes[4] - 10} y2={SY + SA + 20} stroke={C.press} strokeWidth={4} />
    <line x1={nodes[2] + 10} y1={SY + SA + 5} x2={nodes[2] + 10} y2={SY + SA + 35} stroke={C.press} strokeWidth={4} />
    <line x1={nodes[3]} y1={SY + SA + 5} x2={nodes[3]} y2={SY + SA + 35} stroke={C.press} strokeWidth={4} />
  </g>
);

/** Gambar mini 2K untuk YouTube/LMS. */
export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse 80% 70% at 30% 40%, #20305e 0%, ${C.bg} 70%)`, fontFamily: FONT.head}}>
    <div style={{position: 'absolute', left: 140, top: 180, color: C.gold, fontSize: 54, letterSpacing: 10, fontWeight: 600}}>{BRAND.series.toUpperCase()}</div>
    <div style={{position: 'absolute', left: 130, top: 270, color: C.ink, fontSize: 190, fontWeight: 700, lineHeight: 0.95, letterSpacing: -6, whiteSpace: 'nowrap'}}>
      Getaran yang
      <br />
      <span style={{color: C.cyan}}>Berjalan</span>
    </div>
    <div style={{position: 'absolute', left: 140, top: 760, color: C.muted, fontSize: 70, fontWeight: 500}}>{BRAND.subtitle}</div>
    <div style={{position: 'absolute', left: 140, bottom: 140, color: C.ink, fontSize: 44, letterSpacing: 8, fontWeight: 600}}>
      {BRAND.channel} <span style={{color: C.muted, letterSpacing: 2, fontWeight: 400}}>· {BRAND.tagline}</span>
    </div>
    <svg width={2560} height={1440} style={{position: 'absolute', inset: 0}}>
      <Visual />
    </svg>
  </AbsoluteFill>
);
