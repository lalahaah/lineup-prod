import { NextResponse, NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 })
  }

  try {
    const supabase = createServiceClient()
    const body = await request.json()
    const { selections } = body // Array<{ id: string, action: 'select' | 'pass' }>

    // 1. campaigns 테이블에서 portal_token으로 조회
    const { data: campaign, error: campError } = await supabase
      .from('campaigns')
      .select('id, name')
      .eq('portal_token', token)
      .single()

    if (campError || !campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    // 2. selections 배열로 campaign_influencers status 업데이트 (select -> 'selected', pass -> 'passed')
    if (Array.isArray(selections) && selections.length > 0) {
      for (const item of selections) {
        const targetId = item.id || item.campaign_influencer_id
        const isSelect = item.action === 'select' || item.status === 'chosen' || item.status === 'selected'
        const nextStatus = isSelect ? 'selected' : 'passed'

        if (targetId) {
          await supabase
            .from('campaign_influencers')
            .update({ status: nextStatus })
            .eq('id', targetId)
        }
      }
    }

    // 3. campaigns.stage -> 'outreaching' 자동 변경
    await supabase
      .from('campaigns')
      .update({ stage: 'outreaching' })
      .eq('id', campaign.id)

    // 4. activity_logs INSERT
    await supabase.from('activity_logs').insert({
      campaign_id: campaign.id,
      type: 'client_selected',
      actor_type: 'client',
      actor_name: '광고주',
      description: '광고주가 인플루언서 후보 선택 결과를 전달했습니다. (섭외중 단계로 이동)',
      metadata: { selections_count: selections?.length || 0 }
    })

    return NextResponse.json({
      success: true,
      message: '선택 결과가 반영되었습니다. (섭외중 단계로 변경)',
      token,
    })
  } catch (error: any) {
    console.error('Error submitting portal selection:', error)
    return NextResponse.json({ error: error.message || 'Failed to submit selection' }, { status: 500 })
  }
}
