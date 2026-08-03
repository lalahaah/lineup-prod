'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import type { Campaign } from '@/types'

interface AddToCampaignModalProps {
  isOpen?: boolean
  open?: boolean
  onClose?: () => void
  onOpenChange?: (open: boolean) => void
  selectedIds?: string[]
  influencerId?: string
  influencerName?: string
  onSuccess?: () => void
}

export function AddToCampaignModal({
  isOpen,
  open,
  onClose,
  onOpenChange,
  selectedIds,
  influencerId,
  influencerName,
  onSuccess,
}: AddToCampaignModalProps) {
  const isVisible = isOpen ?? open ?? false

  const handleClose = () => {
    if (onClose) onClose()
    if (onOpenChange) onOpenChange(false)
  }

  const targetIds = selectedIds && selectedIds.length > 0
    ? selectedIds
    : influencerId
    ? [influencerId]
    : []

  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('')
  const [proposedFee, setProposedFee] = useState<string>('')
  const [comment, setComment] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isVisible) {
      async function fetchCampaigns() {
        setIsLoading(true)
        try {
          const res = await fetch('/api/campaigns')
          if (res.ok) {
            const data = await res.json()
            const activeCampaigns = (data.data || []).filter(
              (c: Campaign) => c.stage !== 'completed'
            )
            setCampaigns(activeCampaigns)
            if (activeCampaigns.length > 0) {
              setSelectedCampaignId(activeCampaigns[0].id)
            }
          }
        } catch (err) {
          console.error(err)
        } finally {
          setIsLoading(false)
        }
      }
      fetchCampaigns()
    }
  }, [isVisible])

  if (!isVisible) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCampaignId) {
      toast.error('캠페인을 선택해 주세요.')
      return
    }
    if (targetIds.length === 0) {
      toast.error('선택된 인플루언서가 없습니다.')
      return
    }

    setIsSubmitting(true)
    let successCount = 0

    try {
      for (const infId of targetIds) {
        const res = await fetch(`/api/campaigns/${selectedCampaignId}/influencers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            influencer_id: infId,
            proposed_fee: proposedFee ? Number(proposedFee) : undefined,
            agency_comment: comment.trim() || undefined,
          }),
        })
        if (res.ok) {
          successCount++
        }
      }

      toast.success(`${successCount}명이 캠페인에 추가됐습니다.`)
      if (onSuccess) onSuccess()
      handleClose()
    } catch (err) {
      console.error(err)
      toast.error('캠페인 추가 중 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className="card card-pad bg-[var(--white)] max-w-md w-full flex flex-col gap-5"
        style={{
          border: '1px solid var(--dark)',
          borderRadius: 'var(--r-lg)',
          boxShadow: 'var(--shadow)',
          padding: '28px',
        }}
      >
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-lg font-bold text-[var(--dark)]">
            🎯 캠페인에 인플루언서 추가 ({influencerName || `${targetIds.length}명`})
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-500 hover:text-[var(--dark)] text-xl font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* 캠페인 선택 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[var(--dark)]">진행 중인 캠페인 선택</label>
            {isLoading ? (
              <span className="text-xs text-[var(--muted)]">캠페인 목록 로딩 중...</span>
            ) : (
              <select
                value={selectedCampaignId}
                onChange={(e) => setSelectedCampaignId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dark)] bg-[var(--white)] text-sm font-sans focus:outline-none"
              >
                {campaigns.length === 0 ? (
                  <option value="">진행 중인 캠페인이 없습니다</option>
                ) : (
                  campaigns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))
                )}
              </select>
            )}
          </div>

          {/* 제안 단가 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[var(--dark)]">제안 단가 (원)</label>
            <input
              type="number"
              placeholder="예: 600000 (입력 안 할 시 기본 단가 사용)"
              value={proposedFee}
              onChange={(e) => setProposedFee(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dark)] bg-[var(--white)] text-sm font-sans focus:outline-none"
            />
          </div>

          {/* 코멘트 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[var(--dark)]">운영팀 코멘트</label>
            <textarea
              rows={3}
              placeholder="섭외 시 참고할 운영 메모나 요청사항을 입력하세요."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 rounded-xl border border-[var(--dark)] bg-[var(--white)] text-sm font-sans focus:outline-none resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t">
            <button type="button" onClick={handleClose} className="btn btn-ghost font-sans">
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedCampaignId}
              className="btn btn-green font-sans cursor-pointer"
            >
              {isSubmitting ? '추가 중...' : `추가하기 (${targetIds.length}명)`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
