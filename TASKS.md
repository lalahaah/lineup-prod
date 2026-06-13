# TASKS.md — Lineup 개발 작업 목록

> Antigravity IDE에서 Antigravity CLI로 작업할 때 이 파일의 태스크를 순서대로 진행한다.
> 각 태스크는 독립적으로 완결되어야 한다. 완료 시 [x] 체크.

---

## Phase 1: 프로젝트 기반 (Week 1)

### TASK-001: 프로젝트 초기화
- [x] Next.js 14 프로젝트 생성 (App Router, TypeScript, Tailwind)
- [x] 패키지 설치 (ARCHITECTURE.md 참고)
- [x] shadcn/ui 초기화
- [x] `.env.local` 설정
- [x] `tailwind.config.ts`에 CSS 변수 연동
- [x] `globals.css`에 styles.css 내용 이식 (디자인 토큰)
- [x] Pretendard 폰트 설정

**Antigravity 프롬프트:**
```
ANTIGRAVITY.md를 읽어줘. 그리고 ARCHITECTURE.md의 초기 셋업 명령어를 순서대로 실행해줘.
완료 후 globals.css에 styles.css의 CSS 변수와 기본 스타일을 이식해줘.
tailwind.config.ts에서 CSS 변수를 Tailwind 커스텀 컬러로 매핑해줘.
```

---

### TASK-002: Supabase 연동 + DB 초기화
- [x] Supabase 프로젝트 생성 (supabase.com)
- [x] `lib/supabase/client.ts` 생성
- [x] `lib/supabase/server.ts` 생성 (service client 포함)
- [x] DATABASE.sql을 Supabase SQL Editor에서 실행
- [x] `supabase gen types` 실행 → `lib/supabase/types.ts` 생성
- [x] `types/index.ts` 생성 (CampaignStage, 레이블, 컬러 맵)
- [x] `middleware.ts` 생성 (인증 라우팅)

**Antigravity 프롬프트:**
```
ARCHITECTURE.md의 lib/supabase/client.ts, lib/supabase/server.ts 템플릿을 그대로 구현해줘.
그리고 types/index.ts를 ARCHITECTURE.md의 핵심 타입 섹션 기반으로 만들어줘.
middleware.ts도 구현해줘 — /portal/, /inf/, / 경로는 인증 없이 접근 가능하고
나머지 /dashboard, /campaigns, /influencers 등은 로그인 필요.
```

---

### TASK-003: 공통 레이아웃 컴포넌트
- [x] `components/shared/Logo.tsx`
- [x] `components/layout/Sidebar.tsx`
- [x] `components/layout/Header.tsx`
- [x] `(app)/layout.tsx` (Sidebar + Header 포함)
- [x] `(marketing)/layout.tsx` (Nav만 포함)

**Antigravity 프롬프트:**
```
ANTIGRAVITY.md의 디자인 토큰을 기반으로 다음을 만들어줘:

1. Logo.tsx: design_files/shared.jsx의 Logo 컴포넌트를 React/TypeScript로 포팅
2. Sidebar.tsx: design_files/hero.jsx의 HeroMock 안에 있는 사이드바 UI를 실제 컴포넌트로 구현.
   메뉴: 대시보드, 캠페인, 인플루언서 DB, 광고주, 정산, 리포트, 설정
   현재 경로에 따라 active 상태 자동 처리
3. Header.tsx: 현재 페이지 타이틀 + 사용자 아바타 + 로그아웃
4. (app)/layout.tsx: Sidebar(좌) + 콘텐츠(우) 레이아웃
```

---

## Phase 1: 핵심 기능 (Week 2)

### TASK-004: 대시보드 페이지
- [x] `api/dashboard/route.ts` (DashboardSummary 반환)
- [x] `components/shared/MetricCard.tsx`
- [x] `components/campaign/PriorityQueue.tsx`
- [x] `components/shared/ActivityFeed.tsx`
- [x] `dashboard/page.tsx`

