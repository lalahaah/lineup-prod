'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { CampaignKanban } from '@/components/campaign/CampaignKanban'
import { EmptyState } from '@/components/shared/EmptyState'
import { STAGE_LABELS, type CampaignStage } from '@/types'
import type { CampaignCardData } from '@/app/api/campaigns/route'

interface CampaignsClientProps {
  initialCampaigns: CampaignCardData[]
  totalActive?: number
}

interface ClientOption {
  id: string
  name: string
}

const STAGE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'all', label: '전체 스테이지' },
  { value: 'preparing', label: '준비중' },
  { value: 'client_review', label: '광고주 검토' },
  { value: 'outreaching', label: '섭외중' },
  { value: 'reviewing', label: '원고 검수' },
  { value: 'done', label: '정산완료' },
]

export function CampaignsClient({ initialCampaigns, totalActive }: CampaignsClientProps) {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'kanban' | 'list' | 'calendar'>('kanban')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedClient, setSelectedClient] = useState<string>('all')
  const [selectedStage, setSelectedStage] = useState<string>('all')
  const [clients, setClients] = useState<ClientOption[]>([])
  const [filteredCampaigns, setFilteredCampaigns] = useState<CampaignCardData[]>(initialCampaigns)

  // 동적 광고주 목록 로드
  useEffect(() => {
    async function fetchClients() {
      try {
        const res = await fetch('/api/clients')
        if (res.ok) {
          const json = await res.json()
          const list = Array.isArray(json) ? json : json.data || []
          setClients(list.map((c: any) => ({ id: c.id, name: c.name })))
        }
      } catch (err) {
        console.error('Failed to load clients:', err)
      }
    }
    fetchClients()
  }, [])

  // 클라이언트 사이드 필터링 (검색어, 광고주, 스테이지)
  useEffect(() => {
    let result = initialCampaigns || []

    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase()
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          (c.client_name && c.client_name.toLowerCase().includes(q)) ||
          (c.product_name && c.product_name.toLowerCase().includes(q))
      )
    }

    if (selectedClient !== 'all') {
      result = result.filter(
        (c) => c.client_name === selectedClient || c.client_id === selectedClient
      )
    }

    if (selectedStage !== 'all') {
      result = result.filter((c) => c.stage === selectedStage)
    }

    setFilteredCampaigns(result)
  }, [initialCampaigns, searchTerm, selectedClient, selectedStage])

  const activeCount = totalActive ?? (initialCampaigns || []).filter((c) => c.stage !== 'done').length

  const filterSelectStyle = (isActive: boolean): React.CSSProperties => ({
    border: '1px solid var(--dark)',
    borderRadius: '30px',
    padding: '8px 14px',
    background: isActive ? 'var(--dark)' : 'var(--white)',
    color: isActive ? 'var(--white)' : 'var(--dark)',
    fontSize: '14px',
    fontWeight: 500,
    outline: 'none',
    cursor: 'pointer',
  })

  return (
    <>
      <Header
        title="캠페인"
        subTitle={`9단계 파이프라인 · 진행 중 ${activeCount}건`}
        searchPlaceholder="캠페인 검색"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        actionButton={
          <Link href="/campaigns/new" className="btn font-sans">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            새 캠페인
          </Link>
        }
      />

      <div className="content">
        {/* Filter Section */}
        <div className="filt flex items-center gap-3 mb-6">
          {/* Segmented view switcher */}
          <div className="seg">
            <button
              type="button"
              className={viewMode === 'kanban' ? 'on' : ''}
              onClick={() => setViewMode('kanban')}
            >
              칸반
            </button>
            <button
              type="button"
              className={viewMode === 'list' ? 'on' : ''}
              onClick={() => setViewMode('list')}
            >
              리스트
            </button>
            <button
              type="button"
              className={viewMode === 'calendar' ? 'on' : ''}
              onClick={() => setViewMode('calendar')}
            >
              캘린더
            </button>
          </div>

          <span style={{ width: 1, height: 24, background: 'var(--line-soft)' }} />

          {/* 광고주 선택 드롭다운 */}
          <select
            style={filterSelectStyle(selectedClient !== 'all')}
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
          >
            <option value="all">전체 광고주</option>
            {clients.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          {/* 스테이지 선택 드롭다운 */}
          <select
            style={filterSelectStyle(selectedStage !== 'all')}
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
          >
            {STAGE_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* View mode contents */}
        {viewMode === 'kanban' && <CampaignKanban campaigns={filteredCampaigns} />}

        {viewMode === 'list' && (
          <div
            className="card card-pad"
            style={{
              background: 'var(--white)',
              border: '1px solid var(--dark)',
              borderRadius: 'var(--r-lg)',
              boxShadow: 'var(--shadow)',
              padding: '0',
              overflow: 'hidden',
            }}
          >
            <table className="tbl font-sans">
              <thead>
                <tr>
                  <th>캠페인명</th>
                  <th>광고주</th>
                  <th>스테이지</th>
                  <th>담당자</th>
                  <th className="right">인플루언서 수</th>
                  <th>마감일</th>
                  <th className="right">D-day</th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>
                      검색 조건에 해당하는 캠페인이 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredCampaigns.map((camp) => {
                    const stageLabel = STAGE_LABELS[camp.stage as CampaignStage] || camp.stage
                    const ddayClass =
                      camp.dday_variant === 'hot'
                        ? 'dday hot'
                        : camp.dday_variant === 'warm'
                        ? 'dday warm'
                        : 'dday'
                    const infCount = camp.target_influencers_count || 5
                    const assignee = camp.assignees?.[0] || {
                      name: '현우',
                      avatar: '현',
                      color: 'c1',
                    }

                    return (
                      <tr
                        key={camp.id}
                        className="cursor-pointer hover:bg-[var(--gray)] transition-colors"
                        onClick={() => router.push(`/campaigns/${camp.id}`)}
                      >
                        <td className="font-bold text-[var(--dark)]">{camp.title}</td>
                        <td className="font-medium text-[var(--dark)]">{camp.client_name}</td>
                        <td>
                          <span className="badge soft">{stageLabel}</span>
                        </td>
                        <td>
                          <div className="who">
                            <span className={`av sm ${assignee.color || 'c1'}`}>
                              {assignee.avatar}
                            </span>
                            <span className="nm">{assignee.name}</span>
                          </div>
                        </td>
                        <td className="right font-semibold">{infCount}명</td>
                        <td className="text-sm text-[var(--muted)]">{camp.content_deadline || '-'}</td>
                        <td className="right">
                          <span className={ddayClass}>{camp.dday || 'D-7'}</span>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {viewMode === 'calendar' && (
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
              icon="📅"
              title="캘린더 뷰 준비 중입니다"
              description="캠페인 타임라인 및 마감일을 캘린더 형태로 확인하는 기능은 준비 중입니다."
            />
          </div>
        )}
      </div>
    </>
  )
}
