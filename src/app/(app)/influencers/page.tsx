import { headers } from 'next/headers'
import { InfluencersContainerClient } from '@/components/influencer/InfluencersContainerClient'
import type { InfluencerItem } from '@/types'

interface PageProps {
  searchParams: Promise<{
    q?: string
    channel?: string
    channels?: string
    categories?: string
    followers_range?: string
    fee_range?: string
    fee_min?: string
    fee_max?: string
    collab_status?: string
    include_blacklist?: string
    exclude_blacklist?: string
  }>
}

async function getInfluencers(params: Record<string, string | undefined>) {
  try {
    const headersList = await headers()
    const host = headersList.get('host') || 'localhost:3000'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const cookie = headersList.get('cookie') || ''

    const query = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v) query.set(k, v)
    })

    const res = await fetch(`${protocol}://${host}/api/influencers?${query.toString()}`, {
      headers: { cookie },
      next: { revalidate: 0 },
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch influencers: ${res.status}`)
    }

    const json = await res.json()
    return {
      items: (json.data as InfluencerItem[]) || [],
      totalCount: json.totalCount ?? json.total ?? (json.data?.length || 0),
    }
  } catch (error) {
    console.error('Error fetching influencers:', error)
    return { items: [], totalCount: 0 }
  }
}

export default async function InfluencersPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const { items, totalCount } = await getInfluencers(resolvedParams)

  return <InfluencersContainerClient items={items} totalCount={totalCount} />
}
