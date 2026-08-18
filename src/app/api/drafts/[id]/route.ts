import { NextResponse, NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email'
import { InfluencerRevision } from '@/lib/email/templates/InfluencerRevision'

export interface DraftItem {
  id: string
  campaign_id: string
  influencer_id: string
  version: number
  status:
    | 'submitted'
    | 'agency_reviewing'
    | 'agency_approved'
    | 'revision_requested'
    | 'client_reviewing'
    | 'client_approved'
    | 'rejected'
    | string
  caption: string
  file_urls?: string[]
  file_name?: string
  file_size?: string
  file_duration?: string
  media_type?: string
  created_at: string
  feedbacks: Array<{
    id: string
    author_type: 'agency' | 'client' | 'influencer'
    author_name: string
    author_role?: string
    avatar_initial: string
    avatar_color_class: string
    content: string
    created_at: string
    action_label?: string
  }>
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: draftId } = await context.params
  try {
    const supabase = createServiceClient()

    const { data: draft, error } = await supabase
      .from('drafts')
      .select(`
        *,
        campaign_influencers (
          id,
          status,
          proposed_fee,
          campaign_id,
          access_token,
          influencers (
            id,
            name,
            handle,
            primary_channel,
            email
          ),
          campaigns (
            id,
            name,
            product_name,
            content_deadline,
            clients ( name )
          )
        ),
        draft_feedbacks (
          id,
          author_type,
          author_name,
          content,
          created_at
        )
      `)
      .eq('id', draftId)
      .single()

    if (error || !draft) {
      return NextResponse.json({ error: 'Draft not found' }, { status: 404 })
    }

    const ci = (draft.campaign_influencers as any) || {}
    const feedbacks = (draft.draft_feedbacks || []).map((fb: any) => ({
      id: fb.id,
      author_type: (['agency', 'client', 'influencer'].includes(fb.author_type)
        ? fb.author_type
        : 'agency') as 'agency' | 'client' | 'influencer',
      author_name: fb.author_name || (fb.author_type === 'agency' ? '운영진' : '광고주'),
      author_role: fb.author_type === 'agency' ? '에이전시' : fb.author_type === 'client' ? '광고주' : '인플루언서',
      avatar_initial: (fb.author_name || '운')[0],
      avatar_color_class: 'c1',
      content: fb.content,
      created_at: fb.created_at ? new Date(fb.created_at).toLocaleDateString('ko-KR') : '방금 전',
      action_label: fb.author_type === 'agency' ? '에이전시 피드백' : '광고주 피드백',
    }))

    const fileName = Array.isArray(draft.file_urls) && draft.file_urls.length > 0
      ? draft.file_urls[0].split('/').pop() || 'draft_file'
      : 'draft_file'

    return NextResponse.json({
      id: draft.id,
      campaign_id: ci.campaign_id || '',
      influencer_id: ci.influencer_id || '',
      version: draft.version,
      status: draft.status,
      caption: draft.caption || '',
      file_urls: draft.file_urls || [],
      file_name: fileName,
      created_at: draft.submitted_at || draft.created_at,
      feedbacks,
      raw_data: draft,
    })
  } catch (error: any) {
    console.error('Error fetching draft detail:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: draftId } = await context.params
  try {
    const supabase = createServiceClient()
    const body = await request.json()
    const { action, feedback } = body

    // 1. 기존 draft 및 연관 데이터 조회
    const { data: existingDraft, error: fetchError } = await supabase
      .from('drafts')
      .select(`
        *,
        campaign_influencers (
          id,
          campaign_id,
          influencer_id,
          access_token,
          influencers ( id, name, handle, email ),
          campaigns ( id, name, clients ( name ) )
        )
      `)
      .eq('id', draftId)
      .single()

    if (fetchError || !existingDraft) {
      return NextResponse.json({ error: 'Draft not found' }, { status: 404 })
    }

    let nextStatus = existingDraft.status
    let activityType = ''
    let activityDesc = ''

    const ci = (existingDraft.campaign_influencers as any) || {}
    const inf = (ci.influencers as any) || {}
    const camp = (ci.campaigns as any) || {}
    const clientName = (camp.clients as any)?.name || '광고주'

    if (action === 'approve') {
      nextStatus = 'agency_approved'
      activityType = 'draft_approved'
      activityDesc = `${inf.name || '인플루언서'} 님의 원고 v${existingDraft.version}을 에이전시에서 승인했습니다.`
    } else if (action === 'revise') {
      nextStatus = 'revision_requested'
      activityType = 'draft_revision_requested'
      activityDesc = `${inf.name || '인플루언서'} 님에게 원고 v${existingDraft.version} 수정 요청을 전달했습니다.`
    } else if (action === 'reject') {
      nextStatus = 'rejected'
      activityType = 'draft_rejected'
      activityDesc = `${inf.name || '인플루언서'} 님의 원고 v${existingDraft.version}을 반려했습니다.`
    }

    // 2. drafts status 업데이트
    const { data: updatedDraft, error: updateError } = await supabase
      .from('drafts')
      .update({ status: nextStatus })
      .eq('id', draftId)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // 3. revise 시 draft_feedbacks INSERT 및 이메일 발송
    if (action === 'revise' && feedback) {
      await supabase.from('draft_feedbacks').insert({
        draft_id: draftId,
        author_type: 'agency',
        author_name: '에이전시 매니저',
        content: feedback,
      })

      // 인플루언서에게 수정 요청 이메일 발송 (Resend)
      if (inf.email) {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        await sendEmail({
          to: inf.email,
          subject: `[${clientName}] 원고 수정 요청 안내입니다`,
          react: InfluencerRevision({
            influencerName: inf.name || '인플루언서',
            campaignName: camp.name || '캠페인',
            brandName: clientName,
            feedback,
            resubmitLink: `${baseUrl}/inf/${ci.access_token || ''}`,
          }),
        })
      }
    }

    // 4. activity_logs INSERT
    if (activityType) {
      await supabase.from('activity_logs').insert({
        campaign_id: ci.campaign_id,
        type: activityType as any,
        actor_type: 'agency',
        actor_name: '에이전시 매니저',
        description: activityDesc,
        metadata: { draft_id: draftId, version: existingDraft.version, action, feedback },
      })
    }

    return NextResponse.json({
      success: true,
      status: nextStatus,
      draft: updatedDraft,
    })
  } catch (error: any) {
    console.error('Error updating draft:', error)
    return NextResponse.json({ error: error.message || 'Failed to update draft' }, { status: 500 })
  }
}
