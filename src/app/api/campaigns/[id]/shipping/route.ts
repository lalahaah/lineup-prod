import { NextResponse, NextRequest } from 'next/server'

export interface ShippingItem {
  ci_id: string
  influencer_id: string
  influencer_name: string
  handle: string
  avatar_initial: string
  avatar_color_class: string
  recipient: string
  phone: string
  address: string
  detail_address: string
  tracking_number: string
  status: 'pending' | 'preparing' | 'in_transit' | 'shipped' | 'delivered'
  is_confirmed: boolean
}

const MOCK_SHIPPING_ITEMS: ShippingItem[] = [
  {
    ci_id: 'ci-1',
    influencer_id: 'inf-2',
    influencer_name: '먹방준',
    handle: '@mukbang_jun',
    avatar_initial: '준',
    avatar_color_class: 'c3',
    recipient: '김준형',
    phone: '010-1234-5678',
    address: '서울시 강남구 테헤란로 123',
    detail_address: '401호',
    tracking_number: '1234567890',
    status: 'shipped',
    is_confirmed: false,
  },
  {
    ci_id: 'ci-2',
    influencer_id: 'inf-1',
    influencer_name: '유리쿡',
    handle: '@yuri_cooks',
    avatar_initial: '유',
    avatar_color_class: 'c1',
    recipient: '이유리',
    phone: '010-2345-6789',
    address: '경기도 성남시 분당구 판교로 456',
    detail_address: '102동 503호',
    tracking_number: '9876543210',
    status: 'delivered',
    is_confirmed: true,
  },
  {
    ci_id: 'ci-3',
    influencer_id: 'inf-6',
    influencer_name: '집밥현이',
    handle: '@hyuni.eats',
    avatar_initial: '현',
    avatar_color_class: 'c6',
    recipient: '-',
    phone: '-',
    address: '-',
    detail_address: '-',
    tracking_number: '',
    status: 'pending',
    is_confirmed: false,
  },
  {
    ci_id: 'ci-4',
    influencer_id: 'inf-4',
    influencer_name: '하나테이블',
    handle: '@hana_table',
    avatar_initial: '하',
    avatar_color_class: 'c4',
    recipient: '박하나',
    phone: '010-3456-7890',
    address: '서울시 마포구 월드컵북로 88',
    detail_address: '2층',
    tracking_number: '5551234567',
    status: 'in_transit',
    is_confirmed: false,
  },
  {
    ci_id: 'ci-5',
    influencer_id: 'inf-5',
    influencer_name: '리빙민지',
    handle: '@minji.living',
    avatar_initial: '민',
    avatar_color_class: 'c5',
    recipient: '최민지',
    phone: '010-4567-8901',
    address: '서울시 용산구 이태원로 12',
    detail_address: '301호',
    tracking_number: '',
    status: 'preparing',
    is_confirmed: false,
  },
]

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  return NextResponse.json({
    campaign_id: id,
    data: MOCK_SHIPPING_ITEMS,
  })
}
