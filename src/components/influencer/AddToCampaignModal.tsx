'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

interface AddToCampaignModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  influencerName?: string
  influencerId?: string
}

const MOCK_CAMPAIGNS = [
  { id: 'campaign-1', title: '쿠쿠 트윈프레셔 신제품 런칭' },
  { id: 'campaign-2', title: '쿠쿠 에어프라이어 봄 캠페인' },
  { id: 'campaign-3', title: '하기스 위생 캠페인' },
]

export function AddToCampaignModal({
  open,
  onOpenChange,
  influencerName = '인플루언서',
  influencerId = 'inf-1',
}: AddToCampaignModalProps) {
  const [selectedCampaignId, setSelectedCampaignId] = useState(MOCK_CAMPAIGNS[0].id)
  const [fee, setFee] = useState<string>('800000')
  const [comment, setComment] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch(`/api/campaigns/${selectedCampaignId}/influencers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          influencer_id: influencerId,
          agreed_fee: Number(fee),
          comment,
        }),
      })

      if (res.ok) {
        toast.success('캠페인에 추가됐습니다')
        onOpenChange(false)
      } else {
        toast.error('캠페인 추가에 실패했습니다')
      }
    } catch (err) {
      console.error(err)
      toast.error('오류가 발생했습니다')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[480px] p-6"
        style={{
          background: 'var(--white)',
          border: '1px solid var(--dark)',
          borderRadius: 'var(--r-lg)',
          boxShadow: 'var(--shadow)',
        }}
      >
        <DialogHeader>
          <DialogTitle
            className="text-xl font-bold"
            style={{ color: 'var(--dark)', fontFamily: 'var(--font-sans)' }}
          >
            캠페인에 추가
          </DialogTitle>
          <p className="text-xs text-[var(--muted)]">
            <b>{influencerName}</b> 님을 후보로 등록할 캠페인을 선택하고 제안 조건 정보를 입력하세요.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          {/* 캠페인 선택 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[var(--dark)]">캠페인 선택</label>
            <select
              value={selectedCampaignId}
              onChange={(e) => setSelectedCampaignId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dark)] bg-[var(--white)] text-sm font-sans focus:outline-none"
            >
              {MOCK_CAMPAIGNS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* 제안 단가 입력 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[var(--dark)]">제안 단가 (원)</label>
            <input
              type="number"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              placeholder="예: 800000"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dark)] bg-[var(--white)] text-sm font-sans focus:outline-none"
            />
          </div>

          {/* 운영팀 코멘트 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[var(--dark)]">운영팀 코멘트</label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="특이사항이나 제안 배경을 메모하세요."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dark)] bg-[var(--white)] text-sm font-sans focus:outline-none resize-none"
            />
          </div>

          <DialogFooter className="mt-4 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="btn btn-ghost font-sans cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-green font-sans cursor-pointer"
            >
              {isSubmitting ? '추가 중...' : '추가하기'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
