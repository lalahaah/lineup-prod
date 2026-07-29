import React from 'react'

export interface InfluencerRevisionProps {
  influencerName: string
  campaignName: string
  feedback: string
  resubmitLink: string
}

export function InfluencerRevision({
  influencerName = '먹방준',
  campaignName = '쿠쿠 트윈프레셔 신제품 런칭',
  feedback = 'v1 영상에서 제품 모델명이 화면에 노출되지 않았어요. 클로즈업 컷 한 번만 추가 부탁드립니다.',
  resubmitLink = 'https://lineup.kr/inf/mock-inf-token-001',
}: InfluencerRevisionProps) {
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
          Lineup <span style={{ color: '#B9FF66', fontSize: '14px' }}>· 원고 수정 요청</span>
        </div>

        <div style={{ padding: '24px 28px', color: '#191A23' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600, marginTop: 0 }}>
            안녕하세요, {influencerName} 님
          </h2>
          <p style={{ fontSize: '15px', color: '#4A4A52' }}>
            <b>{campaignName}</b> 캠페인에 제출해주신 원고에 대한 검수 피드백이 도착했습니다.
          </p>

          <div
            style={{
              backgroundColor: '#FFFBE6',
              border: '1px solid #FFE58F',
              borderRadius: '12px',
              padding: '18px',
              margin: '20px 0',
            }}
          >
            <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '8px', color: '#D48806' }}>
              📝 운영팀 피드백 내용
            </div>
            <div style={{ fontSize: '14px', lineHeight: 1.6, color: '#191A23' }}>
              {feedback}
            </div>
          </div>

          <p style={{ fontSize: '14px', color: '#4A4A52' }}>
            수정 완료 후 아래 링크를 통해 원고를 재제출해주시기 바랍니다.
          </p>

          <div style={{ textAlign: 'center', margin: '28px 0' }}>
            <a
              href={resubmitLink}
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
              원고 재제출하기 →
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
