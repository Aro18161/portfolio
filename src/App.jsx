import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import MobileHome from './pages/MobileHome';
import './styles/mobile-home.css';

const ROUTE_MAP = {
  left:  { Projects: '/engineering/projects', Company: '/engineering/company', Blog: '/engineering/blog' },
  right: { Projects: '/design/projects',      Essay:   '/design/essay',        Article: '/design/article' },
};

const engineeringLinks = ['Projects', 'Company', 'Blog'];
const designLinks = ['Projects', 'Essay', 'Article'];
const displayName = '\uC2E0\uB3D9\uBBFC';

const profileLinks = [
  {
    href: 'https://github.com/Aro18161',
    label: 'GitHub',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="11" height="11" fill="currentColor" aria-hidden="true">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8Z" />
      </svg>
    ),
  },
  {
    href: 'https://www.linkedin.com/in/%EB%8F%99%EB%AF%BC-%EC%8B%A0-3b25b4317/',
    label: 'LinkedIn',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="11" height="11" fill="currentColor" aria-hidden="true">
        <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146Zm4.943 12.248V6.169H2.542v7.225h2.401Zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016Zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4Z" />
      </svg>
    ),
  },
];

const coords = [
  {
    id: 'left',
    className: 'coords coords-left',
    lines: ['43.2819 N / 127.4021 E', 'ALT: 1442m  IDX: 0x3FA2'],
  },
  {
    id: 'right',
    className: 'coords coords-right',
    lines: ['35.6895 N / 139.6917 E', 'LAYER: 04  MESH: 0xB17C'],
  },
];

const pageDots = [true, false];

function Panel({ side, title, items, onCursorEnter, onCursorLeave, meta }) {
  const routes = ROUTE_MAP[side] || {};
  return (
    <section className={`panel panel-${side}`}>
      <div className="panel-title">{title}</div>
      <nav className="panel-nav" aria-label={`${title} navigation`}>
        {items.map((item) => (
          <Link
            key={item}
            to={routes[item] || '/'}
            onMouseEnter={onCursorEnter}
            onMouseLeave={onCursorLeave}
            onFocus={onCursorEnter}
            onBlur={onCursorLeave}
          >
            {item}
          </Link>
        ))}
      </nav>
      {meta ? <div className="meta-label">{meta}</div> : null}
    </section>
  );
}

function FragmentLink({ href, label, icon, onCursorEnter, onCursorLeave, showSeparator }) {
  return (
    <>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        onMouseEnter={onCursorEnter}
        onMouseLeave={onCursorLeave}
        onFocus={onCursorEnter}
        onBlur={onCursorLeave}
      >
        {icon}
        {label}
      </a>
      {showSeparator ? <span className="sep">.</span> : null}
    </>
  );
}

