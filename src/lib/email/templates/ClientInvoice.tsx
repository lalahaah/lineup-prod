import React from 'react'

export interface ClientInvoiceProps {
  clientName: string
  campaignName: string
  total: string
  dueDate: string
  invoiceLink: string
}

export function ClientInvoice({
  clientName = 'CUCKOO',
  campaignName = '쿠쿠 트윈프레셔 신제품 런칭',
  total = '₩9,487,500',
  dueDate = '2026-06-22',
  invoiceLink = 'https://lineup.kr/portal/mock-portal-token-001/invoice',
}: ClientInvoiceProps) {
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
          Lineup <span style={{ color: '#B9FF66', fontSize: '14px' }}>· 청구서 발송</span>
        </div>

        <div style={{ padding: '24px 28px', color: '#191A23' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600, marginTop: 0 }}>
            안녕하세요, {clientName} 담당자님
          </h2>
          <p style={{ fontSize: '15px', color: '#4A4A52' }}>
            <b>{campaignName}</b> 캠페인 관련 정산 청구서가 발행되었습니다.
          </p>

          <div
            style={{
              backgroundColor: '#F8F9FA',
              border: '1px solid #191A23',
              borderRadius: '12px',
              padding: '20px',
              margin: '20px 0',
            }}
          >
            <div style={{ fontSize: '13px', color: '#6A6A72' }}>총 청구 금액</div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: '#191A23', margin: '4px 0 12px' }}>
              {total}
            </div>
            <div style={{ fontSize: '13px', color: '#6A6A72' }}>
              납기일자: <b>{dueDate}</b>
            </div>
          </div>

          <div style={{ textAlign: 'center', margin: '28px 0' }}>
            <a
              href={invoiceLink}
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
              청구서 확인 및 다운로드 →
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
          (주)라운드미디어 · 회계팀
        </div>
      </div>
    </div>
  )
}
