export type CampaignStage =
  | 'briefing'
  | 'search'
  | 'proposal'
  | 'selection'
  | 'outreach'
  | 'shipping'
  | 'review'
  | 'uploaded'
  | 'billing'
  | 'completed'

export type CIStatus =
  | 'candidate'
  | 'proposed'
  | 'selected'
  | 'passed'
  | 'outreached'
  | 'confirmed'
  | 'rejected'
  | 'blackout'

export type DraftStatus =
  | 'submitted'
  | 'agency_reviewing'
  | 'agency_approved'
  | 'client_reviewing'
  | 'client_approved'
  | 'revision_requested'
  | 'rejected'

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
