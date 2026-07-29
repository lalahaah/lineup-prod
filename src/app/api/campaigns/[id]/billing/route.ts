import { NextResponse, NextRequest } from 'next/server'

export interface BillingInfluencerItem {
  influencer_id: string
  influencer_name: string
  handle: string
  avatar_initial: string
  avatar_color_class: string
  channel_info: string
  followers: string
  confirmed_fee: number
  confirmed_fee_formatted: string
  tax_invoice_status: '수취' | '미수취'
  payment_status: '대기' | '지급완료'
}

export interface CampaignBillingData {
  campaign_id: string
  influencer_items: BillingInfluencerItem[]
  influencer_subtotal: number
  agency_fee: number
  vat: number
  total_invoice_amount: number
}

const MOCK_BILLING_DATA: CampaignBillingData = {
  campaign_id: 'camp-8',
  influencer_items: [
    {
      influencer_id: 'inf-2',
      influencer_name: '먹방준',
      handle: '@mukbang_jun',
      avatar_initial: '준',
      avatar_color_class: 'c3',
      channel_info: '유튜브',
      followers: '52만',
      confirmed_fee: 4000000,
      confirmed_fee_formatted: '₩4,000,000',
      tax_invoice_status: '미수취',
      payment_status: '대기',
    },
    {
      influencer_id: 'inf-1',
      influencer_name: '유리쿡',
      handle: '@yuri_cooks',
      avatar_initial: '유',
      avatar_color_class: 'c1',
      channel_info: '인스타',
      followers: '12.5만',
      confirmed_fee: 800000,
      confirmed_fee_formatted: '₩800,000',
      tax_invoice_status: '수취',
      payment_status: '지급완료',
    },
    {
      influencer_id: 'inf-6',
      influencer_name: '집밥현이',
      handle: '@hyuni.eats',
      avatar_initial: '현',
      avatar_color_class: 'c6',
      channel_info: '유튜브',
      followers: '17만',
      confirmed_fee: 1500000,
      confirmed_fee_formatted: '₩1,500,000',
      tax_invoice_status: '수취',
      payment_status: '대기',
    },
    {
      influencer_id: 'inf-4',
      influencer_name: '하나테이블',
      handle: '@hana_table',
      avatar_initial: '하',
      avatar_color_class: 'c4',
      channel_info: '인스타',
      followers: '21만',
      confirmed_fee: 1200000,
      confirmed_fee_formatted: '₩1,200,000',
      tax_invoice_status: '미수취',
      payment_status: '대기',
    },
  ],
  influencer_subtotal: 7500000,
  agency_fee: 1125000,
  vat: 862500,
  total_invoice_amount: 9487500,
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  return NextResponse.json({
    ...MOCK_BILLING_DATA,
    campaign_id: id,
  })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const body = await request.json()
    console.log(`[Create Invoice] Campaign: ${id}`, body)

    return NextResponse.json({
      success: true,
      message: '청구서가 성공적으로 생성되었습니다.',
      campaign_id: id,
    })
  } catch (error) {
    console.error('Error creating invoice:', error)
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 })
  }
}
