'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import type { QueueDraftItem } from '@/app/api/drafts/route'

interface AllDraftsClientProps {
  initialItems: QueueDraftItem[]
  counts: {
    total: number
    agency_reviewing: number
    revision_requested: number
    client_reviewing: number
  }
}

type FilterType = 'all' | 'agency_reviewing' | 'revision_requested' | 'client_reviewing'

export function AllDraftsClient({ initialItems, counts }: AllDraftsClientProps) {
  const [filter, setFilter] = useState<FilterType>('all')

  const filteredItems = initialItems.filter((item) => {
    if (filter === 'all') return true
    return item.status === filter
  })

  return (
    <div className="main select-none">
      <Header
        title="원고 검수"
        subTitle="agency_reviewing 또는 submitted 상태 원고 전체 Queue"
      />

      <div className="content">
        {/* Top Stat Cards (3 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <div
            className="card card-pad"
            style={{
              background: '#FFF9E6',
              border: '1px solid var(--dark)',
              borderRadius: '24px',
              boxShadow: 'var(--shadow)',
              padding: '22px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '14px', color: 'var(--dark)', fontWeight: 500 }}>
                검수 대기
              </div>
              <div style={{ fontSize: '32px', fontWeight: 700, marginTop: '4px', color: '#D48806' }}>
                {counts.agency_reviewing}건
              </div>
            </div>
            <span className="badge warn" style={{ fontSize: '13px', padding: '6px 12px' }}>
              에이전시 1차
            </span>
          </div>

          <div
            className="card card-pad"
            style={{
              background: '#FFF2F0',
              border: '1px solid var(--dark)',
              borderRadius: '24px',
              boxShadow: 'var(--shadow)',
              padding: '22px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '14px', color: 'var(--dark)', fontWeight: 500 }}>
                수정 요청
              </div>
              <div style={{ fontSize: '32px', fontWeight: 700, marginTop: '4px', color: '#CF1322' }}>
                {counts.revision_requested}건
              </div>
            </div>
            <span className="badge danger" style={{ fontSize: '13px', padding: '6px 12px' }}>
              재제출 대기
            </span>
          </div>

          <div
            className="card card-pad"
            style={{
              background: 'var(--green-soft)',
              border: '1px solid var(--dark)',
              borderRadius: '24px',
              boxShadow: 'var(--shadow)',
              padding: '22px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '14px', color: 'var(--dark)', fontWeight: 500 }}>
                광고주 컨펌 대기
              </div>
              <div style={{ fontSize: '32px', fontWeight: 700, marginTop: '4px', color: 'var(--dark)' }}>
                {counts.client_reviewing}건
              </div>
            </div>
            <span className="badge soft" style={{ fontSize: '13px', padding: '6px 12px' }}>
              포털 보고됨
            </span>
          </div>
        </div>

        {/* Filter Chips Toolbar */}
        <div className="filt" style={{ marginBottom: '20px' }}>
          <button
            type="button"
            className={`chip ${filter === 'all' ? 'on' : ''}`}
            onClick={() => setFilter('all')}
          >
            전체 <span style={{ fontSize: '12px', opacity: 0.8 }}>({counts.total})</span>
          </button>
          <button
            type="button"
            className={`chip ${filter === 'agency_reviewing' ? 'on' : ''}`}
            onClick={() => setFilter('agency_reviewing')}
          >
            검수 대기 <span style={{ fontSize: '12px', opacity: 0.8 }}>({counts.agency_reviewing})</span>
          </button>
          <button
            type="button"
            className={`chip ${filter === 'revision_requested' ? 'on' : ''}`}
            onClick={() => setFilter('revision_requested')}
          >
            수정 요청 <span style={{ fontSize: '12px', opacity: 0.8 }}>({counts.revision_requested})</span>
          </button>
          <button
            type="button"
            className={`chip ${filter === 'client_reviewing' ? 'on' : ''}`}
            onClick={() => setFilter('client_reviewing')}
          >
            광고주 컨펌 대기 <span style={{ fontSize: '12px', opacity: 0.8 }}>({counts.client_reviewing})</span>
          </button>
        </div>

        {/* Drafts Table Card (.card.flat) */}
        <div
          className="card flat"
          style={{
            background: 'var(--white)',
            border: '1px solid var(--dark)',
            borderRadius: '24px',
            boxShadow: 'var(--shadow)',
            padding: '24px',
          }}
        >
          <table className="tbl" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>인플루언서</th>
                <th>캠페인</th>
                <th>광고주</th>
                <th>버전</th>
                <th>제출일</th>
                <th>상태</th>
                <th>액션</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
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
                  <td style={{ fontWeight: 500, fontSize: '15px' }}>{item.campaign_name}</td>
                  <td>
                    <span className="badge dark">{item.client_name}</span>
                  </td>
                  <td style={{ fontWeight: 600, fontSize: '14px' }}>{item.version}</td>
                  <td style={{ fontSize: '13.5px', color: 'var(--muted)' }}>{item.submitted_at}</td>
                  <td>
                    <span className={`badge ${item.status_variant}`}>{item.status_label}</span>
                  </td>
                  <td>
                    <Link
                      href={`/campaigns/${item.campaign_id}/drafts?inf=${item.influencer_id}`}
                      className="btn btn-ghost"
                      style={{
                        fontSize: '13px',
                        padding: '7px 13px',
                        border: '1px solid var(--dark)',
                        borderRadius: '9px',
                        textDecoration: 'none',
                        display: 'inline-block',
                      }}
                    >
                      검수하기
                    </Link>
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
