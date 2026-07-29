import React from 'react'
import { Nav } from '@/components/marketing/Nav'
import { Footer } from '@/components/marketing/Footer'

export const metadata = {
  title: 'Lineup — 인플루언서 캠페인 운영 OS',
  description: '섭외부터 원고 검수, 정산까지 9단계 파이프라인을 한 곳에서 관리하는 광고대행사 전용 OS',
}

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--white)',
        color: 'var(--dark)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <Nav />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
