import { NextResponse, NextRequest } from 'next/server'

export interface CampaignInfluencerDetail {
  id: string
  influencer_id: string
  name: string
  handle: string
  avatar_initial: string
  avatar_color_class: string
  status_text: string
  badge_label: string
  badge_variant: 'soft' | 'gray' | 'warn' | 'danger'
  channel_info: string
  caption: string
  media_info?: {
    duration?: string
    size?: string
    placeholder?: string
  }
  draft_versions: Array<{
    version: string
    label: string
    variant: 'muted' | 'green' | 'gray'
    is_active?: boolean
  }>
  feedback_history: Array<{
    id: string
    sender_name: string
    sender_role: string
    avatar_initial: string
    avatar_color_class: string
    message: string
    time: string
    type: string
    is_me: boolean
  }>
}

const MOCK_CAMPAIGN_INFLUENCERS: CampaignInfluencerDetail[] = [
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
    media_info: {
      duration: '01:30',
      size: '45MB',
      placeholder: '유리쿡 원고 릴스 영상 미리보기',
    },
    draft_versions: [{ version: 'v1', label: '승인 완료', variant: 'green', is_active: true }],
    feedback_history: [
      {
        id: 'fb-3',
        sender_name: '김현우',
        sender_role: '운영',
        avatar_initial: '우',
        avatar_color_class: 'c1',
        message: '광고주 승인이 완료되었습니다. 예정일에 맞춰 포스팅 부탁드립니다.',
        time: '어제 18:00 · 승인 완료',
        type: '승인',
        is_me: true,
      },
    ],
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
    media_info: {
      duration: '08:45',
      size: '280MB',
      placeholder: '집밥현이 유튜브 원고 영상 미리보기',
    },
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
    media_info: {
      duration: '00:58',
      size: '32MB',
      placeholder: '하나테이블 원고 미리보기',
    },
    draft_versions: [{ version: 'v1', label: '수정 요청', variant: 'muted', is_active: true }],
    feedback_history: [
      {
        id: 'fb-4',
        sender_name: '김현우',
        sender_role: '운영',
        avatar_initial: '우',
        avatar_color_class: 'c1',
        message: '해시태그 오탈자 수정 부탁드립니다 (#쿠쿠트윈프레셔).',
        time: '오늘 10:12 · 수정 요청',
        type: '수정 요청',
        is_me: true,
      },
    ],
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
    media_info: {
      placeholder: '원고 미제출',
    },
    draft_versions: [],
    feedback_history: [],
  },
]

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  return NextResponse.json({
    data: MOCK_CAMPAIGN_INFLUENCERS,
    total: MOCK_CAMPAIGN_INFLUENCERS.length,
    approvedCount: 3,
  })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const body = await request.json()
    return NextResponse.json(
      { message: 'Successfully added influencer', campaign_id: id, ...body },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error adding influencer:', error)
    return NextResponse.json({ error: 'Failed to add influencer' }, { status: 500 })
  }
}
