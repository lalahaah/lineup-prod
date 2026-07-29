import { NextResponse, NextRequest } from 'next/server'

export interface PortalApprovedDraft {
  id: string
  influencer_name: string
  handle: string
  avatar_initial: string
  avatar_color_class: string
  channel_info: string
  caption: string
  media_placeholder: string
  scheduled_upload_date: string
  status: 'agency_approved' | 'client_approved' | 'revision_requested'
}

const MOCK_PORTAL_DRAFTS: PortalApprovedDraft[] = [
  {
    id: 'pd-1',
    influencer_name: '유리쿡',
    handle: '@yuri_cooks',
    avatar_initial: '유',
    avatar_color_class: 'c1',
    channel_info: '인스타 릴스 · 12.5만 팔로워',
    caption: '쿠쿠 트윈프레셔로 만드는 초스피드 레시피! ✨ 밥이 윤기나고 쫀득해요. #신혼집밥 #쿠쿠트윈프레셔',
    media_placeholder: '유리쿡 원고 릴스 미리보기 영상',
    scheduled_upload_date: '06.10',
    status: 'agency_approved',
  },
  {
    id: 'pd-2',
    influencer_name: '집밥현이',
    handle: '@hyuni.eats',
    avatar_initial: '현',
    avatar_color_class: 'c6',
    channel_info: '유튜브 · 17만 팔로워',
    caption: '오늘 저녁은 쿠쿠 트윈프레셔와 함께하는 집밥 한 상 🍚 #신혼집밥 #쿠쿠트윈프레셔',
    media_placeholder: '집밥현이 유튜브 원고 미리보기 영상',
    scheduled_upload_date: '06.11',
    status: 'agency_approved',
  },
  {
    id: 'pd-3',
    influencer_name: '먹방준',
    handle: '@mukbang_jun',
    avatar_initial: '준',
    avatar_color_class: 'c3',
    channel_info: '유튜브 · 52만 팔로워',
    caption:
      '신혼 첫 밥솥으로 쿠쿠 트윈프레셔를 골랐어요 🍚 12분 만에 갓 지은 윤기나는 밥이 완성되는데, 압력이 두 배라 현미도 부드럽게 익어요. 자취·신혼 집들이 메뉴로 강력 추천! #신혼집밥 #쿠쿠트윈프레셔',
    media_placeholder: '먹방준 v2 검수완료 영상 미리보기',
    scheduled_upload_date: '06.12',
    status: 'agency_approved',
  },
]

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params

  return NextResponse.json({
    token,
    data: MOCK_PORTAL_DRAFTS,
  })
}
