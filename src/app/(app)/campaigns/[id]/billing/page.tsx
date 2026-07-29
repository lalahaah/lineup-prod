import { headers } from 'next/headers'
import { CampaignBillingClient } from '@/components/campaign/CampaignBillingClient'
import type { CampaignDetailData } from '@/app/api/campaigns/[id]/route'
import type { CampaignBillingData } from '@/app/api/campaigns/[id]/billing/route'

interface PageProps {
  params: Promise<{ id: string }>
}

async function getBillingData(id: string): Promise<{
  campaign: CampaignDetailData
  billingData: CampaignBillingData
}> {
  try {
    const headersList = await headers()
    const host = headersList.get('host') || 'localhost:3000'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const cookie = headersList.get('cookie') || ''

    const [campRes, billRes] = await Promise.all([
      fetch(`${protocol}://${host}/api/campaigns/${id}`, {
        headers: { cookie },
        next: { revalidate: 0 },
      }),
      fetch(`${protocol}://${host}/api/campaigns/${id}/billing`, {
        headers: { cookie },
        next: { revalidate: 0 },
      }),
    ])

    const campaign = campRes.ok ? await campRes.json() : null
    const billingData = billRes.ok ? await billRes.json() : null

    return {
      campaign: campaign || {
        id,
        title: '쿠쿠 트윈프레셔 신제품 런칭',
        client: 'CUCKOO',
        stage: 'billing',
        assignee: '김현우',
        influencer_count: 5,
        approved_count: 3,
        content_deadline: '06.08 (D-2)',
        dday: '마감 D-2',
        dday_variant: 'hot',
        portal_token: 'mock-portal-token-001',
        product_name: '쿠쿠 트윈프레셔 IH',
        channels_text: '인스타 릴스 / 유튜브',
        post_period: '06.10 ~ 06.20',
        hashtags: ['# 신혼집밥', '# 쿠쿠트윈프레셔', '필수 태그 2개'],
      },
      billingData: billingData || {
        campaign_id: id,
        influencer_items: [],
        influencer_subtotal: 7500000,
        agency_fee: 1125000,
        vat: 862500,
        total_invoice_amount: 9487500,
      },
    }
  } catch (error) {
    console.error('Error fetching billing data, using fallback:', error)
    return {
      campaign: {
        id,
        title: '쿠쿠 트윈프레셔 신제품 런칭',
        client: 'CUCKOO',
        stage: 'billing',
        assignee: '김현우',
        influencer_count: 5,
        approved_count: 3,
        content_deadline: '06.08 (D-2)',
        dday: '마감 D-2',
        dday_variant: 'hot',
        portal_token: 'mock-portal-token-001',
        product_name: '쿠쿠 트윈프레셔 IH',
        channels_text: '인스타 릴스 / 유튜브',
        post_period: '06.10 ~ 06.20',
        hashtags: ['# 신혼집밥', '# 쿠쿠트윈프레셔', '필수 태그 2개'],
      },
      billingData: {
        campaign_id: id,
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
      },
    }
  }
}

export default async function CampaignBillingPage({ params }: PageProps) {
  const { id } = await params
  const { campaign, billingData } = await getBillingData(id)

  return <CampaignBillingClient campaign={campaign} billingData={billingData} />
}
