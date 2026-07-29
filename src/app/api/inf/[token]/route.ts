import { NextResponse, NextRequest } from 'next/server'

export interface InfTokenData {
  token: string
  influencer_name: string
  campaign_title: string
  client_name: string
  channel_label: string
  proposed_fee_formatted: string
  content_deadline: string
  post_period: string
  required_tags: string
  status: 'candidate' | 'outreached' | 'confirmed' | 'rejected'
  shipping_address?: {
    name?: string
    phone?: string
    address?: string
    detail_address?: string
  }
}

const MOCK_INF_TOKEN_DATA: InfTokenData = {
  token: 'mock-inf-token-001',
  influencer_name: '유리쿡',
  campaign_title: '쿠쿠 트윈프레셔 신제품 런칭',
  client_name: 'CUCKOO',
  channel_label: '인스타 릴스',
  proposed_fee_formatted: '₩800,000',
  content_deadline: '06.08',
  post_period: '06.10 ~ 06.20',
  required_tags: '#신혼집밥 외 1',
  status: 'outreached',
  shipping_address: {
    name: '',
    phone: '',
    address: '',
    detail_address: '',
  },
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params

  // RLS 우회 데이터 반환
  const data = {
    ...MOCK_INF_TOKEN_DATA,
    token,
  }

  return NextResponse.json(data)
}
