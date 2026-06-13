'use client'

import * as React from 'react'

export interface Activity {
  icon: 'check' | 'doc' | 'info' | 'mail'
  text: string
  sub: string
  color: string
}

export function ActivityFeed() {
  // TODO: 실시간 DB 연동 필요. 현재는 Dashboard.html 목업과 동일하게 5개 데이터 하드코딩.
  const mockActivities: Activity[] = [
    { icon: 'check', text: '<b>유리쿡</b> 님이 섭외를 <b>수락</b>했어요', sub: '쿠쿠 정수기 · 3분 전', color: '#1f8a3b' },
    { icon: 'doc', text: '<b>먹방준</b> 님이 원고 <b>v2</b>를 제출했어요', sub: '쿠쿠 트윈프레셔 · 21분 전', color: 'var(--dark)' },
    { icon: 'info', text: '광고주가 후보 <b>5명을 선택</b>했어요', sub: 'CUCKOO · 에어프라이어 · 1시간 전', color: 'var(--dark)' },
    { icon: 'mail', text: '섭외 이메일 <b>4건 발송</b> 완료', sub: '쿠쿠 정수기 · 2시간 전', color: 'var(--dark)' },
    { icon: 'check', text: '<b>소연홈</b> 님이 배송지를 <b>입력</b>했어요', sub: '하기스 위생 · 3시간 전', color: '#1f8a3b' },
  ]

  const getIconSvg = (icon: string, color: string) => {
    const style = { width: 16, height: 16 }
    switch (icon) {
      case 'check':
        return (
          <svg viewBox="0 0 24 24" fill="none" style={style}>
            <path d="M5 12l5 5L20 7" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
      case 'doc':
        return (
          <svg viewBox="0 0 24 24" fill="none" style={style}>
            <path d="M6 3h9l4 4v14H6z" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
        )
      case 'mail':
        return (
          <svg viewBox="0 0 24 24" fill="none" style={style}>
            <path d="M4 6l8 6 8-6" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
            <rect x="4" y="5" width="16" height="14" rx="2" stroke={color} strokeWidth="1.6" />
          </svg>
        )
      case 'info':
      default:
        return (
          <svg viewBox="0 0 24 24" fill="none" style={style}>
            <circle cx="12" cy="12" r="8" stroke={color} strokeWidth="1.6" />
            <path d="M12 8v5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        )
    }
  }

  return (
    <div className="feed" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {mockActivities.map((act, index) => {
        const isLast = index === mockActivities.length - 1
        const fiStyle: React.CSSProperties = {
          display: 'flex',
          gap: 13,
          padding: '14px 0',
          borderBottom: isLast ? 'none' : '1px dashed var(--line-soft)'
        }

        return (
          <div key={index} style={fiStyle} className="fi">
            <div 
              style={{
                width: 32,
                height: 32,
                borderRadius: 9,
                background: 'var(--gray)',
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0
              }} 
              className="fic"
            >
              {getIconSvg(act.icon, act.color)}
            </div>
            <div>
              <div 
                className="ft"
                style={{ fontSize: 14, lineHeight: 1.45 }}
                dangerouslySetInnerHTML={{ __html: act.text }}
              />
              <div className="fmeta" style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                {act.sub}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
