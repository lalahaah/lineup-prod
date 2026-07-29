import React from 'react'

export interface InfluencerOutreachProps {
  influencerName: string
  campaignName: string
  brandName: string
  productName: string
  contentDeadline: string
  uploadDeadline: string
  fee: string
  responseLink: string
  managerName: string
}

export function InfluencerOutreach({
  influencerName = '유리쿡',
  campaignName = '쿠쿠 트윈프레셔 신제품 런칭',
  brandName = 'CUCKOO',
  productName = '쿠쿠 트윈프레셔 IH',
  contentDeadline = '06.08',
  uploadDeadline = '06.10',
  fee = '₩800,000',
  responseLink = 'https://lineup.kr/inf/mock-inf-token-001',
  managerName = '김현우',
}: InfluencerOutreachProps) {
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
        {/* Header */}
        <div
          style={{
            backgroundColor: '#191A23',
            padding: '20px 24px',
            color: '#FFFFFF',
            fontSize: '20px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>Lineup</span>
          <span style={{ color: '#B9FF66', fontSize: '14px', fontWeight: 500 }}>
            · 라운드미디어
          </span>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px 28px', color: '#191A23' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600, marginTop: 0 }}>
            안녕하세요, {influencerName} 님 👋
          </h2>
          <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#4A4A52' }}>
            라운드미디어 {managerName} 매니저입니다. <b>{brandName}</b> 브랜드의 신규 캠페인 협업을 제안드리고자 연락드렸습니다.
          </p>

          {/* Campaign Info Box */}
          <div
            style={{
              backgroundColor: '#B9FF66',
              border: '1px solid #191A23',
              borderRadius: '14px',
              padding: '20px',
              margin: '24px 0',
            }}
          >
            <div style={{ fontSize: '14px', color: '#191A23', fontWeight: 600, marginBottom: '12px' }}>
              📌 제안 상세 내용
            </div>
            <table style={{ width: '100%', fontSize: '14px', color: '#191A23', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '4px 0', fontWeight: 600, width: '100px' }}>캠페인명</td>
                  <td>{campaignName}</td>
                </tr>
                <tr>
                  <td style={{ padding: '4px 0', fontWeight: 600 }}>제품명</td>
                  <td>{productName}</td>
                </tr>
                <tr>
                  <td style={{ padding: '4px 0', fontWeight: 600 }}>제안 단가</td>
                  <td style={{ fontWeight: 700 }}>{fee}</td>
                </tr>
                <tr>
                  <td style={{ padding: '4px 0', fontWeight: 600 }}>원고 마감</td>
                  <td>{contentDeadline}</td>
                </tr>
                <tr>
                  <td style={{ padding: '4px 0', fontWeight: 600 }}>업로드 마감</td>
                  <td>{uploadDeadline}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p style={{ fontSize: '14px', lineHeight: 1.5, color: '#4A4A52', marginBottom: '24px' }}>
            아래 버튼을 눌러 모바일 전용 링크에서 상세 가이드를 확인하고 수락 여부를 답변해주세요.
          </p>

          {/* Action Button */}
          <div style={{ textAlign: 'center', margin: '30px 0' }}>
            <a
              href={responseLink}
              style={{
                display: 'inline-block',
                backgroundColor: '#191A23',
                color: '#FFFFFF',
                padding: '14px 32px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              수락하기 / 가이드 확인 →
            </a>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            backgroundColor: '#FAFAFA',
            borderTop: '1px solid #E5E5E5',
            padding: '18px 24px',
            fontSize: '12px',
            color: '#8A8A93',
            textAlign: 'center',
          }}
        >
          (주)라운드미디어 · 서울시 강남구 테헤란로 123 | 문의: contact@roundmedia.co.kr
        </div>
      </div>
    </div>
  )
}
