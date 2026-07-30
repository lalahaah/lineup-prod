import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export interface CampaignInfluencerDetail {
  id: string
  influencer_id: string
  name: string
  handle?: string
  avatar_initial?: string
  avatar_color_class?: string
  channel?: string
  channel_label?: string
  followers?: string
  engagement?: string
  status?: string
  status_label?: string
  badge_variant?: 'gray' | 'soft' | 'warn' | 'danger' | 'dark'
  fee?: number
  fee_formatted?: string
  agency_comment?: string | null
  rejection_reason?: string | null
  shipping_status?: string | null
  tracking_number?: string | null
  status_text?: string
  badge_label?: string
  channel_info?: string
  caption?: string
  media_info?: any
  draft_versions: any[]
  feedback_history: any[]
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const supabase = await createClient()

    const { data: campaignInfluencers, error } = await supabase
      .from('campaign_influencers')
      .select('*, influencers(*)')
      .eq('campaign_id', id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const formatted: CampaignInfluencerDetail[] = (campaignInfluencers || []).map((ci: any) => {
      const inf = ci.influencers || {}
      const name = inf.name || '알 수 없음'
      return {
        id: ci.id,
        influencer_id: ci.influencer_id,
        name,
        handle: inf.handle || '',
        avatar_initial: name[0],
        avatar_color_class: 'c1',
        channel: inf.primary_channel || 'instagram',
        channel_label: inf.primary_channel === 'youtube' ? '유튜브' : inf.primary_channel === 'tiktok' ? '틱톡' : '인스타',
        followers: typeof inf.followers === 'object' && inf.followers !== null ? (inf.followers.instagram || inf.followers.youtube || '10만') : '10만',
        engagement: typeof inf.avg_engagement === 'object' && inf.avg_engagement !== null ? `${inf.avg_engagement.instagram || 5.0}%` : '5.0%',
        status: ci.status,
        status_label: ci.status,
        badge_variant: 'soft' as const,
        fee: ci.proposed_fee || inf.fee_min || 0,
        fee_formatted: `₩${((ci.proposed_fee || inf.fee_min || 0) / 10000).toFixed(0)}만`,
        agency_comment: ci.agency_comment,
        rejection_reason: ci.rejection_reason,
        shipping_status: ci.shipping_status,
        tracking_number: ci.tracking_number,
        draft_versions: [],
        feedback_history: [],
        raw_ci: ci
      }
    })

    return NextResponse.json({ data: campaignInfluencers, formatted })
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
    const supabase = await createClient()
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
        agency_comment: agency_comment || null
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
      metadata: { influencer_id }
    })

    return NextResponse.json({ data: newCI }, { status: 201 })
  } catch (error: any) {
    console.error('Error adding influencer to campaign:', error)
    return NextResponse.json({ error: error.message || 'Failed to add influencer' }, { status: 500 })
  }
}
