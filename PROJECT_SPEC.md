# PROJECT_SPEC.md — Lineup 기능 명세 v1.0

> 이 문서는 MVP 범위의 모든 기능을 코드 수준으로 정의한다.
> Gemini가 컴포넌트 또는 API를 생성할 때 이 스펙을 기준으로 한다.

---

## MVP 범위 (Phase 1)

### IN SCOPE ✅
- 운영팀 대시보드
- 캠페인 CRUD + 9단계 파이프라인 관리
- 인플루언서 DB (검색, 필터, 프로필, 컨택 이력)
- 광고주 포털 (토큰 링크, 인플루언서 선택, 원고 컨펌)
- 인플루언서 링크 (수락/거절, 배송지 입력, 원고 제출)
- 원고 검수 플로우 (버전 관리, 피드백)
- 이메일 발송 (Resend, 템플릿 기반)
- 정산 관리 (청구서 생성, 지급 관리)

### OUT OF SCOPE ❌ (Phase 2)
- 구독 결제 (토스페이먼츠)
- 성과 데이터 자동 수집 API
- 화이트라벨 멀티테넌트
- 모바일 앱

---

## 1. 인증 & 권한

### 1-1. 운영팀 로그인
- Supabase Auth (이메일 + 비밀번호)
- 초대 기반 가입 (외부 가입 불가)
- 역할: `admin`, `manager`

### 1-2. 광고주 포털 접근
```
GET /portal/[token]
- token: campaigns.portal_token (UUID)
- 만료: 없음 (캠페인 stage = 'billing' 이후 읽기 전용)
- 허용 액션: 인플루언서 선택, 원고 승인/수정 요청
```

### 1-3. 인플루언서 링크 접근
```
GET /inf/[token]
- token: campaign_influencers.access_token (UUID)
- 허용 액션: 수락/거절, 배송지 입력, 원고 제출
```

---

## 2. 대시보드

### 화면 구성
```
┌─ 상단 메트릭 카드 (4개) ─────────────────────────────┐
│  진행 캠페인 | 원고 대기 | 배송 대기 | 이번달 매출     │
└───────────────────────────────────────────────────────┘
┌─ 오늘 처리 필요 (우선순위 큐) ───────────────────────┐
│  마감 임박 순 정렬, 스테이지별 컬러 코딩               │
│  → 클릭 시 해당 캠페인 상세로 이동                    │
└───────────────────────────────────────────────────────┘
┌─ 최근 활동 피드 ──────────────────────────────────────┐
│  실시간 업데이트: 광고주 선택 완료, 원고 제출 등        │
└───────────────────────────────────────────────────────┘
```

### API
```typescript
// GET /api/dashboard/summary
interface DashboardSummary {
  activeCampaigns: number
  pendingDrafts: number          // review 스테이지
  pendingShipments: number       // shipping 스테이지
  monthlyRevenue: number         // 이번달 청구 완료 합계
  priorityQueue: PriorityItem[]  // 마감 D-3 이내 캠페인
  recentActivities: Activity[]   // 최근 20개
}
```

---

## 3. 캠페인 관리

### 3-1. 캠페인 목록

**뷰 모드:** 칸반 보드 (기본) / 리스트

**칸반:**
- 컬럼 = 9개 스테이지
- 카드: 캠페인명, 광고주, 담당자 아바타, 마감일, 인플루언서 수
- 드래그 앤 드롭으로 스테이지 이동

**리스트:**
- 컬럼: 캠페인명, 광고주, 스테이지, 담당자, 인플루언서 수, 마감일, 매출

**필터:** 광고주, 스테이지, 담당자, 날짜 범위

### 3-2. 캠페인 생성 폼

```typescript
interface CampaignCreateInput {
  client_id: string
  name: string                    // 캠페인명
  product_name: string
  product_description: string
  goal: 'awareness' | 'review' | 'conversion'
  channels: Channel[]             // instagram | youtube | tiktok | blog
  influencer_count_target: number
  categories: Category[]
  brief: string                   // 콘텐츠 방향성
  restrictions: string            // 금지사항
  budget?: number                 // 내부 참고용
  ship_date: Date
  content_deadline: Date
  upload_deadline: Date
  assignee_id: string
  attachments?: File[]            // 제품 이미지, 브리핑 문서
}
```

생성 즉시:
- `portal_token` UUID 자동 생성 및 저장
- 담당자에게 이메일 알림 발송

### 3-3. 캠페인 상세

탭 구조:
```
[개요] [인플루언서] [원고 검수] [배송] [정산] [타임라인]
```

**개요 탭:**
- 캠페인 기본 정보 표시 + 편집
- 스테이지 수동 변경 가능
- 광고주 포털 링크 복사 버튼

**타임라인 탭:**
- 모든 상태 변경, 이메일 발송, 원고 제출 이력
- 시간순 역순 정렬

