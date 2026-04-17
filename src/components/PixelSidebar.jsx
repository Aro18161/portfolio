import { useEffect, useRef } from 'react';

const GS = Array.from({ length: 256 }, (_, i) => `rgb(${i},${i},${i})`);
const PS = 4;

function hash(n) {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function smoothNoise(x) {
  const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
  return hash(i) * (1 - u) + hash(i + 1) * u;
}
function fbm(x, seed) {
  return smoothNoise(x * 1.00 + seed)        * 0.500
       + smoothNoise(x * 2.13 + seed * 1.31) * 0.250
       + smoothNoise(x * 4.37 + seed * 2.17) * 0.125
       + smoothNoise(x * 8.71 + seed * 3.73) * 0.063
       + smoothNoise(x * 17.5 + seed * 5.31) * 0.031;
}

const LAYERS = [
  { yBase: 0.52, yAmp: 0.09, seed: 1.13, maxDepth: 22, bTop: 0.42, bBot: 0.05, sp: 1.8 },
  { yBase: 0.60, yAmp: 0.08, seed: 3.71, maxDepth: 28, bTop: 0.62, bBot: 0.08, sp: 1.5 },
  { yBase: 0.68, yAmp: 0.07, seed: 6.29, maxDepth: 38, bTop: 0.80, bBot: 0.11, sp: 1.2 },
  { yBase: 0.76, yAmp: 0.05, seed: 9.87, maxDepth: 999, bTop: 1.00, bBot: 0.15, sp: 0.7 },
];

export default function PixelSidebar() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W = 0, H = 0, pixels = [], frameId = 0;
    let glitchTimer = 60, activeGlitch = null;
    const mouse = { x: -9999, y: -9999 };

    const buildPixels = () => {
      pixels = [];
      const cols = Math.ceil(W / PS);
      const rows = Math.ceil(H / PS);
      const PEAK_X = 0.68, PEAK_AMP = 0.15, PEAK_W = 3.8;

      for (const L of LAYERS) {
        for (let col = 0; col < cols; col++) {
          const nx = col / cols;
          const h = fbm(nx * 9, L.seed);
          const boost = PEAK_AMP * Math.exp(-Math.pow((nx - PEAK_X) * PEAK_W, 2));
          const surfRow = Math.round((L.yBase - boost + (h - 0.5) * L.yAmp * 2) * rows);
          if (surfRow < 0 || surfRow >= rows) continue;

          const maxD = Math.min(L.maxDepth, rows);
          for (let dr = 0; dr < maxD; dr++) {
            const row = surfRow + dr;
            if (row >= rows) break;
            const t = Math.min(1, dr / L.maxDepth);
            if (dr > 3 && Math.random() > Math.pow(1 - t, L.sp)) continue;
            let b = L.bTop + (L.bBot - L.bTop) * t + (Math.random() - 0.5) * 0.07;
            b = Math.max(0.01, Math.min(0.97, b));
            pixels.push({ ox: col * PS, oy: row * PS, x: col * PS, y: row * PS, vx: 0, vy: 0, b, sz: PS - 1 });
          }
        }
      }
      // Scatter
      for (let i = 0; i < 80 + Math.floor(W / 5); i++) {
        const x = Math.random() * W, y = Math.random() * H * 0.48;
        pixels.push({ ox: x, oy: y, x, y, vx: 0, vy: 0, b: Math.random() * 0.06 + 0.01, sz: 1 });
      }
    };

    const draw = () => {
      ctx.fillStyle = '#030303';
      ctx.fillRect(0, 0, W, H);

      const R = 110, R2 = R * R;
      for (const p of pixels) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < R2 && d2 > 0.01) {
          const d = Math.sqrt(d2), norm = 1 - d / R;
          const f = norm * norm * 5.5;
          p.vx += (dx / d) * f; p.vy += (dy / d) * f;
        }
        p.vx += (p.ox - p.x) * 0.18; p.vy += (p.oy - p.y) * 0.18;
        p.vx *= 0.72; p.vy *= 0.72;
        p.x += p.vx; p.y += p.vy;
        if (Math.abs(p.vx) < 0.08 && Math.abs(p.vy) < 0.08 &&
            Math.abs(p.x - p.ox) < 0.5 && Math.abs(p.y - p.oy) < 0.5) {
          p.vx = p.vy = 0; p.x = p.ox; p.y = p.oy;
        }
        ctx.fillStyle = GS[Math.round(p.b * 255)];
        ctx.fillRect(p.x | 0, p.y | 0, p.sz, p.sz);
      }

      // Right-edge fade
      const edgeFade = ctx.createLinearGradient(W * 0.55, 0, W, 0);
      edgeFade.addColorStop(0, 'transparent');
      edgeFade.addColorStop(1, '#030303');
      ctx.fillStyle = edgeFade;
      ctx.fillRect(0, 0, W, H);

      // Glitch
      if (--glitchTimer <= 0) {
        glitchTimer = (40 + Math.random() * 80) | 0;
        if (Math.random() < 0.5) activeGlitch = { y: (H * (0.4 + Math.random() * 0.45)) | 0, life: 2, a: 0.06 + Math.random() * 0.05 };
      }
      if (activeGlitch) {
        ctx.save(); ctx.globalAlpha = activeGlitch.a;
        ctx.fillStyle = '#fff'; ctx.fillRect(0, activeGlitch.y, W, 1);
        ctx.restore();
        if (--activeGlitch.life <= 0) activeGlitch = null;
      }

      frameId = requestAnimationFrame(draw);
    };

    const init = () => {
      W = canvas.width  = canvas.parentElement?.offsetWidth || 260;
      H = canvas.height = window.innerHeight;
      buildPixels();
    };

    const onMouseMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onMouseLeave = () => { mouse.x = mouse.y = -9999; };
    const onClick = (e) => {
      const r = canvas.getBoundingClientRect();
      const cx = e.clientX - r.left, cy = e.clientY - r.top;
      for (const p of pixels) {
        const dx = p.ox - cx, dy = p.oy - cy, d = Math.sqrt(dx * dx + dy * dy);
        if (d < 180 && d > 0.01) { const f = (180 - d) / 180 * 8; p.vx += dx / d * f; p.vy += dy / d * f; }
      }
    };

    window.addEventListener('resize', init);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);
    canvas.addEventListener('click', onClick);

    init(); draw();

    return () => {
      window.removeEventListener('resize', init);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      canvas.removeEventListener('click', onClick);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="sidebar-canvas" />;
}
