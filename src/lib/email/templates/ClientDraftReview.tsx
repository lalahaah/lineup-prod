import React from 'react'

export interface ClientDraftReviewProps {
  clientName: string
  campaignName: string
  draftCount: number
  portalLink: string
}

export function ClientDraftReview({
  clientName = 'CUCKOO',
  campaignName = '쿠쿠 트윈프레셔 신제품 런칭',
  draftCount = 3,
  portalLink = 'https://lineup.kr/portal/mock-portal-token-001/drafts',
}: ClientDraftReviewProps) {
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
          Lineup <span style={{ color: '#B9FF66', fontSize: '14px' }}>· 원고 컨펌 요청</span>
        </div>

        <div style={{ padding: '24px 28px', color: '#191A23' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600, marginTop: 0 }}>
            안녕하세요, {clientName} 담당자님
          </h2>
          <p style={{ fontSize: '15px', color: '#4A4A52' }}>
            <b>{campaignName}</b> 캠페인에 대해 에이전시 1차 검수가 완료된 원고 <b>{draftCount}건</b>이 준비되었습니다.
          </p>

          <p style={{ fontSize: '14px', color: '#4A4A52' }}>
            포털에서 원고 영상/이미지 및 캡션 내용을 확인 후 컨펌해주시면 업로드가 진행됩니다.
          </p>

          <div style={{ textAlign: 'center', margin: '28px 0' }}>
            <a
              href={portalLink}
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
              원고 확인 및 컨펌하기 →
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
          (주)라운드미디어 · Client Portal
        </div>
      </div>
    </div>
  )
}
