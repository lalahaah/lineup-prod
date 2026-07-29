'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import * as XLSX from 'xlsx'
import { CampaignStepper } from '@/components/campaign/CampaignStepper'
import type { ShippingItem } from '@/app/api/campaigns/[id]/shipping/route'
import type { CampaignDetailData } from '@/app/api/campaigns/[id]/route'

interface CampaignShippingClientProps {
  campaign: CampaignDetailData
  shippingItems: ShippingItem[]
}

export function CampaignShippingClient({
  campaign,
  shippingItems: initialItems,
}: CampaignShippingClientProps) {
  const [items, setItems] = useState<ShippingItem[]>(initialItems)
  const [editingTracking, setEditingTracking] = useState<Record<string, string>>({})
  const [savingId, setSavingId] = useState<string | null>(null)

  const handleDownloadExcel = () => {
    const exportData = items.map((item) => ({
      인플루언서명: item.influencer_name,
      수령인: item.recipient,
      연락처: item.phone,
      주소: item.address,
      상세주소: item.detail_address,
    }))

    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, '배송지목록')

    const safeTitle = campaign.title.replace(/[/\\?%*:|"<>]/g, '_')
    XLSX.writeFile(workbook, `lineup_배송지_${safeTitle}.xlsx`)
    toast.success('배송지 엑셀 파일이 다운로드되었습니다.')
  }

  const handleSaveTracking = async (ci_id: string) => {
    const trackingNumber = editingTracking[ci_id]
    if (!trackingNumber || !trackingNumber.trim()) {
      toast.error('운송장 번호를 입력해주세요.')
      return
    }

    setSavingId(ci_id)
    try {
      const res = await fetch(`/api/campaigns/${campaign.id}/shipping/${ci_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tracking_number: trackingNumber, status: 'shipped' }),
      })

      if (res.ok) {
        setItems((prev) =>
          prev.map((i) =>
            i.ci_id === ci_id
              ? { ...i, tracking_number: trackingNumber, status: 'shipped' }
              : i
          )
        )
        toast.success('운송장 번호가 저장되었습니다.')
      } else {
        toast.error('저장에 실패했습니다.')
      }
    } catch (err) {
      console.error(err)
      toast.error('오류가 발생했습니다.')
    } finally {
      setSavingId(null)
    }
  }

  const renderStatusBadge = (status: ShippingItem['status']) => {
    switch (status) {
      case 'pending':
        return <span className="badge gray">대기</span>
      case 'preparing':
        return <span className="badge gray">준비중</span>
      case 'shipped':
        return <span className="badge soft">발송완료</span>
      case 'in_transit':
        return <span className="badge warn">배송중</span>
      case 'delivered':
        return <span className="badge green">수령완료</span>
      default:
        return <span className="badge gray">대기</span>
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
        <span className="dday warm">{campaign.dday}</span>
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
              <b style={{ fontSize: '16px' }}>제품 배송 · Shipping</b>
            </div>
            <span className="muted" style={{ fontSize: '13px' }}>
              담당 {campaign.assignee} · 인플루언서 {items.length}명
            </span>
          </div>

          <CampaignStepper currentStage="shipping" />
        </div>

        {/* Shipping Card */}
        <div
          className="card card-pad"
          style={{
            background: 'var(--white)',
            border: '1px solid var(--dark)',
            borderRadius: 'var(--r-lg)',
            boxShadow: 'var(--shadow)',
            padding: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <h2 style={{ fontSize: '18px', fontWeight: 700 }}>배송 관리</h2>
            <button
              type="button"
              onClick={handleDownloadExcel}
              className="btn btn-green cursor-pointer"
              style={{ fontSize: '14px', padding: '9px 16px' }}
            >
              <svg viewBox="0 0 24 24" fill="none" style={{ width: 16, height: 16 }}>
                <path d="M12 3v12M12 15l-4-4M12 15l4-4" stroke="var(--dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 19h16" stroke="var(--dark)" strokeWidth="2" strokeLinecap="round" />
              </svg>
              배송지 엑셀 다운로드
            </button>
          </div>

          {/* Shipping Table */}
          <table className="tbl" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>인플루언서</th>
                <th>수령인</th>
                <th>주소</th>
                <th>연락처</th>
                <th>운송장번호</th>
                <th>배송상태</th>
                <th>수령확인</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.ci_id}>
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
                  <td style={{ fontSize: '14px' }}>{item.recipient}</td>
                  <td style={{ fontSize: '13px', color: 'var(--muted)', maxWidth: '240px' }}>
                    {item.address !== '-' ? `${item.address} ${item.detail_address}` : '-'}
                  </td>
                  <td style={{ fontSize: '14px' }}>{item.phone}</td>
                  <td>
                    {item.tracking_number ? (
                      <span style={{ fontFamily: 'monospace', fontSize: '14px', fontWeight: 500 }}>
                        {item.tracking_number}
                      </span>
                    ) : (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <input
                          placeholder="운송장 번호"
                          value={editingTracking[item.ci_id] || ''}
                          onChange={(e) =>
                            setEditingTracking({ ...editingTracking, [item.ci_id]: e.target.value })
                          }
                          style={{
                            padding: '6px 10px',
                            fontSize: '13px',
                            border: '1px solid var(--dark)',
                            borderRadius: '8px',
                            width: '130px',
                            outline: 'none',
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveTracking(item.ci_id)}
                          disabled={savingId === item.ci_id}
                          className="btn btn-ghost cursor-pointer"
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                        >
                          저장
                        </button>
                      </div>
                    )}
                  </td>
                  <td>{renderStatusBadge(item.status)}</td>
                  <td>
                    {item.is_confirmed || item.status === 'delivered' ? (
                      <span className="done-tag" style={{ fontSize: '13px' }}>
                        ✓ 완료
                      </span>
                    ) : (
                      <span className="muted" style={{ fontSize: '13px' }}>
                        미완료
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
