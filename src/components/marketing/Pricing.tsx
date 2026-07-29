'use client'

import { useState } from 'react'
import Link from 'next/link'

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true)

  const plans = [
    {
      name: 'Starter',
      desc: '소형 대행사를 위한 기초 플랜',
      priceMonthly: '29만원',
      priceAnnual: '23만원',
      features: [
        '동시 실행 캠페인 3개',
        '인플루언서 DB 500명',
        '광고주 공유 포털',
        '기본 이메일 자동화',
      ],
      isPopular: false,
    },
    {
      name: 'Growth',
      desc: '중형 대행사를 위한 베스트 플랜',
      priceMonthly: '79만원',
      priceAnnual: '63만원',
      features: [
        '동시 실행 캠페인 15개',
        '무제한 인플루언서 DB',
        '광고주 공유 포털 + 브랜드 커스텀',
        '원고 검수 & 버전 히스토리',
        '배송지 엑셀 다운로드',
        '전담 매니저 기술 지원',
      ],
      isPopular: true,
    },
    {
      name: 'Scale',
      desc: '대형 대행사 & 에이전시 전용',
      priceMonthly: '199만원',
      priceAnnual: '159만원',
      features: [
        '무제한 캠페인',
        '팀 계정 무제한 생성',
        'Resend 이메일 연동',
        '고급 청구서 생성 & PDF 발송',
        '우선순위 기술 지원',
      ],
      isPopular: false,
    },
    {
      name: 'Enterprise',
      desc: '엔터프라이즈 맞춤 구축',
      priceMonthly: '문의',
      priceAnnual: '문의',
      features: [
        '온프레미스 / 독립 데이터베이스',
        '커스텀 도메인 & SSO 로그인',
        '내부 ERP/CRM 커스텀 API 연동',
        '24/7 전담 SLA 엔지니어',
      ],
      isPopular: false,
    },
  ]

  return (
    <section id="pricing" className="section select-none" style={{ padding: '80px 0', backgroundColor: 'var(--gray)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="tag mb-3">Pricing Plans</span>
          <h2 style={{ fontSize: '38px', fontWeight: 700, letterSpacing: '-1px' }}>
            투명하고 합리적인 요금제
          </h2>
          <p className="muted" style={{ fontSize: '18px', marginTop: '8px' }}>
            대행사 규모와 진행 캠페인 수에 맞게 자유롭게 선택하세요.
          </p>

          {/* Billing Toggle */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              marginTop: '28px',
              backgroundColor: 'var(--white)',
              padding: '6px 12px',
              borderRadius: '999px',
              border: '1px solid var(--dark)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <span
              onClick={() => setIsAnnual(false)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: !isAnnual ? 'var(--dark)' : 'transparent',
                color: !isAnnual ? 'var(--white)' : 'var(--dark)',
                transition: 'all 0.15s',
              }}
            >
              월간 결제
            </span>
            <span
              onClick={() => setIsAnnual(true)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: isAnnual ? 'var(--dark)' : 'transparent',
                color: isAnnual ? 'var(--white)' : 'var(--dark)',
                transition: 'all 0.15s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              연간 결제 <span style={{ backgroundColor: 'var(--green)', color: 'var(--dark)', padding: '2px 6px', borderRadius: '6px', fontSize: '11px' }}>20% 할인</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards 4-Column Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
          {plans.map((p, idx) => {
            const isDark = p.isPopular
            const price = isAnnual ? p.priceAnnual : p.priceMonthly

            return (
              <div
                key={idx}
                style={{
                  backgroundColor: isDark ? 'var(--dark)' : 'var(--white)',
                  color: isDark ? 'var(--white)' : 'var(--dark)',
                  border: '1px solid var(--dark)',
                  borderRadius: '28px',
                  boxShadow: 'var(--shadow)',
                  padding: '32px 26px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',

                  position: 'relative',
                }}
              >
                {isDark && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-14px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: 'var(--green)',
                      color: 'var(--dark)',
                      fontSize: '12px',
                      fontWeight: 700,
                      padding: '4px 14px',
                      borderRadius: '12px',
                      border: '1px solid var(--dark)',
                    }}
                  >
                    대행사 가장 많은 추천 👍
                  </div>
                )}

                <div>
                  <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '6px' }}>{p.name}</h3>
                  <p style={{ fontSize: '13px', opacity: 0.8, marginBottom: '20px' }}>{p.desc}</p>

                  <div style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-1px', marginBottom: '24px' }}>
                    {price}
                    {price !== '문의' && <span style={{ fontSize: '14px', fontWeight: 400, opacity: 0.7 }}> /월</span>}
                  </div>

                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                    {p.features.map((f, fIdx) => (
                      <li key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: 'var(--green)', fontWeight: 700 }}>✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/auth/login"
                  className={`btn ${isDark ? 'btn-green' : 'btn-dark'}`}
                  style={{
                    width: '100%',
                    padding: '14px',
                    fontSize: '15px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    textAlign: 'center',
                    marginTop: '32px',
                    display: 'block',
                  }}
                >
                  시작하기
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
