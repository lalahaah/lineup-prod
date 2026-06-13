# ANTIGRAVITY.md — Lineup 프로젝트 헌법

> 이 파일은 **Antigravity CLI**가 이 프로젝트에서 작업할 때 반드시 먼저 읽어야 하는 컨텍스트 파일이다.
> 모든 코드 생성, 수정, 리팩토링은 이 문서의 원칙을 따른다.
> **할당된 태스크(TASKS.md 기준)를 완료한 즉시 멈춘다. 다음 태스크로 넘어가지 않는다.**

---

## 프로젝트 개요

**제품명:** Lineup
**성격:** 광고대행사를 위한 인플루언서 캠페인 운영 OS (SaaS)
**초기 운영사:** (주)라운드미디어
**핵심 명제:** 이메일·엑셀·카카오톡으로 흩어진 인플루언서 캠페인 파이프라인을 하나의 플랫폼으로 대체한다.
**디자인 레퍼런스:** Positivus 스타일 (Bold shadow, Lime green accent, Space Grotesk)

---

## 비즈니스 모델 (Phase별)

### Phase 1 — 내부 운영 도구
- 라운드미디어 + 쿠쿠전자 전용
- 수익 없음 (내부 검증)

### Phase 2A — 대행사 SaaS (모델 A)
- 타 광고대행사에 구독료로 판매

### Phase 2B — 광고주 셀프서비스 (모델 B)
- 광고주 구독료 + 거래 수수료

---

## 사용자 롤

| 롤 | 접근 방식 | 설명 |
|---|---|---|
| `agency_admin` | 로그인 필요 | 라운드미디어 대표 (Laha) |
| `agency_manager` | 로그인 필요 | 캠페인 매니저 |
| `client` | 토큰 링크 | 광고주 (쿠쿠전자) — 로그인 없음 |
| `influencer` | 토큰 링크 | 인플루언서 — 로그인 없음 |

---

## 기술 스택 (변경 금지)

```
Frontend:  Next.js 16.2.9 (App Router)
Runtime:   React 19.2.4
주의사항:
  - cookies()는 async 필수: await cookies()
  - headers()는 async 필수: await headers()
  - middleware.ts deprecated → proxy.ts 사용
  - Turbopack 기본 활성화
Styling:   Tailwind CSS + CSS Variables (globals.css 기반)
UI Kit:    shadcn/ui
Backend:   Supabase (PostgreSQL + Auth + Storage + Realtime)
Email:     Resend API
PDF:       @react-pdf/renderer
배포:      Vercel
결제:      토스페이먼츠 (Phase 2)
AI 도구:   Antigravity CLI
```

---

## ⚠️ 디자인 시스템 (절대 준수 — Positivus 스타일)

### 핵심 원칙
- **Positivus 디자인 시스템** 기반
- Bold border + offset shadow가 이 디자인의 핵심 정체성
- 모든 카드, 버튼에 `border: 1px solid var(--dark)` + `box-shadow: var(--shadow)` 적용
- HEX 직접 입력 절대 금지 — 반드시 CSS 변수 사용

### 컬러 토큰
```css
--green: #B9FF66;        /* 메인 액센트 — 라임 그린 */
--green-soft: #EAFDD2;   /* 연한 그린 배경 */
--dark: #191A23;         /* 텍스트, 테두리, 그림자 */
--gray: #F3F3F3;         /* 페이지 배경 */
--white: #FFFFFF;        /* 카드 배경 */
--line: #191A23;         /* 강한 테두리 */
--line-soft: #E3E3E6;    /* 약한 구분선 */
--muted: #6A6A72;        /* 보조 텍스트 */

/* 상태 컬러 */
--badge-warn-bg: #FFE8B0;
--badge-warn-border: #E0B65A;
--badge-danger-bg: #FFD5D0;
--badge-danger-border: #E08A80;
```

### 그림자 (Positivus 시그니처)
```css
--shadow: 0 4px 0 0 var(--dark);      /* 카드, 버튼 기본 */
--shadow-sm: 0 3px 0 0 var(--dark);   /* 작은 카드 */
```

### 폰트
```
주 폰트: Space Grotesk (400, 500, 600, 700)
Google Fonts: https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700
letter-spacing: -0.5px (제목)
```

### Border Radius
```css
--r-lg: 28px;   /* 대형 카드 */
--r-md: 18px;   /* 중형 카드, 칸반 카드 */
--r-sm: 12px;   /* 버튼, 입력창 */
```

### 버튼 스타일
```css
/* 기본 버튼 */
background: var(--dark); color: white;
border: 1px solid var(--dark); border-radius: 12px;
padding: 12px 20px; font-size: 15px;
hover: background → var(--green); color → var(--dark)

/* 그린 버튼 */
background: var(--green); color: var(--dark);
hover: background → var(--dark); color → white

/* 고스트 버튼 */
background: var(--white); color: var(--dark);
hover: background → var(--dark); color → white
```

### 카드 스타일
```css
background: var(--white);
border: 1px solid var(--dark);
border-radius: var(--r-lg);  /* 28px */
box-shadow: var(--shadow);   /* 0 4px 0 0 #191A23 */
```

### 배지(Badge) 스타일
```css
/* 기본 */
border: 1px solid var(--dark); background: var(--white);
border-radius: 30px; padding: 4px 11px; font-size: 12.5px;

/* 그린 */   background: var(--green);
/* 소프트 */ background: var(--green-soft); border-color: #B6E88A;
/* 경고 */   background: #FFE8B0; border-color: #E0B65A;
/* 위험 */   background: #FFD5D0; border-color: #E08A80;
/* 다크 */   background: var(--dark); color: white;
/* 회색 */   background: var(--gray);
```

