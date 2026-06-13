'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/shared/Logo'
import { createClient } from '@/lib/supabase/client'
import { useTransition } from 'react'

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    startTransition(() => {
      router.refresh()
      router.push('/auth/login')
    })
  }

  const opLinks = [
    {
      name: '대시보드',
      href: '/dashboard',
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M4 13h7V4H4v9zM13 20h7v-9h-7v9zM13 4v5h7V4h-7zM4 20h7v-5H4v5z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      name: '캠페인',
      href: '/campaigns',
      count: 8,
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="5" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
          <rect x="10" y="4" width="5" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
          <rect x="17" y="4" width="4" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      )
    },
    {
      name: '인플루언서 DB',
      href: '/influencers',
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.7" />
          <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M16 6.2A3 3 0 0 1 16 12M17 14c2.5.3 4 2.3 4 4.7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      )
    },
    {
      name: '원고 검수',
      href: '/drafts',
      count: 12,
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M6 3h9l4 4v14H6z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M14 3v5h5M9 13h7M9 17h7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      )
    },
    {
      name: '정산',
      href: '/billing',
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M5 4h14v16l-3-2-2 2-2-2-2 2-3-2V4z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M9 9h6M9 13h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      )
    }
  ]

  const extLinks = [
    {
      name: '광고주 포털',
      href: '/portal/demo',
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M10 13a4 4 0 0 0 5.7.3l3-3A4 4 0 0 0 13 4.7l-1.7 1.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M14 11a4 4 0 0 0-5.7-.3l-3 3A4 4 0 0 0 11 19.3l1.6-1.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      )
    },
    {
      name: '인플루언서 링크',
      href: '/inf/demo',
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <rect x="7" y="3" width="10" height="18" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
          <path d="M11 18h2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      )
    }
  ]

  return (
    <aside className={cn("sidebar select-none", className)}>
      <div className="sb-brand">
        <Logo size={30} showText={true} color="var(--white)" />
      </div>

      <div className="sb-sec">운영</div>
      <nav className="sb-nav">
        {opLinks.map((link) => {
          const isActive = pathname.startsWith(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn("sb-link", isActive && "active")}
            >
              {link.icon}
              <span>{link.name}</span>
              {link.count !== undefined && <span className="count">{link.count}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="sb-sec">외부 공유 링크</div>
      <nav className="sb-nav">
        {extLinks.map((link) => {
          const isActive = pathname.startsWith(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn("sb-link", isActive && "active")}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          )
        })}
      </nav>

      <div
        onClick={handleLogout}
        className="sb-foot cursor-pointer hover:bg-white/5 transition-colors duration-150"
        title="클릭하여 로그아웃"
      >
        <div className="av">우</div>
        <div className="min-w-0 flex-1">
          <div className="nm truncate font-sans text-sm font-semibold">{isPending ? '로그아웃 중...' : '김현우'}</div>
          <div className="rl truncate font-sans text-xs text-[#8A8B95]">캠페인 매니저</div>
        </div>
      </div>
    </aside>
  )
}
