import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'
import type { CampaignStage } from '@/types'

export interface CampaignDetailData {
  id: string
  title: string
  client: string
  client_id?: string
  stage: CampaignStage
  assignee: string
  influencer_count: number
  approved_count: number
  content_deadline: string
  dday: string
  dday_variant: 'default' | 'warm' | 'hot'
  portal_token: string
  product_name: string
  channels_text: string
  post_period: string
  hashtags: string[]
  budget?: number | null
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const supabase = await createClient()

    const { data: campaign, error } = await supabase
      .from('campaigns')
      .select('*, clients(*), users:assignee_id(*)')
      .eq('id', id)
      .single()

    if (error || !campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    const clientObj = campaign.clients as any || {}
    const userObj = campaign.users as any || {}

    const formatted: CampaignDetailData = {
      id: campaign.id,
      title: campaign.name,
      client: clientObj.name || 'CUCKOO',
      client_id: campaign.client_id,
      stage: campaign.stage as CampaignStage,
      assignee: userObj.name || '담당자',
      influencer_count: campaign.influencer_count_target || 5,
      approved_count: 3,
      content_deadline: campaign.content_deadline || '',
      dday: '마감 D-3',
      dday_variant: 'warm',
      portal_token: campaign.portal_token || '',
      product_name: campaign.product_name,
      channels_text: (campaign.channels || []).join(' / '),
      post_period: campaign.upload_deadline ? `${campaign.content_deadline || ''} ~ ${campaign.upload_deadline}` : '',
      hashtags: campaign.categories || ['#신제품'],
      budget: campaign.budget
    }

    return NextResponse.json({
      data: campaign,
      ...formatted
    })
  } catch (error: any) {
    console.error('Error fetching campaign detail:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const supabase = await createClient()
    const body = await request.json()

    // 1. 기존 캠페인 정보 조회
    const { data: existing } = await supabase
      .from('campaigns')
      .select('stage, name')
      .eq('id', id)
      .single()

    // 2. 전달된 필드만 UPDATE
    const { data: updated, error: updateError } = await supabase
      .from('campaigns')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (updateError || !updated) {
      return NextResponse.json({ error: updateError?.message || 'Failed to update campaign' }, { status: 500 })
    }

    // 3. stage 변경 시 activity_logs INSERT (type: 'stage_changed')
    if (body.stage && existing && body.stage !== existing.stage) {
      await supabase.from('activity_logs').insert({
        campaign_id: id,
        type: 'stage_changed',
        actor_type: 'agency_manager',
        actor_name: '담당자',
        description: `캠페인 단계가 ${existing.stage}에서 ${body.stage}(으)로 변경되었습니다.`,
        metadata: { old_stage: existing.stage, new_stage: body.stage }
      })
    }

    return NextResponse.json({ data: updated })
  } catch (error: any) {
    console.error('Error updating campaign:', error)
    return NextResponse.json({ error: error.message || 'Failed to update campaign' }, { status: 500 })
  }
}