**Antigravity 프롬프트:**
```
PROJECT_SPEC.md 섹션 2를 읽고 대시보드를 구현해줘.

1. GET /api/dashboard/route.ts:
   - 진행 캠페인 수 (stage != 'completed')
   - 원고 대기 수 (review 스테이지 캠페인)
   - 배송 대기 수 (shipping 스테이지)
   - 이번달 매출 (paid invoices)
   - 우선순위 큐 (마감 D-3 이내)
   - 최근 활동 20개

2. dashboard/page.tsx:
   design_files/hero.jsx의 HeroMock UI(메트릭 카드 4개 + 우선순위 큐)를
   실제 데이터와 연동하는 Server Component로 구현
   
컬러: 원고 대기 → --red, 배송 대기 → --yellow, 매출 → --accent
```

---

### TASK-005: 인플루언서 DB — 목록 & 검색
- [ ] `api/influencers/route.ts` (GET with filters, POST create)
- [ ] `components/influencer/InfluencerSearch.tsx`
- [ ] `components/influencer/InfluencerCard.tsx`
- [ ] `influencers/page.tsx`

**Antigravity 프롬프트:**
```
PROJECT_SPEC.md 섹션 4를 읽고 인플루언서 DB 목록 페이지를 구현해줘.

GET /api/influencers:
- 쿼리파라미터: q, channels, followers_min/max, categories, 
  collaborated, response_rate_min, fee_min/max, exclude_blacklist
- Supabase 쿼리 with pg_trgm 검색

InfluencerCard: 
- 아바타(이름 첫글자), 이름, 핸들, 팔로워, 참여율, 단가, 카테고리 태그
- "캠페인에 추가" 버튼, "프로필 보기" 링크

인플루언서 목록 페이지:
- 상단 검색창 + 필터 드롭다운 (채널, 카테고리)
- 그리드 레이아웃 카드 목록
- 우상단 "새 인플루언서 추가" 버튼
```

---

### TASK-006: 인플루언서 DB — 상세 & 추가
- [ ] `api/influencers/[id]/route.ts` (GET, PATCH)
- [ ] `influencers/[id]/page.tsx`
- [ ] `components/influencer/InfluencerProfile.tsx`
- [ ] `components/influencer/AddToCampaignModal.tsx`
- [ ] 인플루언서 신규 추가 폼 (모달 or 페이지)

**Antigravity 프롬프트:**
```
인플루언서 상세 페이지와 신규 추가 기능을 구현해줘.

상세 페이지 탭:
- [기본 정보]: 모든 필드 편집 가능
- [컨택 이력]: contact_logs 테이블, 최신순
- [캠페인 이력]: 참여한 캠페인 목록

AddToCampaignModal:
- 진행 중인 캠페인 목록 (드롭다운)
- 제안 단가 입력
- 운영팀 코멘트 입력
- 제출 → campaign_influencers INSERT (status: 'candidate')
```

---

### TASK-007: 캠페인 목록 (칸반 보드)
- [ ] `api/campaigns/route.ts` (GET, POST)
- [ ] `components/campaign/StageChip.tsx`
- [ ] `components/campaign/CampaignCard.tsx`
- [ ] `components/campaign/CampaignKanban.tsx`
- [ ] `campaigns/page.tsx`

**Antigravity 프롬프트:**
```
PROJECT_SPEC.md 섹션 3-1을 읽고 캠페인 목록 칸반 보드를 구현해줘.

design_files/kanban.jsx를 참고해서 실제 Next.js 컴포넌트로 구현.
칸반 컬럼 = 9개 스테이지 (STAGE_LABELS 참고)
카드: 캠페인명, 광고주명, 담당자, 마감일, 인플루언서 수, StageChip

StageChip: stage에 따라 STAGE_COLORS 적용, pill 모양

상단: "리스트 뷰 | 칸반 뷰" 토글 + "새 캠페인" 버튼
```

---

### TASK-008: 캠페인 생성 폼
- [ ] `campaigns/new/page.tsx`
- [ ] `components/campaign/CampaignForm.tsx`

