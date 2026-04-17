export const designProjects = [
  {
    id: 'brand-identity',
    title: 'Brand Identity System',
    year: '2025',
    tags: ['Branding', 'Typography', 'System Design'],
    thumbnail: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?w=800&q=80',
    content: `# Brand Identity System

## Overview
스타트업의 브랜드 아이덴티티 시스템 구축. 로고, 타입 시스템, 컬러 팔레트, 컴포넌트 라이브러리까지 일관된 디자인 언어를 정의했습니다.

## Scope
- 로고 디자인 & 사용 가이드라인
- 타입 스케일 및 폰트 페어링
- 컬러 시스템 (Light/Dark 모드)
- 아이콘 세트 (48개)

## Process
경쟁사 분석 → 키워드 도출 → 무드보드 → 컨셉 스케치 → 디지털 제작 → 가이드라인 문서화 순으로 진행했습니다.

## Outcome
디자인 결정 속도 60% 향상, 개발-디자인 핸드오프 마찰 최소화.
`,
  },
  {
    id: 'mobile-app-ux',
    title: 'Finance App UX Redesign',
    year: '2024',
    tags: ['UX Research', 'Figma', 'Prototyping'],
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
    content: `# Finance App UX Redesign

## Overview
MAU 50만 핀테크 앱의 UX 전면 개편. 사용성 테스트와 데이터 분석을 바탕으로 주요 플로우를 재설계했습니다.

## Research
- 사용자 인터뷰 12명
- Heatmap 분석 (Hotjar)
- 퍼널 이탈률 분석

## Key Changes
1. 온보딩 단계 5 → 3으로 축소
2. 메인 대시보드 정보 계층 재구성
3. 송금 플로우 탭 수 40% 감소

## Results
온보딩 완료율 +28%, 핵심 기능 발견율 +41%.
`,
  },
  {
    id: 'design-system',
    title: 'Design System: Token Architecture',
    year: '2024',
    tags: ['Design System', 'Tokens', 'Figma'],
    thumbnail: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80',
    content: `# Design System: Token Architecture

## Overview
Design Token을 활용한 멀티 플랫폼 디자인 시스템 설계.
Web, iOS, Android에서 동일한 토큰 구조를 사용해 일관성을 유지합니다.

## Token Structure

\`\`\`
Global Tokens
  └── color.blue.500 = #3B82F6

Semantic Tokens
  └── color.action.primary = {color.blue.500}

Component Tokens
  └── button.bg.primary = {color.action.primary}
\`\`\`

## Implementation
Figma Variables → Style Dictionary → Platform-specific output (CSS / Swift / Kotlin)
`,
  },
];

export const essays = [
  {
    id: 'design-engineering-bridge',
    title: 'Engineering과 Design 사이: 경계에서 일하는 것에 대해',
    date: '2025.02.01',
    tags: ['Essay', 'Career'],
    content: `# Engineering과 Design 사이: 경계에서 일하는 것에 대해

나는 오랫동안 스스로를 "엔지니어인가, 디자이너인가"라는 질문 앞에 세워두었다.
코드를 짤 때는 디자이너의 감각이 머릿속을 맴돌고, 인터페이스를 그릴 때는 구현 가능성부터 생각하게 된다.

이 포트폴리오 사이트를 만들면서 그 경계를 시각적으로 표현해보고 싶었다.
화면을 가르는 사선은 단순한 레이아웃이 아니라, 내가 서 있는 위치를 나타낸다.
완전히 왼쪽도, 완전히 오른쪽도 아닌 그 어딘가.

## 경계의 가치

경계에 서 있다는 것은 양쪽을 모두 이해한다는 뜻이기도 하다.
픽셀 하나하나가 어떻게 화면에 그려지는지를 알면서, 동시에 그 픽셀들이 사용자에게 어떤 감정을 줄지 생각한다.

그것이 이 일을 계속하게 만드는 이유다.
`,
  },
  {
    id: 'pixel-aesthetics',
    title: '픽셀 미학: 디지털의 물성을 드러내는 방법',
    date: '2024.12.15',
    tags: ['Design Theory', 'Aesthetics'],
    content: `# 픽셀 미학: 디지털의 물성을 드러내는 방법

고해상도 디스플레이가 보편화된 지금, 의도적으로 픽셀을 드러내는 것은 역설적인 선택처럼 보인다.
하지만 그것이 오히려 디지털 매체의 본질을 정직하게 드러낸다고 생각한다.

## 픽셀은 재료다

돌은 돌결을, 나무는 나뭇결을 가진다. 디지털의 재료는 픽셀이다.
그것을 감추려 하지 않고 구조로 활용할 때, 오히려 더 솔직한 디자인이 된다.

## 움직임과 물성

픽셀이 마우스를 따라 흩어지고 돌아오는 것은, 물질적 질감을 디지털로 번역한 것이다.
완벽하게 복원되는 탄성은 디지털만이 가질 수 있는 물성이다.
`,
  },
];

export const articles = [
  {
    id: 'figma-variables',
    title: 'Figma Variables로 다크 모드 구현하기',
    date: '2025.01.28',
    tags: ['Figma', 'Tutorial', 'Dark Mode'],
    content: `# Figma Variables로 다크 모드 구현하기

Figma Variables(구 Tokens)를 활용하면 라이트/다크 모드를 단 한 번의 클릭으로 전환하는 디자인 파일을 만들 수 있습니다.

## 설정 방법

### 1. Collection 생성
- Figma → Variables 패널 → "+ New Collection"
- 이름: \`color/mode\`

### 2. Variable 정의
| Variable Name | Light | Dark |
|---|---|---|
| background/primary | #FFFFFF | #0A0A0A |
| text/primary | #111111 | #F5F5F5 |
| border/default | #E0E0E0 | #2A2A2A |

### 3. Mode 전환
Figma 우측 패널 → Variable Mode → Light / Dark 클릭

## 코드와 연결

Style Dictionary를 이용하면 Figma Variables를 CSS Custom Properties로 자동 변환할 수 있습니다.
`,
  },
  {
    id: 'component-driven-design',
    title: 'Component-Driven Design: 개발자와 협업하는 방법',
    date: '2024.10.12',
    tags: ['Process', 'Collaboration', 'Components'],
    content: `# Component-Driven Design: 개발자와 협업하는 방법

디자이너가 컴포넌트 단위로 사고하면, 개발자와의 핸드오프 마찰이 크게 줄어듭니다.

## 핵심 원칙

### Atomic Design 기반 구조
- Atom: Button, Input, Icon
- Molecule: SearchBar, Card
- Organism: Header, ProductList

### 상태를 모두 설계하라
컴포넌트 설계 시 반드시 다음 상태를 포함해야 합니다:
- Default / Hover / Active / Disabled
- Empty / Loading / Error / Success

### Props 관점에서 생각하기
\`\`\`
Button
  variant: primary | secondary | ghost
  size: sm | md | lg
  disabled: boolean
  loading: boolean
\`\`\`

이렇게 명시하면 개발자가 바로 컴포넌트를 구현할 수 있습니다.
`,
  },
];
