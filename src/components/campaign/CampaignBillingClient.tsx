'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { CampaignStepper } from '@/components/campaign/CampaignStepper'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import type { CampaignBillingData } from '@/app/api/campaigns/[id]/billing/route'
import type { CampaignDetailData } from '@/app/api/campaigns/[id]/route'

interface CampaignBillingClientProps {
  campaign: CampaignDetailData
  billingData: CampaignBillingData
}

export function CampaignBillingClient({ campaign, billingData }: CampaignBillingClientProps) {
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false)
  const [issueDate, setIssueDate] = useState('2026-06-08')
  const [dueDate, setDueDate] = useState('2026-06-22')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSaveDraft = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/campaigns/${campaign.id}/billing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issueDate, dueDate, notes, status: 'draft' }),
      })
      if (res.ok) {
        toast.success('청구서 초안이 저장되었습니다.')
        setIsInvoiceModalOpen(false)
      }
    } catch (err) {
      console.error(err)
      toast.error('저장에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSendPDF = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/campaigns/${campaign.id}/billing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issueDate, dueDate, notes, status: 'sent' }),
      })
      if (res.ok) {
        toast.success('청구서 PDF 생성 후 광고주에게 발송되었습니다.')
        setIsInvoiceModalOpen(false)
      }
    } catch (err) {
      console.error(err)
      toast.error('발송에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

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
              <b style={{ fontSize: '16px' }}>정산 및 청구 · Billing</b>
            </div>
            <span className="muted" style={{ fontSize: '13px' }}>
              담당 {campaign.assignee} · 인플루언서 {billingData.influencer_items.length}명
            </span>
          </div>

          <CampaignStepper currentStage={campaign.stage || 'done'} />
        </div>

        {/* 2-Column Billing Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 align-start">
          {/* Card 1: Influencer Billing Table (2 cols) */}
          <div
            className="card card-pad lg:col-span-2"
            style={{
              background: 'var(--white)',
              border: '1px solid var(--dark)',
              borderRadius: 'var(--r-lg)',
              boxShadow: 'var(--shadow)',
              padding: '24px',
            }}
          >
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '18px' }}>
              인플루언서 정산 내역
            </h2>
            <table className="tbl" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>인플루언서</th>
                  <th>채널</th>
                  <th>팔로워</th>
                  <th>확정단가</th>
                  <th>세금계산서</th>
                  <th>지급상태</th>
                </tr>
              </thead>
              <tbody>
                {billingData.influencer_items.map((item) => (
                  <tr key={item.influencer_id}>
                    <td>
                      <div className="who">
                        <span className={`av ${item.avatar_color_class || 'c1'}`}>
                          {item.avatar_initial}
                        </span>
                        <div>
                          <div className="nm">{item.influencer_name}</div>
                          <div className="hd">{item.handle}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: '14px' }}>{item.channel_info}</td>
                    <td style={{ fontSize: '14px' }}>{item.followers}</td>
                    <td style={{ fontWeight: 600, fontSize: '15px' }}>
                      {item.confirmed_fee_formatted}
                    </td>
                    <td>
                      <span className={`badge ${item.tax_invoice_status === '수취' ? 'soft' : 'gray'}`}>
                        {item.tax_invoice_status}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${item.payment_status === '지급완료' ? 'green' : 'warn'}`}>
                        {item.payment_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Card 2: Summary Card (1 col) */}
          <div
            className="card card-pad"
            style={{
              background: 'var(--white)',
              border: '1px solid var(--dark)',
              borderRadius: 'var(--r-lg)',
              boxShadow: 'var(--shadow)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '18px' }}>
                캠페인 청구 요약
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="muted">인플루언서 비용 소계</span>
                  <b>₩{(billingData.influencer_subtotal / 10000).toLocaleString()}만 원</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="muted">대행 수수료 (15%)</span>
                  <b>₩{(billingData.agency_fee / 10000).toLocaleString()}만 원</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="muted">부가세 (10%)</span>
                  <b>₩{(billingData.vat / 10000).toLocaleString()}만 원</b>
                </div>
                <div
                  style={{
                    height: '1px',
                    background: 'var(--line-soft)',
                    margin: '8px 0',
                  }}
                />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',

                    fontSize: '18px',
                    fontWeight: 700,
                  }}
                >
                  <span>최종 청구액</span>
                  <span style={{ color: 'var(--dark)' }}>
                    ₩{(billingData.total_invoice_amount / 10000).toLocaleString()}만 원
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsInvoiceModalOpen(true)}
              className="btn btn-green cursor-pointer"
              style={{
                width: '100%',
                padding: '15px',
                fontSize: '16px',
                marginTop: '24px',
                justifyContent: 'center',
              }}
            >
              청구서 생성
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Creation Modal */}
      <Dialog open={isInvoiceModalOpen} onOpenChange={setIsInvoiceModalOpen}>
        <DialogContent
          className="sm:max-w-[500px]"
          style={{
            background: 'var(--white)',
            border: '1px solid var(--dark)',
            borderRadius: 'var(--r-lg)',
            boxShadow: 'var(--shadow)',
            padding: '24px',
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[var(--dark)]">청구서 생성 및 발송</DialogTitle>
            <DialogDescription className="text-sm text-[var(--muted)]">
              광고주({campaign.client}) 청구서 정보를 확인 후 발행합니다.
            </DialogDescription>
          </DialogHeader>

          <div className="py-3 flex flex-col gap-4">
            <div>
              <label className="text-xs text-[var(--muted)] block mb-1">발행일</label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  fontSize: '14px',
                  border: '1px solid var(--dark)',
                  borderRadius: '12px',
                  outline: 'none',
                }}
              />
            </div>
            <div>
              <label className="text-xs text-[var(--muted)] block mb-1">납기일</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  fontSize: '14px',
                  border: '1px solid var(--dark)',
                  borderRadius: '12px',
                  outline: 'none',
                }}
              />
            </div>
            <div>
              <label className="text-xs text-[var(--muted)] block mb-1">특이사항 (청구서 기재용)</label>
              <textarea
                rows={3}
                placeholder="특이사항 및 입금계좌 정보를 기재해주세요."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  fontSize: '14px',
                  border: '1px solid var(--dark)',
                  borderRadius: '12px',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSubmitting}
              className="btn btn-ghost cursor-pointer"
            >
              초안 저장
            </button>
            <button
              type="button"
              onClick={handleSendPDF}
              disabled={isSubmitting}
              className="btn btn-green cursor-pointer"
            >
              PDF 생성 후 발송
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
