import { headers } from 'next/headers'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { CampaignsClient } from '@/components/campaign/CampaignsClient'
import type { CampaignCardData } from '@/app/api/campaigns/route'

async function getCampaigns(): Promise<{ items: CampaignCardData[]; totalActive: number }> {
  try {
    const headersList = await headers()
    const host = headersList.get('host') || 'localhost:3000'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const cookie = headersList.get('cookie') || ''

    const res = await fetch(`${protocol}://${host}/api/campaigns`, {
      headers: { cookie },
      next: { revalidate: 0 },
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch campaigns: ${res.status}`)
    }

    const json = await res.json()
    return {
      items: json.data as CampaignCardData[],
      totalActive: json.totalActive ?? 8,
    }
  } catch (error) {
    console.error('Error fetching campaigns, using fallback:', error)
    // Synchronized fallback matching Campaigns.html mock
    const fallback: CampaignCardData[] = [
      {
        id: 'camp-1',
        client_id: 'client-1',
        client_name: 'CUCKOO',
        title: '쿠쿠 인덕션 가을 신제품',
        stage: 'briefing',
        status_badge: { label: '브리핑 작성 중', variant: 'gray' },
        assignees: [{ name: '하나', avatar: '하', color: 'c4' }],
        dday: 'D-14',
        dday_variant: 'default',
      },
      {
        id: 'camp-2',
        client_id: 'client-2',
        client_name: '유한킴벌리',
        title: '크리넥스 항균 티슈 협찬',
        stage: 'search',
        progress: 40,
        meta_text: '후보 6명 / 목표 15명',
        assignees: [{ name: '소연', avatar: '소', color: 'c2' }],
        dday: 'D-9',
        dday_variant: 'default',
      },
      {
        id: 'camp-3',
        client_id: 'client-1',
        client_name: 'CUCKOO',
        title: '쿠쿠 에어프라이어 봄 캠페인',
        stage: 'proposal',
        status_badge: { label: '광고주 검토 중', variant: 'warn' },
        progress: 100,
        meta_text: '8명 제안 · 포털 공유됨',
        assignees: [{ name: '현우', avatar: '우', color: 'c1' }],
        dday: 'D-3',
        dday_variant: 'warm',
      },
      {
        id: 'camp-4',
        client_id: 'client-3',
        client_name: 'CJ올리브영',
        title: '올리브영 뷰티 픽 11월',
        stage: 'proposal',
        status_badge: { label: '제안서 준비', variant: 'gray' },
        assignees: [{ name: '지은', avatar: '지', color: 'c3' }],
        dday: 'D-8',
        dday_variant: 'default',
      },
      {
        id: 'camp-5',
        client_id: 'client-1',
        client_name: 'CUCKOO',
        title: '쿠쿠 밥솥 추석 기획전',
        stage: 'selection',
        status_badge: { label: '광고주 선택 완료', variant: 'soft' },
        progress: 100,
        meta_text: '5명 선택 · 섭외 대기',
        assignees: [{ name: '현우', avatar: '우', color: 'c1' }],
        dday: 'D-6',
        dday_variant: 'default',
      },
      {
        id: 'camp-6',
        client_id: 'client-1',
        client_name: 'CUCKOO',
        title: '쿠쿠 정수기 인스타 협찬',
        stage: 'outreach',
        status_badge: { label: '2명 미응답', variant: 'warn' },
        progress: 50,
        meta_text: '확정 2 / 대기 2',
        assignees: [
          { name: '유리', avatar: '유', color: 'c5' },
          { name: '민지', avatar: '민', color: 'c2' },
          { name: '하나', avatar: '하', color: 'c4' },
        ],
        dday: 'D-3',
        dday_variant: 'warm',
      },
      {
        id: 'camp-7',
        client_id: 'client-2',
        client_name: '유한킴벌리',
        title: '하기스 위생 캠페인',
        stage: 'shipping',
        status_badge: { label: '운송장 2건 대기', variant: 'gray' },
        progress: 60,
        meta_text: '배송완료 3 / 5',
        assignees: [
          { name: '소연', avatar: '소', color: 'c2' },
          { name: '현이', avatar: '현', color: 'c6' },
        ],
        dday: 'D-5',
        dday_variant: 'default',
      },
      {
        id: 'camp-8',
        client_id: 'client-1',
        client_name: 'CUCKOO',
        title: '쿠쿠 트윈프레셔 신제품 런칭',
        stage: 'review',
        status_badge: { label: '컨펌 대기 D-2', variant: 'danger' },
        progress: 60,
        meta_text: '승인 3 / 제출 5',
        assignees: [
          { name: '유리', avatar: '유', color: 'c1' },
          { name: '준', avatar: '준', color: 'c3' },
          { name: '하나', avatar: '하', color: 'c4' },
          { name: '민지', avatar: '민', color: 'c5' },
        ],
        dday: 'D-2',
        dday_variant: 'hot',
        border_highlight: true,
      },
      {
        id: 'camp-9',
        client_id: 'client-1',
        client_name: 'CUCKOO',
        title: '쿠쿠 비스포크 홈카페',
        stage: 'uploaded',
        status_badge: { label: '게시 완료', variant: 'soft' },
        progress: 100,
        meta_text: '성과 입력 대기',
        assignees: [{ name: '지은', avatar: '지', color: 'c3' }],
        dday: 'D-4',
        dday_variant: 'default',
      },
      {
        id: 'camp-10',
        client_id: 'client-3',
        client_name: 'CJ올리브영',
        title: '올리브영 뷰티 신제품',
        stage: 'billing',
        status_badge: { label: '청구서 발송 대기', variant: 'gray' },
        fee_info: { amount: '₩8.4M', fee_badge: '수수료 15%' },
        assignees: [{ name: '지은', avatar: '지', color: 'c3' }],
        dday: 'D-6',
        dday_variant: 'default',
      },
    ]

    return { items: fallback, totalActive: 8 }
  }
}

export default async function CampaignsPage() {
  const { items, totalActive } = await getCampaigns()

  return (
    <div className="main select-none">
      <Header
        title="캠페인"
        subTitle={`9단계 파이프라인 · 진행 중 ${totalActive}건`}
        searchPlaceholder="캠페인 검색"
        actionButton={
          <Link href="/campaigns/new" className="btn font-sans">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            새 캠페인
          </Link>
        }
      />

      <CampaignsClient initialCampaigns={items} />
    </div>
  )
}
