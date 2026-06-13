# ARCHITECTURE.md — Lineup 아키텍처 가이드

---

## 초기 셋업 명령어

```bash
# 1. Next.js 프로젝트 생성
npx create-next-app@latest lineup \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd lineup

# 2. 핵심 패키지 설치
npm install \
  @supabase/supabase-js \
  @supabase/ssr \
  resend \
  @react-pdf/renderer \
  react-email \
  @radix-ui/react-dialog \
  @radix-ui/react-dropdown-menu \
  @radix-ui/react-select \
  @radix-ui/react-tabs \
  @radix-ui/react-toast \
  date-fns \
  lucide-react \
  clsx \
  tailwind-merge \
  zustand

# 3. shadcn/ui 초기화
npx shadcn-ui@latest init

# 4. shadcn 컴포넌트 추가
npx shadcn-ui@latest add button card dialog dropdown-menu \
  input label select tabs toast badge avatar \
  table sheet popover calendar

# 5. Supabase CLI (전역)
npm install -g supabase
supabase login
```

---

## 최종 폴더 구조

```
lineup/
├── src/
│   ├── app/
│   │   ├── (marketing)/                    # 그룹: 랜딩페이지
│   │   │   ├── layout.tsx                  # Nav 포함
│   │   │   └── page.tsx                    # 기존 디자인 파일 이식
│   │   │
│   │   ├── (app)/                          # 그룹: 실제 앱 (인증 필요)
│   │   │   ├── layout.tsx                  # Sidebar + Header
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── campaigns/
│   │   │   │   ├── page.tsx                # 칸반/리스트 뷰
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx            # 캠페인 생성 폼
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx            # 캠페인 상세 (개요)
│   │   │   │       ├── influencers/
│   │   │   │       │   └── page.tsx        # 인플루언서 라인업
│   │   │   │       ├── drafts/
│   │   │   │       │   └── page.tsx        # 원고 검수
│   │   │   │       ├── shipping/
│   │   │   │       │   └── page.tsx        # 배송 관리
│   │   │   │       └── billing/
│   │   │   │           └── page.tsx        # 정산
│   │   │   ├── influencers/
│   │   │   │   ├── page.tsx                # 인플루언서 DB
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx            # 인플루언서 상세
│   │   │   ├── clients/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   └── billing/
│   │   │       └── page.tsx                # 전체 정산 관리
│   │   │
│   │   ├── portal/
│   │   │   └── [token]/                    # 광고주 포털 (토큰 기반)
│   │   │       ├── page.tsx                # 인플루언서 선택
│   │   │       └── drafts/
│   │   │           └── page.tsx            # 원고 컨펌
│   │   │
│   │   ├── inf/
│   │   │   └── [token]/                    # 인플루언서 링크 (토큰 기반)
│   │   │       ├── page.tsx                # 캠페인 안내 + 수락/거절
│   │   │       ├── address/
│   │   │       │   └── page.tsx            # 배송지 입력
│   │   │       └── draft/
│   │   │           └── page.tsx            # 원고 제출
│   │   │
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── callback/
│   │   │       └── route.ts
│   │   │
│   │   └── api/
│   │       ├── campaigns/
│   │       │   ├── route.ts                # GET list, POST create
│   │       │   └── [id]/
│   │       │       ├── route.ts            # GET, PATCH, DELETE
│   │       │       └── influencers/
│   │       │           ├── route.ts        # POST add influencer
│   │       │           └── [ci_id]/
│   │       │               ├── route.ts    # PATCH status
│   │       │               └── outreach/
│   │       │                   └── route.ts # POST send email
│   │       ├── influencers/
│   │       │   ├── route.ts
│   │       │   └── [id]/
│   │       │       └── route.ts
│   │       ├── portal/
│   │       │   └── [token]/
│   │       │       ├── route.ts            # GET portal data
│   │       │       ├── select/
│   │       │       │   └── route.ts        # POST selection
│   │       │       └── drafts/
│   │       │           └── [draft_id]/
│   │       │               └── route.ts    # POST approve/revise
│   │       ├── inf/
│   │       │   └── [token]/
│   │       │       ├── route.ts            # GET influencer data
│   │       │       ├── response/
│   │       │       │   └── route.ts        # POST accept/reject
│   │       │       ├── address/
│   │       │       │   └── route.ts        # POST shipping address
│   │       │       └── draft/
│   │       │           └── route.ts        # POST draft submit
│   │       ├── drafts/
│   │       │   └── [id]/
│   │       │       └── route.ts            # PATCH status, POST feedback
│   │       └── invoices/
│   │           ├── route.ts
│   │           └── [id]/
│   │               └── route.ts
│   │
│   ├── components/
│   │   ├── ui/                             # shadcn/ui (자동생성)
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── MobileNav.tsx
│   │   ├── campaign/
│   │   │   ├── CampaignCard.tsx            # 칸반 카드
│   │   │   ├── CampaignKanban.tsx          # 칸반 보드
│   │   │   ├── CampaignList.tsx            # 리스트 뷰
│   │   │   ├── CampaignForm.tsx            # 생성/수정 폼
│   │   │   ├── StageChip.tsx               # 스테이지 배지
│   │   │   └── PriorityQueue.tsx           # 우선순위 큐 위젯
│   │   ├── influencer/
│   │   │   ├── InfluencerCard.tsx          # 리스트 카드
│   │   │   ├── InfluencerSearch.tsx        # 검색 + 필터
│   │   │   ├── InfluencerProfile.tsx       # 상세 프로필
│   │   │   ├── OutreachModal.tsx           # 섭외 이메일 발송 모달
│   │   │   └── AddToCampaignModal.tsx      # 캠페인에 추가 모달
│   │   ├── portal/
│   │   │   ├── CandidateCard.tsx           # 광고주 포털 후보 카드
│   │   │   ├── SelectionBar.tsx            # 하단 제출 바
│   │   │   └── DraftReviewCard.tsx         # 원고 컨펌 카드
│   │   ├── draft/
│   │   │   ├── DraftCard.tsx               # 원고 검수 카드
│   │   │   ├── DraftFeedback.tsx           # 피드백 컴포넌트
│   │   │   └── VersionHistory.tsx          # 버전 히스토리
│   │   ├── billing/
│   │   │   ├── InvoiceForm.tsx
│   │   │   └── PaymentTable.tsx
│   │   └── shared/
│   │       ├── Logo.tsx
│   │       ├── StatusBadge.tsx
│   │       ├── MetricCard.tsx              # 대시보드 지표 카드
│   │       ├── ActivityFeed.tsx            # 타임라인
│   │       ├── FileUpload.tsx              # 파일 업로드 공통
│   │       ├── ConfirmDialog.tsx
│   │       └── EmptyState.tsx
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts                   # createBrowserClient
│   │   │   ├── server.ts                   # createServerClient
│   │   │   └── types.ts                    # supabase gen types 결과
│   │   ├── email/
│   │   │   ├── index.ts                    # Resend 클라이언트 + send 함수
│   │   │   └── templates/
│   │   │       ├── InfluencerOutreach.tsx
│   │   │       ├── InfluencerRevision.tsx
│   │   │       ├── ClientProposal.tsx
│   │   │       ├── ClientDraftReview.tsx
│   │   │       └── ClientInvoice.tsx
│   │   ├── pdf/
│   │   │   ├── InvoicePDF.tsx              # React-PDF 청구서
│   │   │   └── ProposalPDF.tsx             # React-PDF 보고서
│   │   └── utils.ts
│   │
│   ├── types/
│   │   └── index.ts                        # 전역 타입 정의
│   │
│   └── middleware.ts                       # 인증 미들웨어
│
├── supabase/
│   ├── config.toml
│   └── migrations/
│       └── 20260516000001_initial.sql      # DATABASE.sql 내용
│
├── public/
│   └── fonts/
│       └── Pretendard.woff2
│
├── ANTIGRAVITY.md                               # ← Antigravity CLI가 읽는 파일
├── PROJECT_SPEC.md
├── ARCHITECTURE.md
├── DATABASE.sql
├── .env.local
└── package.json
```

