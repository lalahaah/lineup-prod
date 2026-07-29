'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { VersionHistory } from '@/components/draft/VersionHistory'
import { DraftFeedback } from '@/components/draft/DraftFeedback'
import { EmptyState } from '@/components/shared/EmptyState'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

import type { DraftItem } from '@/app/api/drafts/[id]/route'
import type { InfluencerDraftOverview } from '@/app/api/campaigns/[id]/drafts/route'

interface DraftCardProps {
  influencer: InfluencerDraftOverview
  onApprove?: (draftId: string) => void
  onRevise?: (draftId: string, feedback: string) => void
  onReject?: (draftId: string) => void
}

export function DraftCard({ influencer, onApprove, onRevise, onReject }: DraftCardProps) {
  const drafts = influencer.drafts || []
  const [selectedVersion, setSelectedVersion] = useState<number>(
    influencer.current_draft?.version || (drafts.length > 0 ? drafts[drafts.length - 1].version : 1)
  )

  const currentDraft = drafts.find((d) => d.version === selectedVersion) || influencer.current_draft

  // Revision Feedback Dialog state
  const [isRevisionDialogOpen, setIsRevisionDialogOpen] = useState(false)
  const [revisionFeedback, setRevisionFeedback] = useState('')

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
          title="아직 원고를 제출하지 않았습니다"
          description={`${influencer.name} 님이 원고를 제출하면 이곳에서 확인 및 검수를 진행할 수 있습니다.`}
        />
      </div>
    )
  }

  const handleApproveClick = () => {
    if (onApprove) {
      onApprove(currentDraft.id)
    } else {
      toast.success('승인됐습니다. 광고주에게 전달됩니다.')
    }
  }

  const handleOpenRevisionDialog = () => {
    setRevisionFeedback('')
    setIsRevisionDialogOpen(true)
  }

  const handleConfirmRevision = () => {
    if (!revisionFeedback.trim()) {
      toast.error('수정 요청 피드백을 입력해 주세요.')
      return
    }
    if (onRevise) {
      onRevise(currentDraft.id, revisionFeedback)
    } else {
      toast.success('수정 요청이 전달됐습니다.')
    }
    setIsRevisionDialogOpen(false)
  }

  const handleRejectClick = () => {
    if (onReject) {
      onReject(currentDraft.id)
    } else {
      toast.error('원고가 반려 처리됐습니다.')
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
      <div className="review-head">
        <div className="row" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className={`av ${influencer.avatar_color_class || 'c3'}`}>
            {influencer.avatar_initial}
          </span>
          <div>
            <div style={{ fontWeight: 500, fontSize: '17px' }}>
              {influencer.name}{' '}
              <span className="muted" style={{ fontWeight: 400, fontSize: '14px' }}>
                {influencer.handle}
              </span>
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
      <div className="draft-area">
        {/* Left: Image/Video Placeholder */}
        <div>
          <div
            style={{
              width: '100%',
              height: '300px',
              borderRadius: '16px',
              background: 'var(--gray)',
              border: '1px solid var(--dark)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              color: 'var(--muted)',
              padding: '20px',
              textAlign: 'center',
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" style={{ width: 42, height: 42 }}>
              <rect x="3" y="3" width="18" height="18" rx="4" stroke="var(--dark)" strokeWidth="1.8" />
              <circle cx="8.5" cy="8.5" r="1.5" fill="var(--dark)" />
              <path d="M21 15l-5-5-8 8" stroke="var(--dark)" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <span className="text-xs font-semibold text-[var(--dark)]">
              {currentDraft.file_name || '원고 영상/이미지 미리보기'}
            </span>
          </div>

          <div className="row" style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button
              type="button"
              className="rowbtn"
              onClick={() => toast.success('원본 원고 파일 다운로드가 시작되었습니다.')}
              style={{
                fontSize: '13px',
                padding: '8px 13px',
                border: '1px solid var(--dark)',
                borderRadius: '9px',
                background: '#fff',
                cursor: 'pointer',
              }}
            >
              원본 다운로드
            </button>
            {currentDraft.file_size && (
              <span className="badge gray">
                {currentDraft.file_duration ? `${currentDraft.file_duration} · ` : ''}
                {currentDraft.file_size}
              </span>
            )}
          </div>
        </div>

        {/* Right: Caption & Feedbacks */}
        <div>
          <h4 style={{ fontSize: '14px', color: 'var(--muted)', fontWeight: 400, marginBottom: '6px' }}>
            캡션 원고
          </h4>
          <p className="cap">{currentDraft.caption}</p>

          <h4 style={{ fontSize: '14px', color: 'var(--muted)', fontWeight: 400, margin: '22px 0 6px' }}>
            피드백 이력
          </h4>
          <div className="feedback">
            {currentDraft.feedbacks && currentDraft.feedbacks.length > 0 ? (
              currentDraft.feedbacks.map((fb) => (
                <DraftFeedback
                  key={fb.id}
                  content={fb.content}
                  authorType={fb.author_type}
                  authorName={fb.author_name}
                  authorRole={fb.author_role}
                  avatarInitial={fb.avatar_initial}
                  avatarColorClass={fb.avatar_color_class}
                  createdAt={fb.created_at}
                  actionLabel={fb.action_label}
                />
              ))
            ) : (
              <div className="text-xs text-[var(--muted)] p-3 bg-[var(--gray)] rounded-xl">
                등록된 피드백 이력이 없습니다.
              </div>
            )}
          </div>

          {/* Actions Footer */}
          <div className="actions">
            <button type="button" onClick={handleApproveClick} className="btn btn-green cursor-pointer">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12l5 5L20 7"
                  stroke="#191A23"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              에이전시 승인 → 광고주
            </button>
            <button
              type="button"
              onClick={handleOpenRevisionDialog}
              className="btn btn-ghost cursor-pointer"
            >
              수정 요청
            </button>
            <button
              type="button"
              onClick={handleRejectClick}
              className="btn btn-ghost cursor-pointer"
              style={{ marginLeft: 'auto' }}
            >
              반려
            </button>
          </div>
        </div>
      </div>

      {/* Revision Dialog */}
      <Dialog open={isRevisionDialogOpen} onOpenChange={setIsRevisionDialogOpen}>
        <DialogContent
          className="sm:max-w-[480px]"
          style={{
            background: 'var(--white)',
            border: '1px solid var(--dark)',
            borderRadius: 'var(--r-lg)',
            boxShadow: 'var(--shadow)',
            padding: '24px',
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[var(--dark)]">원고 수정 요청</DialogTitle>
            <DialogDescription className="text-sm text-[var(--muted)]">
              인플루언서({influencer.name}) 님에게 전달할 수정 요청 내용을 상세히 작성해주세요.
            </DialogDescription>
          </DialogHeader>

          <div className="py-3">
            <textarea
              rows={4}
              placeholder="예: 영상 v1에서 모델명이 잘 보이지 않아요. 클로즈업 컷을 1초간 추가 요청드립니다."
              value={revisionFeedback}
              onChange={(e) => setRevisionFeedback(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                fontSize: '14px',
                border: '1px solid var(--dark)',
                borderRadius: '12px',
                outline: 'none',
              }}
            />
          </div>

          <DialogFooter className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setIsRevisionDialogOpen(false)}
              className="btn btn-ghost cursor-pointer"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleConfirmRevision}
              className="btn btn-green cursor-pointer"
            >
              수정 요청 전송
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
