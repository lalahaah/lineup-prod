import { NextResponse, NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { CHANNEL_LABELS } from '@/lib/utils'
import type { DraftItem } from '@/app/api/drafts/[id]/route'

export interface InfluencerDraftOverview {
  ci_id: string
  influencer_id: string
  name: string
  handle: string
  avatar_initial: string
  avatar_color_class: string
  channel_info: string
  status_label: string
  status_variant: 'soft' | 'gray' | 'warn' | 'danger' | 'green'
  influencer: {
    name: string
    handle: string
    channel: string
    email: string | null
  }
  drafts: DraftItem[]
  current_draft?: DraftItem | null
  latest_draft?: DraftItem | null
}

function getDraftStatusInfo(status?: string): {
  label: string
  variant: 'soft' | 'gray' | 'warn' | 'danger' | 'green'
} {
  switch (status) {
    case 'submitted':
      return { label: '검수 대기', variant: 'warn' }
    case 'agency_reviewing':
      return { label: '검수 중', variant: 'warn' }
    case 'agency_approved':
      return { label: '승인', variant: 'green' }
    case 'revision_requested':
      return { label: '수정 요청', variant: 'danger' }
    case 'rejected':
      return { label: '반려', variant: 'gray' }
    case 'client_reviewing':
      return { label: '광고주 검토', variant: 'soft' }
    case 'client_approved':
      return { label: '승인 완료', variant: 'green' }
    default:
      return { label: '미제출', variant: 'gray' }
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: campaignId } = await context.params

  try {
    const supabase = createServiceClient()

    const { data: ciList, error } = await supabase
      .from('campaign_influencers')
      .select(`
        id,
        status,
        influencers (
          id,
          name,
          handle,
          primary_channel,
          email
        ),
        drafts (
          id,
          version,
          file_urls,
          caption,
          hashtags,
          status,
          submitted_at,
          planned_upload_at,
          created_at,
          draft_feedbacks (
            id,
            author_type,
            author_name,
            content,
            created_at
          )
        )
      `)
      .eq('campaign_id', campaignId)
      .eq('status', 'confirmed')
      .order('submitted_at', { ascending: false, foreignTable: 'drafts' })

    if (error) {
      console.error('Error fetching campaign drafts:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const formattedList: InfluencerDraftOverview[] = (ciList || []).map((ci: any, idx: number) => {
      const inf = ci.influencers || {}
      const draftsRaw = Array.isArray(ci.drafts) ? ci.drafts : []
      // Sort drafts by version ascending for history, latest first for latest_draft
      const sortedDrafts = [...draftsRaw].sort((a, b) => (b.version || 0) - (a.version || 0))
      const latestRaw = sortedDrafts[0] || null

      const drafts: DraftItem[] = sortedDrafts.map((d: any) => {
        const feedbacks = (d.draft_feedbacks || []).map((fb: any) => ({
          id: fb.id,
          author_type: (['agency', 'client', 'influencer'].includes(fb.author_type)
            ? fb.author_type
            : 'agency') as 'agency' | 'client' | 'influencer',
          author_name: fb.author_name || (fb.author_type === 'agency' ? '에이전시' : '광고주'),
          author_role: fb.author_type === 'agency' ? '에이전시' : fb.author_type === 'client' ? '광고주' : '인플루언서',
          avatar_initial: (fb.author_name || '운')[0],
          avatar_color_class: 'c1',
          content: fb.content,
          created_at: fb.created_at ? new Date(fb.created_at).toLocaleDateString('ko-KR') : '방금 전',
          action_label: fb.author_type === 'agency' ? '에이전시 피드백' : '광고주 피드백',
        }))

        const fileName = Array.isArray(d.file_urls) && d.file_urls.length > 0
          ? d.file_urls[0].split('/').pop() || `원고_v${d.version}`
          : `원고_v${d.version}`

        return {
          id: d.id,
          campaign_id: campaignId,
          influencer_id: inf.id || '',
          version: d.version,
          status: d.status,
          caption: d.caption || '',
          file_urls: d.file_urls || [],
          file_name: fileName,
          created_at: d.submitted_at ? new Date(d.submitted_at).toLocaleDateString('ko-KR') : '오늘',
          feedbacks,
        }
      })

      const latestDraft = drafts[0] || null
      const statusInfo = getDraftStatusInfo(latestDraft?.status)
      const channelLabel = CHANNEL_LABELS[inf.primary_channel] || inf.primary_channel || '인스타그램'

      return {
        ci_id: ci.id,
        influencer_id: inf.id || ci.id,
        name: inf.name || '인플루언서',
        handle: inf.handle || '',
        avatar_initial: (inf.name || '인')[0],
        avatar_color_class: `c${(idx % 6) + 1}`,
        channel_info: `${channelLabel}`,
        status_label: statusInfo.label,
        status_variant: statusInfo.variant,
        influencer: {
          name: inf.name || '인플루언서',
          handle: inf.handle || '',
          channel: inf.primary_channel || 'instagram',
          email: inf.email || null,
        },
        drafts: drafts.sort((a, b) => a.version - b.version),
        current_draft: latestDraft,
        latest_draft: latestDraft,
      }
    })

    return NextResponse.json({
      data: formattedList,
    })
  } catch (error: any) {
    console.error('Error fetching campaign drafts:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
