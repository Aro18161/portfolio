export const engineeringProjects = [
  {
    id: 'portfolio-site',
    title: 'Portfolio Website',
    year: '2025',
    tags: ['React', 'Canvas', 'Animation'],
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    content: `# Portfolio Website

## Overview
픽셀 렌더링 산맥을 주요 시각 요소로 활용한 개인 포트폴리오 사이트.
마우스 인터랙션과 분할 레이아웃을 통해 Engineering과 Design의 이중성을 표현했습니다.

## Tech Stack
- React 18 + Vite
- HTML5 Canvas (2D)
- CSS Custom Properties

## Key Features
- fBm 노이즈 기반 픽셀 마운틴 생성
- 스프링 물리 기반 마우스 인터랙션
- 대각 그라디언트 분할 레이아웃
- 폰트 로드 완료 후 정확한 클리어존 계산

## Process
먼저 픽셀 마운틴의 시각적 방향성을 잡고, Canvas 퍼포먼스를 고려해 grayscale LUT를 사용했습니다.
스프링 물리는 \`vx += (ox - x) * k\` 형태로 구현하며, 임계값 이하에서 스냅 처리합니다.
`,
  },
  {
    id: 'dev-tool',
    title: 'Internal Dev Tooling',
    year: '2024',
    tags: ['Node.js', 'CLI', 'TypeScript'],
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
    content: `# Internal Dev Tooling

## Overview
팀 내부 배포 및 코드 품질 검사 자동화를 위한 CLI 도구 세트.

## Tech Stack
- Node.js + TypeScript
- Commander.js
- GitHub Actions

## Key Features
- 브랜치 기반 자동 배포 파이프라인
- Lint / Type check / Test 통합 실행
- Slack 알림 연동

## Impact
배포 시간 평균 40% 단축, 수동 릴리즈 오류 제거.
`,
  },
  {
    id: 'data-viz',
    title: 'Real-time Data Dashboard',
    year: '2024',
    tags: ['React', 'D3.js', 'WebSocket'],
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    content: `# Real-time Data Dashboard

## Overview
WebSocket 기반 실시간 데이터 시각화 대시보드.

## Tech Stack
- React + D3.js
- WebSocket (custom protocol)
- Redis Pub/Sub

## Key Features
- 초당 수백 건 업데이트 처리
- D3 force simulation 활용 네트워크 그래프
- 시계열 데이터 줌/팬 인터랙션
`,
  },
];

export const blogPosts = [
  {
    id: 'canvas-performance',
    title: 'Canvas 퍼포먼스 최적화: 수만 개의 픽셀을 60fps로',
    date: '2025.01.10',
    tags: ['Canvas', 'Performance', 'JavaScript'],
    content: `# Canvas 퍼포먼스 최적화: 수만 개의 픽셀을 60fps로

포트폴리오 사이트를 만들면서 캔버스에서 ~30,000개 픽셀을 매 프레임 렌더링해야 했습니다.
처음 구현에서는 프레임 드롭이 심각했는데, 몇 가지 최적화로 안정적인 60fps를 달성했습니다.

## 문제: 매 프레임 String 생성

\`\`\`js
// Before: 매 픽셀마다 새 문자열 생성
ctx.fillStyle = \`rgb(\${v},\${v},\${v})\`;
\`\`\`

30,000개 픽셀에서 이는 매 프레임 30,000번의 string allocation입니다.
GC 부하가 눈에 띄게 발생했습니다.

## 해결: LUT (Lookup Table) 사전 생성

\`\`\`js
// After: 256개 색상 문자열을 한 번만 생성
const GS = Array.from({ length: 256 }, (_, i) => \`rgb(\${i},\${i},\${i})\`);

// 렌더 루프에서
ctx.fillStyle = GS[Math.round(pixel.b * 255)];
\`\`\`

프레임당 string 할당이 0으로 줄어 GC 중단이 사라졌습니다.

## 추가 최적화: 스냅 처리

스프링 물리를 적용할 때 매우 작은 속도와 변위에서도 매 프레임 연산이 발생합니다.
임계값 이하에서 정확히 원위치로 스냅하면 \`fillRect\` 호출은 동일하지만
불필요한 부동소수점 연산을 줄일 수 있습니다.

## 결과

| 최적화 전 | 최적화 후 |
|---|---|
| 38-45 fps | 60 fps stable |
| GC 간헐적 중단 | GC pause 없음 |
`,
  },
  {
    id: 'spring-physics',
    title: '스프링 물리로 자연스러운 UI 인터랙션 만들기',
    date: '2024.11.22',
    tags: ['Animation', 'Physics', 'UX'],
    content: `# 스프링 물리로 자연스러운 UI 인터랙션 만들기

CSS transition만으로는 표현하기 어려운, 탄성 있는 인터랙션을 JS 스프링 물리로 구현하는 방법을 정리합니다.

## 기본 모델

단순 스프링-감쇠 시스템:

\`\`\`js
// 매 프레임
vx += (targetX - x) * stiffness;  // 스프링 힘
vx *= damping;                      // 감쇠
x += vx;
\`\`\`

\`stiffness\`가 높을수록 빠르게 수렴, \`damping\`이 낮을수록 진동이 오래 지속됩니다.

## 과감쇠 (Overdamped) 설정

진동 없이 빠르게 수렴하려면:
- stiffness: 0.15 ~ 0.25
- damping: 0.70 ~ 0.78

## 스냅 처리

작은 값에서 무한히 수렴하는 걸 방지:

\`\`\`js
if (Math.abs(vx) < 0.08 && Math.abs(x - ox) < 0.5) {
  vx = 0; x = ox; // 정확히 원위치로
}
\`\`\`
`,
  },
  {
    id: 'fbm-noise',
    title: 'fBm 노이즈로 자연스러운 지형 생성하기',
    date: '2024.09.05',
    tags: ['Math', 'Procedural', 'Canvas'],
    content: `# fBm 노이즈로 자연스러운 지형 생성하기

Fractional Brownian Motion(fBm)은 여러 옥타브의 노이즈를 합산해 자연스러운 지형을 만드는 기법입니다.

## 기본 구조

\`\`\`js
function fbm(x, seed) {
  return noise(x * 1.0 + seed) * 0.500   // 저주파, 높은 진폭
       + noise(x * 2.1 + seed) * 0.250   // 중주파
       + noise(x * 4.3 + seed) * 0.125   // 고주파
       + noise(x * 8.7 + seed) * 0.063;  // 세부 디테일
}
\`\`\`

옥타브를 거듭할수록 진폭은 절반, 주파수는 2배가 됩니다.

## 가우시안 피크 추가

특정 위치에 두드러진 봉우리를 만들려면 가우시안 envelope를 곱합니다:

\`\`\`js
const peak = 0.16 * Math.exp(-Math.pow((x - peakX) * width, 2));
const surfaceY = baseY - peak - fbm(x, seed) * amplitude;
\`\`\`
`,
  },
];