---

## 4. 인플루언서 DB

### 4-1. 검색 & 필터

```typescript
interface InfluencerSearchParams {
  q?: string                      // 이름, 핸들 검색
  channels?: Channel[]
  followers_min?: number
  followers_max?: number
  categories?: Category[]
  region?: string
  gender?: 'male' | 'female' | 'other'
  collaborated?: boolean          // 과거 협업 여부
  response_rate_min?: number      // 0.0 ~ 1.0
  fee_min?: number
  fee_max?: number
  exclude_blacklist?: boolean     // 기본 true
}
```

### 4-2. 인플루언서 프로필 카드 (리스트)

```
[아바타] [이름] [핸들]          [팔로워] [참여율] [단가범위]
         [카테고리 태그들]       [채널 아이콘들]
         [과거 협업 브랜드]      [응답률] [협업 횟수]
                                          [+ 추가] [프로필 보기]
```

### 4-3. 인플루언서 상세 페이지

- 기본 정보 편집
- 채널별 지표 (팔로워, 평균 조회수, 참여율)
- 과거 협업 이력 (캠페인 링크 포함)
- 컨택 이력 전체 (이메일, DM 발송 기록)
- 블랙리스트 처리 버튼 + 사유 입력

### 4-4. 캠페인에 후보 추가

인플루언서 목록에서 "캠페인에 추가" 클릭:
- 캠페인 선택 드롭다운 (진행 중인 캠페인만)
- 제안 단가 입력
- 운영팀 코멘트 입력
- 추가 즉시 `campaign_influencers` 레코드 생성 (status: `candidate`)

---

## 5. 광고주 포털 (/portal/[token])

### 5-1. 인플루언서 선택 화면

**접근:** 토큰 검증 → 캠페인 stage가 `proposal` 이상일 때만 활성화

**화면 구성:**
```
[캠페인 헤더: 캠페인명, 광고주명, 안내 문구]
[인플루언서 카드 그리드]
  각 카드:
  - 채널 종류 배지 (Instagram / YouTube / Blog)
  - 이름 + 핸들
  - 팔로워 수 + 참여율
  - 카테고리
  - 예상 단가
  - 운영팀 추천 코멘트
  - [선택] [패스] 버튼
[하단 제출 바: X명 선택 · Y명 패스 · [선택 완료 제출]]
```

**제출 처리:**
```typescript
// POST /api/portal/[token]/select
interface SelectionSubmit {
  selections: { influencer_id: string; action: 'select' | 'pass' }[]
}
// → campaign_influencers.status 업데이트
// → 운영팀에 이메일 알림
// → campaign.stage → 'selection' 자동 변경
```

### 5-2. 원고 컨펌 화면

**접근:** 해당 캠페인에 `agency_approved` 상태의 원고가 있을 때

```
[인플루언서별 원고 카드]
  - 파일 미리보기 (이미지/영상 썸네일)
  - 캡션 초안
  - 해시태그
  - 업로드 예정일
  [승인] [수정 요청] 버튼

수정 요청 시:
  - 수정 내용 텍스트 입력 모달
  - 제출 → 운영팀 알림 → 인플루언서에게 전달
```

---

## 6. 인플루언서 링크 (/inf/[token])

### 6-1. 캠페인 안내 + 수락/거절

**화면 구성:**
```
[브랜드명] 협찬 제안입니다.

캠페인명: [캠페인명]
제품: [제품명 + 설명]
채널: [요청 채널]
원고 제출 마감: [날짜]
업로드 예정일: [날짜]
제안 단가: [금액]원

콘텐츠 가이드:
[brief 내용]

금지사항:
[restrictions 내용]

[수락하기] [거절하기] [조건 협의 요청]
```

**수락 처리:**
```typescript
// POST /api/inf/[token]/response
interface InfResponse {
  action: 'accept' | 'reject' | 'negotiate'
  rejection_reason?: string
  negotiation_message?: string
}
// 수락 → status: 'confirmed' → 배송지 입력 화면으로 이동
// 거절 → status: 'rejected' → 운영팀 알림
```

### 6-2. 배송지 입력

수락 후 바로 노출되는 폼:
```typescript
interface ShippingAddress {
  recipient_name: string
  phone: string
  zipcode: string
  address1: string
  address2: string
  delivery_note?: string
}
```

제출 즉시 운영팀에 "배송지 수집 완료" 알림.

### 6-3. 원고 제출

```typescript
interface DraftSubmit {
  files: File[]                   // 이미지/영상
  caption: string                 // 캡션 초안
  hashtags: string                // 해시태그
  planned_upload_at: Date         // 업로드 예정일
  note?: string                   // 특이사항
}
```

제출 즉시:
- `drafts` 테이블에 version 1로 저장
- status: `submitted`
- 운영팀에 이메일 알림

---

## 7. 원고 검수 플로우 (운영팀)

