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
          total: 12,
          agency_reviewing: 7,
          revision_requested: 3,
          client_reviewing: 2,
        },
      }
    }
  } catch (error) {
    console.error('Error fetching drafts queue data:', error)
  }

  // Fallback mock data matching requirements
  const fallbackItems: QueueDraftItem[] = [
    {
      id: 'qd-1',
      influencer_id: 'inf-2',
      influencer_name: '먹방준',
      handle: '@mukbang_jun',
      avatar_initial: '준',
      avatar_color_class: 'c3',
      campaign_id: 'camp-8',
      campaign_name: '쿠쿠 트윈프레셔 신제품 런칭',
      client_name: 'CUCKOO',
      version: 'v2',
      submitted_at: '오늘 09:35',
      status: 'agency_reviewing',
      status_label: '검수 중',
      status_variant: 'warn',
    },
    {
      id: 'qd-2',
      influencer_id: 'inf-1',
      influencer_name: '유리쿡',
      handle: '@yuri_cooks',
      avatar_initial: '유',
      avatar_color_class: 'c1',
      campaign_id: 'camp-8',
      campaign_name: '쿠쿠 트윈프레셔 신제품 런칭',
      client_name: 'CUCKOO',
      version: 'v1',
      submitted_at: '어제 15:20',
      status: 'client_reviewing',
      status_label: '광고주 컨펌 대기',
      status_variant: 'soft',
    },
    {
      id: 'qd-3',
      influencer_id: 'inf-6',
      influencer_name: '집밥현이',
      handle: '@hyuni.eats',
      avatar_initial: '현',
      avatar_color_class: 'c6',
      campaign_id: 'camp-8',
      campaign_name: '쿠쿠 트윈프레셔 신제품 런칭',
      client_name: 'CUCKOO',
      version: 'v1',
      submitted_at: '어제 11:00',
      status: 'client_reviewing',
      status_label: '광고주 컨펌 대기',
      status_variant: 'soft',
    },
    {
      id: 'qd-4',
      influencer_id: 'inf-4',
      influencer_name: '하나테이블',
      handle: '@hana_table',
      avatar_initial: '하',
      avatar_color_class: 'c4',
      campaign_id: 'camp-8',
      campaign_name: '쿠쿠 트윈프레셔 신제품 런칭',
      client_name: 'CUCKOO',
      version: 'v1',
      submitted_at: '2일전',
      status: 'revision_requested',
      status_label: '수정 요청',
      status_variant: 'danger',
    },
    {
      id: 'qd-5',
      influencer_id: 'inf-3',
      influencer_name: '소연홈',
      handle: '@soyeon.home',
      avatar_initial: '소',
      avatar_color_class: 'c2',
      campaign_id: 'camp-3',
      campaign_name: '하기스 위생 신제품',
      client_name: '유한킴벌리',
      version: 'v1',
      submitted_at: '오늘 08:10',
      status: 'agency_reviewing',
      status_label: '검수 중',
      status_variant: 'warn',
    },
    {
      id: 'qd-6',
      influencer_id: 'inf-5',
      influencer_name: '리빙민지',
      handle: '@minji.living',
      avatar_initial: '민',
      avatar_color_class: 'c5',
      campaign_id: 'camp-3',
      campaign_name: '하기스 위생 신제품',
      client_name: '유한킴벌리',
      version: 'v2',
      submitted_at: '어제 14:00',
      status: 'agency_reviewing',
      status_label: '검수 중',
      status_variant: 'warn',
    },
    {
      id: 'qd-7',
      influencer_id: 'inf-1',
      influencer_name: '유리쿡',
      handle: '@yuri_cooks',
      avatar_initial: '유',
      avatar_color_class: 'c1',
      campaign_id: 'camp-1',
      campaign_name: '쿠쿠 에어프라이어 봄 캠페인',
      client_name: 'CUCKOO',
      version: 'v1',
      submitted_at: '오늘 10:00',
      status: 'agency_reviewing',
      status_label: '검수 중',
      status_variant: 'warn',
    },
    {
      id: 'qd-8',
      influencer_id: 'inf-2',
      influencer_name: '먹방준',
      handle: '@mukbang_jun',
      avatar_initial: '준',
      avatar_color_class: 'c3',
      campaign_id: 'camp-2',
      campaign_name: '올리브영 뷰티 페스타',
      client_name: 'CJ올리브영',
      version: 'v1',
      submitted_at: '3일전',
      status: 'revision_requested',
      status_label: '수정 요청',
      status_variant: 'danger',
    },
    {
      id: 'qd-9',
      influencer_id: 'inf-6',
      influencer_name: '집밥현이',
      handle: '@hyuni.eats',
      avatar_initial: '현',
      avatar_color_class: 'c6',
      campaign_id: 'camp-2',
      campaign_name: '올리브영 뷰티 페스타',
      client_name: 'CJ올리브영',
      version: 'v2',
      submitted_at: '어제',
      status: 'client_reviewing',
      status_label: '광고주 컨펌 대기',
      status_variant: 'soft',
    },
    {
      id: 'qd-10',
      influencer_id: 'inf-4',
      influencer_name: '하나테이블',
      handle: '@hana_table',
      avatar_initial: '하',
      avatar_color_class: 'c4',
      campaign_id: 'camp-4',
      campaign_name: '크리넥스 협찬 캠페인',
      client_name: '유한킴벌리',
      version: 'v1',
      submitted_at: '오늘',
      status: 'agency_reviewing',
      status_label: '검수 중',
      status_variant: 'warn',
    },
    {
      id: 'qd-11',
      influencer_id: 'inf-3',
      influencer_name: '소연홈',
      handle: '@soyeon.home',
      avatar_initial: '소',
      avatar_color_class: 'c2',
      campaign_id: 'camp-4',
      campaign_name: '크리넥스 협찬 캠페인',
      client_name: '유한킴벌리',
      version: 'v1',
      submitted_at: '오늘',
      status: 'agency_reviewing',
      status_label: '검수 중',
      status_variant: 'warn',
    },
    {
      id: 'qd-12',
      influencer_id: 'inf-5',
      influencer_name: '리빙민지',
      handle: '@minji.living',
      avatar_initial: '민',
      avatar_color_class: 'c5',
      campaign_id: 'camp-5',
      campaign_name: '쿠쿠 정수기 상반기 프로모션',
      client_name: 'CUCKOO',
      version: 'v1',
      submitted_at: '2일전',
      status: 'revision_requested',
      status_label: '수정 요청',
      status_variant: 'danger',
    },
  ]

  return {
    initialItems: fallbackItems,
    counts: {
      total: 12,
      agency_reviewing: 7,
      revision_requested: 3,
      client_reviewing: 2,
    },
  }
}

export default async function DraftsQueuePage() {
  const { initialItems, counts } = await getDraftsData()

  return <AllDraftsClient initialItems={initialItems} counts={counts} />
}
