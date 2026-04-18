import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const STRIP_H = 190;

/* ── 공유 노이즈 함수 ────────────────────────────────────── */
const hash = (v) => { const s = Math.sin(v * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const smooth = (v) => { const i = Math.floor(v), f = v - i, c = f * f * (3 - 2 * f); return hash(i) * (1 - c) + hash(i + 1) * c; };
const fbm = (v, s) =>
  smooth(v * 1.0 + s) * 0.50 +
  smooth(v * 2.13 + s * 1.31) * 0.25 +
  smooth(v * 4.37 + s * 2.17) * 0.125 +
  smooth(v * 8.71 + s * 3.73) * 0.063 +
  smooth(v * 17.5 + s * 5.31) * 0.031;

function drawMountainStrip(canvas) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const PS = 4; // pixel size

  /* 배경: 상단은 어둡고 하단으로 갈수록 약간 밝게 */
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#020202');
  bg.addColorStop(1, '#0c0c0c');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const GS = Array.from({ length: 256 }, (_, i) => `rgb(${i},${i},${i})`);
  const cols = Math.ceil(W / PS);
  const rows = Math.ceil(H / PS);

  const layers = [
    { yBase: 0.55, yAmp: 0.10, seed: 1.13, maxD: 20, bTop: 0.44, bBot: 0.06, sp: 1.8 },
    { yBase: 0.65, yAmp: 0.08, seed: 3.71, maxD: 28, bTop: 0.64, bBot: 0.10, sp: 1.4 },
    { yBase: 0.75, yAmp: 0.06, seed: 6.29, maxD: rows, bTop: 0.82, bBot: 0.14, sp: 0.9 },
  ];

  const peakX = 0.6, peakAmp = 0.20, peakW = 3.2;

  for (const l of layers) {
    for (let c = 0; c < cols; c++) {
      const nx = c / cols;
      const noise = fbm(nx * 9, l.seed);
      const boost = peakAmp * Math.exp(-Math.pow((nx - peakX) * peakW, 2));
      const surfRow = Math.round((l.yBase - boost + (noise - 0.5) * l.yAmp * 2) * rows);
      if (surfRow < 0 || surfRow >= rows) continue;

      for (let d = 0; d < l.maxD; d++) {
        const row = surfRow + d;
        if (row >= rows) break;
        const t = Math.min(1, d / l.maxD);
        const density = Math.pow(1 - t, l.sp);
        if (d > 3 && Math.random() > density) continue;
        let b = l.bTop + (l.bBot - l.bTop) * t + (Math.random() - 0.5) * 0.07;
        b = Math.max(0.01, Math.min(0.97, b));
        ctx.fillStyle = GS[Math.round(b * 255)];
        ctx.fillRect(c * PS, row * PS, PS - 1, PS - 1);
      }
    }
  }

  /* 하단 페이드 아웃 — 컨텐츠 영역으로 자연스럽게 연결 */
  const fade = ctx.createLinearGradient(0, H * 0.55, 0, H);
  fade.addColorStop(0, 'rgba(8,8,8,0)');
  fade.addColorStop(1, 'rgba(8,8,8,1)');
  ctx.fillStyle = fade;
  ctx.fillRect(0, 0, W, H);
}

/* ── 아이콘 ─────────────────────────────────────────────── */
const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="11" height="11" fill="currentColor">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8Z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="11" height="11" fill="currentColor">
    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146Zm4.943 12.248V6.169H2.542v7.225h2.401Zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016Zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4Z"/>
  </svg>
);

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M4 3L10 7L4 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

/* ── 컴포넌트 ────────────────────────────────────────────── */
export default function MobileHome() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width  = window.innerWidth;
    canvas.height = STRIP_H;
    drawMountainStrip(canvas);

    const onResize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = STRIP_H;
      drawMountainStrip(canvas);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className="mh-root">
      {/* 산 스트립 */}
      <canvas ref={canvasRef} className="mh-strip" aria-hidden="true" />

      {/* 프로필 */}
      <section className="mh-profile">
        <span className="mh-name">신동민</span>
        <span className="mh-sub">PORTFOLIO</span>
        <div className="mh-divider" />
        <div className="mh-links">
          <a href="https://github.com/" target="_blank" rel="noreferrer" className="mh-link">
            <GithubIcon /> GitHub
          </a>
          <span className="mh-dot">·</span>
          <a href="https://linkedin.com/" target="_blank" rel="noreferrer" className="mh-link">
            <LinkedInIcon /> LinkedIn
          </a>
        </div>
      </section>

      {/* Engineering */}
      <nav className="mh-section">
        <p className="mh-section-label mh-label-eng">Engineering</p>
        {[
          { label: 'Projects', to: '/engineering/projects' },
          { label: 'Company',  to: '/engineering/company'  },
          { label: 'Blog',     to: '/engineering/blog'     },
        ].map(({ label, to }) => (
          <Link key={to} to={to} className="mh-item">
            <span>{label}</span>
            <Arrow />
          </Link>
        ))}
      </nav>

      {/* Design */}
      <nav className="mh-section">
        <p className="mh-section-label mh-label-design">Design</p>
        {[
          { label: 'Projects', to: '/design/projects' },
          { label: 'Essay',    to: '/design/essay'    },
          { label: 'Article',  to: '/design/article'  },
        ].map(({ label, to }) => (
          <Link key={to} to={to} className="mh-item">
            <span>{label}</span>
            <Arrow />
          </Link>
        ))}
      </nav>
    </div>
  );
}
