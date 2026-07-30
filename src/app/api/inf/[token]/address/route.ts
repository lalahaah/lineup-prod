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
    const shippingAddress = body.shipping_address || body

    // 1. access_token으로 campaign_influencers 조회
    const { data: ci, error: fetchError } = await supabase
      .from('campaign_influencers')
      .select('id, campaign_id, influencers(name)')
      .eq('access_token', token)
      .single()

    if (fetchError || !ci) {
      return NextResponse.json({ error: 'Influencer token not found' }, { status: 404 })
    }

    // 2. update shipping_address JSONB
    const { error: updateError } = await supabase
      .from('campaign_influencers')
      .update({
        shipping_address: shippingAddress,
        shipping_status: 'preparing'
      })
      .eq('id', ci.id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    const infName = typeof ci.influencers === 'object' && ci.influencers !== null ? (ci.influencers as any).name : '인플루언서'

    // 3. activity_logs INSERT
    await supabase.from('activity_logs').insert({
      campaign_id: ci.campaign_id,
      type: 'shipping_updated',
      actor_type: 'influencer',
      actor_name: infName,
      description: `${infName} 님이 배송지 정보를 입력/수정했습니다.`
    })

    return NextResponse.json({
      success: true,
      shipping_address: shippingAddress,
      token,
    })
  } catch (error: any) {
    console.error('Error submitting shipping address:', error)
    return NextResponse.json({ error: error.message || 'Failed to submit address' }, { status: 500 })
  }
}