### 사이드바
```css
background: var(--dark); color: white;
width: 256px; height: 100vh; position: sticky; top: 0;

/* 활성 메뉴 */
background: var(--green); color: var(--dark); font-weight: 500;

/* 비활성 메뉴 */
color: #CFD0D6;
hover: background: #25262F; color: white;
```

### D-day 칩
```css
/* 기본 */  background: var(--gray); border: 1px solid var(--line-soft);
/* 긴급 */  background: #FFD5D0; border-color: #E08A80;  /* hot: D-3 이내 */
/* 주의 */  background: #FFE8B0; border-color: #E0B65A;  /* warm: D-7 이내 */
```

### 페이지 레이아웃
```css
/* 전체 앱 */
body { background: var(--gray); }
.app { display: flex; min-height: 100vh; }

/* 메인 영역 */
.topbar { padding: 26px 40px 18px; background: var(--gray); position: sticky; top: 0; }
.content { padding: 8px 40px 50px; }
```

---

## 화면별 디자인 레퍼런스

각 화면의 목업 HTML 파일이 프로젝트에 포함되어 있다.
코드 생성 시 반드시 해당 목업을 참고해서 구조와 스타일을 최대한 동일하게 구현한다.

| 화면 | 목업 파일 | 경로 |
|---|---|---|
| 대시보드 | Dashboard.html | design_files/ |
| 캠페인 칸반 | Campaigns.html | design_files/ |
| 캠페인 상세 | Campaign_Detail.html | design_files/ |
| 인플루언서 DB | Influencers.html | design_files/ |
| 광고주 포털 | Portal.html | design_files/ |
| 인플루언서 링크 | Influencer_Link.html | design_files/ |

**브랜드명:** 목업의 "RoundFlow" → 모두 "Lineup"으로 변경

---

## 캠페인 스테이지 (9단계)

```typescript
type CampaignStage =
  | 'briefing'    // 1. 브리핑
  | 'search'      // 2. 서치
  | 'proposal'    // 3. 제안
  | 'selection'   // 4. 선택
  | 'outreach'    // 5. 섭외
  | 'shipping'    // 6. 배송
  | 'review'      // 7. 검수
  | 'uploaded'    // 8. 업로드
  | 'billing'     // 9. 정산
  | 'completed'   // 완료

export const STAGE_LABELS: Record<CampaignStage, string> = {
  briefing: '브리핑', search: '서치', proposal: '제안',
  selection: '선택', outreach: '섭외', shipping: '배송',
  review: '검수', uploaded: '업로드', billing: '정산', completed: '완료'
}

// 칸반 컬럼 닷 컬러
export const STAGE_COLORS: Record<CampaignStage, string> = {
  briefing: '#C9C9D0', search: '#9FC0FF', proposal: '#FFD27A',
  selection: '#FFBA3A', outreach: '#FFBA3A', shipping: '#9FE0A8',
  review: '#FF8A7A', uploaded: '#9FE0A8', billing: '#191A23', completed: '#191A23'
}
```

---

## 인플루언서-캠페인 상태

```typescript
type CIStatus =
  | 'candidate' | 'proposed' | 'selected' | 'passed'
  | 'outreached' | 'confirmed' | 'rejected' | 'blackout'
```

---

## 원고 상태

```typescript
type DraftStatus =
  | 'submitted' | 'agency_reviewing' | 'agency_approved'
  | 'client_reviewing' | 'client_approved'
  | 'revision_requested' | 'rejected'
```

---

## 핵심 개발 원칙

1. **디자인 목업 최우선**: 각 화면 구현 시 design_files/ 의 HTML 목업을 열어서 구조 확인 후 구현
2. **CSS 변수만 사용**: HEX 직접 입력 절대 금지
3. **Space Grotesk 폰트**: Pretendard/Inter 사용 금지
4. **Bold shadow 유지**: 모든 카드에 `box-shadow: var(--shadow)` 적용
5. **타입 안전성**: TypeScript any 금지, Supabase 타입 사용
6. **서버/클라이언트 분리**: 데이터 패칭 Server Component, 인터랙션만 'use client'
7. **async cookies()**: Next.js 16 필수
8. **에러 처리**: try/catch 필수
9. **한국어 UI**: 모든 텍스트 한국어
10. **브랜드명**: "RoundFlow" → "Lineup" (목업 파일 참고 시 주의)

---

## Antigravity CLI 작업 규칙

1. TASKS.md에서 현재 태스크 번호와 범위 확인
2. **할당된 태스크만 구현. 다음 태스크 자동 진행 절대 금지**
3. 태스크 완료 후: "TASK-XXX 완료. 다음 태스크를 지시해주세요." 출력 후 정지
4. 완료 후 커밋 & 푸시 (.env.local 커밋 금지)

---

## 환경 변수

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_APP_URL=
```

---

## globals.css 핵심 내용

```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');

:root {
  --green: #B9FF66;
  --green-soft: #EAFDD2;
  --dark: #191A23;
  --gray: #F3F3F3;
  --white: #FFFFFF;
  --line: #191A23;
  --line-soft: #E3E3E6;
  --muted: #6A6A72;
  --shadow: 0 4px 0 0 var(--dark);
  --shadow-sm: 0 3px 0 0 var(--dark);
  --r-lg: 28px;
  --r-md: 18px;
  --r-sm: 12px;
  --sb-w: 256px;
}

* { box-sizing: border-box; }
body {
  font-family: "Space Grotesk", system-ui, sans-serif;
  color: var(--dark);
  background: var(--gray);
  -webkit-font-smoothing: antialiased;
}
```
