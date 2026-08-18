import { NextResponse, NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export interface QueueDraftItem {
  id: string
  influencer_id: string
  influencer_name: string
  handle: string
  avatar_initial: string
  avatar_color_class: string
  campaign_id: string
  campaign_name: string
  client_name: string
  version: string
  submitted_at: string
  status: 'submitted' | 'agency_reviewing' | 'revision_requested' | 'client_reviewing' | 'client_approved' | 'agency_approved' | 'rejected' | string
  status_label: '검수 대기' | '검수 중' | '수정 요청' | '광고주 컨펌 대기' | '승인 완료' | '승인' | '반려' | string
  status_variant: 'warn' | 'danger' | 'soft' | 'green' | 'gray'
}

function getStatusInfo(status: string): {
  label: QueueDraftItem['status_label']
  variant: QueueDraftItem['status_variant']
} {
  switch (status) {
    case 'submitted':
      return { label: '검수 대기', variant: 'warn' }
    case 'agency_reviewing':
      return { label: '검수 중', variant: 'warn' }
    case 'revision_requested':
      return { label: '수정 요청', variant: 'danger' }
    case 'agency_approved':
      return { label: '승인', variant: 'green' }
    case 'client_reviewing':
      return { label: '광고주 컨펌 대기', variant: 'soft' }
    case 'client_approved':
      return { label: '승인 완료', variant: 'green' }
    case 'rejected':
      return { label: '반려', variant: 'gray' }
    default:
      return { label: '검수 대기', variant: 'warn' }
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceClient()
    const searchParams = request.nextUrl.searchParams
    const filter = searchParams.get('filter')

    const { data: rawDrafts, error } = await supabase
      .from('drafts')
      .select(`
        id,
        version,
        status,
        submitted_at,
        created_at,
        campaign_influencers (
          id,
          campaign_id,
          influencer_id,
          influencers (
            id,
            name,
            handle,
            primary_channel
          ),
          campaigns (
            id,
            name,
            clients ( name )
          )
        )
      `)
      .order('submitted_at', { ascending: false })

    if (error) {
      console.error('Error fetching all drafts queue:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const items: QueueDraftItem[] = (rawDrafts || []).map((d: any, idx: number) => {
      const ci = d.campaign_influencers || {}
      const inf = ci.influencers || {}
      const camp = ci.campaigns || {}
      const client = camp.clients || {}

      const infName = inf.name || '인플루언서'
      const statusInfo = getStatusInfo(d.status)

      const submittedDate = d.submitted_at || d.created_at
      const dateStr = submittedDate
        ? new Date(submittedDate).toLocaleDateString('ko-KR', {
            month: '2-digit',
            day: '2-digit',
          })
        : '-'

      return {
        id: d.id,
        influencer_id: inf.id || ci.influencer_id || '',
        influencer_name: infName,
        handle: inf.handle || '',
        avatar_initial: infName[0],
        avatar_color_class: `c${(idx % 6) + 1}`,
        campaign_id: camp.id || ci.campaign_id || '',
        campaign_name: camp.name || '캠페인',
        client_name: client.name || '광고주',
        version: `v${d.version}`,
        submitted_at: dateStr,
        status: d.status,
        status_label: statusInfo.label,
        status_variant: statusInfo.variant,
      }
    })

    let filtered = items
    if (filter && filter !== 'all') {
      if (filter === 'agency_reviewing') {
        filtered = items.filter((d) => d.status === 'agency_reviewing' || d.status === 'submitted')
      } else {
        filtered = items.filter((d) => d.status === filter)
      }
    }

    const counts = {
      total: items.length,
      agency_reviewing: items.filter((d) => d.status === 'agency_reviewing' || d.status === 'submitted').length,
      revision_requested: items.filter((d) => d.status === 'revision_requested').length,
      client_reviewing: items.filter((d) => d.status === 'client_reviewing' || d.status === 'agency_approved').length,
    }

    return NextResponse.json({
      data: filtered,
      counts,
    })
  } catch (error: any) {
    console.error('Error in drafts queue API:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
