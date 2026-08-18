import { NextResponse, NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { CHANNEL_LABELS } from '@/lib/utils'

export interface ChannelDetailInfo {
  type: string
  label: string
  handle?: string
  url: string
  followers: number
  followers_formatted: string
}

export interface InfluencerDetailItem {
  id: string
  name: string
  handle: string
  avatar_initial?: string
  avatar_color_class?: string
  channel?: string
  channel_label?: string
  channels?: ChannelDetailInfo[]
  channel_urls?: Record<string, string>
  channel_handles?: Record<string, string>
  category?: string
  categories_list?: string[]
  email?: string | null
  phone?: string | null
  followers?: any
  followers_formatted?: string
  engagement_rate?: number
  engagement_rate_formatted?: string
  fee?: number
  fee_min?: number | null
  fee_max?: number | null
  fee_formatted?: string
  fee_range_formatted?: string
  status?: string
  status_label?: string
  is_blacklisted?: boolean
  blacklist_reason?: string | null
  past_brands?: string[]
  response_rate?: string
  total_collaborations?: number
  memo?: string
  notes?: string | null
  contact_history?: any[]
  recent_campaigns?: any[]
  campaign_history?: any[]
}

function formatInfluencerData(influencer: any): InfluencerDetailItem {
  const name = influencer.name || '알 수 없음'
  const channel = influencer.primary_channel || 'instagram'
  const channelUrlsObj = (influencer.channel_urls as Record<string, string> | null) || {}
  const channelHandlesObj = (influencer.channel_handles as Record<string, string> | null) || {}
  const followersObj = influencer.followers as Record<string, any> | null
  const engagementObj = influencer.avg_engagement as Record<string, any> | null

  const followerCount =
    typeof followersObj === 'object' && followersObj !== null && !Array.isArray(followersObj)
      ? followersObj[channel] || followersObj.instagram || followersObj.youtube || 0
      : Number(influencer.followers) || 0

  const engagementRate =
    typeof engagementObj === 'object' && engagementObj !== null && !Array.isArray(engagementObj)
      ? engagementObj[channel] || engagementObj.instagram || engagementObj.youtube || 0
      : Number(influencer.avg_engagement) || 0

  const feeMin = influencer.fee_min || 0
  const feeMax = influencer.fee_max || feeMin

  // Build channels list for multi-channel display
  const keys = Array.from(
    new Set([
      channel,
      ...Object.keys(channelUrlsObj),
      ...Object.keys(channelHandlesObj),
      ...Object.keys(typeof followersObj === 'object' && followersObj !== null ? followersObj : {}),
    ])
  )

  const channels: ChannelDetailInfo[] = keys.map((type) => {
    const url = channelUrlsObj[type] || ''
    const handle = channelHandlesObj[type] || (type === channel ? influencer.handle || '' : '')
    const follNum =
      typeof followersObj === 'object' && followersObj !== null && !Array.isArray(followersObj)
        ? Number(followersObj[type]) || 0
        : typeof followersObj === 'number'
        ? followersObj
        : 0

    return {
      type,
      label: CHANNEL_LABELS[type] || type,
      handle,
      url,
      followers: follNum,
      followers_formatted: follNum > 0 ? `${(follNum / 10000).toFixed(1)}만` : '0',
    }
  })

  const displayHandle = channelHandlesObj[channel] || Object.values(channelHandlesObj)[0] || influencer.handle || ''

  return {
    id: influencer.id,
    name,
    handle: displayHandle,
    avatar_initial: name[0],
    avatar_color_class: 'c1',
    channel,
    channel_label: CHANNEL_LABELS[channel] || channel,
    channels,
    channel_urls: channelUrlsObj,
    channel_handles: channelHandlesObj,
    category: (influencer.categories && influencer.categories[0]) || '일반',
    categories_list: influencer.categories || ['일반'],
    email: influencer.email,
    phone: influencer.phone,
    followers: followersObj,
    followers_formatted: followerCount > 0 ? `${(followerCount / 10000).toFixed(1)}만` : '0',
    engagement_rate: engagementRate,
    engagement_rate_formatted: `${engagementRate.toFixed(1)}%`,
    fee: feeMin,
    fee_min: influencer.fee_min,
    fee_max: influencer.fee_max,
    fee_formatted: feeMin > 0 ? `₩${(feeMin / 10000).toFixed(0)}만` : '₩0',
    fee_range_formatted: `₩${((feeMin || 0) / 10000).toFixed(0)}만 ~ ₩${((feeMax || 0) / 10000).toFixed(0)}만`,
    status: influencer.is_blacklisted ? 'blacklisted' : 'candidate',
    status_label: influencer.is_blacklisted ? '블랙리스트' : '후보',
    is_blacklisted: !!influencer.is_blacklisted,
    blacklist_reason: influencer.blacklist_reason || null,
    past_brands: influencer.past_brands || [],
    response_rate: influencer.response_rate ? `${influencer.response_rate}%` : '90%',
    total_collaborations: influencer.collab_count || 0,
    memo: influencer.notes || '',
    notes: influencer.notes || '',
    contact_history: [],
    recent_campaigns: [],
    campaign_history: [],
  }
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

    const formatted = formatInfluencerData(influencer)

    return NextResponse.json({
      data: influencer,
      ...formatted,
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

    const updatePayload: Record<string, any> = {}

    if (body.name !== undefined) updatePayload.name = body.name
    if (body.email !== undefined) updatePayload.email = body.email
    if (body.phone !== undefined) updatePayload.phone = body.phone
    if (body.channel_urls !== undefined) updatePayload.channel_urls = body.channel_urls
    if (body.channel_handles !== undefined) updatePayload.channel_handles = body.channel_handles
    if (body.followers !== undefined) updatePayload.followers = body.followers
    if (body.primary_channel !== undefined) updatePayload.primary_channel = body.primary_channel
    if (body.categories !== undefined) updatePayload.categories = body.categories
    if (body.fee_min !== undefined) updatePayload.fee_min = body.fee_min
    if (body.fee_max !== undefined) updatePayload.fee_max = body.fee_max
    if (body.notes !== undefined) updatePayload.notes = body.notes
    if (body.memo !== undefined) updatePayload.notes = body.memo
    if (body.is_blacklisted !== undefined) updatePayload.is_blacklisted = body.is_blacklisted
    if (body.blacklist_reason !== undefined) updatePayload.blacklist_reason = body.blacklist_reason

    const { data: updated, error } = await supabase
      .from('influencers')
      .update(updatePayload as any)
      .eq('id', id)
      .select()
      .single()

    if (error || !updated) {
      return NextResponse.json({ error: error?.message || 'Failed to update influencer' }, { status: 500 })
    }

    const formatted = formatInfluencerData(updated)

    return NextResponse.json({
      data: updated,
      ...formatted,
    })
  } catch (error: any) {
    console.error('Error updating influencer:', error)
    return NextResponse.json({ error: error.message || 'Failed to update influencer' }, { status: 500 })
  }
}
