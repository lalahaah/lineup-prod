import { headers } from 'next/headers'
import { AllDraftsClient } from '@/components/draft/AllDraftsClient'
import type { QueueDraftItem } from '@/app/api/drafts/route'

export const metadata = {
  title: 'Lineup — 원고 검수 대기 목록',
  description: '전체 캠페인 원고 검수 Queue 목록',
}

async function getDraftsData(): Promise<{
  initialItems: QueueDraftItem[]
  counts: {
    total: number
    agency_reviewing: number
    revision_requested: number
    client_reviewing: number
  }
}> {
  try {
    const headersList = await headers()
    const host = headersList.get('host') || 'localhost:3000'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const cookie = headersList.get('cookie') || ''

    const res = await fetch(`${protocol}://${host}/api/drafts`, {
      headers: { cookie },
      next: { revalidate: 0 },
    })

    if (res.ok) {
      const data = await res.json()
      return {
        initialItems: data.data || [],
        counts: data.counts || {
          total: 0,
          agency_reviewing: 0,
          revision_requested: 0,
          client_reviewing: 0,
        },
      }
    }
  } catch (error) {
    console.error('Error fetching drafts queue data:', error)
  }

  return {
    initialItems: [],
    counts: {
      total: 0,
      agency_reviewing: 0,
      revision_requested: 0,
      client_reviewing: 0,
    },
  }
}

export default async function DraftsQueuePage() {
  const { initialItems, counts } = await getDraftsData()

  return <AllDraftsClient initialItems={initialItems} counts={counts} />
}
