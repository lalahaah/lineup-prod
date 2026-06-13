import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { CampaignStage } from '@/types'

export async function GET() {
  const supabase = await createClient()

  // 세션 검증
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // 1. 진행 캠페인 수 (stage != 'completed')
    const { count: activeCampaignsCount } = await supabase
      .from('campaigns')
      .select('*', { count: 'exact', head: true })
      .neq('stage', 'completed')

    // 2. 검수 대기 원고 수
    const { count: pendingDraftsCount } = await supabase
      .from('drafts')
      .select('*', { count: 'exact', head: true })
      .in('status', ['submitted', 'agency_reviewing'])

    // 3. 배송 대기 수 (confirmed 상태의 인플루언서 수)
    const { count: pendingShipmentsCount } = await supabase
      .from('campaign_influencers')
      .select('*', { count: 'exact', head: true })
      .in('status', ['confirmed'])

    // DB 연동 이전 상태에 대비하여 Dashboard.html 기준과 동일한 Mock을 결합해 반환
    const mockData = {
      activeCampaigns: activeCampaignsCount ?? 8,
      pendingDrafts: pendingDraftsCount ?? 12,
      pendingShipments: pendingShipmentsCount ?? 3,
      monthlyRevenue: 42800000, // 4,280 만원
      priorityQueue: [
        {
          campaign_id: 'campaign-1',
          campaign_name: '쿠쿠 트윈프레셔 신제품 런칭',
          client_name: 'CUCKOO',
          stage: 'review' as CampaignStage,
          days_until_deadline: 2,
          urgent_reason: '인플루언서 5명 중 3명 제출',
          badge_label: '원고 컨펌 대기',
          badge_variant: 'danger',
          action_label: '검수'
        },
        {
          campaign_id: 'campaign-2',
          campaign_name: '쿠쿠 에어프라이어 봄 캠페인',
          client_name: 'CUCKOO',
          stage: 'proposal' as CampaignStage,
          days_until_deadline: 3,
          urgent_reason: '광고주 포털 후보 검토 중 (8명 제안)',
          badge_label: '광고주 선택 대기',
          badge_variant: 'warn',
          action_label: '포털 열기'
        },
        {
          campaign_id: 'campaign-3',
          campaign_name: '쿠쿠 정수기 인스타 협찬',
          client_name: 'CUCKOO',
          stage: 'outreach' as CampaignStage,
          days_until_deadline: 3,
          urgent_reason: '4명 중 2명 미응답 (D-7 리마인더 예약됨)',
          badge_label: '섭외 응답 대기',
          badge_variant: 'warn',
          action_label: '컨택 이력'
        },
        {
          campaign_id: 'campaign-4',
          campaign_name: '하기스 위생 캠페인',
          client_name: '유한킴벌리',
          stage: 'shipping' as CampaignStage,
          days_until_deadline: 5,
          urgent_reason: '운송장 미입력 2건',
          badge_label: '배송 처리',
          badge_variant: 'soft',
          action_label: '배송 관리'
        },
        {
          campaign_id: 'campaign-5',
          campaign_name: '올리브영 뷰티 신제품',
          client_name: 'CJ올리브영',
          stage: 'billing' as CampaignStage,
          days_until_deadline: 6,
          urgent_reason: '청구서 발송 대기 ₩8.4M',
          badge_label: '청구서 발송',
          badge_variant: 'gray',
          action_label: '정산'
        }
      ],
      recentActivities: [
        {
          id: 'act-1',
          description: '<b>유리쿡</b> 님이 섭외를 <b>수락</b>했어요',
          actor_name: '유리쿡',
          campaign_name: '쿠쿠 정수기',
          created_at: new Date(Date.now() - 3 * 60 * 1000).toISOString()
        },
        {
          id: 'act-2',
          description: '<b>먹방준</b> 님이 원고 <b>v2</b>를 제출했어요',
          actor_name: '먹방준',
          campaign_name: '쿠쿠 트윈프레셔',
          created_at: new Date(Date.now() - 21 * 60 * 1000).toISOString()
        },
        {
          id: 'act-3',
          description: '광고주가 후보 <b>5명을 선택</b>했어요',
          actor_name: 'CUCKOO',
          campaign_name: '에어프라이어',
          created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString()
        },
        {
          id: 'act-4',
          description: '섭외 이메일 <b>4건 발송</b> 완료',
          actor_name: '이매니저',
          campaign_name: '쿠쿠 정수기',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'act-5',
          description: '<b>소연홈</b> 님이 배송지를 <b>입력</b>했어요',
          actor_name: '소연홈',
          campaign_name: '하기스 위생',
          created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
        }
      ]
    }

    return NextResponse.json(mockData)
  } catch (err) {
    console.error('Database query error, using synchronized fallback mock data:', err)
    return NextResponse.json({
      activeCampaigns: 8,
      pendingDrafts: 12,
      pendingShipments: 3,
      monthlyRevenue: 42800000,
      priorityQueue: [
        {
          campaign_id: 'campaign-1',
          campaign_name: '쿠쿠 트윈프레셔 신제품 런칭',
          client_name: 'CUCKOO',
          stage: 'review' as CampaignStage,
          days_until_deadline: 2,
          urgent_reason: '인플루언서 5명 중 3명 제출',
          badge_label: '원고 컨펌 대기',
          badge_variant: 'danger',
          action_label: '검수'
        }
      ],
      recentActivities: [
        {
          id: 'act-1',
          description: '<b>유리쿡</b> 님이 섭외를 <b>수락</b>했어요',
          actor_name: '유리쿡',
          campaign_name: '쿠쿠 정수기',
          created_at: new Date(Date.now() - 3 * 60 * 1000).toISOString()
        }
      ]
    })
  }
}
