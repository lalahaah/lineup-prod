import { NextResponse, NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'
import { CHANNEL_LABELS } from '@/lib/utils'

function formatFeeRange(minFee?: number | null, maxFee?: number | null): string {
  const min = Number(minFee) || 0
  const max = Number(maxFee) || 0

  if (min <= 0 && max <= 0) return '₩0'

  const minMan = Math.round(min / 10000)
  const maxMan = Math.round(max / 10000)

  if (min > 0 && max > 0 && min !== max) {
    return `${minMan}만원~${maxMan}만원`
  }
  if (min > 0) {
    return `${minMan}만원~`
  }
  if (max > 0) {
    return `~${maxMan}만원`
  }
  return '₩0'
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim() || ''
  const channelsParam = searchParams.get('channels') || ''
  const categoriesParam = searchParams.get('categories') || ''
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '20', 10)
  const excludeBlacklistParam = searchParams.get('exclude_blacklist')
  const excludeBlacklist = excludeBlacklistParam === null ? true : excludeBlacklistParam === 'true'

  try {
    const supabase = createServiceClient()

    let query = supabase
      .from('influencers')
      .select('*', { count: 'exact' })

    // 1. exclude_blacklist=true: is_blacklisted = false
    if (excludeBlacklist) {
      query = query.eq('is_blacklisted', false)
    }

    // 2. q: name 또는 handle ilike 검색
    if (q) {
      query = query.or(`name.ilike.%${q}%,handle.ilike.%${q}%`)
    }

    // 3. channels: primary_channel IN 필터
    if (channelsParam) {
      const channelList = channelsParam.split(',').map((c) => c.trim()).filter((c) => c && c !== 'all')
      if (channelList.length > 0) {
        query = query.in('primary_channel', channelList as Database['public']['Enums']['channel_type'][])
      }
    }

    // 4. categories: categories 배열 contains 필터
    if (categoriesParam) {
      const categoryList = categoriesParam.split(',').map((c) => c.trim()).filter((c) => c && c !== 'all')
      if (categoryList.length > 0) {
        query = query.contains('categories', categoryList)
      }
    }

    // 5. page, limit으로 페이지네이션
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to).order('created_at', { ascending: false })

    const { data: influencers, count, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const formatted = (influencers || []).map((inf: any) => {
      const followersObj = inf.followers as Record<string, any> | null
      const engagementObj = inf.avg_engagement as Record<string, any> | null
      const primaryChannel = inf.primary_channel || 'instagram'

      const followerCount = typeof followersObj === 'object' && followersObj !== null && !Array.isArray(followersObj)
        ? (followersObj[primaryChannel] || followersObj.instagram || followersObj.youtube || 0)
        : Number(inf.followers) || 0

      const engagementNum = typeof engagementObj === 'object' && engagementObj !== null && !Array.isArray(engagementObj)
        ? (engagementObj[primaryChannel] || engagementObj.instagram || engagementObj.youtube || 0)
        : Number(inf.avg_engagement) || 0

      const followersFormatted = followerCount > 0 ? `${Math.round(followerCount / 1000) / 10}만` : '0'
      const feeFormatted = formatFeeRange(inf.fee_min, inf.fee_max)

      const channelHandles = (inf.channel_handles as Record<string, string> | null) || {}
      const displayHandle = channelHandles[primaryChannel] || Object.values(channelHandles)[0] || inf.handle || ''

      return {
        id: inf.id,
        name: inf.name,
        handle: displayHandle,
        avatar_initial: (inf.name || '인')[0],
        avatar_color_class: 'c1',
        channel: primaryChannel,
        channel_label: CHANNEL_LABELS[primaryChannel] || primaryChannel || '인스타그램',
        category: (inf.categories && inf.categories[0]) || '일반',
        followers: followerCount,
        followers_formatted: followersFormatted,
        engagement_rate: engagementNum,
        engagement_rate_formatted: `${engagementNum.toFixed(1)}%`,
        fee: inf.fee_min || 0,
        fee_formatted: feeFormatted,
        status: inf.is_blacklisted ? 'blacklisted' : 'candidate',
        status_label: inf.is_blacklisted ? '블랙리스트' : '후보',
        is_blacklisted: !!inf.is_blacklisted,
      }
    })

    return NextResponse.json({
      data: formatted,
      raw_data: influencers,
      total: count ?? formatted.length,
      totalCount: count ?? formatted.length,
      page,
      limit,
    })
  } catch (error: any) {
    console.error('Error fetching influencers:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServiceClient()
    const body = await request.json()

    const {
      name,
      email,
      phone,
      channels,
      categories,
      category,
      fee_min,
      fee_max,
      fee,
      notes,
      memo,
      handle,
    } = body

    if (!name || !String(name).trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    let primaryChannel: Database['public']['Enums']['channel_type'] = 'instagram'
    let channelUrlsObj: Record<string, string> = {}
    let channelHandlesObj: Record<string, string> = {}
    let followersObj: Record<string, number> = {}

    if (Array.isArray(channels) && channels.length > 0) {
      primaryChannel = (channels[0].type || 'instagram') as Database['public']['Enums']['channel_type']
      channels.forEach((ch: any) => {
        if (ch.type) {
          if (ch.url) channelUrlsObj[ch.type] = String(ch.url).trim()
          if (ch.handle) channelHandlesObj[ch.type] = String(ch.handle).trim()
          followersObj[ch.type] = Number(ch.followers) || 0
        }
      })
    } else {
      primaryChannel = ((body.primary_channel || body.channel) as Database['public']['Enums']['channel_type']) || 'instagram'
      if (typeof body.channel_urls === 'object' && body.channel_urls !== null && !Array.isArray(body.channel_urls)) {
        channelUrlsObj = body.channel_urls
      } else if (body.channel_url) {
        channelUrlsObj = { [primaryChannel]: body.channel_url }
      }

      if (typeof body.channel_handles === 'object' && body.channel_handles !== null && !Array.isArray(body.channel_handles)) {
        channelHandlesObj = body.channel_handles
      } else if (handle) {
        channelHandlesObj = { [primaryChannel]: handle }
      }

      if (typeof body.followers === 'object' && body.followers !== null && !Array.isArray(body.followers)) {
        followersObj = body.followers
      } else {
        followersObj = { [primaryChannel]: Number(body.followers) || 0 }
      }
    }

    const primaryHandle = channelHandlesObj[primaryChannel] || Object.values(channelHandlesObj)[0] || handle || null

    const categoriesArray = Array.isArray(categories)
      ? categories
      : Array.isArray(category)
      ? category
      : [category || '기타']

    const feeMin = Number(fee_min ?? fee) || 0
    const feeMax = Number(fee_max ?? feeMin) || feeMin
    const notesText = notes || memo || null

    const { data: newInf, error } = await supabase
      .from('influencers')
      .insert({
        name: String(name).trim(),
        handle: primaryHandle ? (primaryHandle.startsWith('@') || primaryHandle.includes(' ') ? primaryHandle : `@${primaryHandle}`) : null,
        primary_channel: primaryChannel,
        categories: categoriesArray,
        channel_urls: channelUrlsObj,
        channel_handles: channelHandlesObj,
        followers: followersObj,
        avg_engagement: { [primaryChannel]: 5.0 },
        fee_min: feeMin,
        fee_max: feeMax,
        email: email || null,
        phone: phone || null,
        notes: notesText,
        is_blacklisted: false,
        is_public: true,
        is_verified: false,
      })
      .select()
      .single()

    if (error || !newInf) {
      return NextResponse.json({ error: error?.message || 'Failed to create influencer' }, { status: 500 })
    }

    return NextResponse.json(newInf, { status: 201 })
  } catch (error: any) {
    console.error('Error creating influencer:', error)
    return NextResponse.json({ error: error.message || 'Failed to create influencer' }, { status: 500 })
  }
}
