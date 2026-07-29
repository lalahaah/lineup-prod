import { headers } from 'next/headers'
import { CampaignShippingClient } from '@/components/campaign/CampaignShippingClient'
import type { CampaignDetailData } from '@/app/api/campaigns/[id]/route'
import type { ShippingItem } from '@/app/api/campaigns/[id]/shipping/route'

interface PageProps {
  params: Promise<{ id: string }>
}

async function getShippingData(id: string): Promise<{
  campaign: CampaignDetailData
  shippingItems: ShippingItem[]
}> {
  try {
    const headersList = await headers()
    const host = headersList.get('host') || 'localhost:3000'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const cookie = headersList.get('cookie') || ''

    const [campRes, shipRes] = await Promise.all([
      fetch(`${protocol}://${host}/api/campaigns/${id}`, {
        headers: { cookie },
        next: { revalidate: 0 },
      }),
      fetch(`${protocol}://${host}/api/campaigns/${id}/shipping`, {
        headers: { cookie },
        next: { revalidate: 0 },
      }),
    ])

    const campaign = campRes.ok ? await campRes.json() : null
    const shipJson = shipRes.ok ? await shipRes.json() : null

    return {
      campaign: campaign || {
        id,
        title: '쿠쿠 트윈프레셔 신제품 런칭',
        client: 'CUCKOO',
        stage: 'shipping',
        assignee: '김현우',
        influencer_count: 5,
        approved_count: 3,
        content_deadline: '06.08 (D-2)',
        dday: '마감 D-2',
        dday_variant: 'warm',
        portal_token: 'mock-portal-token-001',
        product_name: '쿠쿠 트윈프레셔 IH',
        channels_text: '인스타 릴스 / 유튜브',
        post_period: '06.10 ~ 06.20',
        hashtags: ['# 신혼집밥', '# 쿠쿠트윈프레셔', '필수 태그 2개'],
      },
      shippingItems: shipJson?.data || [],
    }
  } catch (error) {
    console.error('Error fetching shipping data, using fallback:', error)
    return {
      campaign: {
        id,
        title: '쿠쿠 트윈프레셔 신제품 런칭',
        client: 'CUCKOO',
        stage: 'shipping',
        assignee: '김현우',
        influencer_count: 5,
        approved_count: 3,
        content_deadline: '06.08 (D-2)',
        dday: '마감 D-2',
        dday_variant: 'warm',
        portal_token: 'mock-portal-token-001',
        product_name: '쿠쿠 트윈프레셔 IH',
        channels_text: '인스타 릴스 / 유튜브',
        post_period: '06.10 ~ 06.20',
        hashtags: ['# 신혼집밥', '# 쿠쿠트윈프레셔', '필수 태그 2개'],
      },
      shippingItems: [
        {
          ci_id: 'ci-1',
          influencer_id: 'inf-2',
          influencer_name: '먹방준',
          handle: '@mukbang_jun',
          avatar_initial: '준',
          avatar_color_class: 'c3',
          recipient: '김준형',
          phone: '010-1234-5678',
          address: '서울시 강남구 테헤란로 123',
          detail_address: '401호',
          tracking_number: '1234567890',
          status: 'shipped',
          is_confirmed: false,
        },
        {
          ci_id: 'ci-2',
          influencer_id: 'inf-1',
          influencer_name: '유리쿡',
          handle: '@yuri_cooks',
          avatar_initial: '유',
          avatar_color_class: 'c1',
          recipient: '이유리',
          phone: '010-2345-6789',
          address: '경기도 성남시 분당구 판교로 456',
          detail_address: '102동 503호',
          tracking_number: '9876543210',
          status: 'delivered',
          is_confirmed: true,
        },
        {
          ci_id: 'ci-3',
          influencer_id: 'inf-6',
          influencer_name: '집밥현이',
          handle: '@hyuni.eats',
          avatar_initial: '현',
          avatar_color_class: 'c6',
          recipient: '-',
          phone: '-',
          address: '-',
          detail_address: '-',
          tracking_number: '',
          status: 'pending',
          is_confirmed: false,
        },
        {
          ci_id: 'ci-4',
          influencer_id: 'inf-4',
          influencer_name: '하나테이블',
          handle: '@hana_table',
          avatar_initial: '하',
          avatar_color_class: 'c4',
          recipient: '박하나',
          phone: '010-3456-7890',
          address: '서울시 마포구 월드컵북로 88',
          detail_address: '2층',
          tracking_number: '5551234567',
          status: 'in_transit',
          is_confirmed: false,
        },
        {
          ci_id: 'ci-5',
          influencer_id: 'inf-5',
          influencer_name: '리빙민지',
          handle: '@minji.living',
          avatar_initial: '민',
          avatar_color_class: 'c5',
          recipient: '최민지',
          phone: '010-4567-8901',
          address: '서울시 용산구 이태원로 12',
          detail_address: '301호',
          tracking_number: '',
          status: 'preparing',
          is_confirmed: false,
        },
      ],
    }
  }
}

export default async function CampaignShippingPage({ params }: PageProps) {
  const { id } = await params
  const { campaign, shippingItems } = await getShippingData(id)

  return <CampaignShippingClient campaign={campaign} shippingItems={shippingItems} />
}
