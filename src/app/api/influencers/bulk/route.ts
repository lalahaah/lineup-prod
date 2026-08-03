import { NextResponse, NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServiceClient()
    const body = await request.json()
    const influencersList = Array.isArray(body.influencers) ? body.influencers : []

    if (influencersList.length === 0) {
      return NextResponse.json({ error: 'No influencers provided' }, { status: 400 })
    }

    // 1. Fetch existing emails to prevent duplicates
    const { data: existingRecords } = await supabase
      .from('influencers')
      .select('email')
      .not('email', 'is', null)

    const existingEmailSet = new Set(
      (existingRecords || [])
        .map((r) => r.email?.trim().toLowerCase())
        .filter(Boolean)
    )

    let createdCount = 0
    let skippedCount = 0

    const recordsToInsert: any[] = []

    for (const item of influencersList) {
      const name = (item.name || item['이름*'] || item['이름'])?.toString().trim()
      if (!name) {
        skippedCount++
        continue
      }

      const email = (item.email || item['이메일'])?.toString().trim().toLowerCase() || null
      if (email && existingEmailSet.has(email)) {
        skippedCount++
        continue
      }

      if (email) existingEmailSet.add(email)

      const primaryChannel = ((item.primary_channel || item.channel || item['주요채널*'] || item['주요채널'] || 'instagram')
        .toString()
        .trim()
        .toLowerCase()) as Database['public']['Enums']['channel_type']

      const handle = (item.handle || item['핸들'])?.toString().trim() || null
      const channelUrl = (item.channel_url || item.url || item['채널URL'])?.toString().trim() || ''
      const followersNum = Number(item.followers || item['팔로워수']) || 0

      let categoriesArray: string[] = ['기타']
      const catInput = item.categories || item['카테고리(쉼표구분)'] || item['카테고리']
      if (Array.isArray(catInput)) {
        categoriesArray = catInput
      } else if (typeof catInput === 'string' && catInput.trim()) {
        categoriesArray = catInput.split(',').map((c) => c.trim()).filter(Boolean)
      }

      const feeMin = Number(item.fee_min || item.min_fee || item['단가최소(원)']) || 0
      const feeMax = Number(item.fee_max || item.max_fee || item['단가최대(원)']) || feeMin
      const notes = (item.notes || item.memo || item['메모'])?.toString().trim() || null
      const phone = (item.phone || item['연락처'])?.toString().trim() || null

      const channelUrlsObj = channelUrl ? { [primaryChannel]: channelUrl } : {}
      const channelHandlesObj = handle ? { [primaryChannel]: handle } : {}
      const followersObj = { [primaryChannel]: followersNum }

      recordsToInsert.push({
        name,
        handle: handle ? (handle.startsWith('@') || handle.includes(' ') ? handle : `@${handle}`) : null,
        primary_channel: primaryChannel,
        categories: categoriesArray,
        channel_urls: channelUrlsObj,
        channel_handles: channelHandlesObj,
        followers: followersObj,
        avg_engagement: { [primaryChannel]: 5.0 },
        fee_min: feeMin,
        fee_max: feeMax,
        email: email || null,
        phone,
        notes,
        is_blacklisted: false,
        is_public: true,
        is_verified: false,
      })

      createdCount++
    }

    if (recordsToInsert.length > 0) {
      const { error } = await supabase.from('influencers').insert(recordsToInsert)
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    }

    return NextResponse.json({ created: createdCount, skipped: skippedCount }, { status: 201 })
  } catch (error: any) {
    console.error('Error bulk adding influencers:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
