import { NextResponse, NextRequest } from 'next/server'

export interface PortalCandidate {
  id: string
  name: string
  handle: string
  avatar_initial: string
  avatar_color_class: string
  channel: string
  category: string
  followers: string
  engagement: string
  fee: number
  fee_formatted: string
  tag: string
  status: 'chosen' | 'passed' | 'neutral'
}

export interface PortalData {
  token: string
  campaign_title: string
  client_name: string
  candidate_count: number
  total_budget_formatted: string
  deadline: string
  candidates: PortalCandidate[]
}

const MOCK_PORTAL_DATA: PortalData = {
  token: 'mock-portal-token-001',
  campaign_title: '쿠쿠 에어프라이어 봄 캠페인',
  client_name: 'CUCKOO',
  candidate_count: 8,
  total_budget_formatted: '₩12,000,000',
  deadline: '06.09 (D-3)',
  candidates: [
    {
      id: 'c1',
      name: '유리쿡',
      handle: '@yuri_cooks',
      avatar_initial: '유',
      avatar_color_class: 'c1',
      channel: '인스타',
      category: '푸드',
      followers: '12.5만',
      engagement: '4.8%',
      fee: 800000,
      fee_formatted: '₩80만',
      tag: '# 신혼집밥 콘텐츠 강점',
      status: 'chosen',
    },
    {
      id: 'c2',
      name: '먹방준',
      handle: '@mukbang_jun',
      avatar_initial: '준',
      avatar_color_class: 'c3',
      channel: '유튜브',
      category: '푸드',
      followers: '52만',
      engagement: '6.1%',
      fee: 4000000,
      fee_formatted: '₩400만',
      tag: '# 조리 리뷰 도달 강점',
      status: 'chosen',
    },
    {
      id: 'c3',
      name: '소연홈',
      handle: '@soyeon.home',
      avatar_initial: '소',
      avatar_color_class: 'c2',
      channel: '인스타',
      category: '리빙',
      followers: '8.2만',
      engagement: '5.4%',
      fee: 600000,
      fee_formatted: '₩60만',
      tag: '# 주방 인테리어 톤',
      status: 'neutral',
    },
    {
      id: 'c4',
      name: '집밥현이',
      handle: '@hyuni.eats',
      avatar_initial: '현',
      avatar_color_class: 'c6',
      channel: '유튜브',
      category: '푸드',
      followers: '17만',
      engagement: '5.0%',
      fee: 1500000,
      fee_formatted: '₩150만',
      tag: '# 자취 요리 공감대',
      status: 'chosen',
    },
    {
      id: 'c5',
      name: '하나테이블',
      handle: '@hana_table',
      avatar_initial: '하',
      avatar_color_class: 'c4',
      channel: '인스타',
      category: '푸드',
      followers: '21만',
      engagement: '3.9%',
      fee: 1200000,
      fee_formatted: '₩120만',
      tag: '# 참여율 다소 낮음',
      status: 'passed',
    },
    {
      id: 'c6',
      name: '리빙민지',
      handle: '@minji.living',
      avatar_initial: '민',
      avatar_color_class: 'c5',
      channel: '틱톡',
      category: '리빙',
      followers: '34만',
      engagement: '7.2%',
      fee: 2500000,
      fee_formatted: '₩250만',
      tag: '# 숏폼 바이럴 강점',
      status: 'neutral',
    },
  ],
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params

  // RLS 우회 데이터 제공 (token 매칭 또는 기본 mock)
  const data = {
    ...MOCK_PORTAL_DATA,
    token,
  }

  return NextResponse.json(data)
}
