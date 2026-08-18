import { NextResponse, NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email'
import { InfluencerOutreach } from '@/lib/email/templates/InfluencerOutreach'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const supabase = createServiceClient()
    let body: any = {}
    try {
      body = await request.json()
    } catch (e) {
      // Body may be empty
    }

    const targetCiIds: string[] = Array.isArray(body.influencer_ids) && body.influencer_ids.length > 0
      ? body.influencer_ids
      : []

    if (targetCiIds.length === 0) {
      // Fetch all selected campaign_influencers
      const { data: selectedCiList } = await supabase
        .from('campaign_influencers')
        .select('id')
        .eq('campaign_id', id)
        .in('status', ['selected', 'confirmed', 'candidate'])

      if (selectedCiList && selectedCiList.length > 0) {
        selectedCiList.forEach((ci) => targetCiIds.push(ci.id))
      }
    }

    let sentCount = 0

    // Fetch campaign info for email details
    const { data: campaign } = await supabase
      .from('campaigns')
      .select('*, clients(name)')
      .eq('id', id)
      .single()

    const brandName = typeof campaign?.clients === 'object' && campaign?.clients !== null
      ? (campaign.clients as any).name || 'Lineup'
      : campaign?.name || 'Lineup'

    for (const targetId of targetCiIds) {
      const { data: ciRecord } = await supabase
        .from('campaign_influencers')
        .select('*, influencers(*)')
        .eq('id', targetId)
        .single()

      if (!ciRecord) continue

      const inf = (ciRecord.influencers as any) || {}
      const recipientEmail = inf.email
      if (!recipientEmail) continue

      const recipientName = inf.name || '인플루언서'
      const responseToken = ciRecord.access_token || 'mock-inf-token-001'
      const responseLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/inf/${responseToken}`

      await sendEmail({
        to: recipientEmail,
        subject: `[${brandName}] ${campaign?.name || '캠페인'} 협업 제안드립니다`,
        campaignId: id,
        influencerId: targetId,
        react: InfluencerOutreach({
          influencerName: recipientName,
          campaignName: campaign?.name || '캠페인',
          brandName,
          productName: campaign?.product_name || '신제품',
          contentDeadline: campaign?.content_deadline || '06.08',
          uploadDeadline: campaign?.upload_deadline || '06.10',
          fee: `₩${((((ciRecord as any)?.agreed_fee || (ciRecord as any)?.proposed_fee || inf.fee_min || 500000)) / 10000).toFixed(0)}만`,
          responseLink,
          managerName: '담당자',
        }),
      })

      // Update status to outreached / confirmed
      if (ciRecord.status === 'selected') {
        await supabase
          .from('campaign_influencers')
          .update({ status: 'confirmed' })
          .eq('id', targetId)
      }

      sentCount++
    }

    return NextResponse.json({
      success: true,
      message: `${sentCount}명에게 섭외 이메일이 발송됐습니다`,
      sentCount,
    })
  } catch (error: any) {
    console.error('Error sending bulk outreach email:', error)
    return NextResponse.json({ error: error.message || 'Failed to send outreach email' }, { status: 500 })
  }
}
