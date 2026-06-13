'use client'

import * as React from 'react'
import Link from 'next/link'

export interface PriorityItem {
  title: string
  sub: string
  badge: string
  badgeType: 'danger' | 'warn' | 'soft' | 'default'
  days: number
  action: string
  url?: string
}

export function PriorityQueue() {
  // TODO: 실시간 DB 연동 필요. 현재는 Dashboard.html 목업과 동일하게 5개 데이터 하드코딩.
  const mockItems: PriorityItem[] = [
    { title: '쿠쿠 트윈프레셔 신제품 런칭', sub: 'CUCKOO · 원고 검수 · 인플루언서 5명 중 3명 제출', badge: '원고 컨펌 대기', badgeType: 'danger', days: 2, action: '검수' },
    { title: '쿠쿠 에어프라이어 봄 캠페인', sub: 'CUCKOO · 제안 · 광고주 포털 후보 검토 중 (8명 제안)', badge: '광고주 선택 대기', badgeType: 'warn', days: 3, action: '포털 열기' },
    { title: '쿠쿠 정수기 인스타 협찬', sub: 'CUCKOO · 섭외 · 4명 중 2명 미응답 (D-7 리마인더 예약됨)', badge: '섭외 응답 대기', badgeType: 'warn', days: 3, action: '컨택 이력' },
    { title: '하기스 위생 캠페인', sub: '유한킴벌리 · 배송 · 운송장 미입력 2건', badge: '배송 처리', badgeType: 'soft', days: 5, action: '배송 관리' },
    { title: '올리브영 뷰티 신제품', sub: 'CJ올리브영 · 정산 · 청구서 발송 대기 ₩8.4M', badge: '청구서 발송', badgeType: 'default', days: 6, action: '정산' },
  ]

  const getTickStyle = (days: number): React.CSSProperties => {
    const base: React.CSSProperties = {
      width: 5,
      height: 46,
      borderRadius: 4,
      flexShrink: 0
    }
    if (days <= 2) {
      return { ...base, background: '#FF6B5E' }
    }
    if (days <= 7) {
      return { ...base, background: '#FFBA3A' }
    }
    return { ...base, background: 'var(--green)' }
  }

  const getDdayStyle = (days: number): React.CSSProperties => {
    const base: React.CSSProperties = {
      fontWeight: 600,
      fontSize: 13,
      padding: '3px 10px',
      borderRadius: 8,
      display: 'inline-block',
      textAlign: 'center',
      whiteSpace: 'nowrap'
    }
    if (days <= 2) {
      return { ...base, background: '#FFD5D0', border: '1px solid #E08A80', color: '#191A23' }
    }
    if (days <= 7) {
      return { ...base, background: '#FFE8B0', border: '1px solid #E0B65A', color: '#855d00' }
    }
    return { ...base, background: 'var(--gray)', border: '1px solid var(--line-soft)', color: 'var(--dark)' }
  }

  const getBadgeClass = (badgeType: string) => {
    if (badgeType === 'danger') return 'badge danger'
    if (badgeType === 'warn') return 'badge warn'
    if (badgeType === 'soft') return 'badge soft'
    return 'badge gray'
  }

  return (
    <div className="card pq">
      {mockItems.map((item, index) => {
        const isLast = index === mockItems.length - 1
        const itemStyle: React.CSSProperties = {
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          padding: '18px 24px',
          borderBottom: isLast ? 'none' : '1px solid var(--line-soft)'
        }

        return (
          <div key={index} style={itemStyle} className="pq-item">
            <div style={getTickStyle(item.days)} className={`tick ${item.days <= 2 ? 'hot' : item.days <= 7 ? 'warm' : ''}`} />
            <div className="info" style={{ flex: 1, minWidth: 0 }}>
              <div className="t" style={{ fontWeight: 500, fontSize: 16 }}>
                {item.title}
              </div>
              <div className="m" style={{ fontSize: '13.5px', color: 'var(--muted)', marginTop: 3 }}>
                {item.sub}
              </div>
            </div>
            
            <span className={getBadgeClass(item.badgeType)}>
              {item.badge}
            </span>
            
            <span style={getDdayStyle(item.days)} className={`dday ${item.days <= 2 ? 'hot' : item.days <= 7 ? 'warm' : ''}`}>
              D-{item.days}
            </span>
            
            <Link 
              href={item.url || '#'} 
              className="btn btn-sm btn-ghost cursor-pointer"
              style={{
                background: 'white',
                border: '1px solid var(--dark)',
                borderRadius: 9,
                padding: '7px 13px',
                fontSize: 13,
                color: 'var(--dark)',
                fontWeight: 500,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'none'
              }}
            >
              {item.action}
            </Link>
          </div>
        )
      })}
    </div>
  )
}
