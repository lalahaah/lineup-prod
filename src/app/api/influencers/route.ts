import { NextResponse, NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'
import { CHANNEL_LABELS } from '@/lib/utils'

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
      const followersNum = typeof followersObj === 'object' && followersObj !== null && !Array.isArray(followersObj) ? (followersObj.instagram || followersObj.youtube || 0) : Number(inf.followers) || 0
      const engagementNum = typeof engagementObj === 'object' && engagementObj !== null && !Array.isArray(engagementObj) ? (engagementObj.instagram || engagementObj.youtube || 0) : Number(inf.avg_engagement) || 0
      const feeNum = inf.fee_min || 0

      return {
        id: inf.id,
        name: inf.name,
        handle: inf.handle || '',
        avatar_initial: (inf.name || '인')[0],
        avatar_color_class: 'c1',
        channel: inf.primary_channel || 'instagram',
        channel_label: CHANNEL_LABELS[inf.primary_channel] || inf.primary_channel || '인스타그램',
        category: (inf.categories && inf.categories[0]) || '일반',
        followers: followersNum,
        followers_formatted: followersNum > 0 ? `${(followersNum / 10000).toFixed(1)}만` : '0',
        engagement_rate: engagementNum,
        engagement_rate_formatted: `${engagementNum.toFixed(1)}%`,
        fee: feeNum,
        fee_formatted: feeNum > 0 ? `₩${(feeNum / 10000).toFixed(0)}만` : '₩0',
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
      handle,
      channel,
      primary_channel,
      category,
      followers,
      channel_urls,
      fee,
      min_fee,
      max_fee,
      email,
      phone,
      memo,
    } = body

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const primaryChannel = ((primary_channel || channel) as Database['public']['Enums']['channel_type']) || 'instagram'
    const categoriesArray = Array.isArray(category) ? category : [category || '기타']

    const feeMin = Number(min_fee ?? fee) || 0
    const feeMax = Number(max_fee ?? feeMin) || feeMin

    let followersObj: Record<string, number> = {}
    if (typeof followers === 'object' && followers !== null && !Array.isArray(followers)) {
      followersObj = followers
    } else {
      followersObj = { [primaryChannel]: Number(followers) || 0 }
    }

    let channelUrlsObj: Record<string, string> = {}
    if (typeof channel_urls === 'object' && channel_urls !== null && !Array.isArray(channel_urls)) {
      channelUrlsObj = channel_urls
    } else if (body.channel_url) {
      channelUrlsObj = { [primaryChannel]: body.channel_url }
    }

    const { data: newInf, error } = await supabase
      .from('influencers')
      .insert({
        name: name.trim(),
        handle: handle ? (handle.startsWith('@') ? handle : `@${handle}`) : null,
        primary_channel: primaryChannel,
        categories: categoriesArray,
        channel_urls: channelUrlsObj,
        followers: followersObj,
        avg_engagement: { [primaryChannel]: 5.0 },
        fee_min: feeMin,
        fee_max: feeMax,
        email: email || null,
        phone: phone || null,
        notes: memo || null,
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
