import { headers } from 'next/headers'
import { CampaignDetailClient } from '@/components/campaign/CampaignDetailClient'
import type { CampaignDetailData } from '@/app/api/campaigns/[id]/route'
import type { CampaignInfluencerDetail } from '@/app/api/campaigns/[id]/influencers/route'

interface PageProps {
  params: Promise<{ id: string }>
}

async function getCampaignDetailData(id: string): Promise<{
  campaign: CampaignDetailData
  influencers: CampaignInfluencerDetail[]
}> {
  try {
    const headersList = await headers()
    const host = headersList.get('host') || 'localhost:3000'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const cookie = headersList.get('cookie') || ''

    const [campRes, infRes] = await Promise.all([
      fetch(`${protocol}://${host}/api/campaigns/${id}`, {
        headers: { cookie },
        next: { revalidate: 0 },
      }),
      fetch(`${protocol}://${host}/api/campaigns/${id}/influencers`, {
        headers: { cookie },
        next: { revalidate: 0 },
      }),
    ])

    const campaign = campRes.ok ? await campRes.json() : null
    const infJson = infRes.ok ? await infRes.json() : null

    return {
      campaign: campaign || {
        id,
        title: '쿠쿠 트윈프레셔 신제품 런칭',
        client: 'CUCKOO',
        stage: 'review',
        assignee: '김현우',
        influencer_count: 5,
        approved_count: 3,
        content_deadline: '06.08 (D-2)',
        dday: '마감 D-2',
        dday_variant: 'hot',
        portal_token: 'mock-portal-token-001',
        product_name: '쿠쿠 트윈프레셔 IH',
        channels_text: '인스타 릴스 / 유튜브',
        post_period: '06.10 ~ 06.20',
        hashtags: ['# 신혼집밥', '# 쿠쿠트윈프레셔', '필수 태그 2개'],
      },
      influencers: infJson?.data || [],
    }
  } catch (error) {
    console.error('Error fetching campaign detail data, using fallback:', error)
    return {
      campaign: {
        id,
        title: '쿠쿠 트윈프레셔 신제품 런칭',
        client: 'CUCKOO',
        stage: 'review',
        assignee: '김현우',
        influencer_count: 5,
        approved_count: 3,
        content_deadline: '06.08 (D-2)',
        dday: '마감 D-2',
        dday_variant: 'hot',
        portal_token: 'mock-portal-token-001',
        product_name: '쿠쿠 트윈프레셔 IH',
        channels_text: '인스타 릴스 / 유튜브',
        post_period: '06.10 ~ 06.20',
        hashtags: ['# 신혼집밥', '# 쿠쿠트윈프레셔', '필수 태그 2개'],
      },
      influencers: [
        {
          id: 'ci-1',
          influencer_id: 'inf-2',
          name: '먹방준',
          handle: '@mukbang_jun',
          avatar_initial: '준',
          avatar_color_class: 'c3',
          status_text: '원고 v2 검수 대기',
          badge_label: '검수 중',
          badge_variant: 'warn',
          channel_info: '유튜브 · 52만 팔로워',
          caption:
            '신혼 첫 밥솥으로 쿠쿠 트윈프레셔를 골랐어요 🍚 12분 만에 갓 지은 윤기나는 밥이 완성되는데, 압력이 두 배라 현미도 부드럽게 익어요. 자취·신혼 집들이 메뉴로 강력 추천! #신혼집밥 #쿠쿠트윈프레셔',
          media_info: {
            duration: '04:12',
            size: '142MB',
            placeholder: '원고 영상/이미지 미리보기',
          },
          draft_versions: [
            { version: 'v1', label: '반려', variant: 'muted' },
            { version: 'v2', label: '검수 중', variant: 'green', is_active: true },
          ],
          feedback_history: [
            {
              id: 'fb-1',
              sender_name: '김현우',
              sender_role: '운영',
              avatar_initial: '우',
              avatar_color_class: 'c1',
              message: 'v1 영상에서 제품 모델명이 화면에 노출되지 않았어요. 클로즈업 컷 한 번만 추가 부탁드립니다.',
              time: '어제 14:20 · 수정 요청',
              type: '수정 요청',
              is_me: true,
            },
            {
              id: 'fb-2',
              sender_name: '먹방준',
              sender_role: '인플루언서',
              avatar_initial: '준',
              avatar_color_class: 'c3',
              message: '모델명 클로즈업 추가해서 v2로 재제출했습니다! 확인 부탁드려요.',
              time: '오늘 09:35 · 재제출',
              type: '재제출',
              is_me: false,
            },
          ],
        },
        {
          id: 'ci-2',
          influencer_id: 'inf-1',
          name: '유리쿡',
          handle: '@yuri_cooks',
          avatar_initial: '유',
          avatar_color_class: 'c1',
          status_text: '광고주 승인 완료',
          badge_label: '승인',
          badge_variant: 'soft',
          channel_info: '인스타 · 12.5만 팔로워',
          caption: '쿠쿠 트윈프레셔로 만드는 초스피드 레시피! ✨ 밥이 윤기나고 쫀득해요. #신혼집밥 #쿠쿠트윈프레셔',
          draft_versions: [{ version: 'v1', label: '승인 완료', variant: 'green', is_active: true }],
          feedback_history: [],
        },
        {
          id: 'ci-3',
          influencer_id: 'inf-6',
          name: '집밥현이',
          handle: '@hyuni.eats',
          avatar_initial: '현',
          avatar_color_class: 'c6',
          status_text: '광고주 승인 완료',
          badge_label: '승인',
          badge_variant: 'soft',
          channel_info: '유튜브 · 17만 팔로워',
          caption: '오늘 저녁은 쿠쿠 트윈프레셔와 함께하는 집밥 한 상 🍚 #신혼집밥 #쿠쿠트윈프레셔',
          draft_versions: [{ version: 'v1', label: '승인 완료', variant: 'green', is_active: true }],
          feedback_history: [],
        },
        {
          id: 'ci-4',
          influencer_id: 'inf-4',
          name: '하나테이블',
          handle: '@hana_table',
          avatar_initial: '하',
          avatar_color_class: 'c4',
          status_text: '수정 요청 → 재제출 대기',
          badge_label: '수정요청',
          badge_variant: 'danger',
          channel_info: '인스타 · 21만 팔로워',
          caption: '예쁜 테이블 세팅과 쿠쿠 트윈프레셔 🤍 #신혼집밥 #쿠쿠트윈프레셔',
          draft_versions: [{ version: 'v1', label: '수정 요청', variant: 'muted', is_active: true }],
          feedback_history: [],
        },
        {
          id: 'ci-5',
          influencer_id: 'inf-5',
          name: '리빙민지',
          handle: '@minji.living',
          avatar_initial: '민',
          avatar_color_class: 'c5',
          status_text: '원고 미제출',
          badge_label: '대기',
          badge_variant: 'gray',
          channel_info: '틱톡 · 34만 팔로워',
          caption: '원고 작성 대기 중입니다.',
          draft_versions: [],
          feedback_history: [],
        },
      ],
    }
  }
}

export default async function CampaignDetailPage({ params }: PageProps) {
  const { id } = await params
  const { campaign, influencers } = await getCampaignDetailData(id)

  return <CampaignDetailClient campaign={campaign} influencers={influencers} />
}