---

## 핵심 파일 템플릿

### proxy.ts (인증 프록시 — Next.js 16)
```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 외부 접근 경로는 인증 불필요
  if (pathname.startsWith('/portal/') || pathname.startsWith('/inf/')) {
    return NextResponse.next()
  }

  // 마케팅 페이지 인증 불필요
  if (pathname === '/') {
    return NextResponse.next()
  }

  // 앱 경로는 인증 필요
  // ... Supabase auth check
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

### lib/supabase/client.ts
```typescript
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### lib/supabase/server.ts
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './types'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: (c) => c.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } }
  )
}

// API Routes에서 RLS 우회용 (portal/inf 엔드포인트)
export function createServiceClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )
}
```

### types/index.ts (핵심 타입)
```typescript
export type CampaignStage =
  | 'briefing' | 'search' | 'proposal' | 'selection'
  | 'outreach' | 'shipping' | 'review' | 'uploaded'
  | 'billing' | 'completed'

export type CIStatus =
  | 'candidate' | 'proposed' | 'selected' | 'passed'
  | 'outreached' | 'confirmed' | 'rejected' | 'blackout'

export type DraftStatus =
  | 'submitted' | 'agency_reviewing' | 'agency_approved'
  | 'client_reviewing' | 'client_approved'
  | 'revision_requested' | 'rejected'

