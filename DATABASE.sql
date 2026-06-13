-- ================================================================
-- Lineup — Supabase PostgreSQL Schema
-- Version: 1.0.0
-- Run this in Supabase SQL Editor
-- ================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- 한국어 검색 성능

-- ================================================================
-- ENUMS
-- ================================================================

CREATE TYPE campaign_stage AS ENUM (
  'briefing',
  'search',
  'proposal',
  'selection',
  'outreach',
  'shipping',
  'review',
  'uploaded',
  'billing',
  'completed'
);

CREATE TYPE campaign_goal AS ENUM (
  'awareness',
  'review',
  'conversion'
);

CREATE TYPE channel_type AS ENUM (
  'instagram',
  'youtube',
  'tiktok',
  'blog',
  'naver_tv',
  'threads'
);

CREATE TYPE influencer_gender AS ENUM (
  'female',
  'male',
  'other'
);

CREATE TYPE ci_status AS ENUM (
  'candidate',
  'proposed',
  'selected',
  'passed',
  'outreached',
  'confirmed',
  'rejected',
  'blackout'
);

CREATE TYPE shipping_status AS ENUM (
  'pending',
  'preparing',
  'shipped',
  'in_transit',
  'delivered'
);

CREATE TYPE draft_status AS ENUM (
  'submitted',
  'agency_reviewing',
  'agency_approved',
  'client_reviewing',
  'client_approved',
  'revision_requested',
  'rejected'
);

CREATE TYPE invoice_status AS ENUM (
  'draft',
  'sent',
  'paid'
);

CREATE TYPE payment_status AS ENUM (
  'pending',
  'paid'
);

CREATE TYPE contact_type AS ENUM (
  'email',
  'dm',
  'phone',
  'platform'
);

CREATE TYPE contact_direction AS ENUM (
  'outbound',
  'inbound'
);

CREATE TYPE user_role AS ENUM (
  'admin',
  'manager'
);

CREATE TYPE activity_type AS ENUM (
  'campaign_created',
  'stage_changed',
  'influencer_added',
  'influencer_status_changed',
  'outreach_sent',
  'draft_submitted',
  'draft_approved',
  'draft_revision_requested',
  'client_selected',
  'shipping_updated',
  'invoice_created',
  'payment_sent'
);

-- ================================================================
-- USERS (운영팀)
-- Supabase Auth와 연동
-- ================================================================

