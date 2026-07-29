'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { InfluencerItem } from '@/types'
import { EmptyState } from '@/components/shared/EmptyState'

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

  // Default selected: 4 active candidates selected as in Influencers.html mockup
  const [selectedIds, setSelectedIds] = useState<string[]>(['inf-1', 'inf-2', 'inf-3', 'inf-6'])

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

  if (influencers.length === 0) {
    return (
      <EmptyState
        icon="🔍"
        title="검색된 인플루언서가 없습니다"
        description="조건에 맞는 인플루언서가 없습니다. 검색어나 필터를 변경해 보세요."
      />
    )
  }

  return (
    <div>
      {/* Count Line */}
      <div className="count-line">
        <span className="muted" style={{ fontSize: '14px' }}>
          <b style={{ color: 'var(--dark)' }}>{influencers.length}명</b> 검색됨 ·{' '}
          <b style={{ color: 'var(--dark)' }}>쿠쿠 트윈프레셔</b> 캠페인 후보 구성 중
        </span>
        <span className="row" style={{ display: 'flex', gap: '8px' }}>
          <button type="button" className="rowbtn">
            엑셀 내보내기
          </button>
          <button type="button" className="rowbtn add">
            선택 {selectedIds.length}명 캠페인에 추가
          </button>
        </span>
      </div>

      {/* Table Card */}
      <div className="card flat" style={{ background: 'var(--white)', border: '1px solid var(--dark)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: '30px' }}>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                />
              </th>
              <th>인플루언서</th>
              <th>채널</th>
              <th>카테고리</th>
              <th className="right">팔로워</th>
              <th className="right">평균 참여율</th>
              <th className="right">제안 단가</th>
              <th>상태</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {influencers.map((inf) => {
              const isBlack = inf.is_blacklisted || inf.status === 'blacklisted'
              const isChecked = selectedIds.includes(inf.id)

              return (
                <tr key={inf.id} style={isBlack ? { opacity: 0.55 } : undefined}>
                  <td>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      disabled={isBlack}
                      onChange={() => !isBlack && toggleSelectOne(inf.id)}
                    />
                  </td>
                  <td>
                    <div className="who">
                      <span className={`av ${inf.avatar_color_class || 'c1'}`}>
                        {inf.avatar_initial}
                      </span>
                      <div>
                        <div className="nm">{inf.name}</div>
                        <div className="hd">{inf.handle}</div>
                      </div>
                    </div>
                  </td>
                  <td>
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
                  <td>
                    <span className="cat">{inf.category}</span>
                  </td>
                  <td className="right foll">{inf.followers_formatted}</td>
                  <td className="right">{inf.engagement_rate_formatted}</td>
                  <td className="right price">{inf.fee_formatted}</td>
                  <td>
                    {inf.status === 'candidate' && (
                      <span className="badge soft">
                        <span className="dot" style={{ background: '#1f8a3b' }}></span>
                        후보
                      </span>
                    )}
                    {inf.status === 'uncontacted' && <span className="badge gray">미접촉</span>}
                    {isBlack && <span className="badge danger">블랙리스트</span>}
                  </td>
                  <td>
                    {inf.status === 'candidate' && (
                      <button
                        type="button"
                        className="rowbtn"
                        onClick={() =>
                          onViewDetail ? onViewDetail(inf) : router.push(`/influencers/${inf.id}`)
                        }
                      >
                        상세
                      </button>

                    )}
                    {inf.status === 'uncontacted' && (
                      <button
                        type="button"
                        className="rowbtn add"
                        onClick={() => onAddCandidate && onAddCandidate(inf)}
                      >
                        + 후보
                      </button>
                    )}
                    {isBlack && (
                      <button type="button" className="rowbtn" disabled>
                        제외
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
