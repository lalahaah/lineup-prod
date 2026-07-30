import { NextResponse, NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email'
import { InfluencerRevision } from '@/lib/email/templates/InfluencerRevision'
import { ClientDraftReview } from '@/lib/email/templates/ClientDraftReview'

export interface DraftItem {
  id: string
  campaign_id: string
  influencer_id: string
  version: number
  status:
    | 'agency_reviewing'
    | 'agency_approved'
    | 'revision_requested'
    | 'client_reviewing'
    | 'client_approved'
    | 'rejected'
  caption: string
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
  const { id } = await context.params
  try {
    const supabase = createServiceClient()

    const { data: draft, error } = await supabase
      .from('drafts')
      .select('*, campaign_influencers(*, influencers(*), campaigns(*)), draft_feedbacks(*)')
      .eq('id', id)
      .single()

    if (error || !draft) {
      return NextResponse.json({
        id,
        campaign_id: 'camp-8',
        influencer_id: 'inf-2',
        version: 2,
        status: 'agency_reviewing',
        caption: '신혼 첫 밥솥으로 쿠쿠 트윈프레셔를 골랐어요 🍚 12분 만에 갓 지은 윤기나는 밥이 완성되는데, 압력이 두 배라 현미도 부드럽게 익어요. 자취·신혼 집들이 메뉴로 강력 추천! #신혼집밥 #쿠쿠트윈프레셔',
        file_name: 'mukbang_jun_v2.mp4',
        file_size: '142MB',
        file_duration: '04:12',
        media_type: 'video',
        created_at: '오늘 09:35',
        feedbacks: []
      })
    }

    const ci = (draft.campaign_influencers as any) || {}

    const feedbacks = (draft.draft_feedbacks || []).map((fb: any) => ({
      id: fb.id,
      author_type: (['agency', 'client', 'influencer'].includes(fb.author_type) ? fb.author_type : 'agency') as 'agency' | 'client' | 'influencer',
      author_name: fb.author_name || '담당자',
      author_role: fb.author_type === 'agency' ? '운영' : '인플루언서',
      avatar_initial: (fb.author_name || '담당')[0],
      avatar_color_class: 'c1',
      content: fb.content,
      created_at: fb.created_at,
      action_label: '피드백'
    }))

    return NextResponse.json({
      id: draft.id,
      campaign_id: ci.campaign_id || '',
      influencer_id: ci.influencer_id || '',
      version: draft.version,
      status: draft.status,
      caption: draft.caption || '',
      file_name: draft.file_urls?.[0] || 'draft_file',
      created_at: draft.created_at,
      feedbacks,
      raw_data: draft
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
  const { id } = await context.params
  try {
    const supabase = createServiceClient()
    const body = await request.json()
    const { action, feedback } = body

    let newStatus = 'agency_reviewing'
    if (action === 'approve') newStatus = 'agency_approved'
    if (action === 'revise') newStatus = 'revision_requested'
    if (action === 'reject') newStatus = 'rejected'

    const { data: updatedDraft } = await supabase
      .from('drafts')
      .update({ status: newStatus as any })
      .eq('id', id)
      .select('*, campaign_influencers(*, influencers(*), campaigns(*))')
      .single()

    if (feedback) {
      await supabase.from('draft_feedbacks').insert({
        draft_id: id,
        author_type: 'agency',
        author_name: '김현우',
        content: feedback
      })
    }

    const ci = (updatedDraft?.campaign_influencers as any) || {}
    const inf = (ci.influencers as any) || {}
    const camp = (ci.campaigns as any) || {}

    // 이메일 자동 발송 처리
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    if (action === 'revise') {
      await sendEmail({
        to: inf.email || 'mukbang_jun@example.com',
        subject: '[Lineup] 원고 수정 요청 안내입니다',
        campaignId: ci.campaign_id || 'camp-1',
        influencerId: ci.influencer_id || 'inf-1',
        react: InfluencerRevision({
          influencerName: inf.name || '먹방준',
          campaignName: camp.name || '캠페인',
          feedback: feedback || '수정 사항을 확인 후 재제출 부탁드립니다.',
          resubmitLink: `${baseUrl}/inf/${ci.access_token || 'demo'}`,
        }),
      })
    } else if (action === 'approve') {
      await sendEmail({
        to: 'cuckoo_brand@example.com',
        subject: '[Lineup] 원고 검수 완료 및 컨펌 요청드립니다',
        campaignId: ci.campaign_id || 'camp-1',
        react: ClientDraftReview({
          clientName: '광고주',
          campaignName: camp.name || '캠페인',
          draftCount: 1,
          portalLink: `${baseUrl}/portal/${camp.portal_token || 'demo'}/drafts`,
        }),
      })
    }

    return NextResponse.json({
      success: true,
      status: newStatus,
      draft: updatedDraft
    })
  } catch (error: any) {
    console.error('Error updating draft:', error)
    return NextResponse.json({ error: error.message || 'Failed to update draft' }, { status: 500 })
  }
}
