import { NextResponse, NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'
import { STAGE_LABELS, type CampaignStage } from '@/types'

export interface CampaignCardData {
  id: string
  client_id?: string
  client_name: string
  title: string
  stage: CampaignStage
  status_badge?: {
    label: string
    variant: 'soft' | 'gray' | 'warn' | 'danger' | 'dark'
  } | null
  progress?: number | null
  meta_text?: string | null
  fee_info?: {
    amount: string
    fee_badge: string
  } | null
  assignees: Array<{
    name: string
    avatar: string
    color: string
  }>
  dday: string
  dday_variant: 'default' | 'warm' | 'hot'
  border_highlight?: boolean
  portal_token?: string
  budget?: number | null
  product_name?: string
  content_deadline?: string | null
  upload_deadline?: string | null
  target_influencers_count?: number | null
  created_at?: string
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceClient()
    const { searchParams } = new URL(request.url)
    const stageParam = searchParams.get('stage')
    const clientIdParam = searchParams.get('client_id')

    let query = supabase
      .from('campaigns')
      .select('*, clients(name), users:assignee_id(name)')
      .order('created_at', { ascending: false })

    if (stageParam && stageParam !== 'all') {
      query = query.eq('stage', stageParam as Database['public']['Enums']['campaign_stage'])
    }

    if (clientIdParam && clientIdParam !== 'all') {
      query = query.eq('client_id', clientIdParam)
    }

    const { data: campaigns, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const formatted: CampaignCardData[] = (campaigns || []).map((c: any) => {
      const clientName = c.clients?.name || c.client_name || 'CUCKOO'
      const assigneeName = c.users?.name || '현우'
      const stageLabel = STAGE_LABELS[c.stage as CampaignStage] || c.stage

      return {
        id: c.id,
        client_id: c.client_id,
        client_name: clientName,
        title: c.name,
        stage: c.stage,
        status_badge: { label: stageLabel, variant: 'gray' },
        assignees: [{ name: assigneeName, avatar: assigneeName[0], color: 'c1' }],
        dday: 'D-7',
        dday_variant: 'default',
        portal_token: c.portal_token,
        budget: c.budget,
        product_name: c.product_name,
        content_deadline: c.content_deadline,
        upload_deadline: c.upload_deadline,
        target_influencers_count: c.influencer_count_target || 5,
        created_at: c.created_at
      }
    })

    return NextResponse.json({
      data: formatted,
      total: formatted.length,
      totalActive: formatted.filter((c) => c.stage !== 'done').length,
    })
  } catch (error: any) {
    console.error('Error fetching campaigns:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServiceClient()
    const body = await request.json()

    let clientId = body.client_id

    // 만약 client_id가 명칭 형태로 왔을 경우 clients 테이블에서 일치하는 것 찾기
    if (!clientId && body.client_name) {
      const { data: matchedClient } = await supabase
        .from('clients')
        .select('id')
        .eq('name', body.client_name)
        .limit(1)
        .single()

      if (matchedClient) {
        clientId = matchedClient.id
      }
    }

    // fallback client if null
    if (!clientId) {
      const { data: firstClient } = await supabase
        .from('clients')
        .select('id')
        .limit(1)
        .single()

      clientId = firstClient?.id
    }

    if (!clientId) {
      return NextResponse.json({ error: '유효한 광고주가 선택되지 않았습니다.' }, { status: 400 })
    }

    const title = body.title || body.name || '새 캠페인'
    const productName = body.product_name || '신제품'
    const portalToken = crypto.randomUUID()

    const insertData = {
      name: title,
      client_id: clientId,
      product_name: productName,
      product_description: body.product_description || null,
      goal: (body.goal as Database['public']['Enums']['campaign_goal']) || 'awareness',
      channels: Array.isArray(body.channels) ? body.channels : ['instagram'],
      influencer_count_target: Number(body.target_influencers_count || body.influencer_count_target) || 5,
      categories: Array.isArray(body.categories) ? body.categories : ['푸드'],
      brief: body.content_direction || null,
      restrictions: body.prohibitions || null,
      ship_date: body.shipping_date || null,
      content_deadline: body.content_deadline || null,
      upload_deadline: body.upload_deadline || null,
      budget: body.budget ? Number(body.budget) : null,
      stage: 'preparing' as Database['public']['Enums']['campaign_stage'],
      portal_token: portalToken
    }

    const { data: newCampaign, error: createError } = await supabase
      .from('campaigns')
      .insert(insertData)
      .select()
      .single()

    if (createError || !newCampaign) {
      return NextResponse.json({ error: createError?.message || 'Failed to create campaign' }, { status: 500 })
    }

    // activity_logs INSERT (type: 'campaign_created')
    await supabase.from('activity_logs').insert({
      campaign_id: newCampaign.id,
      type: 'campaign_created',
      actor_type: 'agency_manager',
      actor_name: '담당자',
      description: `캠페인 "${newCampaign.name}"이(가) 생성되었습니다.`
    })

    return NextResponse.json(newCampaign, { status: 201 })
  } catch (error: any) {
    console.error('Error creating campaign:', error)
    return NextResponse.json({ error: error.message || 'Failed to create campaign' }, { status: 500 })
  }
}
