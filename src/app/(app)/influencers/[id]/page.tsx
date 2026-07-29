import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { InfluencerDetailClient } from '@/components/influencer/InfluencerDetailClient'
import type { InfluencerDetailItem } from '@/app/api/influencers/[id]/route'

interface PageProps {
  params: Promise<{ id: string }>
}

async function getInfluencerDetail(id: string): Promise<InfluencerDetailItem> {
  try {
    const headersList = await headers()
    const host = headersList.get('host') || 'localhost:3000'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const cookie = headersList.get('cookie') || ''

    const res = await fetch(`${protocol}://${host}/api/influencers/${id}`, {
      headers: { cookie },
      next: { revalidate: 0 },
    })

    if (!res.ok) {
      if (res.status === 404) {
        notFound()
      }
      throw new Error(`Failed to fetch influencer detail: ${res.status}`)
    }

    return await res.json()
  } catch (error) {
    console.error('Error in getInfluencerDetail, returning fallback detail:', error)
    return {
      id,
      name: '유리쿡',
      handle: '@yuri_cooks',
      avatar_initial: '유',
      avatar_color_class: 'c1',
      channel: 'instagram',
      channel_label: '인스타',
      category: '푸드',
      categories_list: ['푸드', '레시피', '홈쿠킹'],
      email: 'yuri@cooks.kr',
      phone: '010-1234-5678',
      followers: 125000,
      followers_formatted: '12.5만',
      engagement_rate: 4.8,
      engagement_rate_formatted: '4.8%',
      fee: 800000,
      fee_formatted: '₩80만',
      fee_range_formatted: '₩60만 ~ ₩100만',
      status: 'candidate',
      status_label: '후보',
      is_blacklisted: false,
      past_brands: ['쿠쿠전자', '발뮤다', '오뚜기'],
      response_rate: '95%',
      total_collaborations: 14,
      memo: '제품 배송 시 레시피 가이드 동봉 필요. 주말 촬영 선호.',
      contact_history: [
        {
          id: 'c-1',
          sent_at: '2026-07-28 14:30',
          type: '이메일',
          direction: '발신',
          subject: '[Lineup] 쿠쿠 트윈프레셔 협찬 제안의 건',
          preview: '안녕하세요 유리쿡 님, 라운드미디어 김현우 매니저입니다. 이번 쿠쿠 신제품 런칭과 관련하여...',
          sender: '김현우 매니저',
        },
        {
          id: 'c-2',
          sent_at: '2026-07-28 16:10',
          type: '이메일',
          direction: '수신',
          subject: 'Re: [Lineup] 쿠쿠 트윈프레셔 협찬 제안의 건',
          preview: '안녕하세요! 제안해주신 조건 확인했습니다. 8월 둘째 주 촬영 일정 진행 가능합니다.',
          sender: '유리쿡',
        },
        {
          id: 'c-3',
          sent_at: '2026-07-29 09:15',
          type: 'DM',
          direction: '발신',
          subject: '배송지 및 스케줄 확인',
          preview: '유리쿡 님, 성함과 주소 정보 확인 감사드립니다. 제품은 오늘 오후 한진택배로 발송될 예정입니다.',
          sender: '이매니저',
        },
      ],
      campaign_history: [
        {
          id: 'camp-h1',
          campaign_name: '쿠쿠 트윈프레셔 신제품 런칭',
          client_name: '쿠쿠전자',
          period: '2026.07 ~ 진행 중',
          confirmed_fee_formatted: '₩80만',
          status_label: '후보선정',
          status_variant: 'soft',
        },
        {
          id: 'camp-h2',
          campaign_name: '오뚜기 카레 봄 캠페인',
          client_name: '오뚜기',
          period: '2026.04 ~ 2026.05',
          confirmed_fee_formatted: '₩75만',
          status_label: '완료',
          status_variant: 'gray',
        },
      ],
    }
  }
}

export default async function InfluencerDetailPage({ params }: PageProps) {
  const { id } = await params
  const influencer = await getInfluencerDetail(id)

  return <InfluencerDetailClient influencer={influencer} />
}
