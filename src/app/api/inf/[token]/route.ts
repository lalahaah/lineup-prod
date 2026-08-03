import { NextResponse, NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { CHANNEL_LABELS } from '@/lib/utils'

export interface InfTokenData {
  token: string
  influencer_name: string
  campaign_title: string
  client_name: string
  channel_label: string
  proposed_fee_formatted: string
  content_deadline: string
  post_period: string
  required_tags: string
  status: 'candidate' | 'outreached' | 'confirmed' | 'rejected' | string
  shipping_address?: {
    name?: string
    phone?: string
    address?: string
    detail_address?: string
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 404 })
  }

  try {
    const supabase = createServiceClient()

    // campaign_influencers에서 access_token으로 조회 + campaigns, clients, influencers JOIN
    const { data: ci, error } = await supabase
      .from('campaign_influencers')
      .select('*, campaigns(*, clients(*)), influencers(*)')
      .eq('access_token', token)
      .single()

    if (error || !ci) {
      return NextResponse.json({ error: 'Influencer link not found' }, { status: 404 })
    }

    const campaign = ci.campaigns as any || {}
    const client = campaign.clients as any || {}
    const influencer = ci.influencers as any || {}

    const addressObj = typeof ci.shipping_address === 'object' && ci.shipping_address !== null ? ci.shipping_address : {}

    const formatted: InfTokenData = {
      token,
      influencer_name: influencer.name || '인플루언서',
      campaign_title: campaign.name || '캠페인',
      client_name: client.name || '광고주',
      channel_label: CHANNEL_LABELS[influencer.primary_channel] || influencer.primary_channel || '인스타그램',
      proposed_fee_formatted: `₩${((ci.proposed_fee || 500000) / 10000).toFixed(0)}만`,
      content_deadline: campaign.content_deadline || '',
      post_period: campaign.upload_deadline ? `${campaign.content_deadline || ''} ~ ${campaign.upload_deadline}` : '',
      required_tags: campaign.brief || '#제품협찬 #가이드참조',
      status: ci.status,
      shipping_address: addressObj as any
    }

    return NextResponse.json({
      ...formatted,
      campaign_id: ci.campaign_id,
      influencer_id: ci.influencer_id,
      raw_data: ci
    })
  } catch (error: any) {
    console.error('Error fetching inf token data:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
