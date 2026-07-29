import { NextResponse, NextRequest } from 'next/server'
import type { CampaignStage } from '@/types'

export interface CampaignDetailData {
  id: string
  title: string
  client: string
  stage: CampaignStage
  assignee: string
  influencer_count: number
  approved_count: number
  content_deadline: string
  dday: string
  dday_variant: 'hot' | 'warm' | 'default'
  portal_token: string
  product_name: string
  channels_text: string
  post_period: string
  hashtags: string[]
}

const MOCK_CAMPAIGN_DETAIL: CampaignDetailData = {
  id: 'camp-8',
  title: '쿠쿠 트윈프레셔 신제품 런칭',
  client: 'CUCKOO',
  stage: 'review',
  assignee: '김현우',
  influencer_count: 5,
  approved_count: 3,
  content_deadline: '06.08 (D-2)',
  dday: '마감 D-2',
  dday_variant: 'hot',
  portal_token: 'mock-portal-token-001',
  product_name: '쿠쿠 트윈프레셔 IH',
  channels_text: '인스타 릴스 / 유튜브',
  post_period: '06.10 ~ 06.20',
  hashtags: ['# 신혼집밥', '# 쿠쿠트윈프레셔', '필수 태그 2개'],
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // 요청된 id로 데이터 반환 (없으면 기본 mock)
  const data = {
    ...MOCK_CAMPAIGN_DETAIL,
    id,
  }

  return NextResponse.json(data)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const body = await request.json()
    const updated = {
      ...MOCK_CAMPAIGN_DETAIL,
      ...body,
      id,
    }
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating campaign:', error)
    return NextResponse.json({ error: 'Failed to update campaign' }, { status: 500 })
  }
}
