import { headers } from 'next/headers'
import { CampaignDetailClient } from '@/components/campaign/CampaignDetailClient'
import type { CampaignDetailData } from '@/app/api/campaigns/[id]/route'
import type { CampaignInfluencerDetail } from '@/app/api/campaigns/[id]/influencers/route'

interface PageProps {
  params: Promise<{ id: string }>
}

async function getCampaignDetailData(id: string): Promise<{
  campaign: CampaignDetailData
  influencers: CampaignInfluencerDetail[]
}> {
  try {
    const headersList = await headers()
    const host = headersList.get('host') || 'localhost:3000'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const cookie = headersList.get('cookie') || ''

    const [campRes, infRes] = await Promise.all([
      fetch(`${protocol}://${host}/api/campaigns/${id}`, {
        headers: { cookie },
        next: { revalidate: 0 },
      }),
      fetch(`${protocol}://${host}/api/campaigns/${id}/influencers`, {
        headers: { cookie },
        next: { revalidate: 0 },
      }),
    ])

    const campaignJson = campRes.ok ? await campRes.json() : null
    const infJson = infRes.ok ? await infRes.json() : null

    const campaignData = campaignJson ? {
      ...campaignJson,
      channels: campaignJson.channels || [],
      categories: campaignJson.categories || [],
      attachment_urls: campaignJson.attachment_urls || [],
      assignees: campaignJson.assignees || [],
      hashtags: campaignJson.hashtags || campaignJson.categories || ['#신제품'],
    } : null

    return {
      campaign: campaignData || {
        id,
        title: '쿠쿠 트윈프레셔 신제품 런칭',
        client: 'CUCKOO',
        stage: 'preparing',
        assignee: '김현우',
        assignees: [],
        influencer_count: 5,
        approved_count: 3,
        content_deadline: '06.08 (D-2)',
        dday: '마감 D-2',
        dday_variant: 'hot',
        portal_token: 'mock-portal-token-001',
        product_name: '쿠쿠 트윈프레셔 IH',
        channels: ['인스타그램', '유튜브'],
        channels_text: '인스타 릴스 / 유튜브',
        categories: ['푸드', '리빙'],
        attachment_urls: [],
        post_period: '06.10 ~ 06.20',
        hashtags: ['# 신혼집밥', '# 쿠쿠트윈프레셔', '필수 태그 2개'],
      },
      influencers: Array.isArray(infJson?.data)
        ? infJson.data
        : [],
    }
  } catch (error) {
    console.error('Error fetching campaign detail data, using fallback:', error)
    return {
      campaign: {
        id,
        title: '쿠쿠 트윈프레셔 신제품 런칭',
        client: 'CUCKOO',
        stage: 'preparing',
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
      influencers: [
        {
          id: 'ci-1',
          status: 'candidate',
          proposed_fee: 600000,
          final_fee: null,
          agency_comment: null,
          influencer: {
            id: 'inf-2',
            name: '먹방준',
            handle: '@mukbang_jun',
            primary_channel: 'youtube',
            followers: { youtube: 520000 },
            fee_min: 500000,
            fee_max: 800000,
            categories: ['푸드', '먹방'],
            email: 'jun@example.com',
          },
        },
        {
          id: 'ci-2',
          status: 'selected',
          proposed_fee: 800000,
          final_fee: null,
          agency_comment: null,
          influencer: {
            id: 'inf-1',
            name: '유리쿡',
            handle: '@yuri_cooks',
            primary_channel: 'instagram',
            followers: { instagram: 125000 },
            fee_min: 600000,
            fee_max: 1000000,
            categories: ['요리', '레시피'],
            email: 'yuri@example.com',
          },
        },
      ],
    }
  }
}

export default async function CampaignDetailPage({ params }: PageProps) {
  const { id } = await params
  const { campaign, influencers } = await getCampaignDetailData(id)

  return <CampaignDetailClient campaign={campaign} influencers={influencers} />
}
