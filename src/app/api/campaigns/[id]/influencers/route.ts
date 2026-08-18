import { NextResponse, NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export interface CampaignInfluencerItem {
  id: string
  status: string
  proposed_fee: number | null
  final_fee: number | null
  agency_comment?: string | null
  access_token?: string
  shipping_address?: any
  shipping_status?: string | null
  tracking_number?: string | null
  influencer: {
    id: string
    name: string
    handle?: string | null
    primary_channel?: string | null
    channel_urls?: any
    channel_handles?: any
    followers?: any
    fee_min?: number | null
    fee_max?: number | null
    categories?: string[]
    email?: string | null
    phone?: string | null
    response_rate?: number | null
    collab_count?: number | null
    is_blacklisted?: boolean
  }
}

export type CampaignInfluencerDetail = CampaignInfluencerItem

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: campaignId } = await context.params
    const supabase = createServiceClient()

    const { data, error } = await supabase
      .from('campaign_influencers')
      .select(`
        id,
        status,
        proposed_fee,
        final_fee,
        agency_comment,
        access_token,
        shipping_address,
        shipping_status,
        tracking_number,
        influencers (
          id,
          name,
          handle,
          primary_channel,
          channel_urls,
          channel_handles,
          followers,
          fee_min,
          fee_max,
          categories,
          email,
          phone,
          response_rate,
          collab_count,
          is_blacklisted
        )
      `)
      .eq('campaign_id', campaignId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const formatted: CampaignInfluencerItem[] = (data || []).map((ci: any) => {
      const inf = Array.isArray(ci.influencers) ? ci.influencers[0] : (ci.influencers || {})
      return {
        id: ci.id,
        status: ci.status,
        proposed_fee: ci.proposed_fee,
        final_fee: ci.final_fee,
        agency_comment: ci.agency_comment,
        access_token: ci.access_token,
        shipping_address: ci.shipping_address,
        shipping_status: ci.shipping_status,
        tracking_number: ci.tracking_number,
        influencer: {
          id: inf.id || '',
          name: inf.name || '알 수 없음',
          handle: inf.handle || null,
          primary_channel: inf.primary_channel || null,
          channel_urls: inf.channel_urls || null,
          channel_handles: inf.channel_handles || null,
          followers: inf.followers || null,
          fee_min: inf.fee_min || null,
          fee_max: inf.fee_max || null,
          categories: inf.categories || [],
          email: inf.email || null,
          phone: inf.phone || null,
          response_rate: inf.response_rate || null,
          collab_count: inf.collab_count || null,
          is_blacklisted: inf.is_blacklisted || false,
        },
      }
    })

    return NextResponse.json({ data: formatted })
  } catch (error: any) {
    console.error('Error fetching campaign influencers:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const supabase = createServiceClient()
    const body = await request.json()

    const { influencer_id, proposed_fee, agency_comment } = body

    if (!influencer_id) {
      return NextResponse.json({ error: 'influencer_id is required' }, { status: 400 })
    }

    const accessToken = crypto.randomUUID()

    const { data: newCI, error } = await supabase
      .from('campaign_influencers')
      .insert({
        campaign_id: id,
        influencer_id,
        status: 'candidate',
        access_token: accessToken,
        proposed_fee: proposed_fee ? Number(proposed_fee) : null,
        agency_comment: agency_comment || null,
      })
      .select('*, influencers(*)')
      .single()

    if (error || !newCI) {
      return NextResponse.json({ error: error?.message || 'Failed to add influencer to campaign' }, { status: 500 })
    }

    await supabase.from('activity_logs').insert({
      campaign_id: id,
      type: 'influencer_added',
      actor_type: 'agency_manager',
      actor_name: '담당자',
      description: '캠페인에 신규 인플루언서가 추가되었습니다.',
      metadata: { influencer_id },
    })

    return NextResponse.json({ data: newCI }, { status: 201 })
  } catch (error: any) {
    console.error('Error adding influencer to campaign:', error)
    return NextResponse.json({ error: error.message || 'Failed to add influencer' }, { status: 500 })
  }
}
