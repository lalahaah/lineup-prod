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
    const isAccept = body.accept === true || body.action === 'accept' || body.status === 'confirmed'
    const rejectionReason = body.rejection_reason || body.reason || null

    // 1. access_token으로 campaign_influencers 조회
    const { data: ci, error: fetchError } = await supabase
      .from('campaign_influencers')
      .select('id, campaign_id, influencer_id, influencers(name)')
      .eq('access_token', token)
      .single()

    if (fetchError || !ci) {
      return NextResponse.json({ error: 'Influencer token not found' }, { status: 404 })
    }

    const nextStatus = isAccept ? 'confirmed' : 'rejected'

    // 2. update status & rejection_reason
    const { error: updateError } = await supabase
      .from('campaign_influencers')
      .update({
        status: nextStatus,
        rejection_reason: isAccept ? null : rejectionReason
      })
      .eq('id', ci.id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    const infName = typeof ci.influencers === 'object' && ci.influencers !== null ? (ci.influencers as any).name : '인플루언서'

    // 3. activity_logs INSERT
    await supabase.from('activity_logs').insert({
      campaign_id: ci.campaign_id,
      type: 'influencer_status_changed',
      actor_type: 'influencer',
      actor_name: infName,
      description: `${infName} 님이 섭외 요청을 ${isAccept ? '수락' : '거절'}했습니다.`,
      metadata: { status: nextStatus, rejection_reason: rejectionReason }
    })

    return NextResponse.json({
      success: true,
      action: isAccept ? 'accept' : 'reject',
      status: nextStatus,
      token,
    })
  } catch (error: any) {
    console.error('Error submitting influencer response:', error)
    return NextResponse.json({ error: error.message || 'Failed to submit response' }, { status: 500 })
  }
}
