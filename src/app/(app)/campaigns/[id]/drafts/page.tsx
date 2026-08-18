import { headers } from 'next/headers'
import { CampaignDraftsClient } from '@/components/draft/CampaignDraftsClient'
import type { CampaignDetailData } from '@/app/api/campaigns/[id]/route'
import type { InfluencerDraftOverview } from '@/app/api/campaigns/[id]/drafts/route'

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ inf?: string }>
}

async function getDraftsPageData(id: string): Promise<{
  campaign: CampaignDetailData
  influencers: InfluencerDraftOverview[]
}> {
  try {
    const headersList = await headers()
    const host = headersList.get('host') || 'localhost:3000'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const cookie = headersList.get('cookie') || ''

    const [campRes, draftsRes] = await Promise.all([
      fetch(`${protocol}://${host}/api/campaigns/${id}`, {
        headers: { cookie },
        next: { revalidate: 0 },
      }),
      fetch(`${protocol}://${host}/api/campaigns/${id}/drafts`, {
        headers: { cookie },
        next: { revalidate: 0 },
      }),
    ])

    const campaign = campRes.ok ? await campRes.json() : null
    const draftsJson = draftsRes.ok ? await draftsRes.json() : null

    return {
      campaign: campaign || {
        id,
        title: '캠페인',
        client: '광고주',
        stage: 'reviewing',
        assignee: '담당자',
        influencer_count: 0,
        approved_count: 0,
        content_deadline: '-',
        dday: '',
        dday_variant: 'hot',
        portal_token: '',
        product_name: '-',
        channels_text: '-',
        post_period: '-',
        hashtags: [],
      },
      influencers: draftsJson?.data || [],
    }
  } catch (error) {
    console.error('Error fetching campaign drafts data:', error)
    return {
      campaign: {
        id,
        title: '캠페인',
        client: '광고주',
        stage: 'reviewing',
        assignee: '담당자',
        influencer_count: 0,
        approved_count: 0,
        content_deadline: '-',
        dday: '',
        dday_variant: 'hot',
        portal_token: '',
        product_name: '-',
        channels_text: '-',
        post_period: '-',
        hashtags: [],
      },
      influencers: [],
    }
  }
}

export default async function CampaignDraftsPage({ params, searchParams }: PageProps) {
  const { id } = await params
  const resolvedSearchParams = await searchParams
  const selectedInfluencerId = resolvedSearchParams.inf

  const { campaign, influencers } = await getDraftsPageData(id)

  return (
    <CampaignDraftsClient
      campaign={campaign}
      influencers={influencers}
      selectedInfluencerId={selectedInfluencerId}
    />
  )
}
