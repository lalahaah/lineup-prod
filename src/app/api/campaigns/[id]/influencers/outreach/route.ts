import { NextResponse, NextRequest } from 'next/server'
import { sendEmail } from '@/lib/email'
import { InfluencerOutreach } from '@/lib/email/templates/InfluencerOutreach'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: campaignId } = await params

  try {
    const supabase = createServiceClient()
    let body: any = {}
    try {
      body = await request.json()
    } catch (e) {
      // Body may be empty
    }

    const influencer_ids: string[] = Array.isArray(body.influencer_ids) ? body.influencer_ids : []

    // 캠페인 정보 조회
    const { data: campaign, error: campError } = await supabase
      .from('campaigns')
      .select(`
        *,
        clients (name)
      `)
      .eq('id', campaignId)
      .single()

    if (campError || !campaign) {
      return NextResponse.json({ error: '캠페인을 찾을 수 없습니다.' }, { status: 404 })
    }

    // 대상 인플루언서 조회
    let query = supabase
      .from('campaign_influencers')
      .select(`
        id,
        influencer_id,
        proposed_fee,
        access_token,
        influencers (
          id,
          name,
          email
        )
      `)
      .eq('campaign_id', campaignId)

    if (influencer_ids.length > 0) {
      query = query.in('id', influencer_ids)
    }

    const { data: targets, error: targetError } = await query

    if (targetError || !targets) {
      return NextResponse.json({ error: '인플루언서 조회 실패' }, { status: 500 })
    }

    let sent = 0
    let failed = 0
    const brandName = (campaign.clients as any)?.name || campaign.name || 'Lineup'

    for (const ci of targets) {
      const inf = (ci.influencers as any) || {}
      if (!inf.email) {
        failed++
        continue
      }

      const result = await sendEmail({
        to: inf.email,
        subject: `[${brandName}] 협찬 제안 드립니다`,
        react: InfluencerOutreach({
          influencerName: inf.name || '인플루언서',
          brandName: brandName,
          campaignName: campaign.name || '캠페인',
          productName: campaign.product_name || '',
          contentDeadline: campaign.content_deadline 
            ? new Date(campaign.content_deadline).toLocaleDateString('ko-KR')
            : '미정',
          uploadDeadline: (campaign as any).upload_deadline
            ? new Date((campaign as any).upload_deadline).toLocaleDateString('ko-KR')
            : (campaign as any).post_period || '미정',
          fee: ci.proposed_fee ? Number(ci.proposed_fee) : undefined,
          responseLink: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/inf/${ci.access_token}`,
          managerName: '라운드미디어 담당자',
        }),
      })

      if (result.success) {
        sent++
        // contact_logs 기록
        try {
          await supabase.from('contact_logs').insert({
            influencer_id: ci.influencer_id || inf.id,
            campaign_id: campaignId,
            type: 'email',
            direction: 'outbound',
            subject: `[${brandName}] 협찬 제안 드립니다`,
            template_id: 'influencer_outreach',
            sent_at: new Date().toISOString(),
          })
        } catch (logErr) {
          console.warn('contact_logs insert warning:', logErr)
        }

        // campaign_influencers 상태 업데이트
        try {
          await supabase
            .from('campaign_influencers')
            .update({ status: 'confirmed' })
            .eq('id', ci.id)
        } catch (updateErr) {
          console.warn('campaign_influencers update warning:', updateErr)
        }
      } else {
        failed++
      }
    }

    return NextResponse.json({ sent, failed })
  } catch (error: any) {
    console.error('Outreach error:', error)
    return NextResponse.json({ error: error.message || '서버 오류' }, { status: 500 })
  }
}
