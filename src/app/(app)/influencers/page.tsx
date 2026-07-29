import { headers } from 'next/headers'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { InfluencerSearch } from '@/components/influencer/InfluencerSearch'
import { InfluencerTable } from '@/components/influencer/InfluencerTable'
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
      items: json.data as InfluencerItem[],
      totalCount: json.totalCount ?? 348,
    }
  } catch (error) {
    console.error('Error fetching influencers:', error)
    // Synchronized fallback matching Influencers.html mock
    const fallback: InfluencerItem[] = [
      {
        id: 'inf-1',
        name: '유리쿡',
        handle: '@yuri_cooks',
        avatar_initial: '유',
        avatar_color_class: 'c1',
        channel: 'instagram',
        channel_label: '인스타',
        category: '푸드',
        followers: 125000,
        followers_formatted: '12.5만',
        engagement_rate: 4.8,
        engagement_rate_formatted: '4.8%',
        fee: 800000,
        fee_formatted: '₩80만',
        status: 'candidate',
        status_label: '후보',
        is_blacklisted: false,
      },
      {
        id: 'inf-2',
        name: '먹방준',
        handle: '@mukbang_jun',
        avatar_initial: '준',
        avatar_color_class: 'c3',
        channel: 'youtube',
        channel_label: '유튜브',
        category: '푸드',
        followers: 520000,
        followers_formatted: '52만',
        engagement_rate: 6.1,
        engagement_rate_formatted: '6.1%',
        fee: 4000000,
        fee_formatted: '₩400만',
        status: 'candidate',
        status_label: '후보',
        is_blacklisted: false,
      },
      {
        id: 'inf-3',
        name: '소연홈',
        handle: '@soyeon.home',
        avatar_initial: '소',
        avatar_color_class: 'c2',
        channel: 'instagram',
        channel_label: '인스타',
        category: '리빙',
        followers: 82000,
        followers_formatted: '8.2만',
        engagement_rate: 5.4,
        engagement_rate_formatted: '5.4%',
        fee: 600000,
        fee_formatted: '₩60만',
        status: 'candidate',
        status_label: '후보',
        is_blacklisted: false,
      },
      {
        id: 'inf-4',
        name: '하나테이블',
        handle: '@hana_table',
        avatar_initial: '하',
        avatar_color_class: 'c4',
        channel: 'instagram',
        channel_label: '인스타',
        category: '푸드',
        followers: 210000,
        followers_formatted: '21만',
        engagement_rate: 3.9,
        engagement_rate_formatted: '3.9%',
        fee: 1200000,
        fee_formatted: '₩120만',
        status: 'uncontacted',
        status_label: '미접촉',
        is_blacklisted: false,
      },
      {
        id: 'inf-5',
        name: '리빙민지',
        handle: '@minji.living',
        avatar_initial: '민',
        avatar_color_class: 'c5',
        channel: 'tiktok',
        channel_label: '틱톡',
        category: '리빙',
        followers: 340000,
        followers_formatted: '34만',
        engagement_rate: 7.2,
        engagement_rate_formatted: '7.2%',
        fee: 2500000,
        fee_formatted: '₩250만',
        status: 'uncontacted',
        status_label: '미접촉',
        is_blacklisted: false,
      },
      {
        id: 'inf-6',
        name: '집밥현이',
        handle: '@hyuni.eats',
        avatar_initial: '현',
        avatar_color_class: 'c6',
        channel: 'youtube',
        channel_label: '유튜브',
        category: '푸드',
        followers: 170000,
        followers_formatted: '17만',
        engagement_rate: 5.0,
        engagement_rate_formatted: '5.0%',
        fee: 1500000,
        fee_formatted: '₩150만',
        status: 'candidate',
        status_label: '후보',
        is_blacklisted: false,
      },
      {
        id: 'inf-7',
        name: '단우집밥',
        handle: '@danwoo.home',
        avatar_initial: '단',
        avatar_color_class: 'c0',
        channel: 'instagram',
        channel_label: '인스타',
        category: '리빙',
        followers: 94000,
        followers_formatted: '9.4만',
        engagement_rate: 2.1,
        engagement_rate_formatted: '2.1%',
        fee: 900000,
        fee_formatted: '₩90만',
        status: 'blacklisted',
        status_label: '블랙리스트',
        is_blacklisted: true,
      },
    ]

    return { items: fallback, totalCount: 348 }
  }
}

export default async function InfluencersPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const { items, totalCount } = await getInfluencers(resolvedParams)

  return (
    <div className="main select-none">
      {/* Header */}
      <Header
        title="인플루언서 DB"
        subTitle={
          <>
            총 <b>{totalCount}</b>명 · 블랙리스트 제외
          </>
        }
        searchPlaceholder="이름·핸들 검색"
        searchValue={resolvedParams.q || ''}
        actionButton={
          <Link href="/influencers/new" className="btn font-sans">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            인플루언서 추가
          </Link>
        }

      />

      {/* Content */}
      <div className="content">
        <InfluencerSearch />
        <InfluencerTable influencers={items} />
      </div>
    </div>
  )
}
