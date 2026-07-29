import { NextResponse, NextRequest } from 'next/server'

export interface QueueDraftItem {
  id: string
  influencer_id: string
  influencer_name: string
  handle: string
  avatar_initial: string
  avatar_color_class: string
  campaign_id: string
  campaign_name: string
  client_name: string
  version: string
  submitted_at: string
  status: 'agency_reviewing' | 'revision_requested' | 'client_reviewing' | 'client_approved'
  status_label: '검수 중' | '수정 요청' | '광고주 컨펌 대기' | '승인 완료'
  status_variant: 'warn' | 'danger' | 'soft' | 'green'
}

const MOCK_QUEUE_DRAFTS: QueueDraftItem[] = [
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

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const filter = searchParams.get('filter') // 'all' | 'agency_reviewing' | 'revision_requested' | 'client_reviewing'

  let filtered = MOCK_QUEUE_DRAFTS
  if (filter && filter !== 'all') {
    filtered = MOCK_QUEUE_DRAFTS.filter((d) => d.status === filter)
  }

  const counts = {
    total: MOCK_QUEUE_DRAFTS.length,
    agency_reviewing: MOCK_QUEUE_DRAFTS.filter((d) => d.status === 'agency_reviewing').length,
    revision_requested: MOCK_QUEUE_DRAFTS.filter((d) => d.status === 'revision_requested').length,
    client_reviewing: MOCK_QUEUE_DRAFTS.filter((d) => d.status === 'client_reviewing').length,
  }

  return NextResponse.json({
    data: filtered,
    counts,
  })
}
