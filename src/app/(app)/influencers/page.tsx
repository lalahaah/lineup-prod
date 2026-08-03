import { headers } from 'next/headers'
import Link from 'next/link'
import { InfluencerSearch } from '@/components/influencer/InfluencerSearch'
import { InfluencerTable } from '@/components/influencer/InfluencerTable'
import { InfluencersHeaderClient } from '@/components/influencer/InfluencersHeaderClient'
import { EmptyState } from '@/components/shared/EmptyState'
import type { InfluencerItem } from '@/types'

interface PageProps {
  searchParams: Promise<{
    q?: string
    channels?: string
    categories?: string
    exclude_blacklist?: string
  }>
}

async function getInfluencers(params: {
  q?: string
  channels?: string
  categories?: string
  exclude_blacklist?: string
}) {
  try {
    const headersList = await headers()
    const host = headersList.get('host') || 'localhost:3000'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const cookie = headersList.get('cookie') || ''

    const query = new URLSearchParams()
    if (params.q) query.set('q', params.q)
    if (params.channels) query.set('channels', params.channels)
    if (params.categories) query.set('categories', params.categories)
    if (params.exclude_blacklist) query.set('exclude_blacklist', params.exclude_blacklist)

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

  return (
    <div className="main select-none">
      {/* Header */}
      <InfluencersHeaderClient totalCount={totalCount} />

      {/* Content */}
      <div className="content">
        <InfluencerSearch />
        {items.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%' }}>
              <EmptyState
                icon="👥"
                title="등록된 인플루언서가 없습니다"
                description="인플루언서를 추가해서 DB를 구성해보세요"
              />
            </div>
            <div style={{ marginTop: -20, marginBottom: 40 }}>
              <Link
                href="/influencers/new"
                className="btn btn-green cursor-pointer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}
              >
                + 인플루언서 추가
              </Link>
            </div>
          </div>
        ) : (
          <InfluencerTable influencers={items} />
        )}
      </div>
    </div>
  )
}