**Antigravity 프롬프트:**
```
PROJECT_SPEC.md 섹션 3-2의 CampaignCreateInput 기반으로 캠페인 생성 폼을 구현해줘.

필드:
- 광고주 선택 (clients 테이블에서 드롭다운)
- 캠페인명, 제품명, 제품 설명
- 목표 (라디오: 브랜드 인지 / 제품 리뷰 / 구매 전환)
- 희망 채널 (체크박스 멀티선택)
- 희망 인플루언서 수
- 카테고리 (태그 형식 멀티선택)
- 콘텐츠 방향성 (textarea)
- 금지사항 (textarea)
- 제품 발송 예정일, 원고 마감일, 업로드 희망일 (date picker)
- 담당자 배정 (users 드롭다운)
- 파일 첨부

제출 시: POST /api/campaigns → 생성 완료 → /campaigns/[id]로 이동
```

---

### TASK-009: 캠페인 상세 — 개요 & 인플루언서 탭
- [ ] `api/campaigns/[id]/route.ts`
- [ ] `api/campaigns/[id]/influencers/route.ts`
- [ ] `campaigns/[id]/page.tsx`
- [ ] `campaigns/[id]/influencers/page.tsx`

**Antigravity 프롬프트:**
```
캠페인 상세 페이지를 구현해줘.

상단: 캠페인명, 광고주, 스테이지(편집 가능), 광고주 포털 링크 복사 버튼

탭 네비게이션: [개요] [인플루언서] [원고 검수] [배송] [정산] [타임라인]

[개요] 탭: 
- 캠페인 정보 카드 (제품명, 기간, 목표 등)
- 일정 현황 (ship_date, content_deadline, upload_deadline)

[인플루언서] 탭:
- campaign_influencers 목록
- 각 행: 인플루언서명, 채널, 팔로워, 상태(CIStatus 배지), 단가, 액션 버튼
- 상태에 따른 액션: candidate→보고포함, proposed→선택됨, confirmed→섭외이메일발송
- 우상단: "인플루언서 추가" (DB에서 검색해서 추가)
```

---

## Phase 2: 외부 접근 레이어 (Week 3)

### TASK-010: 광고주 포털
- [ ] `api/portal/[token]/route.ts`
- [ ] `api/portal/[token]/select/route.ts`
- [ ] `portal/[token]/page.tsx`
- [ ] `components/portal/CandidateCard.tsx`
- [ ] `components/portal/SelectionBar.tsx`

**Antigravity 프롬프트:**
```
PROJECT_SPEC.md 섹션 5를 읽고 광고주 포털을 구현해줘.

design_files/portal.jsx를 Next.js로 이식.
기존 React 상태 로직(selected, toggle, submit)은 그대로 유지.
실제 데이터는 GET /api/portal/[token]에서 fetch.

GET /api/portal/[token]:
- portal_token으로 campaign 조회
- campaign_influencers (status IN ['proposed','selected','passed']) 반환
- service_role key 사용 (RLS 우회)

POST /api/portal/[token]/select:
- selections 배열 받아서 status 업데이트
- campaign.stage → 'selection' 변경
- 운영팀에 이메일 알림 발송

포털 페이지 특징:
- 로그인 없음 (토큰으로만 접근)
- 모바일 반응형 필수
- "자동 저장됨" 표시
```

---

### TASK-011: 인플루언서 링크 — 수락/거절 & 배송지
- [ ] `api/inf/[token]/route.ts`
- [ ] `api/inf/[token]/response/route.ts`
- [ ] `api/inf/[token]/address/route.ts`
- [ ] `inf/[token]/page.tsx`
- [ ] `inf/[token]/address/page.tsx`

**Antigravity 프롬프트:**
```
PROJECT_SPEC.md 섹션 6을 읽고 인플루언서 링크 페이지를 구현해줘.

GET /api/inf/[token]:
- access_token으로 campaign_influencer 조회
- 연관 campaign, client 정보 포함

/inf/[token] 메인 페이지:
- 브랜드명, 캠페인명, 제품 정보 표시
- brief, restrictions 표시
- 제안 단가 표시
- [수락하기] [거절하기] [조건 협의] 버튼
- 수락 시 → /inf/[token]/address로 이동
- 거절 시 → 사유 선택 모달 → 제출 → 완료 메시지

/inf/[token]/address:
- 배송지 입력 폼 (우편번호, 주소, 수령인, 연락처, 배송 메모)
- 제출 → shipping_address 저장 → 완료 페이지

디자인: 깔끔한 모바일 퍼스트, 앱 레이아웃 없이 독립 페이지
```

