'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { CampaignStepper } from '@/components/campaign/CampaignStepper'
import type { CampaignDetailData } from '@/app/api/campaigns/[id]/route'

export interface LineupInfluencerItem {
  ci_id: string
  influencer_id: string
  influencer_name: string
  handle: string
  avatar_initial: string
  avatar_color_class: string
  channel_info: string
  followers: string
  status: 'candidate' | 'selected' | 'passed' | 'confirmed' | 'rejected' | string
  proposed_fee_formatted: string
}

interface CampaignInfluencersLineupClientProps {
  campaign: CampaignDetailData
  lineupItems: LineupInfluencerItem[]
}

export function CampaignInfluencersLineupClient({
  campaign,
  lineupItems: initialItems,
}: CampaignInfluencersLineupClientProps) {
  const [items, setItems] = useState<LineupInfluencerItem[]>(initialItems)
  const [sendingId, setSendingId] = useState<string | null>(null)

  const handleSendOutreach = async (ci_id: string) => {
    setSendingId(ci_id)
    try {
      const res = await fetch(`/api/campaigns/${campaign.id}/influencers/${ci_id}/outreach`, {
        method: 'POST',
      })
      if (res.ok) {
        setItems((prev) =>
          prev.map((i) => (i.ci_id === ci_id ? { ...i, status: 'confirmed' } : i))
        )
        toast.success('섭외 이메일이 발송됐습니다')
      } else {
        toast.error('이메일 발송 실패')
      }
    } catch (err) {
      console.error(err)
      toast.error('오류가 발생했습니다.')
    } finally {
      setSendingId(null)
    }
  }

  const handleIncludeInProposal = (ci_id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.ci_id === ci_id ? { ...i, status: 'selected' } : i))
    )
    toast.success('광고주 후보 제안 목록에 포함되었습니다.')
  }

  const renderStatusBadgeAndAction = (item: LineupInfluencerItem) => {
    switch (item.status) {
      case 'candidate':
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="badge gray">후보</span>
            <button
              type="button"
              onClick={() => handleIncludeInProposal(item.ci_id)}
              className="btn btn-ghost cursor-pointer"
              style={{ fontSize: '13px', padding: '6px 12px' }}
            >
              보고 포함
            </button>
          </div>
        )
      case 'selected':
        return (
          <button
            type="button"
            onClick={() => handleSendOutreach(item.ci_id)}
            disabled={sendingId === item.ci_id}
            className="btn btn-green cursor-pointer"
            style={{ fontSize: '13px', padding: '6px 14px' }}
          >
            {sendingId === item.ci_id ? '발송 중...' : '섭외 폼 발송'}
          </button>
        )
      case 'confirmed':
        return <span className="badge soft">✓ 섭외 확정</span>
      case 'rejected':
        return <span className="badge danger">✕ 거절</span>
      default:
        return <span className="badge gray">후보</span>
    }
  }

  return (
    <div className="main select-none">
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
        <span className={`dday ${campaign.dday_variant === 'hot' ? 'hot' : 'warm'}`}>
          {campaign.dday}
        </span>
      </header>

      <div className="content">
        <div
          className="card stepper-card"
          style={{
            background: 'var(--white)',
            border: '1px solid var(--dark)',
            borderRadius: 'var(--r-lg)',
            boxShadow: 'var(--shadow)',
          }}
        >
          <div className="row between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
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
              <b style={{ fontSize: '16px' }}>섭외 진행 · Outreach</b>
            </div>
            <span className="muted" style={{ fontSize: '13px' }}>
              담당 {campaign.assignee} · 총 {items.length}명
            </span>
          </div>

          <CampaignStepper currentStage={campaign.stage || 'outreaching'} />
        </div>

        <div className="card flat" style={{ background: 'var(--white)', border: '1px solid var(--dark)', borderRadius: 'var(--r-lg)', overflowX: 'auto' }}>
          <table className="tbl" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>인플루언서</th>
                <th>채널</th>
                <th className="right">팔로워</th>
                <th className="right">제안 단가</th>
                <th>섭외 상태 및 액션</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.ci_id}>
                  <td>
                    <div className="who" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`av ${item.avatar_color_class || 'c1'}`}>
                        {item.avatar_initial}
                      </span>
                      <div>
                        <div className="nm" style={{ fontWeight: 600 }}>{item.influencer_name}</div>
                        <div className="hd" style={{ fontSize: '12px', color: 'var(--muted)' }}>{item.handle}</div>
                      </div>
                    </div>
                  </td>
                  <td>{item.channel_info}</td>
                  <td className="right foll">{item.followers}</td>
                  <td className="right price">{item.proposed_fee_formatted}</td>
                  <td>{renderStatusBadgeAndAction(item)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
