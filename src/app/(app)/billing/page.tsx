import Link from 'next/link'
import { Header } from '@/components/layout/Header'


export const metadata = {
  title: 'Lineup — 정산 관리',
  description: '전체 캠페인 청구 및 인플루언서 지급 현황',
}

const INVOICE_LIST = [
  {
    id: 'inv-1',
    campaign_id: 'camp-8',
    campaign_name: '쿠쿠 트윈프레셔 신제품 런칭',
    client_name: 'CUCKOO',
    total_amount: '₩9,487,500',
    total_amount_short: '₩9.4M',
    status: '발송완료',
    status_variant: 'soft',
    issue_date: '2026-06-08',
  },
  {
    id: 'inv-2',
    campaign_id: 'camp-2',
    campaign_name: '올리브영 뷰티 페스타',
    client_name: 'CJ올리브영',
    total_amount: '₩8,400,000',
    total_amount_short: '₩8.4M',
    status: '입금완료',
    status_variant: 'green',
    issue_date: '2026-05-20',
  },
  {
    id: 'inv-3',
    campaign_id: 'camp-3',
    campaign_name: '하기스 위생 신제품',
    client_name: '유한킴벌리',
    total_amount: '₩6,200,000',
    total_amount_short: '₩6.2M',
    status: '초안',
    status_variant: 'gray',
    issue_date: '2026-06-01',
  },
]

const PAYMENT_LIST = [
  {
    id: 'pay-1',
    influencer_name: '먹방준',
    handle: '@mukbang_jun',
    avatar_initial: '준',
    avatar_color_class: 'c3',
    campaign_name: '쿠쿠 트윈프레셔 신제품 런칭',
    amount: '₩4,000,000',
    amount_short: '₩4.0M',
    tax_invoice: '미수취',
    status: '대기',
    status_variant: 'warn',
    payment_date: '2026-06-25',
  },
  {
    id: 'pay-2',
    influencer_name: '유리쿡',
    handle: '@yuri_cooks',
    avatar_initial: '유',
    avatar_color_class: 'c1',
    campaign_name: '쿠쿠 트윈프레셔 신제품 런칭',
    amount: '₩800,000',
    amount_short: '₩0.8M',
    tax_invoice: '수취',
    status: '지급완료',
    status_variant: 'green',
    payment_date: '2026-06-05',
  },
  {
    id: 'pay-3',
    influencer_name: '집밥현이',
    handle: '@hyuni.eats',
    avatar_initial: '현',
    avatar_color_class: 'c6',
    campaign_name: '쿠쿠 트윈프레셔 신제품 런칭',
    amount: '₩1,500,000',
    amount_short: '₩1.5M',
    tax_invoice: '수취',
    status: '대기',
    status_variant: 'warn',
    payment_date: '2026-06-25',
  },
  {
    id: 'pay-4',
    influencer_name: '하나테이블',
    handle: '@hana_table',
    avatar_initial: '하',
    avatar_color_class: 'c4',
    campaign_name: '쿠쿠 트윈프레셔 신제품 런칭',
    amount: '₩1,200,000',
    amount_short: '₩1.2M',
    tax_invoice: '미수취',
    status: '대기',
    status_variant: 'warn',
    payment_date: '2026-06-25',
  },
]

