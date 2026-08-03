import { headers } from 'next/headers'
import { CampaignDraftsClient } from '@/components/draft/CampaignDraftsClient'
import type { CampaignDetailData } from '@/app/api/campaigns/[id]/route'
import type { InfluencerDraftOverview } from '@/app/api/campaigns/[id]/drafts/route'

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ inf?: string }>
}

async function getDraftsPageData(id: string): Promise<{
  campaign: CampaignDetailData
  influencers: InfluencerDraftOverview[]
}> {
  try {
    const headersList = await headers()
    const host = headersList.get('host') || 'localhost:3000'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const cookie = headersList.get('cookie') || ''

    const [campRes, draftsRes] = await Promise.all([
      fetch(`${protocol}://${host}/api/campaigns/${id}`, {
        headers: { cookie },
        next: { revalidate: 0 },
      }),
      fetch(`${protocol}://${host}/api/campaigns/${id}/drafts`, {
        headers: { cookie },
        next: { revalidate: 0 },
      }),
    ])

    const campaign = campRes.ok ? await campRes.json() : null
    const draftsJson = draftsRes.ok ? await draftsRes.json() : null

    return {
      campaign: campaign || {
        id,
        title: '쿠쿠 트윈프레셔 신제품 런칭',
        client: 'CUCKOO',
        stage: 'reviewing',
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
      influencers: draftsJson?.data || [],
    }
  } catch (error) {
    console.error('Error fetching campaign drafts data, using fallback:', error)
    return {
      campaign: {
        id,
        title: '쿠쿠 트윈프레셔 신제품 런칭',
        client: 'CUCKOO',
        stage: 'reviewing',
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
          influencer_id: 'inf-2',
          name: '먹방준',
          handle: '@mukbang_jun',
          avatar_initial: '준',
          avatar_color_class: 'c3',
          channel_info: '유튜브 · 52만 팔로워',
          status_label: '검수 중',
          status_variant: 'warn',
          drafts: [
            {
              id: 'draft-jun-v1',
              campaign_id: id,
              influencer_id: 'inf-2',
              version: 1,
              status: 'rejected',
              caption: '쿠쿠 트윈프레셔 신제품 런칭 리뷰입니다! #신혼집밥 #쿠쿠트윈프레셔',
              created_at: '어제 10:00',
              feedbacks: [],
            },
            {
              id: 'draft-jun-v2',
              campaign_id: id,
              influencer_id: 'inf-2',
              version: 2,
              status: 'agency_reviewing',
              caption:
                '신혼 첫 밥솥으로 쿠쿠 트윈프레셔를 골랐어요 🍚 12분 만에 갓 지은 윤기나는 밥이 완성되는데, 압력이 두 배라 현미도 부드럽게 익어요. 자취·신혼 집들이 메뉴로 강력 추천! #신혼집밥 #쿠쿠트윈프레셔',
              file_name: 'mukbang_jun_v2.mp4',
              file_size: '142MB',
              file_duration: '04:12',
              created_at: '오늘 09:35',
              feedbacks: [
                {
                  id: 'fb-1',
                  author_type: 'agency',
                  author_name: '김현우',
                  author_role: '운영',
                  avatar_initial: '우',
                  avatar_color_class: 'c1',
                  content: 'v1 영상에서 제품 모델명이 화면에 노출되지 않았어요. 클로즈업 컷 한 번만 추가 부탁드립니다.',
                  created_at: '어제 14:20',
                  action_label: '수정 요청',
                },
                {
                  id: 'fb-2',
                  author_type: 'influencer',
                  author_name: '먹방준',
                  author_role: '인플루언서',
                  avatar_initial: '준',
                  avatar_color_class: 'c3',
                  content: '모델명 클로즈업 추가해서 v2로 재제출했습니다! 확인 부탁드려요.',
                  created_at: '오늘 09:35',
                  action_label: '재제출',
                },
              ],
            },
          ],
          current_draft: {
            id: 'draft-jun-v2',
            campaign_id: id,
            influencer_id: 'inf-2',
            version: 2,
            status: 'agency_reviewing',
            caption:
              '신혼 첫 밥솥으로 쿠쿠 트윈프레셔를 골랐어요 🍚 12분 만에 갓 지은 윤기나는 밥이 완성되는데, 압력이 두 배라 현미도 부드럽게 익어요. 자취·신혼 집들이 메뉴로 강력 추천! #신혼집밥 #쿠쿠트윈프레셔',
            file_name: 'mukbang_jun_v2.mp4',
            file_size: '142MB',
            file_duration: '04:12',
            created_at: '오늘 09:35',
            feedbacks: [
              {
                id: 'fb-1',
                author_type: 'agency',
                author_name: '김현우',
                author_role: '운영',
                avatar_initial: '우',
                avatar_color_class: 'c1',
                content: 'v1 영상에서 제품 모델명이 화면에 노출되지 않았어요. 클로즈업 컷 한 번만 추가 부탁드립니다.',
                created_at: '어제 14:20',
                action_label: '수정 요청',
              },
              {
                id: 'fb-2',
                author_type: 'influencer',
                author_name: '먹방준',
                author_role: '인플루언서',
                avatar_initial: '준',
                avatar_color_class: 'c3',
                content: '모델명 클로즈업 추가해서 v2로 재제출했습니다! 확인 부탁드려요.',
                created_at: '오늘 09:35',
                action_label: '재제출',
              },
            ],
          },
        },
        {
          influencer_id: 'inf-1',
          name: '유리쿡',
          handle: '@yuri_cooks',
          avatar_initial: '유',
          avatar_color_class: 'c1',
          channel_info: '인스타 · 12.5만 팔로워',
          status_label: '승인',
          status_variant: 'soft',
          drafts: [
            {
              id: 'draft-yuri-v1',
              campaign_id: id,
              influencer_id: 'inf-1',
              version: 1,
              status: 'client_approved',
              caption: '쿠쿠 트윈프레셔로 만드는 초스피드 레시피! ✨ 밥이 윤기나고 쫀득해요. #신혼집밥 #쿠쿠트윈프레셔',
              file_name: 'yuri_v1.mp4',
              created_at: '어제 12:10',
              feedbacks: [],
            },
          ],
          current_draft: {
            id: 'draft-yuri-v1',
            campaign_id: id,
            influencer_id: 'inf-1',
            version: 1,
            status: 'client_approved',
            caption: '쿠쿠 트윈프레셔로 만드는 초스피드 레시피! ✨ 밥이 윤기나고 쫀득해요. #신혼집밥 #쿠쿠트윈프레셔',
            file_name: 'yuri_v1.mp4',
            created_at: '어제 12:10',
            feedbacks: [],
          },
        },
        {
          influencer_id: 'inf-6',
          name: '집밥현이',
          handle: '@hyuni.eats',
          avatar_initial: '현',
          avatar_color_class: 'c6',
          channel_info: '유튜브 · 17만 팔로워',
          status_label: '승인',
          status_variant: 'soft',
          drafts: [],
          current_draft: null,
        },
        {
          influencer_id: 'inf-4',
          name: '하나테이블',
          handle: '@hana_table',
          avatar_initial: '하',
          avatar_color_class: 'c4',
          channel_info: '인스타 · 21만 팔로워',
          status_label: '수정요청',
          status_variant: 'danger',
          drafts: [],
          current_draft: null,
        },
        {
          influencer_id: 'inf-5',
          name: '리빙민지',
          handle: '@minji.living',
          avatar_initial: '민',
          avatar_color_class: 'c5',
          channel_info: '틱톡 · 34만 팔로워',
          status_label: '대기',
          status_variant: 'gray',
          drafts: [],
          current_draft: null,
        },
      ],
    }
  }
}

export default async function CampaignDraftsPage({ params, searchParams }: PageProps) {
  const { id } = await params
  const resolvedSearchParams = await searchParams
  const selectedInfluencerId = resolvedSearchParams.inf

  const { campaign, influencers } = await getDraftsPageData(id)

  return (
    <CampaignDraftsClient
      campaign={campaign}
      influencers={influencers}
      selectedInfluencerId={selectedInfluencerId}
    />
  )
}