export default function App() {
  const canvasRef = useRef(null);
  const cursorRef = useRef(null);
  const nameLabelRef = useRef(null);
  const [cursorBig, setCursorBig] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia('(max-width: 560px)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 560px)');
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const cursorEl = cursorRef.current;
    const nameLabelEl = nameLabelRef.current;

    if (!canvas || !cursorEl || !nameLabelEl) {
      return undefined;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return undefined;
    }

    const isMobile = window.matchMedia('(pointer: coarse)').matches;

    const grayscale = Array.from({ length: 256 }, (_, index) => `rgb(${index},${index},${index})`);
    const pixelSize = 5;
    const mouse = { x: -9999, y: -9999 };

    let width = 0;
    let height = 0;
    let pixels = [];
    let glitchTimer = 60;
    let activeGlitch = null;
    let clearZone = { x1: 0, y1: 0, x2: 0, y2: 0, fade: 0 };
    let frameId = 0;
    let disposed = false;

    const distToZone = (px, py) => {
      const dx = Math.max(clearZone.x1 - px, 0, px - clearZone.x2);
      const dy = Math.max(clearZone.y1 - py, 0, py - clearZone.y2);
      return Math.sqrt(dx * dx + dy * dy);
    };

    const hash = (value) => {
      const seed = Math.sin(value * 127.1 + 311.7) * 43758.5453;
      return seed - Math.floor(seed);
    };

    const smoothNoise = (value) => {
      const integer = Math.floor(value);
      const fraction = value - integer;
      const curve = fraction * fraction * (3 - 2 * fraction);
      return hash(integer) * (1 - curve) + hash(integer + 1) * curve;
    };

    const fbm = (value, seed) =>
      smoothNoise(value * 1.0 + seed) * 0.5 +
      smoothNoise(value * 2.13 + seed * 1.31) * 0.25 +
      smoothNoise(value * 4.37 + seed * 2.17) * 0.125 +
      smoothNoise(value * 8.71 + seed * 3.73) * 0.063 +
      smoothNoise(value * 17.5 + seed * 5.31) * 0.031;

    const buildPixels = () => {
      pixels = [];

      const cols = Math.ceil(width / pixelSize);
      const rows = Math.ceil(height / pixelSize);
      const layers = [
        { yBase: 0.58, yAmp: 0.08, seed: 1.13, maxDepth: 26, bTop: 0.42, bBot: 0.05, sp: 1.8 },
        { yBase: 0.64, yAmp: 0.07, seed: 3.71, maxDepth: 32, bTop: 0.62, bBot: 0.08, sp: 1.5 },
        { yBase: 0.7, yAmp: 0.06, seed: 6.29, maxDepth: 42, bTop: 0.8, bBot: 0.11, sp: 1.2 },
        { yBase: 0.76, yAmp: 0.05, seed: 9.87, maxDepth: rows, bTop: 1, bBot: 0.15, sp: 0.7 },
      ];

      const peakX = 0.62;
      const peakAmplitude = 0.16;
      const peakWidth = 3.5;

      for (const layer of layers) {
        for (let col = 0; col < cols; col += 1) {
          const nx = col / cols;
          const heightNoise = fbm(nx * 9, layer.seed);
          const boost = peakAmplitude * Math.exp(-Math.pow((nx - peakX) * peakWidth, 2));
          const surfaceRow = Math.round((layer.yBase - boost + (heightNoise - 0.5) * layer.yAmp * 2) * rows);

          if (surfaceRow < 0 || surfaceRow >= rows) {
            continue;
          }

          for (let depth = 0; depth < layer.maxDepth; depth += 1) {
            const row = surfaceRow + depth;
            if (row >= rows) {
              break;
            }

            const t = Math.min(1, depth / layer.maxDepth);
            const density = Math.pow(1 - t, layer.sp);
            if (depth > 3 && Math.random() > density) {
              continue;
            }

            let brightness = layer.bTop + (layer.bBot - layer.bTop) * t + (Math.random() - 0.5) * 0.07;
            brightness = Math.max(0.01, Math.min(0.97, brightness));

            const px = col * pixelSize;
            const py = row * pixelSize;
            const distance = distToZone(px, py);
            if (distance < clearZone.fade) {
              const skipProbability = Math.pow(1 - distance / clearZone.fade, 1.8);
              if (Math.random() < skipProbability) {
                continue;
              }
            }

            pixels.push({
              ox: px,
              oy: py,
              x: px,
              y: py,
              vx: 0,
              vy: 0,
              b: brightness,
              sz: pixelSize - 1,
            });
          }
        }
      }

      if (!isMobile) {
        const scatterCount = 200 + Math.floor(width / 6);
        for (let index = 0; index < scatterCount; index += 1) {
          const x = Math.random() * width;
          const y = Math.random() * height * 0.55;
          pixels.push({
            ox: x,
            oy: y,
            x,
            y,
            vx: 0,
            vy: 0,
            b: Math.random() * 0.06 + 0.01,
            sz: Math.random() < 0.65 ? 1 : 2,
          });
        }
      }
    };

    const drawFrame = () => {
      const topDiv = width * 0.535;
      const bottomDiv = width * 0.465;
      const blendHalfWidth = width * 0.11;

      ctx.fillStyle = '#030303';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(topDiv - blendHalfWidth, 0);
      ctx.lineTo(bottomDiv - blendHalfWidth, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#989898';
      ctx.beginPath();
      ctx.moveTo(topDiv + blendHalfWidth, 0);
      ctx.lineTo(width, 0);
      ctx.lineTo(width, height);
      ctx.lineTo(bottomDiv + blendHalfWidth, height);
      ctx.closePath();
      ctx.fill();

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(topDiv - blendHalfWidth, 0);
      ctx.lineTo(topDiv + blendHalfWidth, 0);
      ctx.lineTo(bottomDiv + blendHalfWidth, height);
      ctx.lineTo(bottomDiv - blendHalfWidth, height);
      ctx.closePath();
      ctx.clip();

      const bgGradient = ctx.createLinearGradient(topDiv - blendHalfWidth, 0, topDiv + blendHalfWidth, 0);
      bgGradient.addColorStop(0, '#030303');
      bgGradient.addColorStop(1, '#989898');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      if (!isMobile) {
        const radius = 145;
        const radiusSquared = radius * radius;

        for (const pixel of pixels) {
          const dx = pixel.x - mouse.x;
          const dy = pixel.y - mouse.y;
          const distanceSquared = dx * dx + dy * dy;

          if (distanceSquared < radiusSquared && distanceSquared > 0.01) {
            const distance = Math.sqrt(distanceSquared);
            const normalized = 1 - distance / radius;
            const force = normalized * normalized * 6;
            pixel.vx += (dx / distance) * force;
            pixel.vy += (dy / distance) * force;
          }

          pixel.vx += (pixel.ox - pixel.x) * 0.18;
          pixel.vy += (pixel.oy - pixel.y) * 0.18;
          pixel.vx *= 0.72;
          pixel.vy *= 0.72;

          pixel.x += pixel.vx;
          pixel.y += pixel.vy;

          if (
            Math.abs(pixel.vx) < 0.08 &&
            Math.abs(pixel.vy) < 0.08 &&
            Math.abs(pixel.x - pixel.ox) < 0.5 &&
            Math.abs(pixel.y - pixel.oy) < 0.5
          ) {
            pixel.vx = 0;
            pixel.vy = 0;
            pixel.x = pixel.ox;
            pixel.y = pixel.oy;
          }

          ctx.fillStyle = grayscale[Math.round(pixel.b * 255)];
          ctx.fillRect(pixel.x | 0, pixel.y | 0, pixel.sz, pixel.sz);
        }

        glitchTimer -= 1;
        if (glitchTimer <= 0) {
          glitchTimer = (30 + Math.random() * 90) | 0;
          if (Math.random() < 0.65) {
            activeGlitch = {
              y: (height * (0.35 + Math.random() * 0.5)) | 0,
              h: Math.random() < 0.25 ? 2 : 1,
              life: 1 + ((Math.random() * 3) | 0),
              left: Math.random() < 0.5,
              a: 0.07 + Math.random() * 0.06,
            };
          }
        }

        if (activeGlitch) {
          ctx.save();
          ctx.globalAlpha = activeGlitch.a;
          ctx.fillStyle = activeGlitch.left ? '#ffffff' : '#0a0a0a';
          ctx.fillRect(activeGlitch.left ? 0 : width / 2, activeGlitch.y, width / 2, activeGlitch.h);
          ctx.restore();
          activeGlitch.life -= 1;
          if (activeGlitch.life <= 0) {
            activeGlitch = null;
          }
        }

        frameId = window.requestAnimationFrame(drawFrame);
      } else {
        /* mobile — static: draw pixels at their origin positions */
        for (const pixel of pixels) {
          ctx.fillStyle = grayscale[Math.round(pixel.b * 255)];
          ctx.fillRect(pixel.ox | 0, pixel.oy | 0, pixel.sz, pixel.sz);
        }
      }
    };

    const init = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;

      const rect = nameLabelEl.getBoundingClientRect();
      const padding = 22;
      clearZone = {
        x1: rect.left - padding,
        y1: rect.top - padding,
        x2: rect.right + padding,
        y2: rect.bottom + padding,
        fade: Math.min(width, height) * 0.09,
      };

      buildPixels();
    };

    const handleResize = () => {
      init();
      if (isMobile) drawFrame(); // re-render static frame on resize
    };

    const handleMouseMove = (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      cursorEl.style.left = `${event.clientX}px`;
      cursorEl.style.top = `${event.clientY}px`;
    };

    const handleMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const handleClick = (event) => {
      const { clientX, clientY } = event;

      for (const pixel of pixels) {
        const dx = pixel.ox - clientX;
        const dy = pixel.oy - clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 220 && distance > 0.01) {
          const force = ((220 - distance) / 220) * 9;
          pixel.vx += (dx / distance) * force;
          pixel.vy += (dy / distance) * force;
        }
      }
    };

    const startAnimation = () => {
      if (disposed) return;
      init();
      if (isMobile) {
        drawFrame(); // single static frame — no rAF loop
      } else {
        drawFrame(); // kicks off rAF loop internally
      }
    };

    window.addEventListener('resize', handleResize);

    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseleave', handleMouseLeave);
      window.addEventListener('click', handleClick);
    }

    if (document.fonts?.ready) {
      document.fonts.ready.then(startAnimation);
    } else {
      startAnimation();
    }

    return () => {
      disposed = true;
      window.removeEventListener('resize', handleResize);
      if (!isMobile) {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseleave', handleMouseLeave);
        window.removeEventListener('click', handleClick);
      }
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  if (isMobile) return <MobileHome />;

  const enlargeCursor = () => setCursorBig(true);
  const shrinkCursor = () => setCursorBig(false);

  return (
    <main className="portfolio-shell">
      <canvas ref={canvasRef} className="scene-canvas" aria-hidden="true" />
      <div ref={cursorRef} className={`cursor${cursorBig ? ' big' : ''}`} aria-hidden="true" />

      <Panel
        side="left"
        title="Engineering"
        items={engineeringLinks}
        meta={
          <>
            vizalignment #ga_line
            <br />
            BG:
            <br />
            LIGHT_of_LIN 455_1220
          </>
        }
        onCursorEnter={enlargeCursor}
        onCursorLeave={shrinkCursor}
      />

      <Panel
        side="right"
        title="Design"
        items={designLinks}
        onCursorEnter={enlargeCursor}
        onCursorLeave={shrinkCursor}
      />

      <section ref={nameLabelRef} className="name-label" aria-label="profile">
        <span className="name-main">{displayName}</span>
        <span className="name-sub">PORTFOLIO</span>
        <div className="name-divider" />
        <div className="name-links">
          {profileLinks.map((link, index) => (
            <FragmentLink
              key={link.label}
              href={link.href}
              label={link.label}
              icon={link.icon}
              onCursorEnter={enlargeCursor}
              onCursorLeave={shrinkCursor}
              showSeparator={index < profileLinks.length - 1}
            />
          ))}
        </div>
      </section>

      {coords.map((entry) => (
        <div key={entry.id} className={entry.className}>
          {entry.lines.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
      ))}

      <div className="page-dots" aria-hidden="true">
        {pageDots.map((active, index) => (
          <div key={index} className={`dot${active ? ' active' : ''}`} />
        ))}
      </div>
    </main>
  );
}
