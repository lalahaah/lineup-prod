import { NextResponse, NextRequest } from 'next/server'
import type { CampaignStage } from '@/types'

export interface CampaignCardData {
  id: string
  client_id?: string
  client_name: string
  title: string
  stage: CampaignStage
  status_badge?: {
    label: string
    variant: 'soft' | 'gray' | 'warn' | 'danger' | 'dark'
  } | null
  progress?: number | null
  meta_text?: string | null
  fee_info?: {
    amount: string
    fee_badge: string
  } | null
  assignees: Array<{
    name: string
    avatar: string
    color: string
  }>
  dday: string
  dday_variant: 'default' | 'warm' | 'hot'
  border_highlight?: boolean
}

// TODO: DB 연동 시 Supabase campaigns 테이블에서 가져오도록 구현 예정 (현재는 Campaigns.html 목업 기준 데이터 제공)
const MOCK_CAMPAIGNS: CampaignCardData[] = [
  {
    id: 'camp-1',
    client_id: 'client-1',
    client_name: 'CUCKOO',
    title: '쿠쿠 인덕션 가을 신제품',
    stage: 'briefing',
    status_badge: { label: '브리핑 작성 중', variant: 'gray' },
    assignees: [{ name: '하나', avatar: '하', color: 'c4' }],
    dday: 'D-14',
    dday_variant: 'default',
  },
  {
    id: 'camp-2',
    client_id: 'client-2',
    client_name: '유한킴벌리',
    title: '크리넥스 항균 티슈 협찬',
    stage: 'search',
    progress: 40,
    meta_text: '후보 6명 / 목표 15명',
    assignees: [{ name: '소연', avatar: '소', color: 'c2' }],
    dday: 'D-9',
    dday_variant: 'default',
  },
  {
    id: 'camp-3',
    client_id: 'client-1',
    client_name: 'CUCKOO',
    title: '쿠쿠 에어프라이어 봄 캠페인',
    stage: 'proposal',
    status_badge: { label: '광고주 검토 중', variant: 'warn' },
    progress: 100,
    meta_text: '8명 제안 · 포털 공유됨',
    assignees: [{ name: '현우', avatar: '우', color: 'c1' }],
    dday: 'D-3',
    dday_variant: 'warm',
  },
  {
    id: 'camp-4',
    client_id: 'client-3',
    client_name: 'CJ올리브영',
    title: '올리브영 뷰티 픽 11월',
    stage: 'proposal',
    status_badge: { label: '제안서 준비', variant: 'gray' },
    assignees: [{ name: '지은', avatar: '지', color: 'c3' }],
    dday: 'D-8',
    dday_variant: 'default',
  },
  {
    id: 'camp-5',
    client_id: 'client-1',
    client_name: 'CUCKOO',
    title: '쿠쿠 밥솥 추석 기획전',
    stage: 'selection',
    status_badge: { label: '광고주 선택 완료', variant: 'soft' },
    progress: 100,
    meta_text: '5명 선택 · 섭외 대기',
    assignees: [{ name: '현우', avatar: '우', color: 'c1' }],
    dday: 'D-6',
    dday_variant: 'default',
  },
  {
    id: 'camp-6',
    client_id: 'client-1',
    client_name: 'CUCKOO',
    title: '쿠쿠 정수기 인스타 협찬',
    stage: 'outreach',
    status_badge: { label: '2명 미응답', variant: 'warn' },
    progress: 50,
    meta_text: '확정 2 / 대기 2',
    assignees: [
      { name: '유리', avatar: '유', color: 'c5' },
      { name: '민지', avatar: '민', color: 'c2' },
      { name: '하나', avatar: '하', color: 'c4' },
    ],
    dday: 'D-3',
    dday_variant: 'warm',
  },
  {
    id: 'camp-7',
    client_id: 'client-2',
    client_name: '유한킴벌리',
    title: '하기스 위생 캠페인',
    stage: 'shipping',
    status_badge: { label: '운송장 2건 대기', variant: 'gray' },
    progress: 60,
    meta_text: '배송완료 3 / 5',
    assignees: [
      { name: '소연', avatar: '소', color: 'c2' },
      { name: '현이', avatar: '현', color: 'c6' },
    ],
    dday: 'D-5',
    dday_variant: 'default',
  },
  {
    id: 'camp-8',
    client_id: 'client-1',
    client_name: 'CUCKOO',
    title: '쿠쿠 트윈프레셔 신제품 런칭',
    stage: 'review',
    status_badge: { label: '컨펌 대기 D-2', variant: 'danger' },
    progress: 60,
    meta_text: '승인 3 / 제출 5',
    assignees: [
      { name: '유리', avatar: '유', color: 'c1' },
      { name: '준', avatar: '준', color: 'c3' },
      { name: '하나', avatar: '하', color: 'c4' },
      { name: '민지', avatar: '민', color: 'c5' },
    ],
    dday: 'D-2',
    dday_variant: 'hot',
    border_highlight: true,
  },
  {
    id: 'camp-9',
    client_id: 'client-1',
    client_name: 'CUCKOO',
    title: '쿠쿠 비스포크 홈카페',
    stage: 'uploaded',
    status_badge: { label: '게시 완료', variant: 'soft' },
    progress: 100,
    meta_text: '성과 입력 대기',
    assignees: [{ name: '지은', avatar: '지', color: 'c3' }],
    dday: 'D-4',
    dday_variant: 'default',
  },
  {
    id: 'camp-10',
    client_id: 'client-3',
    client_name: 'CJ올리브영',
    title: '올리브영 뷰티 신제품',
    stage: 'billing',
    status_badge: { label: '청구서 발송 대기', variant: 'gray' },
    fee_info: { amount: '₩8.4M', fee_badge: '수수료 15%' },
    assignees: [{ name: '지은', avatar: '지', color: 'c3' }],
    dday: 'D-6',
    dday_variant: 'default',
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const stage = searchParams.get('stage')
  const clientId = searchParams.get('client_id')
  const assignee = searchParams.get('assignee')

  try {
    let filtered = [...MOCK_CAMPAIGNS]

    if (stage) {
      filtered = filtered.filter((c) => c.stage === stage)
    }

    if (clientId && clientId !== 'all') {
      filtered = filtered.filter(
        (c) => c.client_id === clientId || c.client_name.toLowerCase() === clientId.toLowerCase()
      )
    }

    if (assignee && assignee !== 'all') {
      if (assignee === 'me' || assignee === '담당: 나') {
        filtered = filtered.filter((c) =>
          c.assignees.some((a) => a.name === '현우' || a.name === '나')
        )
      } else {
        filtered = filtered.filter((c) =>
          c.assignees.some((a) => a.name.toLowerCase().includes(assignee.toLowerCase()))
        )
      }
    }

    return NextResponse.json({
      data: filtered,
      total: filtered.length,
      totalActive: filtered.filter((c) => c.stage !== 'completed').length,
    })
  } catch (error) {
    console.error('Error fetching campaigns:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, client_name } = body

    const newCampaign: CampaignCardData = {
      id: `camp-${Date.now()}`,
      client_name: client_name || 'CUCKOO',
      title: title || '새 신규 캠페인',
      stage: 'briefing',
      status_badge: { label: '브리핑 작성 중', variant: 'gray' },
      assignees: [{ name: '현우', avatar: '우', color: 'c1' }],
      dday: 'D-14',
      dday_variant: 'default',
    }

    return NextResponse.json(newCampaign, { status: 201 })
  } catch (error) {
    console.error('Error creating campaign:', error)
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 })
  }
}
