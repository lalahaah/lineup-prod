export type CampaignStage =
  | 'preparing'     // 준비중 (캠페인 생성 ~ 인플루언서 리스트업)
  | 'client_review' // 광고주 검토 (포털 링크 전달 후)
  | 'outreaching'   // 섭외중 (광고주 선택 후 인플루언서 연락)
  | 'reviewing'     // 원고검수
  | 'done'          // 정산완료

export const STAGE_LABELS: Record<CampaignStage, string> = {
  preparing: '준비중',
  client_review: '광고주 검토',
  outreaching: '섭외중',
  reviewing: '원고 검수',
  done: '정산완료',
}

export const STAGE_COLORS: Record<CampaignStage, string> = {
  preparing: '#C9C9D0',
  client_review: '#FFD27A',
  outreaching: '#9FC0FF',
  reviewing: '#FF8A7A',
  done: '#9FE0A8',
}

export type CIStatus =
  | 'candidate'   // 후보 (운영팀이 추가)
  | 'selected'    // 광고주 선택
  | 'passed'      // 광고주 패스
  | 'confirmed'   // 섭외 확정 (인플루언서 수락)
  | 'rejected'    // 거절 (인플루언서 거절)

export const CI_STATUS_LABELS: Record<CIStatus, string> = {
  candidate: '후보',
  selected: '광고주 선택',
  passed: '광고주 패스',
  confirmed: '섭외 확정',
  rejected: '거절',
}

export type DraftStatus =
  | 'submitted'
  | 'agency_reviewing'
  | 'agency_approved'
  | 'client_reviewing'
  | 'client_approved'
  | 'revision_requested'
  | 'rejected'

export interface Client {
  id: string
  created_at: string
  name: string
  commission_rate: number
  plan_type: string
}

export interface Campaign {
  id: string
  created_at: string
  title: string
  client_id: string
  stage: CampaignStage
  portal_token: string
  ship_date: string | null
  content_deadline: string | null
  upload_deadline: string | null
}

export interface Influencer {
  id: string
  created_at: string
  name: string
  handle: string
  followers: number
  fee: number
  categories: string[]
  auth_user_id: string | null
  is_public: boolean | null
  is_verified: boolean | null
}

export interface CampaignInfluencer {
  id: string
  created_at: string
  campaign_id: string
  influencer_id: string
  status: CIStatus
  access_token: string
  agreed_fee: number
  shipping_address: any | null
}

export interface Draft {
  id: string
  created_at: string
  campaign_influencer_id: string
  version: number
  status: DraftStatus
  caption: string | null
  hashtags: string | null
  scheduled_date: string | null
}

export interface InfluencerItem {
  id: string
  created_at?: string
  name: string
  handle: string
  avatar_initial: string
  avatar_color_class: string
  channel: 'instagram' | 'youtube' | 'tiktok' | string
  channel_label: string
  category: string
  followers: number
  followers_formatted: string
  engagement_rate: number
  engagement_rate_formatted: string
  fee: number
  fee_formatted: string
  status: 'candidate' | 'uncontacted' | 'blacklisted' | string
  status_label: string
  is_blacklisted: boolean
}