export const STAGE_LABELS: Record<CampaignStage, string> = {
  briefing: '브리핑',
  search: '서치 중',
  proposal: '광고주 보고',
  selection: '선택 완료',
  outreach: '섭외 중',
  shipping: '배송',
  review: '원고 검수',
  uploaded: '업로드 완료',
  billing: '정산',
  completed: '완료',
}

export const STAGE_COLORS: Record<CampaignStage, string> = {
  briefing: '#8B95A1',
  search: '#3182F6',
  proposal: '#7B5BFF',
  selection: '#21C26F',
  outreach: '#FF5A1F',
  shipping: '#F6A609',
  review: '#F04452',
  uploaded: '#21C26F',
  billing: '#4E5968',
  completed: '#191F28',
}
```

---

## Antigravity CLI 작업 순서 (Step by Step)

### Step 1: 프로젝트 초기화
```
"ANTIGRAVITY.md와 ARCHITECTURE.md를 읽고, 
Next.js 16 + Supabase + Tailwind 프로젝트를 초기화해줘.
lib/supabase/client.ts, lib/supabase/server.ts, middleware.ts, 
types/index.ts를 먼저 만들어줘."
```

### Step 2: 레이아웃 & 공통 컴포넌트
```
"ANTIGRAVITY.md의 디자인 토큰을 기반으로
Sidebar.tsx, Header.tsx를 만들어줘.
디자인 참고: 기존 design_files/shared.jsx의 Logo, 사이드바 메뉴 구조 그대로."
```

### Step 3: 대시보드
```
"dashboard/page.tsx와 필요한 컴포넌트를 만들어줘.
PROJECT_SPEC.md 섹션 2 참고.
MetricCard, PriorityQueue, ActivityFeed 컴포넌트 포함."
```

### Step 4: 인플루언서 DB
```
"influencers/ 페이지와 API routes를 만들어줘.
PROJECT_SPEC.md 섹션 4 참고.
검색 필터, 카드 목록, 상세 페이지 포함."
```

### Step 5: 캠페인 관리
```
"campaigns/ 페이지, 칸반 보드, 캠페인 생성 폼을 만들어줘.
PROJECT_SPEC.md 섹션 3 참고."
```

### Step 6: 광고주 포털
```
"portal/[token]/ 페이지를 만들어줘.
PROJECT_SPEC.md 섹션 5 참고.
기존 design_files/portal.jsx의 UI를 Next.js로 이식해줘."
```

### Step 7: 인플루언서 링크
```
"inf/[token]/ 페이지들을 만들어줘.
PROJECT_SPEC.md 섹션 6 참고.
수락/거절, 배송지 입력, 원고 제출 플로우."
```

### Step 8: 원고 검수 & 정산
```
"캠페인 상세의 drafts/, billing/ 탭과 API를 만들어줘.
PROJECT_SPEC.md 섹션 7, 9 참고."
```

### Step 9: 이메일 템플릿
```
"Resend + React Email로 이메일 템플릿들을 만들어줘.
PROJECT_SPEC.md 섹션 10의 템플릿 목록 참고."
```

---

## .env.local 템플릿

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# Resend
RESEND_API_KEY=re_xxxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 개발 → 배포 플로우

```
로컬 개발 (localhost:3000)
  ↓
Vercel 프리뷰 배포 (PR마다 자동)
  ↓
Vercel 프로덕션 (app.lineup.io)
  ↓
Supabase Cloud (DB, Auth, Storage)
```

**Supabase 타입 자동 생성 (DB 변경 시마다 실행):**
```bash
npx supabase gen types typescript \
  --project-id YOUR_PROJECT_ID \
  > src/lib/supabase/types.ts
```
