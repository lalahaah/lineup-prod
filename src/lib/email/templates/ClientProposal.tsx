import React from 'react'

export interface ClientProposalProps {
  clientName: string
  campaignName: string
  candidateCount: number
  portalLink: string
  deadline: string
}

export function ClientProposal({
  clientName = 'CUCKOO',
  campaignName = '쿠쿠 에어프라이어 봄 캠페인',
  candidateCount = 8,
  portalLink = 'https://lineup.kr/portal/mock-portal-token-001',
  deadline = '06.09 (D-3)',
}: ClientProposalProps) {
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
          Lineup <span style={{ color: '#B9FF66', fontSize: '14px' }}>· 광고주 제안</span>
        </div>

        <div style={{ padding: '24px 28px', color: '#191A23' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600, marginTop: 0 }}>
            안녕하세요, {clientName} 담당자님
          </h2>
          <p style={{ fontSize: '15px', color: '#4A4A52' }}>
            라운드미디어입니다. 진행 중인 <b>{campaignName}</b>에 적합한 인플루언서 후보 <b>{candidateCount}명</b>의 제안서 작성이 완료되었습니다.
          </p>

          <div
            style={{
              backgroundColor: '#EAFDD2',
              border: '1px solid #191A23',
              borderRadius: '12px',
              padding: '18px',
              margin: '20px 0',
            }}
          >
            <div style={{ fontWeight: 600, fontSize: '14px' }}>📋 광고주 전용 포털 세부 사항</div>
            <div style={{ fontSize: '14px', marginTop: '6px' }}>
              • 제안 후보 수: {candidateCount}명<br />
              • 검토 회신 기한: {deadline}
            </div>
          </div>

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
              광고주 포털에서 후보 검토하기 →
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
