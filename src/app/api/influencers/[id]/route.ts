import { NextResponse, NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export interface InfluencerDetailItem {
  id: string
  name: string
  handle: string
  avatar_initial?: string
  avatar_color_class?: string
  channel?: string
  channel_label?: string
  category?: string
  categories_list?: string[]
  email?: string | null
  phone?: string | null
  followers?: number
  followers_formatted?: string
  engagement_rate?: number
  engagement_rate_formatted?: string
  fee?: number
  fee_formatted?: string
  fee_range_formatted?: string
  status?: string
  status_label?: string
  is_blacklisted?: boolean
  past_brands?: string[]
  response_rate?: string
  total_collaborations?: number
  memo?: string
  contact_history?: any[]
  recent_campaigns?: any[]
  campaign_history?: any[]
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const supabase = createServiceClient()

    const { data: influencer, error } = await supabase
      .from('influencers')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !influencer) {
      return NextResponse.json({ error: 'Influencer not found' }, { status: 404 })
    }

    const name = influencer.name || '알 수 없음'
    const channel = influencer.primary_channel || 'instagram'
    const followersObj = influencer.followers as Record<string, any> | null
    const engagementObj = influencer.avg_engagement as Record<string, any> | null

    const followerCount = typeof followersObj === 'object' && followersObj !== null && !Array.isArray(followersObj) ? (followersObj.instagram || followersObj.youtube || 0) : Number(influencer.followers) || 0
    const engagementRate = typeof engagementObj === 'object' && engagementObj !== null && !Array.isArray(engagementObj) ? (engagementObj.instagram || engagementObj.youtube || 0) : Number(influencer.avg_engagement) || 0
    const feeMin = influencer.fee_min || 0

    const formatted: InfluencerDetailItem = {
      id: influencer.id,
      name,
      handle: influencer.handle || '',
      avatar_initial: name[0],
      avatar_color_class: 'c1',
      channel,
      channel_label: channel === 'youtube' ? '유튜브' : channel === 'tiktok' ? '틱톡' : '인스타',
      category: (influencer.categories && influencer.categories[0]) || '일반',
      categories_list: influencer.categories || ['일반'],
      email: influencer.email,
      phone: influencer.phone,
      followers: followerCount,
      followers_formatted: followerCount > 0 ? `${(followerCount / 10000).toFixed(1)}만` : '0',
      engagement_rate: engagementRate,
      engagement_rate_formatted: `${engagementRate.toFixed(1)}%`,
      fee: feeMin,
      fee_formatted: feeMin > 0 ? `₩${(feeMin / 10000).toFixed(0)}만` : '₩0',
      fee_range_formatted: `₩${((influencer.fee_min || 0) / 10000).toFixed(0)}만 ~ ₩${((influencer.fee_max || influencer.fee_min || 0) / 10000).toFixed(0)}만`,
      status: influencer.is_blacklisted ? 'blacklisted' : 'candidate',
      status_label: influencer.is_blacklisted ? '블랙리스트' : '후보',
      is_blacklisted: !!influencer.is_blacklisted,
      past_brands: influencer.past_brands || [],
      response_rate: influencer.response_rate ? `${influencer.response_rate}%` : '90%',
      total_collaborations: influencer.collab_count || 0,
      memo: influencer.notes || '',
      contact_history: [],
      recent_campaigns: [],
      campaign_history: []
    }

    return NextResponse.json({
      data: influencer,
      ...formatted
    })
  } catch (error: any) {
    console.error('Error fetching influencer detail:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const supabase = createServiceClient()
    const body = await request.json()

    const { data: updated, error } = await supabase
      .from('influencers')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error || !updated) {
      return NextResponse.json({ error: error?.message || 'Failed to update influencer' }, { status: 500 })
    }

    return NextResponse.json({ data: updated })
  } catch (error: any) {
    console.error('Error updating influencer:', error)
    return NextResponse.json({ error: error.message || 'Failed to update influencer' }, { status: 500 })
  }
}