export default function BillingOverviewPage() {
  return (
    <div className="main select-none">
      <Header title="정산 관리" subTitle="전체 캠페인 청구 및 인플루언서 지급 통합 현황" />

      <div className="content">
        {/* Top Stat Row (2 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <div
            className="card card-pad"
            style={{
              background: 'var(--green)',
              border: '1px solid var(--dark)',
              borderRadius: '24px',
              boxShadow: 'var(--shadow)',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '14px', color: 'var(--dark)', fontWeight: 500 }}>
                이번달 청구 완료
              </div>
              <div style={{ fontSize: '32px', fontWeight: 700, marginTop: '4px' }}>
                ₩42.8M
              </div>
            </div>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'var(--dark)',
                display: 'grid',
                placeItems: 'center',
                color: '#fff',
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" style={{ width: 24, height: 24 }}>
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <div
            className="card card-pad"
            style={{
              background: 'var(--white)',
              border: '1px solid var(--dark)',
              borderRadius: '24px',
              boxShadow: 'var(--shadow)',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '14px', color: 'var(--muted)', fontWeight: 500 }}>
                인플루언서 지급 대기
              </div>
              <div style={{ fontSize: '32px', fontWeight: 700, marginTop: '4px' }}>
                ₩7.5M
              </div>
            </div>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'var(--gray)',
                border: '1px solid var(--line-soft)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" style={{ width: 24, height: 24 }}>
                <circle cx="12" cy="12" r="10" stroke="var(--dark)" strokeWidth="1.8" />
                <path d="M12 6v6l4 2" stroke="var(--dark)" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Invoice List Card */}
        <div
          className="card card-pad mb-6"
          style={{
            background: 'var(--white)',
            border: '1px solid var(--dark)',
            borderRadius: '24px',
            boxShadow: 'var(--shadow)',
            padding: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '18px',
            }}
          >
            <h2 style={{ fontSize: '18px', fontWeight: 700 }}>광고주 청구서 목록</h2>
          </div>

          <table className="tbl" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>캠페인</th>
                <th>광고주</th>
                <th>총액</th>
                <th>상태</th>
                <th>발행일</th>
                <th>액션</th>
              </tr>
            </thead>
            <tbody>
              {INVOICE_LIST.map((inv) => (
                <tr key={inv.id}>
                  <td>
                    <Link
                      href={`/campaigns/${inv.campaign_id}/billing`}
                      style={{ fontWeight: 500, textDecoration: 'none', color: 'var(--dark)' }}
                    >
                      {inv.campaign_name}
                    </Link>
                  </td>
                  <td>
                    <span className="badge dark">{inv.client_name}</span>
                  </td>
                  <td style={{ fontWeight: 600, fontSize: '15px' }}>{inv.total_amount}</td>
                  <td>
                    <span className={`badge ${inv.status_variant}`}>{inv.status}</span>
                  </td>
                  <td style={{ fontSize: '14px', color: 'var(--muted)' }}>{inv.issue_date}</td>
                  <td>
                    <Link
                      href={`/campaigns/${inv.campaign_id}/billing`}
                      className="btn btn-ghost"
                      style={{ fontSize: '13px', padding: '6px 12px', textDecoration: 'none' }}
                    >
                      상세 보기
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Payment List Card */}
        <div
          className="card card-pad"
          style={{
            background: 'var(--white)',
            border: '1px solid var(--dark)',
            borderRadius: '24px',
            boxShadow: 'var(--shadow)',
            padding: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '18px',
            }}
          >
            <h2 style={{ fontSize: '18px', fontWeight: 700 }}>인플루언서 지급 목록</h2>
          </div>

          <table className="tbl" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>인플루언서</th>
                <th>캠페인</th>
                <th>지급액</th>
                <th>세금계산서</th>
                <th>상태</th>
                <th>지급예정일</th>
              </tr>
            </thead>
            <tbody>
              {PAYMENT_LIST.map((pay) => (
                <tr key={pay.id}>
                  <td>
                    <div className="who">
                      <span className={`av ${pay.avatar_color_class || 'c1'}`}>
                        {pay.avatar_initial}
                      </span>
                      <div>
                        <div className="nm">{pay.influencer_name}</div>
                        <div className="hd">{pay.handle}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: '14px' }}>{pay.campaign_name}</td>
                  <td style={{ fontWeight: 600, fontSize: '15px' }}>{pay.amount}</td>
                  <td>
                    <span className={`badge ${pay.tax_invoice === '수취' ? 'soft' : 'gray'}`}>
                      {pay.tax_invoice}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${pay.status_variant}`}>{pay.status}</span>
                  </td>
                  <td style={{ fontSize: '14px', color: 'var(--muted)' }}>{pay.payment_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
