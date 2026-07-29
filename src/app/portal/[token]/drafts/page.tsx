'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import type { PortalApprovedDraft } from '@/app/api/portal/[token]/drafts/route'

interface PageProps {
  params: Promise<{ token: string }>
}

export default function PortalDraftsPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const token = resolvedParams.token

  const [drafts, setDrafts] = useState<PortalApprovedDraft[]>([])
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(null)
  const [revisionFeedback, setRevisionFeedback] = useState('')
  const [isRevisionOpen, setIsRevisionOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function fetchDrafts() {
      try {
        const res = await fetch(`/api/portal/${token}/drafts`)
        if (res.ok) {
          const json = await res.json()
          setDrafts(json.data || [])
        }
      } catch (err) {
        console.error('Error fetching portal drafts:', err)
      }
    }
    fetchDrafts()
  }, [token])

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/portal/${token}/drafts/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' }),
      })
      if (res.ok) {
        setDrafts((prev) =>
          prev.map((d) => (d.id === id ? { ...d, status: 'client_approved' } : d))
        )
        toast.success('승인되었습니다.')
      }
    } catch (err) {
      console.error(err)
      toast.error('승인 처리 실패')
    }
  }

  const handleOpenRevision = (id: string) => {
    setSelectedDraftId(id)
    setRevisionFeedback('')
    setIsRevisionOpen(true)
  }

  const handleConfirmRevision = async () => {
    if (!selectedDraftId || !revisionFeedback.trim()) {
      toast.error('수정 요청 내용을 입력해주세요.')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/portal/${token}/drafts/${selectedDraftId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'revise', feedback: revisionFeedback }),
      })
      if (res.ok) {
        setDrafts((prev) =>
          prev.map((d) => (d.id === selectedDraftId ? { ...d, status: 'revision_requested' } : d))
        )
        toast.success('수정 요청이 전달됐습니다')
        setIsRevisionOpen(false)
      }
    } catch (err) {
      console.error(err)
      toast.error('수정 요청 실패')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      {/* Navigation Bar */}
      <div className="pnav">
        <div className="in">
          <div className="brand select-none">
            <svg className="mark" viewBox="0 0 34 34" fill="none">
              <circle cx="17" cy="17" r="16" fill="#191A23" />
              <path d="M17 6a11 11 0 1 0 0 22" stroke="#B9FF66" strokeWidth="3.4" />
              <circle cx="17" cy="17" r="4" fill="#B9FF66" />
            </svg>
            Lineup
          </div>
          <span className="token select-none">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="4" y="10" width="16" height="11" rx="2" stroke="#6a6a72" strokeWidth="1.7" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="#6a6a72" strokeWidth="1.7" />
            </svg>
            안전한 링크 · 로그인 불필요
          </span>
        </div>
      </div>

      <div className="pwrap select-none">
        {/* Hero Area */}
        <div className="phero">
          <div className="ey">라운드미디어가 보낸 원고 컨펌 요청</div>
          <h1 className="font-bold text-[var(--dark)] tracking-tight">
            쿠쿠 에어프라이어 봄 캠페인 — 원고 검수
          </h1>
          <p className="muted" style={{ fontSize: '15px' }}>
            에이전시 검수를 통과한 원고입니다. 최종 게시 전 원고를 확인하고 승인 또는 수정 요청을 진행해주세요.
          </p>
        </div>

        {/* Tab Bar */}
        <div className="tabbar">
          <Link href={`/portal/${token}`} className="ptab text-decoration-none">
            후보 검토 <span className="n">8</span>
          </Link>
          <span className="ptab on">
            원고 컨펌 <span className="n">{drafts.length}</span>
          </span>
          <span className="ptab">성과 리포트</span>
        </div>

        {/* Draft Cards List */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {drafts.map((draft) => {
            const isApproved = draft.status === 'client_approved'
            const isRevised = draft.status === 'revision_requested'

            return (
              <div
                key={draft.id}
                style={{
                  background: 'var(--white)',
                  border: '1px solid var(--dark)',
                  borderRadius: '24px',
                  boxShadow: 'var(--shadow)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className={`av ${draft.avatar_color_class || 'c1'}`}>
                      {draft.avatar_initial}
                    </span>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: '16px' }}>{draft.influencer_name}</div>
                      <div className="muted" style={{ fontSize: '13px' }}>
                        {draft.channel_info}
                      </div>
                    </div>
                  </div>
                  <span className="badge soft">업로드 예정 {draft.scheduled_upload_date}</span>
                </div>

                {/* Image Placeholder */}
                <div
                  style={{
                    height: '200px',
                    borderRadius: '12px',
                    background: 'var(--gray)',
                    border: '1px solid var(--dark)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    color: 'var(--muted)',
                    fontSize: '13px',
                    padding: '16px',
                    textAlign: 'center',
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" style={{ width: 36, height: 36 }}>
                    <rect x="3" y="3" width="18" height="18" rx="4" stroke="var(--dark)" strokeWidth="1.8" />
                    <circle cx="8.5" cy="8.5" r="1.5" fill="var(--dark)" />
                    <path d="M21 15l-5-5-8 8" stroke="var(--dark)" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                  <span>{draft.media_placeholder}</span>
                </div>

                {/* Caption Text Preview */}
                <div>
                  <h4 style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 400, marginBottom: '4px' }}>
                    캡션 원고
                  </h4>
                  <p style={{ fontSize: '14px', lineHeight: 1.5, color: 'var(--dark)' }}>
                    {draft.caption}
                  </p>
                </div>

                {/* Actions */}
                <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--line-soft)', display: 'flex', gap: '10px' }}>
                  {isApproved ? (
                    <div className="done-tag" style={{ fontSize: '15px' }}>
                      <svg viewBox="0 0 24 24" fill="none" style={{ width: 18, height: 18 }}>
                        <path
                          d="M5 12l5 5L20 7"
                          stroke="#1f8a3b"
                          strokeWidth="2.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      ✓ 승인됨
                    </div>
                  ) : isRevised ? (
                    <span className="badge danger">수정 요청 전달됨</span>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleOpenRevision(draft.id)}
                        className="btn btn-ghost cursor-pointer"
                        style={{ flex: 1 }}
                      >
                        수정 요청
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApprove(draft.id)}
                        className="btn btn-green cursor-pointer"
                        style={{ flex: 1 }}
                      >
                        승인
                      </button>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Revision Modal */}
      <Dialog open={isRevisionOpen} onOpenChange={setIsRevisionOpen}>
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
              에이전시 및 인플루언서에게 전달할 피드백 수정 사항을 입력해주세요.
            </DialogDescription>
          </DialogHeader>

          <div className="py-3">
            <textarea
              rows={4}
              placeholder="수정 요청 사항을 상세히 기재해주세요."
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
              onClick={() => setIsRevisionOpen(false)}
              className="btn btn-ghost cursor-pointer"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleConfirmRevision}
              disabled={isSubmitting}
              className="btn btn-green cursor-pointer"
            >
              {isSubmitting ? '전송 중...' : '수정 요청 전송'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
