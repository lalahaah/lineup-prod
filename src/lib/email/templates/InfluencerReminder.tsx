import React from 'react'

export interface InfluencerReminderProps {
  influencerName: string
  campaignName: string
  deadline: string
  daysLeft: string
  draftLink: string
}

export function InfluencerReminder({
  influencerName = '유리쿡',
  campaignName = '쿠쿠 트윈프레셔 신제품 런칭',
  deadline = '06.08',
  daysLeft = 'D-2',
  draftLink = 'https://lineup.kr/inf/mock-inf-token-001',
}: InfluencerReminderProps) {
  return (
    <div
      style={{
        backgroundColor: '#F3F3F3',
        padding: '30px 10px',
        fontFamily: "'Space Grotesk', -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #191A23',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            backgroundColor: '#191A23',
            padding: '20px 24px',
            color: '#FFFFFF',
            fontSize: '20px',
            fontWeight: 700,
          }}
        >
          Lineup <span style={{ color: '#FF7D7D', fontSize: '14px' }}>· 마감 리마인드 ({daysLeft})</span>
        </div>

        <div style={{ padding: '24px 28px', color: '#191A23' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600, marginTop: 0 }}>
            안녕하세요, {influencerName} 님 ⏰
          </h2>
          <p style={{ fontSize: '15px', color: '#4A4A52' }}>
            <b>{campaignName}</b> 캠페인의 원고 제출 마감일이 얼마 남지 않았습니다! ({daysLeft})
          </p>

          <div
            style={{
              backgroundColor: '#FFF2F0',
              border: '1px solid #FFCCC7',
              borderRadius: '12px',
              padding: '18px',
              margin: '20px 0',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '13px', color: '#FF4D4F', fontWeight: 600 }}>원고 마감일</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#191A23', marginTop: '4px' }}>
              {deadline} ({daysLeft})
            </div>
          </div>

          <div style={{ textAlign: 'center', margin: '28px 0' }}>
            <a
              href={draftLink}
              style={{
                display: 'inline-block',
                backgroundColor: '#191A23',
                color: '#FFFFFF',
                padding: '14px 28px',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              원고 제출하기 →
            </a>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#FAFAFA',
            borderTop: '1px solid #E5E5E5',
            padding: '16px 24px',
            fontSize: '12px',
            color: '#8A8A93',
            textAlign: 'center',
          }}
        >
          (주)라운드미디어 · Lineup 운영팀
        </div>
      </div>
    </div>
  )
}