---

### TASK-012: 인플루언서 링크 — 원고 제출
- [ ] `api/inf/[token]/draft/route.ts`
- [ ] `inf/[token]/draft/page.tsx`
- [ ] `components/shared/FileUpload.tsx`

**Antigravity 프롬프트:**
```
인플루언서 원고 제출 페이지를 구현해줘.

/inf/[token]/draft:
- 파일 업로드 (이미지/영상, 다중, Supabase Storage 'drafts' 버킷)
- 캡션 textarea
- 해시태그 input
- 업로드 예정일 datepicker
- 특이사항 textarea (선택)
- [제출하기] 버튼

POST /api/inf/[token]/draft:
- 파일을 Supabase Storage에 업로드
- drafts 테이블에 INSERT (version=1 또는 기존+1)
- status: 'submitted'
- 운영팀에 이메일 알림 (influencer_outreach 템플릿 유사)
- activity_logs에 기록
```

---

## Phase 3: 검수 & 정산 (Week 4)

### TASK-013: 원고 검수 플로우 (운영팀)
- [ ] `api/drafts/[id]/route.ts`
- [ ] `campaigns/[id]/drafts/page.tsx`
- [ ] `components/draft/DraftCard.tsx`
- [ ] `components/draft/DraftFeedback.tsx`
- [ ] `components/draft/VersionHistory.tsx`

**Antigravity 프롬프트:**
```
PROJECT_SPEC.md 섹션 7을 읽고 원고 검수 화면을 구현해줘.

캠페인 상세 > [원고 검수] 탭:
- 인플루언서별 섹션
- 각 섹션: 최신 원고 파일 미리보기, 캡션, 해시태그, 제출일
- [승인] [수정 요청] [반려] 버튼
- 수정 요청 시: 피드백 textarea 모달 → 제출 → status:'revision_requested' → 인플루언서 이메일 발송
- 버전 탭: v1, v2, v3... 전환 가능

PATCH /api/drafts/[id]:
- action: 'approve' | 'revise' | 'reject'
- feedback?: string
- status 업데이트
- 이메일 발송 (수정 요청 시)
- activity_logs 기록
```

---

### TASK-014: 광고주 원고 컨펌
- [ ] `api/portal/[token]/drafts/[id]/route.ts`
- [ ] `portal/[token]/drafts/page.tsx`

**Antigravity 프롬프트:**
```
광고주 포털의 원고 컨펌 페이지를 구현해줘.

/portal/[token]/drafts:
- agency_approved 상태인 원고 목록
- 각 카드: 인플루언서명, 파일 미리보기, 캡션, 업로드 예정일
- [승인] [수정 요청] 버튼
- 수정 요청 시: 피드백 입력 → 운영팀에 전달 → 운영팀이 인플루언서에게 전달

POST /api/portal/[token]/drafts/[id]:
- action: 'approve' | 'revise'
- feedback?: string
- 'approve' → status: 'client_approved'
- 'revise' → status: 'revision_requested', draft_feedbacks INSERT (author_type:'client')
- 모든 원고 client_approved 시 campaign.stage → 'uploaded'
```

---

### TASK-015: 배송 관리
- [ ] `campaigns/[id]/shipping/page.tsx`

**Antigravity 프롬프트:**
```
캠페인 상세 > [배송] 탭을 구현해줘.

- 확정된 인플루언서(status:'confirmed')의 배송지 목록 테이블
- 컬럼: 인플루언서명, 수령인, 주소, 연락처, 운송장번호(입력), 배송상태(드롭다운)
- "배송지 목록 엑셀 다운로드" 버튼 (SheetJS 사용)
- 배송 상태 변경 → campaign_influencers UPDATE
- 모든 배송 'delivered' 시 운영팀에 알림 토스트
```

