import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { InfluencerItem } from '@/types'

// TODO: DB 연동 시 influencers 테이블과 연결하고, 현재는 Influencers.html 목업과 동일한 데이터 제공
const MOCK_INFLUENCERS: InfluencerItem[] = [
  {
    id: 'inf-1',
    name: '유리쿡',
    handle: '@yuri_cooks',
    avatar_initial: '유',
    avatar_color_class: 'c1',
    channel: 'instagram',
    channel_label: '인스타',
    category: '푸드',
    followers: 125000,
    followers_formatted: '12.5만',
    engagement_rate: 4.8,
    engagement_rate_formatted: '4.8%',
    fee: 800000,
    fee_formatted: '₩80만',
    status: 'candidate',
    status_label: '후보',
    is_blacklisted: false,
  },
  {
    id: 'inf-2',
    name: '먹방준',
    handle: '@mukbang_jun',
    avatar_initial: '준',
    avatar_color_class: 'c3',
    channel: 'youtube',
    channel_label: '유튜브',
    category: '푸드',
    followers: 520000,
    followers_formatted: '52만',
    engagement_rate: 6.1,
    engagement_rate_formatted: '6.1%',
    fee: 4000000,
    fee_formatted: '₩400만',
    status: 'candidate',
    status_label: '후보',
    is_blacklisted: false,
  },
  {
    id: 'inf-3',
    name: '소연홈',
    handle: '@soyeon.home',
    avatar_initial: '소',
    avatar_color_class: 'c2',
    channel: 'instagram',
    channel_label: '인스타',
    category: '리빙',
    followers: 82000,
    followers_formatted: '8.2만',
    engagement_rate: 5.4,
    engagement_rate_formatted: '5.4%',
    fee: 600000,
    fee_formatted: '₩60만',
    status: 'candidate',
    status_label: '후보',
    is_blacklisted: false,
  },
  {
    id: 'inf-4',
    name: '하나테이블',
    handle: '@hana_table',
    avatar_initial: '하',
    avatar_color_class: 'c4',
    channel: 'instagram',
    channel_label: '인스타',
    category: '푸드',
    followers: 210000,
    followers_formatted: '21만',
    engagement_rate: 3.9,
    engagement_rate_formatted: '3.9%',
    fee: 1200000,
    fee_formatted: '₩120만',
    status: 'uncontacted',
    status_label: '미접촉',
    is_blacklisted: false,
  },
  {
    id: 'inf-5',
    name: '리빙민지',
    handle: '@minji.living',
    avatar_initial: '민',
    avatar_color_class: 'c5',
    channel: 'tiktok',
    channel_label: '틱톡',
    category: '리빙',
    followers: 340000,
    followers_formatted: '34만',
    engagement_rate: 7.2,
    engagement_rate_formatted: '7.2%',
    fee: 2500000,
    fee_formatted: '₩250만',
    status: 'uncontacted',
    status_label: '미접촉',
    is_blacklisted: false,
  },
  {
    id: 'inf-6',
    name: '집밥현이',
    handle: '@hyuni.eats',
    avatar_initial: '현',
    avatar_color_class: 'c6',
    channel: 'youtube',
    channel_label: '유튜브',
    category: '푸드',
    followers: 170000,
    followers_formatted: '17만',
    engagement_rate: 5.0,
    engagement_rate_formatted: '5.0%',
    fee: 1500000,
    fee_formatted: '₩150만',
    status: 'candidate',
    status_label: '후보',
    is_blacklisted: false,
  },
  {
    id: 'inf-7',
    name: '단우집밥',
    handle: '@danwoo.home',
    avatar_initial: '단',
    avatar_color_class: 'c0',
    channel: 'instagram',
    channel_label: '인스타',
    category: '리빙',
    followers: 94000,
    followers_formatted: '9.4만',
    engagement_rate: 2.1,
    engagement_rate_formatted: '2.1%',
    fee: 900000,
    fee_formatted: '₩90만',
    status: 'blacklisted',
    status_label: '블랙리스트',
    is_blacklisted: true,
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim().toLowerCase() || ''
  const channelsParam = searchParams.get('channels') || ''
  const categoriesParam = searchParams.get('categories') || ''
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '20', 10)
  const excludeBlacklistParam = searchParams.get('exclude_blacklist')
  const excludeBlacklist = excludeBlacklistParam === null ? true : excludeBlacklistParam === 'true'

  try {
    let filtered = [...MOCK_INFLUENCERS]

    // 1. 블랙리스트 제외 필터링
    if (excludeBlacklist) {
      filtered = filtered.filter((inf) => !inf.is_blacklisted && inf.status !== 'blacklisted')
    }

    // 2. 검색어 필터링 (이름 / 핸들)
    if (q) {
      filtered = filtered.filter(
        (inf) => inf.name.toLowerCase().includes(q) || inf.handle.toLowerCase().includes(q)
      )
    }

    // 3. 채널 필터링 (콤마 구분)
    if (channelsParam) {
      const channelList = channelsParam.split(',').map((c) => c.trim().toLowerCase())
      if (channelList.length > 0 && !channelList.includes('all')) {
        filtered = filtered.filter(
          (inf) =>
            channelList.includes(inf.channel.toLowerCase()) ||
            channelList.includes(inf.channel_label.toLowerCase())
        )
      }
    }

    // 4. 카테고리 필터링 (콤마 구분)
    if (categoriesParam) {
      const categoryList = categoriesParam.split(',').map((c) => c.trim().toLowerCase())
      if (categoryList.length > 0 && !categoryList.includes('all')) {
        filtered = filtered.filter((inf) =>
          categoryList.some((cat) => inf.category.toLowerCase().includes(cat))
        )
      }
    }

    // 페이지네이션
    const startIndex = (page - 1) * limit
    const paginatedData = filtered.slice(startIndex, startIndex + limit)

    return NextResponse.json({
      data: paginatedData,
      total: filtered.length,
      totalCount: 348,
      page,
      limit,
    })
  } catch (error) {
    console.error('Error fetching influencers:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, handle, channel, category, followers, fee } = body

    if (!name || !handle) {
      return NextResponse.json({ error: 'Name and handle are required' }, { status: 400 })
    }

    const newInfluencer: InfluencerItem = {
      id: `inf-${Date.now()}`,
      name,
      handle: handle.startsWith('@') ? handle : `@${handle}`,
      avatar_initial: name.charAt(0),
      avatar_color_class: 'c1',
      channel: channel || 'instagram',
      channel_label: channel === 'youtube' ? '유튜브' : channel === 'tiktok' ? '틱톡' : '인스타',
      category: category || '기타',
      followers: Number(followers) || 0,
      followers_formatted: followers ? `${(Number(followers) / 10000).toFixed(1)}만` : '0',
      engagement_rate: 0,
      engagement_rate_formatted: '0.0%',
      fee: Number(fee) || 0,
      fee_formatted: fee ? `₩${(Number(fee) / 10000).toFixed(0)}만` : '₩0',
      status: 'uncontacted',
      status_label: '미접촉',
      is_blacklisted: false,
    }

    // 목업 응답 반환
    return NextResponse.json(newInfluencer, { status: 201 })
  } catch (error) {
    console.error('Error creating influencer:', error)
    return NextResponse.json({ error: 'Failed to create influencer' }, { status: 500 })
  }
}
