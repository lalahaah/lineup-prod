'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { CampaignStepper } from '@/components/campaign/CampaignStepper'
import { DraftCard } from '@/components/draft/DraftCard'
import type { InfluencerDraftOverview } from '@/app/api/campaigns/[id]/drafts/route'
import type { CampaignDetailData } from '@/app/api/campaigns/[id]/route'

interface CampaignDraftsClientProps {
  campaign: CampaignDetailData
  influencers: InfluencerDraftOverview[]
  selectedInfluencerId?: string
}

export function CampaignDraftsClient({
  campaign,
  influencers: initialInfluencers,
  selectedInfluencerId,
}: CampaignDraftsClientProps) {
  const [influencers, setInfluencers] = useState<InfluencerDraftOverview[]>(initialInfluencers)
  const [activeInfId, setActiveInfId] = useState<string>(
    selectedInfluencerId || initialInfluencers[0]?.influencer_id || 'inf-2'
  )

  const activeInfluencer =
    influencers.find((i) => i.influencer_id === activeInfId) || influencers[0]

  const handleCopyPortalLink = () => {
    const link = `${window.location.origin}/portal/${campaign.portal_token}`
    navigator.clipboard.writeText(link)
    toast.success('광고주 포털 링크가 클립보드에 복사됐습니다.')
  }

  const handleApproveDraft = async (draftId: string) => {
    try {
      const res = await fetch(`/api/drafts/${draftId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' }),
      })
      if (res.ok) {
        setInfluencers((prev) =>
          prev.map((item) => {
            if (item.influencer_id === activeInfluencer.influencer_id) {
              const updatedDrafts = item.drafts.map((d) =>
                d.id === draftId ? { ...d, status: 'agency_approved' as const } : d
              )
              return {
                ...item,
                status_label: '승인',
                status_variant: 'soft',
                drafts: updatedDrafts,
                current_draft: updatedDrafts.find((d) => d.id === draftId) || item.current_draft,
              }
            }
            return item
          })
        )
        toast.success('승인됐습니다. 광고주에게 전달됩니다.')
      }
    } catch (err) {
      console.error(err)
      toast.error('승인 처리에 실패했습니다.')
    }
  }

  const handleReviseDraft = async (draftId: string, feedback: string) => {
    try {
      const res = await fetch(`/api/drafts/${draftId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'revise', feedback }),
      })
      if (res.ok) {
        setInfluencers((prev) =>
          prev.map((item) => {
            if (item.influencer_id === activeInfluencer.influencer_id) {
              const updatedDrafts = item.drafts.map((d) => {
                if (d.id === draftId) {
                  return {
                    ...d,
                    status: 'revision_requested' as const,
                    feedbacks: [
                      ...d.feedbacks,
                      {
                        id: `fb-${Date.now()}`,
                        author_type: 'agency' as const,
                        author_name: '김현우',
                        author_role: '운영',
                        avatar_initial: '우',
                        avatar_color_class: 'c1',
                        content: feedback,
                        created_at: '방금 전',
                        action_label: '수정 요청',
                      },
                    ],
                  }
                }
                return d
              })
              return {
                ...item,
                status_label: '수정요청',
                status_variant: 'danger',
                drafts: updatedDrafts,
                current_draft: updatedDrafts.find((d) => d.id === draftId) || item.current_draft,
              }
            }
            return item
          })
        )
        toast.success('수정 요청이 전달됐습니다.')
      }
    } catch (err) {
      console.error(err)
      toast.error('수정 요청 전송에 실패했습니다.')
    }
  }

  const handleRejectDraft = async (draftId: string) => {
    try {
      const res = await fetch(`/api/drafts/${draftId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject' }),
      })
      if (res.ok) {
        setInfluencers((prev) =>
          prev.map((item) => {
            if (item.influencer_id === activeInfluencer.influencer_id) {
              const updatedDrafts = item.drafts.map((d) =>
                d.id === draftId ? { ...d, status: 'rejected' as const } : d
              )
              return {
                ...item,
                status_label: '반려',
                status_variant: 'gray',
                drafts: updatedDrafts,
                current_draft: updatedDrafts.find((d) => d.id === draftId) || item.current_draft,
              }
            }
            return item
          })
        )
        toast.error('원고가 반려 처리됐습니다.')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const approvedCount = influencers.filter((i) => i.status_label === '승인').length

  return (
    <div className="main select-none">
      {/* Topbar Header */}
      <header className="topbar">
        <div className="h">
          <Link href="/campaigns" className="back">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M15 6l-6 6 6 6"
                stroke="var(--muted)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            캠페인
          </Link>
          <h1 className="font-bold text-2xl tracking-tight text-[var(--dark)]">
            {campaign.title}
          </h1>
        </div>
        <div className="spacer" />
        <span className="badge dark">{campaign.client}</span>
        <span className="dday hot">{campaign.dday}</span>
        <button
          type="button"
          onClick={handleCopyPortalLink}
          className="btn btn-ghost font-sans cursor-pointer"
        >
          포털 링크 복사
        </button>
      </header>

      {/* Main Content */}
      <div className="content">
        {/* Stepper Card */}
        <div
          className="card stepper-card"
          style={{
            background: 'var(--white)',
            border: '1px solid var(--dark)',
            borderRadius: 'var(--r-lg)',
            boxShadow: 'var(--shadow)',
          }}
        >
          <div
            className="row between"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <div className="row" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                className="pill"
                style={{
                  background: 'var(--green)',
                  borderRadius: '6px',
                  padding: '1px 9px',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: 'var(--dark)',
                }}
              >
                현재 단계
              </span>
              <b style={{ fontSize: '16px' }}>원고 검수 · Review</b>
            </div>
            <span className="muted" style={{ fontSize: '13px' }}>
              담당 {campaign.assignee} · 인플루언서 {influencers.length}명
            </span>
          </div>

          <CampaignStepper currentStage={campaign.stage} />
        </div>

        {/* 2-Column Detail Grid */}
        <div className="det-grid">
          {/* Left Column (340px) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {/* Card 1: Influencers List */}
            <div
              className="card card-pad"
              style={{
                padding: '18px',
                background: 'var(--white)',
                border: '1px solid var(--dark)',
                borderRadius: 'var(--r-lg)',
                boxShadow: 'var(--shadow)',
              }}
            >
              <div
                className="row between"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',

                  alignItems: 'center',
                  marginBottom: '6px',
                  padding: '0 4px',
                }}
              >
                <h2 style={{ fontSize: '17px', fontWeight: 700 }}>참여 인플루언서</h2>
                <span className="badge soft">
                  승인 {approvedCount} / {influencers.length}
                </span>
              </div>

              <div className="inf-list">
                {influencers.map((inf) => {
                  const isSelected = inf.influencer_id === activeInfId
                  return (
                    <div
                      key={inf.influencer_id}
                      onClick={() => setActiveInfId(inf.influencer_id)}
                      className={`inf-row ${isSelected ? 'sel' : ''}`}
                    >
                      <span className={`av ${inf.avatar_color_class || 'c1'}`}>
                        {inf.avatar_initial}
                      </span>
                      <div className="info">
                        <div className="nm">{inf.name}</div>
                        <div className="st">
                          {inf.current_draft
                            ? `원고 v${inf.current_draft.version} 검수 대기`
                            : '원고 미제출'}
                        </div>
                      </div>
                      <span className={`badge ${inf.status_variant}`}>{inf.status_label}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Card 2: Campaign Guide */}
            <div
              className="card card-pad"
              style={{
                background: 'var(--white)',
                border: '1px solid var(--dark)',
                borderRadius: 'var(--r-lg)',
                boxShadow: 'var(--shadow)',
                padding: '22px',
              }}
            >
              <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px' }}>
                캠페인 가이드
              </h2>
              <div className="grid-2" style={{ gap: '14px' }}>
                <div className="kv">
                  <b>제품</b>
                  {campaign.product_name}
                </div>
                <div className="kv">
                  <b>채널</b>
                  {campaign.channels_text}
                </div>
                <div className="kv">
                  <b>원고 마감</b>
                  {campaign.content_deadline}
                </div>
                <div className="kv">
                  <b>게시 기간</b>
                  {campaign.post_period}
                </div>
              </div>
              <div className="guide-row">
                {campaign.hashtags.map((tag, idx) => (
                  <span key={idx} className="badge gray">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (1fr) */}
          {activeInfluencer && (
            <DraftCard
              key={activeInfluencer.influencer_id}
              influencer={activeInfluencer}
              onApprove={handleApproveDraft}
              onRevise={handleReviseDraft}
              onReject={handleRejectDraft}
            />
          )}
        </div>
      </div>
    </div>
  )
}