### 7-1. 검수 화면 구성

```
[인플루언서명] [제출일시] [버전: v1]

[파일 미리보기]

[캡션]
  [텍스트 에디터로 표시]

[해시태그]

[운영팀 피드백 입력]
  [피드백 텍스트]

[승인] [수정 요청] [반려]
```

**승인 처리:**
- status: `agency_approved`
- campaign.stage가 아직 `review`면 유지
- 모든 인플루언서 원고가 `agency_approved` 이상이면 → 광고주 포털에 알림

**수정 요청 처리:**
- 피드백 저장 (`draft_feedbacks`)
- status: `revision_requested`
- 인플루언서에게 이메일 자동 발송 (수정 내용 포함)
- 인플루언서가 재제출 → version +1로 새 `drafts` 레코드

### 7-2. 버전 히스토리

- 모든 버전의 파일 + 피드백 보존
- 운영팀 화면에서 버전 탭으로 전환 가능

---

## 8. 배송 관리

### 배송 현황 화면

```typescript
// 캠페인 상세 > 배송 탭
interface ShippingItem {
  influencer_name: string
  handle: string
  address: ShippingAddress
  shipping_status: 'pending' | 'shipped' | 'in_transit' | 'delivered'
  tracking_number?: string
  shipped_at?: Date
  delivered_at?: Date
}
```

**기능:**
- 배송지 목록 엑셀 다운로드 (운송장 번호 입력용)
- 운송장 번호 일괄 입력
- 배송 상태 수동 변경
- 수령 확인 시 인플루언서에게 자동 리마인드 이메일 발송

---

## 9. 정산 관리

### 9-1. 광고주 청구서 생성

캠페인 완료(stage: `billing`) 시 운영팀이 생성:

```typescript
interface InvoiceLineItem {
  influencer_name: string
  channel: string
  fee: number
}

interface Invoice {
  campaign_id: string
  client_id: string
  line_items: InvoiceLineItem[]
  subtotal: number               // 인플루언서 합계
  commission: number             // 대행수수료 (subtotal × commission_rate)
  vat: number                    // 부가세 10%
  total: number
  status: 'draft' | 'sent' | 'paid'
}
```

**청구서 PDF 자동 생성:**
- React-PDF로 서버 사이드 렌더링
- Supabase Storage `invoices/` 버킷에 저장
- 이메일 첨부 발송 or 링크 공유

### 9-2. 인플루언서 지급 목록

```
[인플루언서명] [캠페인명] [지급액] [세금계산서 수취] [지급 상태] [지급일]
```

- 월별 필터
- 지급 상태 일괄 변경
- 연간 지급 합계 (1,000만원 이상 세무 관리용)
- 지급 내역 엑셀 다운로드

---

## 10. 이메일 템플릿 목록

| 템플릿 ID | 발송 시점 | 수신자 |
|---|---|---|
| `influencer_outreach` | 섭외 연락 발송 | 인플루언서 |
| `influencer_response_accept` | 수락 확인 | 운영팀 |
| `influencer_response_reject` | 거절 확인 | 운영팀 |
| `influencer_shipping_reminder` | 배송 수령 후 D+1 | 인플루언서 |
| `influencer_deadline_reminder` | 원고 마감 D-7 | 인플루언서 |
| `influencer_revision_request` | 수정 요청 | 인플루언서 |
| `client_proposal_ready` | 광고주 보고 준비 완료 | 광고주 담당자 |
| `client_selection_confirmed` | 선택 완료 감사 | 운영팀 |
| `client_draft_review` | 원고 검토 요청 | 광고주 담당자 |
| `client_invoice` | 청구서 발송 | 광고주 담당자 |
| `team_campaign_created` | 캠페인 생성 | 담당 매니저 |
| `team_urgent_alert` | D-3 이내 처리 필요 | 운영팀 전체 |

---

## 11. 주요 비즈니스 로직

### 캠페인 스테이지 자동 전환 규칙

```
proposal 보고 생성 완료
  → (수동) 운영팀이 광고주에게 포털 링크 공유
  → 광고주 선택 제출 → selection 자동 전환

selection → outreach: 수동 전환 (운영팀)

outreach → shipping:
  확정된 인플루언서 전원이 status = 'confirmed' 이고
  배송지 수집 완료 시 자동 전환 가능 (운영팀 확인 버튼)

shipping → review:
  모든 인플루언서 shipping_status = 'delivered' 시 자동 알림
  (수동 전환)

review → uploaded:
  모든 원고가 client_approved 상태 시 자동 전환

uploaded → billing:
  수동 전환 (운영팀)
```

### 대행 수수료 계산

```typescript
// clients.commission_rate 기본값: 0.15 (15%)
const commission = subtotal * client.commission_rate
const vat = (subtotal + commission) * 0.10
const total = subtotal + commission + vat
```
