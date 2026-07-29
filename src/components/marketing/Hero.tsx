import Link from 'next/link'

export function Hero() {
  return (
    <section className="hero section select-none" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Hero Copy */}
          <div>
            <div
              style={{
                display: 'inline-block',
                background: 'var(--green)',
                color: 'var(--dark)',
                borderRadius: '999px',
                padding: '6px 16px',
                fontSize: '14px',
                fontWeight: 600,
                marginBottom: '20px',
                border: '1px solid var(--dark)',
              }}
            >
              ⚡ 광고대행사를 위한 캠페인 운영 OS
            </div>

            <h1
              style={{
                fontSize: 'clamp(40px, 5.5vw, 72px)',
                fontWeight: 700,
                lineHeight: 1.15,
                color: 'var(--dark)',
                marginBottom: '24px',
                letterSpacing: '-1.5px',
              }}
            >
              인플루언서 캠페인,
              <br />
              한 곳에서 끝냅니다.
            </h1>

            <p
              style={{
                fontSize: '18px',
                lineHeight: 1.6,
                color: 'var(--muted)',
                marginBottom: '32px',
                maxWidth: '520px',
              }}
            >
              엑셀, 이메일, 카카오톡으로 흩어졌던 업무들...
              <br />
              <b>Lineup</b>이 섭외부터 원고 검수, 정산까지 9단계 파이프라인을 하나로 묶어 드립니다.
            </p>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '28px' }}>
              <Link
                href="/auth/login"
                className="btn btn-green cursor-pointer"
                style={{
                  padding: '16px 32px',
                  fontSize: '17px',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                무료로 시작하기 →
              </Link>
              <Link
                href="/portal/mock-portal-token-001"
                className="btn btn-ghost cursor-pointer"
                style={{
                  padding: '16px 28px',
                  fontSize: '17px',
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
              >
                광고주 포털 데모 보기
              </Link>
            </div>

            <div style={{ fontSize: '13.5px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#1F8A3B', fontWeight: 700 }}>✓</span>
              <span>지금 14개 광고대행사 사용 중 · 설치 불필요 · 5분 안에 시작</span>
            </div>
          </div>

          {/* Right Hero Preview Card */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                width: '100%',
                backgroundColor: 'var(--white)',
                border: '1px solid var(--dark)',
                borderRadius: '32px',
                boxShadow: 'var(--shadow)',
                padding: '24px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '16px',
                  marginBottom: '16px',
                  borderBottom: '1px solid var(--line-soft)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#FF5F56' }} />
                  <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#FFBD2E' }} />
                  <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#27C93F' }} />
                </div>
                <span className="text-xs text-[var(--muted)] font-mono">app.lineup.kr/campaigns</span>
              </div>

              {/* Mockup Dashboard Board Content */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700 }}>쿠쿠 트윈프레셔 신제품 런칭</h3>
                  <span className="badge green">원고 검수 중 (Review)</span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '10px',
                    margin: '10px 0',
                  }}
                >
                  <div
                    style={{
                      background: 'var(--gray)',
                      borderRadius: '12px',
                      padding: '12px',
                      border: '1px solid var(--line-soft)',
                    }}
                  >
                    <div style={{ fontSize: '11px', color: 'var(--muted)' }}>섭외 확정</div>
                    <div style={{ fontSize: '18px', fontWeight: 700 }}>5명</div>
                  </div>
                  <div
                    style={{
                      background: 'var(--gray)',
                      borderRadius: '12px',
                      padding: '12px',
                      border: '1px solid var(--line-soft)',
                    }}
                  >
                    <div style={{ fontSize: '11px', color: 'var(--muted)' }}>광고주 승인</div>
                    <div style={{ fontSize: '18px', fontWeight: 700 }}>3 / 5</div>
                  </div>
                  <div
                    style={{
                      background: 'var(--green-soft)',
                      borderRadius: '12px',
                      padding: '12px',
                      border: '1px solid #B6E88A',
                    }}
                  >
                    <div style={{ fontSize: '11px', color: 'var(--dark)' }}>마감 D-day</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--dark)' }}>D-2</div>
                  </div>
                </div>

                {/* Pipeline Steps Graphic */}
                <div
                  style={{
                    background: 'var(--dark)',
                    borderRadius: '14px',
                    padding: '14px 16px',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                  }}
                >
                  <span style={{ color: 'var(--green)', fontWeight: 600 }}>✓ 섭외 완료</span>
                  <span>→</span>
                  <span style={{ color: 'var(--green)', fontWeight: 600 }}>✓ 배송 완료</span>
                  <span>→</span>
                  <span style={{ color: '#fff', fontWeight: 700 }}>▶ 원고 검수</span>
                  <span>→</span>
                  <span style={{ color: 'var(--muted)' }}>정산</span>
                </div>
              </div>
            </div>

            {/* Floating Hero Stat Badge */}
            <div
              style={{
                position: 'absolute',
                bottom: '-20px',
                left: '-16px',
                backgroundColor: 'var(--white)',
                border: '1px solid var(--dark)',
                borderRadius: '22px',
                boxShadow: 'var(--shadow)',
                padding: '16px 24px',
              }}
            >
              <div style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-1px' }}>
                8h <span style={{ fontSize: '20px', color: 'var(--muted)' }}>→</span>{' '}
                <span
                  style={{
                    backgroundColor: 'var(--green)',
                    borderRadius: '6px',
                    padding: '0 8px',
                    color: 'var(--dark)',
                  }}
                >
                  1h
                </span>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '2px' }}>
                캠페인 1건당 행정 업무 시간 87.5% 감축
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