---

### TASK-016: 정산 관리
- [ ] `api/invoices/route.ts`
- [ ] `api/invoices/[id]/route.ts`
- [ ] `campaigns/[id]/billing/page.tsx`
- [ ] `billing/page.tsx` (전체 정산 현황)
- [ ] `components/billing/InvoiceForm.tsx`
- [ ] `components/billing/PaymentTable.tsx`

**Antigravity 프롬프트:**
```
PROJECT_SPEC.md 섹션 9를 읽고 정산 관리를 구현해줘.

캠페인 > [정산] 탭:
- 인플루언서별 최종 단가 확인 테이블
- 소계, 대행수수료(clients.commission_rate 적용), 부가세, 총계 자동 계산
- [청구서 생성] 버튼 → InvoiceForm 모달

InvoiceForm:
- 계산된 금액 미리보기
- 발행일, 납기일 입력
- 특이사항
- [초안 저장] [PDF 생성 후 발송]

/billing 전체 정산 페이지:
- 월별 필터
- invoices 목록 (광고주, 캠페인, 총액, 상태, 발행일)
- payments 목록 (인플루언서, 지급액, 상태, 세금계산서)
```

---

## Phase 4: 이메일 & 마무리 (Week 5)

### TASK-017: 이메일 시스템
- [ ] `lib/email/index.ts` (Resend 클라이언트)
- [ ] `lib/email/templates/` (React Email 템플릿들)

**Antigravity 프롬프트:**
```
Resend + React Email로 이메일 시스템을 구현해줘.

lib/email/index.ts:
- Resend 클라이언트 초기화
- sendEmail(templateId, to, variables) 함수
- 발송 후 contact_logs INSERT

lib/email/templates/InfluencerOutreach.tsx:
- React Email 컴포넌트
- Lineup 브랜드 컬러 (#FF5A1F)
- 변수: influencer_name, campaign_name, brand_name, product_name,
  content_deadline, upload_deadline, fee, response_link

나머지 템플릿도 동일한 패턴으로 구현.
PROJECT_SPEC.md 섹션 10의 템플릿 목록 전체.
```

---

### TASK-018: 랜딩페이지 이식
- [ ] `(marketing)/page.tsx`

**Antigravity 프롬프트:**
```
design_files/ 폴더의 모든 JSX 파일을 Next.js App Router로 이식해줘.

- hero.jsx → Hero 컴포넌트
- problem.jsx → Problem 컴포넌트  
- features.jsx → Features 컴포넌트
- kanban.jsx → KanbanSection 컴포넌트
- portal.jsx → PortalSection 컴포넌트 (인터랙션 유지)
- numbers.jsx → NumbersSection 컴포넌트
- pricing.jsx → Pricing 컴포넌트
- footer.jsx → Footer 컴포넌트

(marketing)/page.tsx에서 전부 조합.
Reveal 애니메이션은 IntersectionObserver → framer-motion으로 교체.
CountUp은 react-countup 라이브러리 사용.
```

---

## 완료 체크리스트

### 기능
- [ ] 운영팀 로그인/로그아웃
- [ ] 대시보드 (메트릭 + 우선순위 큐)
- [ ] 캠페인 CRUD + 칸반 보드
- [ ] 인플루언서 DB (검색, 추가, 캠페인 연결)
- [ ] 광고주 포털 (선택 + 원고 컨펌)
- [ ] 인플루언서 링크 (수락/거절/배송지/원고제출)
- [ ] 원고 검수 플로우
- [ ] 배송 관리
- [ ] 정산 (청구서 + 지급)
- [ ] 이메일 자동 발송

### 품질
- [ ] 모바일 반응형 (포털, 인플루언서 링크)
- [ ] TypeScript 에러 0개
- [ ] 토큰 기반 접근 보안 검증
- [ ] Supabase RLS 적용 확인
- [ ] Vercel 배포 성공
