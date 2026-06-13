import * as React from 'react'
import Link from 'next/link'
import { Logo } from '@/components/shared/Logo'

export const metadata = {
  title: 'Lineup — 인플루언서 캠페인 운영 OS',
  description: '섭외부터 정산까지, 광고대행사를 위한 인플루언서 캠페인 운영 OS (SaaS)',
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[var(--line-2)]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/">
          <Logo size="md" color="var(--ink)" />
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[var(--ink-2)]">
          <a href="#services" className="hover:text-[var(--accent)] transition-colors">기능</a>
          <a href="#process" className="hover:text-[var(--accent)] transition-colors">파이프라인</a>
          <a href="#cases" className="hover:text-[var(--accent)] transition-colors">성과</a>
          <a href="#pricing" className="hover:text-[var(--accent)] transition-colors">요금제</a>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/auth/login"
            className="text-sm font-semibold text-[var(--ink-2)] hover:text-[var(--accent)] transition-colors"
          >
            로그인
          </Link>
          <a
            href="#contact"
            className="inline-flex items-center justify-center bg-[var(--ink)] hover:bg-[var(--accent)] hover:text-white text-white text-xs font-bold px-5 py-2.5 rounded-full transition-all duration-200"
          >
            데모 신청
          </a>
        </div>
      </div>
    </header>
  )
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white text-[var(--ink)] antialiased font-sans flex flex-col">
      <Nav />
      <main className="flex-grow">
        {children}
      </main>
    </div>
  )
}
