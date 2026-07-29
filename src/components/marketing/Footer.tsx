import Link from 'next/link'

export function Footer() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--dark)',
        color: 'var(--white)',
        padding: '60px 24px 40px',
        borderTop: '1px solid #3A3B47',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '40px',
            paddingBottom: '48px',
            borderBottom: '1px solid #3A3B47',
          }}
        >
          {/* Left Logo & Info */}
          <div style={{ gridColumn: 'span 2' }}>
            <Link
              href="/"
              className="brand select-none"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '24px',
                fontWeight: 700,
                color: 'var(--white)',
                textDecoration: 'none',
                marginBottom: '16px',
              }}
            >
              <svg className="mark" viewBox="0 0 34 34" fill="none" style={{ width: 28, height: 28 }}>
                <circle cx="17" cy="17" r="16" fill="#B9FF66" />
                <path d="M17 6a11 11 0 1 0 0 22" stroke="#191A23" strokeWidth="3.4" fill="none" />
                <circle cx="17" cy="17" r="4" fill="#191A23" />
              </svg>
              Lineup
            </Link>
            <p style={{ fontSize: '14px', color: '#9A9BA5', lineHeight: 1.6, maxWidth: '360px' }}>
              인플루언서 마케팅 대행사를 위한 9단계 캠페인 파이프라인 운영 OS. 섭외부터 원고 검수, 정산까지 한 곳에서 관리하세요.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <span style={{ fontSize: '13px', color: 'var(--green)', fontWeight: 600 }}>
                (주)라운드미디어
              </span>
              <span style={{ fontSize: '13px', color: '#9A9BA5' }}>|</span>
              <span style={{ fontSize: '13px', color: '#9A9BA5' }}>contact@roundmedia.co.kr</span>
            </div>
          </div>

          {/* Column 1: Product */}
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--green)', marginBottom: '16px' }}>
              제품 기능
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: '#9A9BA5' }}>
              <li>
                <a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>인플루언서 DB</a>
              </li>
              <li>
                <a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>광고주 포털</a>
              </li>
              <li>
                <a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>원고 검수 플로우</a>
              </li>
              <li>
                <a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>배송지 관리</a>
              </li>
              <li>
                <a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>정산 &amp; 청구서</a>
              </li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--green)', marginBottom: '16px' }}>
              고객 지원
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: '#9A9BA5' }}>
              <li>
                <a href="#pricing" style={{ color: 'inherit', textDecoration: 'none' }}>요금제 안내</a>
              </li>
              <li>
                <a href="/portal/mock-portal-token-001" style={{ color: 'inherit', textDecoration: 'none' }}>광고주 포털 데모</a>
              </li>
              <li>
                <a href="/inf/mock-inf-token-001" style={{ color: 'inherit', textDecoration: 'none' }}>인플루언서 링크 데모</a>
              </li>
              <li>
                <a href="#problem" style={{ color: 'inherit', textDecoration: 'none' }}>도입 사례</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div
          style={{
            paddingTop: '28px',
            display: 'flex',
            justifyContent: 'space-between',

            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '13px',
            color: '#9A9BA5',
          }}
        >
          <div>© 2026 Lineup by RoundMedia. All Rights Reserved.</div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="#" style={{ color: 'inherit', textDecoration: 'underline' }}>이용약관</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'underline' }}>개인정보처리방침</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
