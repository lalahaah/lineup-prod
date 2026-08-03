'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import * as XLSX from 'xlsx'
import type { InfluencerItem } from '@/types'
import { EmptyState } from '@/components/shared/EmptyState'
import { AddToCampaignModal } from '@/components/influencer/AddToCampaignModal'

interface InfluencerTableProps {
  influencers: InfluencerItem[]
  onAddCandidate?: (influencer: InfluencerItem) => void
  onViewDetail?: (influencer: InfluencerItem) => void
}

export function InfluencerTable({
  influencers,
  onAddCandidate,
  onViewDetail,
}: InfluencerTableProps) {
  const router = useRouter()

  // 기본 선택값 = 비어 있음 (체크박스 선택된 수만 카운트)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false)
  const [targetSingleInf, setTargetSingleInf] = useState<InfluencerItem | null>(null)

  const selectableInfluencers = influencers.filter(
    (inf) => !inf.is_blacklisted && inf.status !== 'blacklisted'
  )

  const isAllSelected =
    selectableInfluencers.length > 0 &&
    selectableInfluencers.every((inf) => selectedIds.includes(inf.id))

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([])
    } else {
      setSelectedIds(selectableInfluencers.map((inf) => inf.id))
    }
  }

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  // 5. 엑셀 내보내기 (체크 선택 시 선택된 것만, 없으면 전체 다운로드)
  const handleExportExcel = () => {
    const targetItems = selectedIds.length > 0
      ? influencers.filter((inf) => selectedIds.includes(inf.id))
      : influencers

    if (targetItems.length === 0) return

    const rows = targetItems.map((inf: any) => ({
      이름: inf.name || '',
      주요채널: inf.channel_label || inf.channel || '',
      핸들: inf.handle || '',
      팔로워: inf.followers_formatted || inf.followers || 0,
      카테고리: inf.category || (inf.categories_list ? inf.categories_list.join(', ') : ''),
      단가범위: inf.fee_formatted || '',
      이메일: inf.email || '',
      연락처: inf.phone || '',
      협업횟수: inf.total_collaborations ?? 0,
      메모: inf.notes || inf.memo || '',
    }))

    const worksheet = XLSX.utils.json_to_sheet(rows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, '인플루언서DB')

    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    XLSX.writeFile(workbook, `lineup_인플루언서_DB_${today}.xlsx`)
  }

  const handleOpenBulkCampaignModal = () => {
    setTargetSingleInf(null)
    setIsCampaignModalOpen(true)
  }

  const handleOpenSingleCampaignModal = (inf: InfluencerItem) => {
    setTargetSingleInf(inf)
    setIsCampaignModalOpen(true)
  }

  if (influencers.length === 0) {
    return (
      <EmptyState
        icon="🔍"
        title="검색된 인플루언서가 없습니다"
        description="조건에 맞는 인플루언서가 없습니다. 검색어나 필터를 변경해 보세요."
      />
    )
  }

  const activeSelectedIds = targetSingleInf ? [targetSingleInf.id] : selectedIds

  return (
    <div>
      {/* Count Line */}
      <div className="count-line" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span className="muted" style={{ fontSize: '14px' }}>
          <b style={{ color: 'var(--dark)' }}>{influencers.length}명</b> 검색됨
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <button type="button" onClick={handleExportExcel} className="rowbtn cursor-pointer font-sans">
            📥 엑셀 내보내기
          </button>
          <button
            type="button"
            onClick={handleOpenBulkCampaignModal}
            className="rowbtn add cursor-pointer font-sans"
            disabled={selectedIds.length === 0}
            style={{ opacity: selectedIds.length === 0 ? 0.6 : 1 }}
          >
            선택 {selectedIds.length}명 캠페인에 추가
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="card flat" style={{ background: 'var(--white)', border: '1px solid var(--dark)', borderRadius: 'var(--r-lg)', overflowX: 'auto' }}>
        <table className="tbl" style={{ width: '100%', tableLayout: 'fixed', minWidth: '820px' }}>
          <thead>
            <tr>
              <th style={{ width: '40px', textAlign: 'center' }}>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                />
              </th>
              <th style={{ width: '200px' }}>인플루언서</th>
              <th style={{ width: '100px' }}>채널</th>
              <th style={{ width: '80px' }}>카테고리</th>
              <th className="right" style={{ width: '80px' }}>팔로워</th>
              <th className="right" style={{ width: '80px' }}>참여율</th>
              <th className="right" style={{ width: '100px' }}>단가</th>
              <th style={{ width: '80px' }}>상태</th>
              <th style={{ width: '60px' }}>액션</th>
            </tr>
          </thead>
          <tbody>
            {influencers.map((inf) => {
              const isBlack = inf.is_blacklisted || inf.status === 'blacklisted'
              const isChecked = selectedIds.includes(inf.id)

              return (
                <tr key={inf.id} style={isBlack ? { opacity: 0.55 } : undefined}>
                  <td style={{ width: '40px', textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      disabled={isBlack}
                      onChange={() => !isBlack && toggleSelectOne(inf.id)}
                    />
                  </td>
                  <td style={{ width: '200px', overflow: 'hidden' }}>
                    <div className="who" style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                      <span className={`av ${inf.avatar_color_class || 'c1'}`} style={{ flexShrink: 0 }}>
                        {inf.avatar_initial}
                      </span>
                      <div style={{ minWidth: 0, overflow: 'hidden' }}>
                        <div className="nm" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 600 }}>{inf.name}</div>
                        <div className="hd" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '12px', color: 'var(--muted)' }}>{inf.handle}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ width: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <span className="row" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      {inf.channel === 'instagram' && (
                        <span className="ch-ico ig">
                          <svg viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="3" width="18" height="18" rx="5" stroke="#fff" strokeWidth="1.8" />
                            <circle cx="12" cy="12" r="4" stroke="#fff" strokeWidth="1.8" />
                            <circle cx="17.5" cy="6.5" r="1.2" fill="#fff" />
                          </svg>
                        </span>
                      )}
                      {inf.channel === 'youtube' && (
                        <span className="ch-ico yt">
                          <svg viewBox="0 0 24 24" fill="#fff">
                            <path d="M5 7l14 .2c1 0 1.6.6 1.7 1.6.2 2 .2 4.4 0 6.4-.1 1-.7 1.6-1.7 1.6L5 17c-1 0-1.6-.6-1.7-1.6-.2-2-.2-4.4 0-6.4C3.4 7.6 4 7 5 7zm5 2.2v5.6l5-2.8z" />
                          </svg>
                        </span>
                      )}
                      {inf.channel === 'tiktok' && (
                        <span className="ch-ico tt">
                          <svg viewBox="0 0 24 24" fill="#fff">
                            <path d="M14 4c.3 2 1.6 3.6 3.6 3.9v2.3c-1.3.1-2.5-.3-3.6-1v5.4a4.8 4.8 0 1 1-4.8-4.8c.3 0 .5 0 .8.1v2.4a2.4 2.4 0 1 0 1.7 2.3V4H14z" />
                          </svg>
                        </span>
                      )}
                      {inf.channel_label}
                    </span>
                  </td>
                  <td style={{ width: '80px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <span className="cat">{inf.category}</span>
                  </td>
                  <td className="right foll" style={{ width: '80px', whiteSpace: 'nowrap' }}>{inf.followers_formatted}</td>
                  <td className="right" style={{ width: '80px', whiteSpace: 'nowrap' }}>{inf.engagement_rate_formatted}</td>
                  <td className="right price" style={{ width: '100px', whiteSpace: 'nowrap' }}>{inf.fee_formatted}</td>
                  <td style={{ width: '80px', whiteSpace: 'nowrap' }}>
                    {inf.status === 'candidate' && (
                      <span className="badge soft">
                        <span className="dot" style={{ background: '#1f8a3b' }}></span>
                        후보
                      </span>
                    )}
                    {inf.status === 'uncontacted' && <span className="badge gray">미접촉</span>}
                    {isBlack && <span className="badge danger">블랙리스트</span>}
                  </td>
                  <td style={{ width: '60px', whiteSpace: 'nowrap' }}>
                    <button
                      type="button"
                      className="rowbtn"
                      onClick={() =>
                        onViewDetail ? onViewDetail(inf) : router.push(`/influencers/${inf.id}`)
                      }
                    >
                      상세
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* 캠페인 추가 모달 */}
      <AddToCampaignModal
        isOpen={isCampaignModalOpen}
        onClose={() => setIsCampaignModalOpen(false)}
        selectedIds={activeSelectedIds}
        onSuccess={() => {
          setSelectedIds([])
          setTargetSingleInf(null)
        }}
      />
    </div>
  )
}
