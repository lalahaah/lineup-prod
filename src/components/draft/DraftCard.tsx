'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { VersionHistory } from '@/components/draft/VersionHistory'
import { EmptyState } from '@/components/shared/EmptyState'
import type { DraftItem } from '@/app/api/drafts/[id]/route'
import type { InfluencerDraftOverview } from '@/app/api/campaigns/[id]/drafts/route'

interface DraftCardProps {
  influencer: InfluencerDraftOverview
  onApprove?: (draftId: string) => void
  onRevise?: (draftId: string, feedback: string) => void
  onReject?: (draftId: string) => void
}

function isVideoUrl(url: string = ''): boolean {
  const lower = url.toLowerCase()
  return (
    lower.endsWith('.mp4') ||
    lower.endsWith('.mov') ||
    lower.endsWith('.webm') ||
    lower.endsWith('.mkv') ||
    lower.includes('video')
  )
}

export function DraftCard({ influencer, onApprove, onRevise, onReject }: DraftCardProps) {
  const drafts = influencer.drafts || []
  const [selectedVersion, setSelectedVersion] = useState<number>(
    influencer.current_draft?.version || (drafts.length > 0 ? drafts[drafts.length - 1].version : 1)
  )

  const currentDraft = drafts.find((d) => d.version === selectedVersion) || influencer.current_draft

  // 직접 구현한 수정 요청 모달 state
  const [showReviseModal, setShowReviseModal] = useState(false)
  const [reviseText, setReviseText] = useState('')
  const [isSubmittingAction, setIsSubmittingAction] = useState(false)

  if (!currentDraft) {
    return (
      <div
        className="card card-pad"
        style={{
          background: 'var(--white)',
          border: '1px solid var(--dark)',
          borderRadius: 'var(--r-lg)',
          boxShadow: 'var(--shadow)',
          padding: '40px',
        }}
      >
        <EmptyState
          icon="📝"
          title="아직 원고를 제출하지 않았습니다"
          description={`${influencer.name} 님이 원고를 제출하면 여기에 표시됩니다.`}
        />
      </div>
    )
  }

  const fileUrl = currentDraft.file_urls?.[0] || ''
  const isVideo = isVideoUrl(fileUrl) || isVideoUrl(currentDraft.file_name)

  const isApproved = currentDraft.status === 'agency_approved' || currentDraft.status === 'client_reviewing' || currentDraft.status === 'client_approved'
  const isActionable = currentDraft.status === 'submitted' || currentDraft.status === 'agency_reviewing'

  const handleApproveClick = async () => {
    setIsSubmittingAction(true)
    try {
      if (onApprove) {
        await onApprove(currentDraft.id)
      } else {
        toast.success('승인됐습니다. 광고주에게 전달됩니다.')
      }
    } finally {
      setIsSubmittingAction(false)
    }
  }

  const handleOpenReviseModal = () => {
    setReviseText('')
    setShowReviseModal(true)
  }

  const handleReviseConfirm = async () => {
    if (!reviseText.trim()) return
    setIsSubmittingAction(true)
    try {
      if (onRevise) {
        await onRevise(currentDraft.id, reviseText.trim())
      } else {
        toast.success('수정 요청이 전달됐습니다.')
      }
      setShowReviseModal(false)
    } finally {
      setIsSubmittingAction(false)
    }
  }

  const handleRejectClick = async () => {
    setIsSubmittingAction(true)
    try {
      if (onReject) {
        await onReject(currentDraft.id)
      } else {
        toast.error('원고가 반려 처리됐습니다.')
      }
    } finally {
      setIsSubmittingAction(false)
    }
  }

  return (
    <div
      className="card card-pad select-none"
      style={{
        background: 'var(--white)',
        border: '1px solid var(--dark)',
        borderRadius: 'var(--r-lg)',
        boxShadow: 'var(--shadow)',
        padding: '26px',
      }}
    >
      {/* Header */}
      <div className="review-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div className="row" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className={`av ${influencer.avatar_color_class || 'c1'}`}>
            {influencer.avatar_initial}
          </span>
          <div>
            <div style={{ fontWeight: 600, fontSize: '17px', color: 'var(--dark)' }}>
              {influencer.name}{' '}
              {influencer.handle && (
                <span className="muted" style={{ fontWeight: 400, fontSize: '14px' }}>
                  {influencer.handle}
                </span>
              )}
            </div>
            <div className="muted" style={{ fontSize: '13px' }}>
              {influencer.channel_info}
            </div>
          </div>
        </div>
        <span className={`badge ${influencer.status_variant}`}>{influencer.status_label}</span>
      </div>

      {/* Version Tabs */}
      <VersionHistory
        drafts={drafts}
        activeVersion={selectedVersion}
        onSelectVersion={(v) => setSelectedVersion(v)}
      />

      {/* Draft Area */}
      <div className="draft-area" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)', gap: 24, marginTop: 20 }}>
        {/* Left: Media Preview (Image or Video) */}
        <div>
          <div
            style={{
              width: '100%',
              minHeight: '280px',
              borderRadius: '16px',
              background: 'var(--gray)',
              border: '1px solid var(--dark)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {fileUrl ? (
              isVideo ? (
                <video
                  src={fileUrl}
                  controls
                  style={{
                    width: '100%',
                    maxHeight: '340px',
                    objectFit: 'contain',
                    background: '#000',
                  }}
                />
              ) : (
                <img
                  src={fileUrl}
                  alt="원고 이미지"
                  style={{
                    width: '100%',
                    maxHeight: '340px',
                    objectFit: 'contain',
                  }}
                />
              )
            ) : (
              <div style={{ textAlign: 'center', padding: 20, color: 'var(--muted)' }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🎬</div>
                <span className="text-xs font-semibold text-[var(--dark)]">
                  {currentDraft.file_name || '원고 파일'}
                </span>
              </div>
            )}
          </div>

          <div className="row" style={{ display: 'flex', gap: '8px', marginTop: '12px', alignItems: 'center' }}>
            {fileUrl && (
              <a
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                download
                className="rowbtn"
                style={{
                  fontSize: '13px',
                  padding: '8px 14px',
                  border: '1px solid var(--dark)',
                  borderRadius: '9px',
                  background: '#fff',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  color: 'var(--dark)',
                  fontWeight: 500,
                }}
              >
                원본 다운로드
              </a>
            )}
            <span className="badge gray" style={{ fontSize: '12px' }}>
              버전 v{currentDraft.version} · {currentDraft.created_at}
            </span>
          </div>
        </div>

        {/* Right: Caption & Feedbacks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <h4 style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 600, marginBottom: '6px' }}>
              캡션 원고
            </h4>
            <div
              className="cap"
              style={{
                background: 'var(--gray)',
                border: '1px solid var(--line-soft)',
                borderRadius: '12px',
                padding: '14px',
                fontSize: '13.5px',
                lineHeight: 1.6,
                color: 'var(--dark)',
                whiteSpace: 'pre-wrap',
              }}
            >
              {currentDraft.caption || '작성된 캡션이 없습니다.'}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 600, marginBottom: '8px' }}>
              피드백 이력
            </h4>
            <div className="feedback" style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 180, overflowY: 'auto' }}>
              {currentDraft.feedbacks && currentDraft.feedbacks.length > 0 ? (
                currentDraft.feedbacks.map((fb) => {
                  const isAgency = fb.author_type === 'agency'
                  return (
                    <div
                      key={fb.id}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 12,
                        border: '1px solid var(--dark)',
                        background: isAgency ? 'var(--green-soft)' : 'var(--gray)',
                        fontSize: 13,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 11, color: 'var(--muted)' }}>
                        <span style={{ fontWeight: 600, color: 'var(--dark)' }}>
                          {isAgency ? '🟢 에이전시 피드백' : '⚪ 광고주 피드백'}
                        </span>
                        <span>{fb.created_at}</span>
                      </div>
                      <p style={{ margin: 0, color: 'var(--dark)', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                        {fb.content}
                      </p>
                    </div>
                  )
                })
              ) : (
                <div style={{ fontSize: 12, color: 'var(--muted)', padding: '12px', background: 'var(--gray)', borderRadius: 10 }}>
                  등록된 피드백 이력이 없습니다.
                </div>
              )}
            </div>
          </div>

          {/* Actions Footer */}
          <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid var(--line-soft)' }}>
            {isApproved ? (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: 'var(--green-soft)',
                  border: '1px solid var(--dark)',
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--dark)',
                  textAlign: 'center',
                }}
              >
                ✓ 이미 승인된 원고입니다
              </div>
            ) : isActionable ? (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={handleApproveClick}
                  disabled={isSubmittingAction}
                  className="btn btn-green cursor-pointer"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <svg viewBox="0 0 24 24" fill="none" style={{ width: 16, height: 16 }}>
                    <path
                      d="M5 12l5 5L20 7"
                      stroke="#191A23"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  ✓ 에이전시 승인 → 광고주
                </button>
                <button
                  type="button"
                  onClick={handleOpenReviseModal}
                  disabled={isSubmittingAction}
                  className="btn btn-ghost cursor-pointer"
                >
                  수정 요청
                </button>
                <button
                  type="button"
                  onClick={handleRejectClick}
                  disabled={isSubmittingAction}
                  className="btn btn-ghost cursor-pointer"
                  style={{ color: '#CF1322' }}
                >
                  반려
                </button>
              </div>
            ) : (
              <div style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>
                현재 상태: {influencer.status_label}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── 직접 구현한 수정 요청 모달 (Fixed Overlay) ─── */}
      {showReviseModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowReviseModal(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 20,
              border: '1px solid var(--dark)',
              boxShadow: '0 4px 0 0 var(--dark)',
              width: 460,
              maxWidth: 'calc(100vw - 40px)',
              padding: 28,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 8px', color: 'var(--dark)' }}>
              수정 요청
            </h2>
            <p style={{ fontSize: 14, color: 'var(--muted)', margin: '0 0 16px' }}>
              인플루언서에게 전달할 수정 내용을 입력해주세요.
            </p>
            <textarea
              value={reviseText}
              onChange={(e) => setReviseText(e.target.value)}
              placeholder="예) 제품 모델명이 영상에 노출되지 않았습니다. 클로즈업 컷을 추가해 주세요."
              style={{
                width: '100%',
                height: 120,
                border: '1px solid var(--dark)',
                borderRadius: 10,
                padding: '12px 14px',
                fontSize: 14,
                fontFamily: 'inherit',
                resize: 'vertical',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 8,
                marginTop: 16,
              }}
            >
              <button
                type="button"
                onClick={() => setShowReviseModal(false)}
                disabled={isSubmittingAction}
                style={{
                  padding: '10px 20px',
                  border: '1px solid var(--dark)',
                  borderRadius: 10,
                  background: 'white',
                  cursor: 'pointer',
                  fontSize: 14,
                }}
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleReviseConfirm}
                disabled={!reviseText.trim() || isSubmittingAction}
                style={{
                  padding: '10px 20px',
                  border: '1px solid var(--dark)',
                  borderRadius: 10,
                  background: reviseText.trim() ? 'var(--dark)' : 'var(--gray)',
                  color: reviseText.trim() ? 'white' : 'var(--muted)',
                  cursor: reviseText.trim() && !isSubmittingAction ? 'pointer' : 'not-allowed',
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                {isSubmittingAction ? '전송 중...' : '수정 요청 전송'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
