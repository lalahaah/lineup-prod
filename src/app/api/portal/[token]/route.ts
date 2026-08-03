import { NextResponse, NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { CHANNEL_LABELS } from '@/lib/utils'

export interface PortalCandidate {
  id: string
  name: string
  handle: string
  avatar_initial: string
  avatar_color_class: string
  channel: string
  category: string
  followers: string
  engagement: string
  fee: number
  fee_formatted: string
  tag: string
  status: 'chosen' | 'passed' | 'neutral' | string
}

export interface PortalData {
  token: string
  campaign_title: string
  client_name: string
  candidate_count: number
  total_budget_formatted: string
  deadline: string
  candidates: PortalCandidate[]
  campaign_id?: string
  raw_campaign?: any
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 404 })
  }

  try {
    const supabase = createServiceClient()

    // 1. campaigns 테이블에서 portal_token으로 캠페인 및 광고주 정보 조회
    const { data: campaign, error: campError } = await supabase
      .from('campaigns')
      .select('*, clients(name)')
      .eq('portal_token', token)
      .single()

    if (campError || !campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    // stage가 client_review 이상일 때만 접근 가능 (preparing 단계 제외)
    const allowedStages = ['client_review', 'outreaching', 'reviewing', 'done']
    if (!allowedStages.includes(campaign.stage)) {
      return NextResponse.json(
        { error: '광고주 검토 단계가 아닙니다. 운영팀이 포털을 오픈한 후 접근할 수 있습니다.' },
        { status: 403 }
      )
    }

    // 2. campaign_influencers에서 candidate, selected, passed, proposed 전체 조회 + influencers JOIN
    const { data: candidates, error: ciError } = await supabase
      .from('campaign_influencers')
      .select('*, influencers(*)')
      .eq('campaign_id', campaign.id)
      .in('status', ['candidate', 'selected', 'passed', 'confirmed'])

    if (ciError) {
      return NextResponse.json({ error: ciError.message }, { status: 500 })
    }

    const formattedCandidates: PortalCandidate[] = (candidates || []).map((ci: any) => {
      const inf = ci.influencers || {}
      const followersObj = inf.followers as Record<string, any> | null
      const engagementObj = inf.avg_engagement as Record<string, any> | null

      const followerText = typeof followersObj === 'object' && followersObj !== null && !Array.isArray(followersObj)
        ? (followersObj.instagram || followersObj.youtube || '10만')
        : '10만'
      const engagementText = typeof engagementObj === 'object' && engagementObj !== null && !Array.isArray(engagementObj)
        ? `${engagementObj.instagram || 5.0}%`
        : '5.0%'

      return {
        id: ci.id,
        name: inf.name || '알 수 없음',
        handle: inf.handle || '',
        avatar_initial: (inf.name || '인')[0],
        avatar_color_class: 'c1',
        channel: CHANNEL_LABELS[inf.primary_channel] || inf.primary_channel || '인스타그램',
        category: (inf.categories && inf.categories[0]) || '일반',
        followers: String(followerText),
        engagement: String(engagementText),
        fee: ci.proposed_fee || inf.fee_min || 500000,
        fee_formatted: `₩${((ci.proposed_fee || inf.fee_min || 500000) / 10000).toFixed(0)}만`,
        tag: ci.agency_comment || '# 검토 대상',
        status: ci.status === 'selected' ? 'chosen' : ci.status === 'passed' ? 'passed' : 'neutral',
      }
    })

    const clientName = typeof campaign.clients === 'object' && campaign.clients !== null ? (campaign.clients as any).name : '광고주'

    const portalData: PortalData = {
      token,
      campaign_id: campaign.id,
      campaign_title: campaign.name,
      client_name: clientName,
      candidate_count: formattedCandidates.length,
      total_budget_formatted: `₩${((campaign.budget || 0) / 10000).toFixed(0)}만`,
      deadline: campaign.upload_deadline || campaign.content_deadline || '',
      candidates: formattedCandidates,
      raw_campaign: campaign
    }

    return NextResponse.json(portalData)
  } catch (error: any) {
    console.error('Error fetching portal data:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
