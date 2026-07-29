import { NextResponse, NextRequest } from 'next/server'
import { sendEmail } from '@/lib/email'
import { InfluencerRevision } from '@/lib/email/templates/InfluencerRevision'
import { ClientDraftReview } from '@/lib/email/templates/ClientDraftReview'

export interface DraftItem {
  id: string
  campaign_id: string
  influencer_id: string
  version: number
  status:
    | 'agency_reviewing'
    | 'agency_approved'
    | 'revision_requested'
    | 'client_reviewing'
    | 'client_approved'
    | 'rejected'
  caption: string
  file_name?: string
  file_size?: string
  file_duration?: string
  media_type?: string
  created_at: string
  feedbacks: Array<{
    id: string
    author_type: 'agency' | 'client' | 'influencer'
    author_name: string
    author_role?: string
    avatar_initial: string
    avatar_color_class: string
    content: string
    created_at: string
    action_label?: string
  }>
}

const MOCK_DRAFTS: Record<string, DraftItem> = {
  'draft-jun-v2': {
    id: 'draft-jun-v2',
    campaign_id: 'camp-8',
    influencer_id: 'inf-2',
    version: 2,
    status: 'agency_reviewing',
    caption:
      '신혼 첫 밥솥으로 쿠쿠 트윈프레셔를 골랐어요 🍚 12분 만에 갓 지은 윤기나는 밥이 완성되는데, 압력이 두 배라 현미도 부드럽게 익어요. 자취·신혼 집들이 메뉴로 강력 추천! #신혼집밥 #쿠쿠트윈프레셔',
    file_name: 'mukbang_jun_v2.mp4',
    file_size: '142MB',
    file_duration: '04:12',
    media_type: 'video',
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
  'draft-jun-v1': {
    id: 'draft-jun-v1',
    campaign_id: 'camp-8',
    influencer_id: 'inf-2',
    version: 1,
    status: 'rejected',
    caption: '쿠쿠 트윈프레셔 신제품 런칭 리뷰입니다! #신혼집밥 #쿠쿠트윈프레셔',
    file_name: 'mukbang_jun_v1.mp4',
    file_size: '120MB',
    file_duration: '03:50',
    media_type: 'video',
    created_at: '어제 10:00',
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
    ],
  },
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const draft = MOCK_DRAFTS[id] || MOCK_DRAFTS['draft-jun-v2']
  return NextResponse.json(draft)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const body = await request.json()
    const { action, feedback } = body

    let newStatus: DraftItem['status'] = 'agency_reviewing'
    if (action === 'approve') newStatus = 'agency_approved'
    if (action === 'revise') newStatus = 'revision_requested'
    if (action === 'reject') newStatus = 'rejected'

    console.log(`[Draft Patch] ID: ${id}, Action: ${action}, Status: ${newStatus}, Feedback: ${feedback}`)

    const currentDraft = MOCK_DRAFTS[id] || MOCK_DRAFTS['draft-jun-v2']
    const updatedFeedbacks = [...currentDraft.feedbacks]

    if (feedback) {
      updatedFeedbacks.push({
        id: `fb-${Date.now()}`,
        author_type: 'agency',
        author_name: '김현우',
        author_role: '운영',
        avatar_initial: '우',
        avatar_color_class: 'c1',
        content: feedback,
        created_at: '방금 전',
        action_label: action === 'revise' ? '수정 요청' : '피드백',
      })
    }

    // 이메일 자동 발송 처리
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    if (action === 'revise') {
      await sendEmail({
        to: 'mukbang_jun@example.com',
        subject: '[Lineup] 원고 수정 요청 안내입니다',
        campaignId: currentDraft.campaign_id,
        influencerId: currentDraft.influencer_id,
        react: InfluencerRevision({
          influencerName: '먹방준',
          campaignName: '쿠쿠 트윈프레셔 신제품 런칭',
          feedback: feedback || '수정 사항을 확인 후 재제출 부탁드립니다.',
          resubmitLink: `${baseUrl}/inf/mock-inf-token-001`,
        }),
      })
    } else if (action === 'approve') {
      await sendEmail({
        to: 'cuckoo_brand@example.com',
        subject: '[CUCKOO] 원고 검수 완료 및 컨펌 요청드립니다',
        campaignId: currentDraft.campaign_id,
        react: ClientDraftReview({
          clientName: 'CUCKOO',
          campaignName: '쿠쿠 트윈프레셔 신제품 런칭',
          draftCount: 3,
          portalLink: `${baseUrl}/portal/mock-portal-token-001/drafts`,
        }),
      })
    }

    const updatedDraft: DraftItem = {
      ...currentDraft,
      status: newStatus,
      feedbacks: updatedFeedbacks,
    }

    return NextResponse.json({
      success: true,
      draft: updatedDraft,
    })
  } catch (error) {
    console.error('Error updating draft:', error)
    return NextResponse.json({ error: 'Failed to update draft' }, { status: 500 })
  }
}