CREATE TABLE users (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  role          user_role NOT NULL DEFAULT 'manager',
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================================
-- CLIENTS (광고주)
-- ================================================================

CREATE TABLE clients (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name              TEXT NOT NULL,            -- "쿠쿠전자"
  industry          TEXT,                     -- "가전"
  contact_name      TEXT,                     -- "김마케터"
  contact_email     TEXT,
  contact_phone     TEXT,
  commission_rate   DECIMAL(4,3) NOT NULL DEFAULT 0.150, -- 15%
  notes             TEXT,
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================================
-- INFLUENCERS (인플루언서 DB)
-- ================================================================

CREATE TABLE influencers (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- 기본 정보
  name            TEXT NOT NULL,
  handle          TEXT,                       -- "@cookingmom_j"
  email           TEXT,
  phone           TEXT,
  gender          influencer_gender,
  region          TEXT DEFAULT '서울',        -- "서울", "부산", etc.
  bio             TEXT,

  -- 채널 정보 (JSONB for flexibility)
  -- 예: {"instagram": "https://...", "youtube": "https://..."}
  channel_urls    JSONB NOT NULL DEFAULT '{}',
  -- 예: {"instagram": 124000, "youtube": 82000}
  followers       JSONB NOT NULL DEFAULT '{}',
  -- 예: {"instagram": 2300, "youtube": 45000}
  avg_engagement  JSONB NOT NULL DEFAULT '{}',

  -- 분류
  primary_channel channel_type,
  categories      TEXT[] NOT NULL DEFAULT '{}', -- ["푸드", "요리", "리빙"]
  past_brands     TEXT[] NOT NULL DEFAULT '{}', -- ["삼성", "LG", "쿠쿠"]

  -- 단가
  fee_min         INTEGER,                    -- 원 단위
  fee_max         INTEGER,

  -- 운영 메타
  response_rate   DECIMAL(3,2) DEFAULT 0.80, -- 0.00 ~ 1.00
  collab_count    INTEGER NOT NULL DEFAULT 0, -- 총 협업 횟수
  is_blacklisted  BOOLEAN NOT NULL DEFAULT FALSE,
  blacklist_reason TEXT,

  -- 미디어킷 파일 URL (Supabase Storage)
  media_kit_url   TEXT,
  notes           TEXT,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 검색 성능을 위한 인덱스
CREATE INDEX idx_influencers_name_trgm ON influencers USING GIN (name gin_trgm_ops);
CREATE INDEX idx_influencers_handle_trgm ON influencers USING GIN (handle gin_trgm_ops);
CREATE INDEX idx_influencers_categories ON influencers USING GIN (categories);
CREATE INDEX idx_influencers_primary_channel ON influencers (primary_channel);
CREATE INDEX idx_influencers_blacklist ON influencers (is_blacklisted);

-- ================================================================
-- CAMPAIGNS (캠페인)
-- ================================================================

CREATE TABLE campaigns (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id             UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  assignee_id           UUID REFERENCES users(id) ON DELETE SET NULL,

  -- 기본 정보
  name                  TEXT NOT NULL,        -- "쿠쿠전자 전기밥솥 F/W 캠페인"
  product_name          TEXT NOT NULL,
  product_description   TEXT,
  goal                  campaign_goal NOT NULL DEFAULT 'review',

  -- 타겟 채널 & 인플루언서
  channels              channel_type[] NOT NULL DEFAULT '{}',
  influencer_count_target INTEGER NOT NULL DEFAULT 5,
  categories            TEXT[] NOT NULL DEFAULT '{}',

  -- 콘텐츠 가이드
  brief                 TEXT,
  restrictions          TEXT,                 -- 금지사항

  -- 예산 (내부 참고용)
  budget                INTEGER,              -- 원 단위

  -- 일정
  ship_date             DATE,
  content_deadline      DATE,
  upload_deadline       DATE,

  -- 파이프라인 상태
  stage                 campaign_stage NOT NULL DEFAULT 'briefing',

  -- 외부 접근 토큰
  portal_token          UUID NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
  -- 생성 즉시 포털 링크: /portal/[portal_token]

  -- 첨부파일 URLs (Supabase Storage)
  attachment_urls       TEXT[] NOT NULL DEFAULT '{}',

  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_campaigns_client ON campaigns (client_id);
CREATE INDEX idx_campaigns_stage ON campaigns (stage);
CREATE INDEX idx_campaigns_assignee ON campaigns (assignee_id);
CREATE INDEX idx_campaigns_portal_token ON campaigns (portal_token);
CREATE INDEX idx_campaigns_upload_deadline ON campaigns (upload_deadline);

-- ================================================================
-- CAMPAIGN_INFLUENCERS (캠페인-인플루언서 연결)
-- 핵심 조인 테이블
-- ================================================================

CREATE TABLE campaign_influencers (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id       UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  influencer_id     UUID NOT NULL REFERENCES influencers(id) ON DELETE RESTRICT,

  -- 상태 관리
  status            ci_status NOT NULL DEFAULT 'candidate',

  -- 단가
  proposed_fee      INTEGER,                  -- 제안 단가
  final_fee         INTEGER,                  -- 최종 확정 단가

  -- 운영팀 코멘트 (광고주 보고서에 노출)
  agency_comment    TEXT,

  -- 거절 사유
  rejection_reason  TEXT,

  -- 외부 접근 토큰 (인플루언서 전용 링크)
  access_token      UUID NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
  -- 인플루언서 링크: /inf/[access_token]

  -- 배송 정보
  shipping_address  JSONB,
  -- {
  --   recipient_name: "홍길동",
  --   phone: "010-1234-5678",
  --   zipcode: "04780",
  --   address1: "서울 성동구 연무장19길 3",
  --   address2: "5층",
  --   delivery_note: "문앞에 놔주세요"
  -- }
  tracking_number   TEXT,
  shipping_status   shipping_status NOT NULL DEFAULT 'pending',
  shipped_at        TIMESTAMPTZ,
  delivered_at      TIMESTAMPTZ,

  -- 업로드 정보
  upload_url        TEXT,                     -- 실제 업로드된 콘텐츠 URL
  uploaded_at       TIMESTAMPTZ,

  -- 성과 데이터 (수동 입력)
  performance       JSONB DEFAULT '{}',
  -- {
  --   views: 45000,
  --   likes: 2300,
  --   comments: 180,
  --   saves: 430,
  --   reach: 38000
  -- }

  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(campaign_id, influencer_id)
);

CREATE INDEX idx_ci_campaign ON campaign_influencers (campaign_id);
CREATE INDEX idx_ci_influencer ON campaign_influencers (influencer_id);
CREATE INDEX idx_ci_status ON campaign_influencers (status);
CREATE INDEX idx_ci_access_token ON campaign_influencers (access_token);

-- ================================================================
-- DRAFTS (원고)
-- ================================================================

CREATE TABLE drafts (
  id                        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_influencer_id    UUID NOT NULL REFERENCES campaign_influencers(id) ON DELETE CASCADE,

  -- 버전 관리
  version                   INTEGER NOT NULL DEFAULT 1,

  -- 원고 내용
  file_urls                 TEXT[] NOT NULL DEFAULT '{}', -- Supabase Storage URLs
  caption                   TEXT,
  hashtags                  TEXT,
  planned_upload_at         TIMESTAMPTZ,
  note                      TEXT,

  -- 상태
  status                    draft_status NOT NULL DEFAULT 'submitted',

  submitted_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(campaign_influencer_id, version)
);

CREATE INDEX idx_drafts_ci ON drafts (campaign_influencer_id);
CREATE INDEX idx_drafts_status ON drafts (status);

-- ================================================================
-- DRAFT_FEEDBACKS (원고 피드백)
-- ================================================================

CREATE TABLE draft_feedbacks (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  draft_id      UUID NOT NULL REFERENCES drafts(id) ON DELETE CASCADE,
  author_type   TEXT NOT NULL CHECK (author_type IN ('agency', 'client')),
  author_name   TEXT,                         -- 운영팀이면 users.name, 광고주이면 clients.contact_name
  content       TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_feedbacks_draft ON draft_feedbacks (draft_id);

-- ================================================================
-- INVOICES (청구서)
-- ================================================================

CREATE TABLE invoices (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id       UUID NOT NULL REFERENCES campaigns(id) ON DELETE RESTRICT,
  client_id         UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,

  -- 금액 계산
  line_items        JSONB NOT NULL DEFAULT '[]',
  -- [
  --   {influencer_name: "쿠킹맘제이", channel: "instagram", fee: 800000},
  --   ...
  -- ]
  subtotal          INTEGER NOT NULL,         -- 인플루언서 비용 합계
  commission_rate   DECIMAL(4,3) NOT NULL,    -- 청구 시점 수수료율
  commission        INTEGER NOT NULL,         -- 대행 수수료
  vat               INTEGER NOT NULL,         -- 부가세
  total             INTEGER NOT NULL,         -- 최종 청구액

  status            invoice_status NOT NULL DEFAULT 'draft',
  pdf_url           TEXT,                     -- 생성된 PDF Supabase Storage URL

  issued_at         DATE,
  due_date          DATE,
  paid_at           DATE,

  notes             TEXT,

  created_by        UUID REFERENCES users(id),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_invoices_campaign ON invoices (campaign_id);
CREATE INDEX idx_invoices_client ON invoices (client_id);
CREATE INDEX idx_invoices_status ON invoices (status);

-- ================================================================
-- PAYMENTS (인플루언서 지급)
-- ================================================================

CREATE TABLE payments (
  id                        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_influencer_id    UUID NOT NULL REFERENCES campaign_influencers(id) ON DELETE RESTRICT,
  invoice_id                UUID REFERENCES invoices(id) ON DELETE SET NULL,

  amount                    INTEGER NOT NULL,
  status                    payment_status NOT NULL DEFAULT 'pending',
  tax_invoice_received      BOOLEAN NOT NULL DEFAULT FALSE,

  paid_at                   DATE,
  notes                     TEXT,

  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_ci ON payments (campaign_influencer_id);
CREATE INDEX idx_payments_status ON payments (status);

-- ================================================================
-- CONTACT_LOGS (컨택 이력)
-- ================================================================

CREATE TABLE contact_logs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  influencer_id   UUID NOT NULL REFERENCES influencers(id) ON DELETE CASCADE,
  campaign_id     UUID REFERENCES campaigns(id) ON DELETE SET NULL,

  type            contact_type NOT NULL DEFAULT 'email',
  direction       contact_direction NOT NULL DEFAULT 'outbound',
  subject         TEXT,
  body            TEXT,
  template_id     TEXT,                       -- 사용된 이메일 템플릿 ID

  sent_by         UUID REFERENCES users(id) ON DELETE SET NULL,
  sent_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contact_logs_influencer ON contact_logs (influencer_id);
CREATE INDEX idx_contact_logs_campaign ON contact_logs (campaign_id);

-- ================================================================
-- ACTIVITY_LOGS (캠페인 타임라인)
-- ================================================================

CREATE TABLE activity_logs (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id   UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,

  type          activity_type NOT NULL,
  actor_type    TEXT NOT NULL CHECK (actor_type IN ('agency', 'client', 'influencer', 'system')),
  actor_name    TEXT,
  description   TEXT NOT NULL,
  metadata      JSONB DEFAULT '{}',           -- 추가 컨텍스트

  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_activity_campaign ON activity_logs (campaign_id);
CREATE INDEX idx_activity_created ON activity_logs (created_at DESC);

-- ================================================================
-- EMAIL_TEMPLATES (이메일 템플릿 설정)
-- ================================================================

CREATE TABLE email_templates (
  id            TEXT PRIMARY KEY,             -- 'influencer_outreach' 등
  name          TEXT NOT NULL,
  subject       TEXT NOT NULL,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 기본 템플릿 데이터 삽입
INSERT INTO email_templates (id, name, subject) VALUES
  ('influencer_outreach', '인플루언서 섭외 연락', '[{{brand_name}}] 협찬 제안 드립니다'),
  ('influencer_revision_request', '원고 수정 요청', '[{{campaign_name}}] 원고 수정 요청입니다'),
  ('influencer_shipping_reminder', '배송 수령 후 리마인드', '[{{brand_name}}] 제품을 받으셨나요?'),
  ('influencer_deadline_reminder', '원고 마감 리마인드', '[{{campaign_name}}] 원고 제출 마감이 7일 남았습니다'),
  ('client_proposal_ready', '광고주 보고 준비 완료', '[{{campaign_name}}] 인플루언서 후보를 검토해주세요'),
  ('client_draft_review', '광고주 원고 검토 요청', '[{{campaign_name}}] 원고 검토 요청드립니다'),
  ('client_invoice', '광고주 청구서 발송', '[{{campaign_name}}] 청구서를 첨부합니다'),
  ('team_campaign_created', '캠페인 생성 알림', '[Lineup] 새 캠페인이 생성되었습니다'),
  ('team_urgent_alert', '긴급 처리 필요 알림', '[Lineup] ⚠️ 처리 필요 캠페인이 있습니다');

-- ================================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================================

-- 운영팀만 접근 가능한 테이블들
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE draft_feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- 운영팀 (로그인 사용자) 전체 접근 정책
CREATE POLICY "agency_full_access" ON clients FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "agency_full_access" ON campaigns FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "agency_full_access" ON influencers FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "agency_full_access" ON campaign_influencers FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "agency_full_access" ON drafts FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "agency_full_access" ON draft_feedbacks FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "agency_full_access" ON invoices FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "agency_full_access" ON payments FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "agency_full_access" ON contact_logs FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "agency_full_access" ON activity_logs FOR ALL TO authenticated USING (TRUE);

-- 외부 접근 (포털/인플루언서 링크)은 API Route에서 service_role key로 처리
-- anon은 직접 테이블 접근 불가

-- ================================================================
-- FUNCTIONS & TRIGGERS
-- ================================================================

-- updated_at 자동 갱신 함수
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 모든 테이블에 updated_at 트리거 적용
CREATE TRIGGER trg_users_updated BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_clients_updated BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_campaigns_updated BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_influencers_updated BEFORE UPDATE ON influencers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_ci_updated BEFORE UPDATE ON campaign_influencers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_invoices_updated BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_payments_updated BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 인플루언서 협업 횟수 자동 증가
CREATE OR REPLACE FUNCTION increment_collab_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
    UPDATE influencers
    SET collab_count = collab_count + 1
    WHERE id = NEW.influencer_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_collab_count
AFTER UPDATE ON campaign_influencers
FOR EACH ROW EXECUTE FUNCTION increment_collab_count();

-- 캠페인 스테이지 변경 시 activity_log 자동 기록
CREATE OR REPLACE FUNCTION log_stage_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.stage != OLD.stage THEN
    INSERT INTO activity_logs (campaign_id, type, actor_type, actor_name, description, metadata)
    VALUES (
      NEW.id,
      'stage_changed',
      'system',
      'Lineup',
      format('스테이지 변경: %s → %s', OLD.stage, NEW.stage),
      jsonb_build_object('from', OLD.stage, 'to', NEW.stage)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_campaign_stage_log
AFTER UPDATE ON campaigns
FOR EACH ROW EXECUTE FUNCTION log_stage_change();

-- ================================================================
-- VIEWS (자주 쓰는 쿼리 뷰)
-- ================================================================

-- 대시보드 우선순위 큐 뷰
CREATE OR REPLACE VIEW priority_campaigns AS
SELECT
  c.id,
  c.name AS campaign_name,
  cl.name AS client_name,
  c.stage,
  c.content_deadline,
  c.upload_deadline,
  c.assignee_id,
  u.name AS assignee_name,
  -- 마감 긴급도 계산
  LEAST(
    COALESCE(c.content_deadline - CURRENT_DATE, 999),
    COALESCE(c.upload_deadline - CURRENT_DATE, 999)
  ) AS days_until_deadline
FROM campaigns c
JOIN clients cl ON c.client_id = cl.id
LEFT JOIN users u ON c.assignee_id = u.id
WHERE c.stage NOT IN ('billing', 'completed')
ORDER BY days_until_deadline ASC;

-- 인플루언서 협업 상태 요약 뷰
CREATE OR REPLACE VIEW influencer_stats AS
SELECT
  i.id,
  i.name,
  i.handle,
  i.primary_channel,
  i.collab_count,
  i.response_rate,
  i.is_blacklisted,
  COUNT(ci.id) AS total_campaigns,
  COUNT(CASE WHEN ci.status = 'confirmed' THEN 1 END) AS confirmed_campaigns,
  AVG(ci.final_fee) AS avg_final_fee
FROM influencers i
LEFT JOIN campaign_influencers ci ON i.id = ci.influencer_id
GROUP BY i.id;

-- 월별 매출 집계 뷰
CREATE OR REPLACE VIEW monthly_revenue AS
SELECT
  DATE_TRUNC('month', inv.issued_at) AS month,
  cl.name AS client_name,
  COUNT(inv.id) AS invoice_count,
  SUM(inv.total) AS total_revenue,
  SUM(inv.commission) AS total_commission
FROM invoices inv
JOIN clients cl ON inv.client_id = cl.id
WHERE inv.status = 'paid'
GROUP BY DATE_TRUNC('month', inv.issued_at), cl.name
ORDER BY month DESC;

-- ================================================================
-- SEED DATA (초기 데이터)
-- ================================================================

-- 광고주 샘플
INSERT INTO clients (name, industry, contact_name, contact_email, commission_rate) VALUES
  ('쿠쿠전자', '가전', '김마케터', 'marketing@cuckoo.co.kr', 0.150),
  ('라운드미디어 테스트', '광고대행', '라하', 'laha@roundmedia.kr', 0.100);

-- ================================================================
-- 완료
-- ================================================================
-- 다음 단계:
-- 1. Supabase Dashboard > SQL Editor에서 이 파일 실행
-- 2. Authentication > Invite 기능으로 첫 번째 운영팀 계정 생성
-- 3. npm run dev 후 /dashboard 접근
-- ================================================================

-- ================================================================
-- PHASE 2 대비 컬럼 추가 (Phase 1에서는 NULL/기본값 유지)
-- ================================================================

-- influencers: 셀프 가입 & 공개 프로필 대비
ALTER TABLE influencers
  ADD COLUMN IF NOT EXISTS auth_user_id  UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS is_public     BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS is_verified   BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS joined_at     TIMESTAMPTZ;

-- clients: 셀프서비스 광고주 직접 로그인 대비
ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS auth_user_id  UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS plan_type     TEXT NOT NULL DEFAULT 'agency_managed';
  -- plan_type: 'agency_managed' | 'self_serve'

-- agencies: Phase 2A 멀티테넌트 대비 (지금은 라운드미디어 1개)
CREATE TABLE IF NOT EXISTS agencies (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL DEFAULT '(주)라운드미디어',
  slug            TEXT NOT NULL DEFAULT 'roundmedia' UNIQUE,
  plan            TEXT NOT NULL DEFAULT 'internal',
  -- plan: 'internal' | 'starter' | 'growth' | 'scale' | 'enterprise'
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 기본 agency 데이터 (라운드미디어)
INSERT INTO agencies (name, slug, plan) VALUES
  ('(주)라운드미디어', 'roundmedia', 'internal')
ON CONFLICT (slug) DO NOTHING;

-- users 테이블에 agency 연결 컬럼 추가
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS agency_id UUID REFERENCES agencies(id);

-- campaigns 테이블에 agency 연결 컬럼 추가 (멀티테넌트 격리용)
ALTER TABLE campaigns
  ADD COLUMN IF NOT EXISTS agency_id UUID REFERENCES agencies(id);

-- ================================================================
-- Phase 2 수익 모델 대비: subscription & transaction_fees 테이블
-- (Phase 1에서는 사용하지 않음. 구조만 심어둠)
-- ================================================================

CREATE TABLE IF NOT EXISTS subscriptions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id       UUID REFERENCES agencies(id),
  client_id       UUID REFERENCES clients(id),
  plan            TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'active',
  -- status: 'active' | 'cancelled' | 'past_due'
  billing_cycle   TEXT NOT NULL DEFAULT 'monthly',
  -- billing_cycle: 'monthly' | 'yearly'
  amount          INTEGER NOT NULL,
  toss_billing_key TEXT,              -- 토스페이먼츠 자동결제 키
  started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  next_billing_at TIMESTAMPTZ,
  cancelled_at    TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS transaction_fees (
  id                        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_influencer_id    UUID REFERENCES campaign_influencers(id),
  base_amount               INTEGER NOT NULL, -- 인플루언서 지급액
  fee_rate                  DECIMAL(4,3),     -- 수수료율 (예: 0.05 = 5%)
  fee_amount                INTEGER NOT NULL, -- 플랫폼 수수료
  status                    TEXT NOT NULL DEFAULT 'pending',
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================================
-- 완료 (Phase 2 대비 구조 추가)
-- ================================================================
