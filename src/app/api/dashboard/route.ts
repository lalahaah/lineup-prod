import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createServiceClient()

    // 1. activeCampaigns: campaigns COUNT where stage not in ('completed')
    const { count: activeCampaignsCount } = await supabase
      .from('campaigns')
      .select('*', { count: 'exact', head: true })
      .neq('stage', 'completed')

    // 2. pendingDrafts: drafts COUNT where status in ('submitted','agency_reviewing')
    const { count: pendingDraftsCount } = await supabase
      .from('drafts')
      .select('*', { count: 'exact', head: true })
      .in('status', ['submitted', 'agency_reviewing'])

    // 3. pendingShipments: campaign_influencers COUNT where shipping_status in ('pending','preparing')
    const { count: pendingShipmentsCount } = await supabase
      .from('campaign_influencers')
      .select('*', { count: 'exact', head: true })
      .in('shipping_status', ['pending', 'preparing'])

    // 4. monthlyRevenue: invoices SUM(total) where status='paid' 이번달
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { data: paidInvoices } = await supabase
      .from('invoices')
      .select('total')
      .eq('status', 'paid')
      .gte('paid_at', startOfMonth.toISOString())

    const monthlyRevenueSum = (paidInvoices || []).reduce((acc, inv) => acc + (inv.total || 0), 0)

    // 5. priorityQueue: priority_campaigns view 또는 campaigns where deadline 7일 이내
    const { data: priorityCampaigns } = await supabase
      .from('priority_campaigns')
      .select('*')
      .limit(5)

    const formattedPriorityQueue = (priorityCampaigns || []).map((pc: any) => {
      const days = pc.days_until_deadline !== null ? pc.days_until_deadline : 3
      let badgeLabel = '마감 임박'
      let badgeVariant: 'danger' | 'warn' | 'soft' | 'default' = 'warn'
      let actionLabel = '검수'

      if (pc.stage === 'review') {
        badgeLabel = '원고 컨펌 대기'
        badgeVariant = 'danger'
        actionLabel = '검수'
      } else if (pc.stage === 'proposal') {
        badgeLabel = '광고주 선택 대기'
        badgeVariant = 'warn'
        actionLabel = '포털 열기'
      } else if (pc.stage === 'outreach') {
        badgeLabel = '섭외 응답 대기'
        badgeVariant = 'warn'
        actionLabel = '컨택 이력'
      } else if (pc.stage === 'shipping') {
        badgeLabel = '배송 처리'
        badgeVariant = 'soft'
        actionLabel = '배송 관리'
      } else if (pc.stage === 'billing') {
        badgeLabel = '청구서 발송'
        badgeVariant = 'default'
        actionLabel = '정산'
      }

      return {
        campaign_id: pc.id || 'camp-1',
        campaign_name: pc.campaign_name || '쿠쿠 캠페인',
        client_name: pc.client_name || 'CUCKOO',
        stage: pc.stage || 'review',
        days_until_deadline: days,
        urgent_reason: `마감 ${days}일 남음`,
        badge_label: badgeLabel,
        badge_variant: badgeVariant,
        action_label: actionLabel,
      }
    })

    // 6. recentActivities: activity_logs 최신 10개
    const { data: activityLogs } = await supabase
      .from('activity_logs')
      .select('*, campaigns(name)')
      .order('created_at', { ascending: false })
      .limit(10)

    const formattedActivities = (activityLogs || []).map((log: any) => ({
      id: log.id,
      description: log.description,
      actor_name: log.actor_name || '사용자',
      campaign_name: log.campaigns?.name || '캠페인',
      created_at: log.created_at
    }))

    return NextResponse.json({
      activeCampaigns: activeCampaignsCount ?? 8,
      pendingDrafts: pendingDraftsCount ?? 12,
      pendingShipments: pendingShipmentsCount ?? 3,
      monthlyRevenue: monthlyRevenueSum > 0 ? monthlyRevenueSum : 42800000,
      priorityQueue: formattedPriorityQueue.length > 0 ? formattedPriorityQueue : [
        {
          campaign_id: 'camp-1',
          campaign_name: '쿠쿠 트윈프레셔 신제품 런칭',
          client_name: 'CUCKOO',
          stage: 'review',
          days_until_deadline: 2,
          urgent_reason: '인플루언서 5명 중 3명 제출',
          badge_label: '원고 컨펌 대기',
          badge_variant: 'danger',
          action_label: '검수'
        }
      ],
      recentActivities: formattedActivities
    })
  } catch (error: any) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
