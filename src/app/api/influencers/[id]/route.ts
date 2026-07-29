import { NextResponse, NextRequest } from 'next/server'
import type { InfluencerItem } from '@/types'

export interface InfluencerDetailItem extends InfluencerItem {
  email?: string
  phone?: string
  categories_list?: string[]
  min_fee?: number
  max_fee?: number
  fee_range_formatted?: string
  past_brands?: string[]
  response_rate?: string
  total_collaborations?: number
  memo?: string
  contact_history?: Array<{
    id: string
    sent_at: string
    type: '이메일' | 'DM'
    direction: '발신' | '수신'
    subject: string
    preview: string
    sender: string
  }>
  campaign_history?: Array<{
    id: string
    campaign_name: string
    client_name: string
    period: string
    confirmed_fee_formatted: string
    status_label: string
    status_variant: 'soft' | 'gray' | 'danger'
  }>
}

const MOCK_DETAILS: Record<string, InfluencerDetailItem> = {
  'inf-1': {
    id: 'inf-1',
    name: '유리쿡',
    handle: '@yuri_cooks',
    avatar_initial: '유',
    avatar_color_class: 'c1',
    channel: 'instagram',
    channel_label: '인스타',
    category: '푸드',
    categories_list: ['푸드', '레시피', '홈쿠킹'],
    email: 'yuri@cooks.kr',
    phone: '010-1234-5678',
    followers: 125000,
    followers_formatted: '12.5만',
    engagement_rate: 4.8,
    engagement_rate_formatted: '4.8%',
    fee: 800000,
    fee_formatted: '₩80만',
    min_fee: 600000,
    max_fee: 1000000,
    fee_range_formatted: '₩60만 ~ ₩100만',
    status: 'candidate',
    status_label: '후보',
    is_blacklisted: false,
    past_brands: ['쿠쿠전자', '발뮤다', '오뚜기'],
    response_rate: '95%',
    total_collaborations: 14,
    memo: '제품 배송 시 레시피 가이드 동봉 필요. 주말 촬영 선호.',
    contact_history: [
      {
        id: 'c-1',
        sent_at: '2026-07-28 14:30',
        type: '이메일',
        direction: '발신',
        subject: '[Lineup] 쿠쿠 트윈프레셔 협찬 제안의 건',
        preview: '안녕하세요 유리쿡 님, 라운드미디어 김현우 매니저입니다. 이번 쿠쿠 신제품 런칭과 관련하여...',
        sender: '김현우 매니저',
      },
      {
        id: 'c-2',
        sent_at: '2026-07-28 16:10',
        type: '이메일',
        direction: '수신',
        subject: 'Re: [Lineup] 쿠쿠 트윈프레셔 협찬 제안의 건',
        preview: '안녕하세요! 제안해주신 조건 확인했습니다. 8월 둘째 주 촬영 일정 진행 가능합니다.',
        sender: '유리쿡',
      },
      {
        id: 'c-3',
        sent_at: '2026-07-29 09:15',
        type: 'DM',
        direction: '발신',
        subject: '배송지 및 스케줄 확인',
        preview: '유리쿡 님, 성함과 주소 정보 확인 감사드립니다. 제품은 오늘 오후 한진택배로 발송될 예정입니다.',
        sender: '이매니저',
      },
    ],
    campaign_history: [
      {
        id: 'camp-h1',
        campaign_name: '쿠쿠 트윈프레셔 신제품 런칭',
        client_name: '쿠쿠전자',
        period: '2026.07 ~ 진행 중',
        confirmed_fee_formatted: '₩80만',
        status_label: '후보선정',
        status_variant: 'soft',
      },
      {
        id: 'camp-h2',
        campaign_name: '오뚜기 카레 봄 캠페인',
        client_name: '오뚜기',
        period: '2026.04 ~ 2026.05',
        confirmed_fee_formatted: '₩75만',
        status_label: '완료',
        status_variant: 'gray',
      },
    ],
  },
  'inf-2': {
    id: 'inf-2',
    name: '먹방준',
    handle: '@mukbang_jun',
    avatar_initial: '준',
    avatar_color_class: 'c3',
    channel: 'youtube',
    channel_label: '유튜브',
    category: '푸드',
    categories_list: ['푸드', '먹방', '대용량'],
    email: 'jun@mukbang.co.kr',
    phone: '010-9876-5432',
    followers: 520000,
    followers_formatted: '52만',
    engagement_rate: 6.1,
    engagement_rate_formatted: '6.1%',
    fee: 4000000,
    fee_formatted: '₩400만',
    min_fee: 3500000,
    max_fee: 4500000,
    fee_range_formatted: '₩350만 ~ ₩450만',
    status: 'candidate',
    status_label: '후보',
    is_blacklisted: false,
    past_brands: ['농심', '쿠쿠전자', '배달의민족'],
    response_rate: '88%',
    total_collaborations: 22,
    memo: '유튜브 롱폼 브랜디드 컨텐츠 위주 작업.',
    contact_history: [
      {
        id: 'c-4',
        sent_at: '2026-07-25 11:00',
        type: '이메일',
        direction: '발신',
        subject: '[Lineup] 유튜브 브랜디드 협업 제안',
        preview: '먹방준 님 안녕하세요, 이번 에어프라이어 대용량 시리즈 브랜디드 협업 관련 문의드립니다.',
        sender: '김현우 매니저',
      },
    ],
    campaign_history: [
      {
        id: 'camp-h3',
        campaign_name: '쿠쿠 에어프라이어 대용량 캠페인',
        client_name: '쿠쿠전자',
        period: '2026.06 ~ 2026.07',
        confirmed_fee_formatted: '₩400만',
        status_label: '완료',
        status_variant: 'gray',
      },
    ],
  },
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const item = MOCK_DETAILS[id]

  if (!item) {
    // 기본 구조 템플릿 반환
    const fallback: InfluencerDetailItem = {
      id,
      name: '인플루언서',
      handle: `@user_${id}`,
      avatar_initial: '인',
      avatar_color_class: 'c1',
      channel: 'instagram',
      channel_label: '인스타',
      category: '기타',
      categories_list: ['라이프스타일'],
      email: 'contact@influencer.com',
      phone: '010-0000-0000',
      followers: 100000,
      followers_formatted: '10만',
      engagement_rate: 3.5,
      engagement_rate_formatted: '3.5%',
      fee: 1000000,
      fee_formatted: '₩100만',
      fee_range_formatted: '₩80만 ~ ₩120만',
      status: 'uncontacted',
      status_label: '미접촉',
      is_blacklisted: false,
      past_brands: ['브랜드 A'],
      response_rate: '90%',
      total_collaborations: 5,
      memo: '등록된 메모가 없습니다.',
      contact_history: [],
      campaign_history: [],
    }
    return NextResponse.json(fallback)
  }

  return NextResponse.json(item)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const body = await request.json()
    const existing = MOCK_DETAILS[id] || {
      id,
      name: '인플루언서',
      handle: `@user_${id}`,
      avatar_initial: '인',
      avatar_color_class: 'c1',
      channel: 'instagram',
      channel_label: '인스타',
      category: '기타',
      followers: 100000,
      followers_formatted: '10만',
      engagement_rate: 3.5,
      engagement_rate_formatted: '3.5%',
      fee: 1000000,
      fee_formatted: '₩100만',
      status: 'uncontacted',
      status_label: '미접촉',
      is_blacklisted: false,
    }

    const updated = { ...existing, ...body }
    MOCK_DETAILS[id] = updated

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating influencer:', error)
    return NextResponse.json({ error: 'Failed to update influencer' }, { status: 500 })
  }
}
