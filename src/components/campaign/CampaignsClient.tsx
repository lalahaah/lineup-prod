'use client'

import { useState } from 'react'
import type { CampaignCardData } from '@/app/api/campaigns/route'
import { CampaignKanban } from '@/components/campaign/CampaignKanban'

interface CampaignsClientProps {
  initialCampaigns: CampaignCardData[]
}

export function CampaignsClient({ initialCampaigns }: CampaignsClientProps) {
  const [viewMode, setViewMode] = useState<'kanban' | 'list' | 'calendar'>('kanban')
  const [clientFilter, setClientFilter] = useState<string>('all') // 'all', 'CUCKOO', 'me'

  const filteredCampaigns = initialCampaigns.filter((camp) => {
    if (clientFilter === 'CUCKOO') {
      return camp.client_name === 'CUCKOO'
    }
    if (clientFilter === 'me') {
      return camp.assignees.some((a) => a.name === '현우' || a.name === '나')
    }
    return true
  })

  return (
    <div className="content">
      {/* Filter Section */}
      <div className="filt">
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

        {/* Client filter chips */}
        <button
          type="button"
          className={`chip ${clientFilter === 'all' ? 'on' : ''}`}
          onClick={() => setClientFilter('all')}
        >
          전체 광고주
        </button>
        <button
          type="button"
          className={`chip ${clientFilter === 'CUCKOO' ? 'on' : ''}`}
          onClick={() => setClientFilter('CUCKOO')}
        >
          CUCKOO
        </button>
        <button
          type="button"
          className={`chip ${clientFilter === 'me' ? 'on' : ''}`}
          onClick={() => setClientFilter('me')}
        >
          담당: 나
        </button>
        <button type="button" className="chip">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M4 6h16M7 12h10M10 18h4"
              stroke="var(--dark)"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          필터
        </button>
      </div>

      {/* Main Board */}
      {viewMode === 'kanban' ? (
        <CampaignKanban campaigns={filteredCampaigns} />
      ) : (
        <div
          className="card card-pad"
          style={{
            background: 'var(--white)',
            border: '1px solid var(--dark)',
            borderRadius: 'var(--r-lg)',
            padding: '40px',
            textAlign: 'center',
            color: 'var(--muted)',
          }}
        >
          {viewMode === 'list' ? '리스트 뷰 준비 중입니다' : '캘린더 뷰 준비 중입니다'}
        </div>
      )}
    </div>
  )
}
