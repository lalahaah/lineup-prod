import { headers } from 'next/headers'
import {
  CampaignInfluencersLineupClient,
  type LineupInfluencerItem,
} from '@/components/campaign/CampaignInfluencersLineupClient'
import type { CampaignDetailData } from '@/app/api/campaigns/[id]/route'

interface PageProps {
  params: Promise<{ id: string }>
}

async function getLineupData(id: string): Promise<{
  campaign: CampaignDetailData
  lineupItems: LineupInfluencerItem[]
}> {
  try {
    const headersList = await headers()
    const host = headersList.get('host') || 'localhost:3000'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const cookie = headersList.get('cookie') || ''

    const campRes = await fetch(`${protocol}://${host}/api/campaigns/${id}`, {
      headers: { cookie },
      next: { revalidate: 0 },
    })

    const campaign = campRes.ok ? await campRes.json() : null

    return {
      campaign: campaign || {
        id,
        title: '쿠쿠 트윈프레셔 신제품 런칭',
        client: 'CUCKOO',
        stage: 'outreaching',
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
      },
      lineupItems: [
        {
          ci_id: 'ci-1',
          influencer_id: 'inf-1',
          influencer_name: '유리쿡',
          handle: '@yuri_cooks',
          avatar_initial: '유',
          avatar_color_class: 'c1',
          channel_info: '인스타 릴스',
          followers: '12.5만',
          status: 'selected',
          proposed_fee_formatted: '₩800,000',
        },
        {
          ci_id: 'ci-2',
          influencer_id: 'inf-2',
          influencer_name: '먹방준',
          handle: '@mukbang_jun',
          avatar_initial: '준',
          avatar_color_class: 'c3',
          channel_info: '유튜브',
          followers: '52만',
          status: 'outreached',
          proposed_fee_formatted: '₩4,000,000',
        },
        {
          ci_id: 'ci-3',
          influencer_id: 'inf-3',
          influencer_name: '소연홈',
          handle: '@soyeon.home',
          avatar_initial: '소',
          avatar_color_class: 'c2',
          channel_info: '인스타',
          followers: '8.2만',
          status: 'candidate',
          proposed_fee_formatted: '₩600,000',
        },
        {
          ci_id: 'ci-4',
          influencer_id: 'inf-6',
          influencer_name: '집밥현이',
          handle: '@hyuni.eats',
          avatar_initial: '현',
          avatar_color_class: 'c6',
          channel_info: '유튜브',
          followers: '17만',
          status: 'confirmed',
          proposed_fee_formatted: '₩1,500,000',
        },
        {
          ci_id: 'ci-5',
          influencer_id: 'inf-4',
          influencer_name: '하나테이블',
          handle: '@hana_table',
          avatar_initial: '하',
          avatar_color_class: 'c4',
          channel_info: '인스타',
          followers: '21만',
          status: 'rejected',
          proposed_fee_formatted: '₩1,200,000',
        },
      ],
    }
  } catch (error) {
    console.error('Error fetching lineup data, using fallback:', error)
    return {
      campaign: {
        id,
        title: '쿠쿠 트윈프레셔 신제품 런칭',
        client: 'CUCKOO',
        stage: 'outreaching',
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
      },
      lineupItems: [
        {
          ci_id: 'ci-1',
          influencer_id: 'inf-1',
          influencer_name: '유리쿡',
          handle: '@yuri_cooks',
          avatar_initial: '유',
          avatar_color_class: 'c1',
          channel_info: '인스타 릴스',
          followers: '12.5만',
          status: 'selected',
          proposed_fee_formatted: '₩800,000',
        },
        {
          ci_id: 'ci-2',
          influencer_id: 'inf-2',
          influencer_name: '먹방준',
          handle: '@mukbang_jun',
          avatar_initial: '준',
          avatar_color_class: 'c3',
          channel_info: '유튜브',
          followers: '52만',
          status: 'outreached',
          proposed_fee_formatted: '₩4,000,000',
        },
        {
          ci_id: 'ci-3',
          influencer_id: 'inf-3',
          influencer_name: '소연홈',
          handle: '@soyeon.home',
          avatar_initial: '소',
          avatar_color_class: 'c2',
          channel_info: '인스타',
          followers: '8.2만',
          status: 'candidate',
          proposed_fee_formatted: '₩600,000',
        },
        {
          ci_id: 'ci-4',
          influencer_id: 'inf-6',
          influencer_name: '집밥현이',
          handle: '@hyuni.eats',
          avatar_initial: '현',
          avatar_color_class: 'c6',
          channel_info: '유튜브',
          followers: '17만',
          status: 'confirmed',
          proposed_fee_formatted: '₩1,500,000',
        },
        {
          ci_id: 'ci-5',
          influencer_id: 'inf-4',
          influencer_name: '하나테이블',
          handle: '@hana_table',
          avatar_initial: '하',
          avatar_color_class: 'c4',
          channel_info: '인스타',
          followers: '21만',
          status: 'rejected',
          proposed_fee_formatted: '₩1,200,000',
        },
      ],
    }
  }
}

export default async function CampaignInfluencersPage({ params }: PageProps) {
  const { id } = await params
  const { campaign, lineupItems } = await getLineupData(id)

  return (
    <CampaignInfluencersLineupClient campaign={campaign} lineupItems={lineupItems} />
  )
}
