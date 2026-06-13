'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

interface HeaderProps {
  title: string
  subTitle?: string
}

export function Header({ title, subTitle }: HeaderProps) {
  const router = useRouter()
  const supabase = createClient()
  const [userName, setUserName] = useState<string>('현우')

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const name = user.user_metadata?.name || user.email?.split('@')[0] || '사용자'
        setUserName(name)
      }
    }
    getUser()
  }, [supabase])

  const handleCreateCampaign = () => {
    router.push('/campaigns/new')
  }

  return (
    <header 
      className="topbar select-none"
      style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 20, 
        background: 'var(--gray)',
        padding: '26px 40px 18px'
      }}
    >
      <div className="h">
        <h1 className="font-sans font-bold text-2xl tracking-tight text-[var(--dark)]">{title}</h1>
        <span className="sub font-sans text-xs text-[var(--muted)]">
          {subTitle || (
            <>
              안녕하세요 {userName}님 — 오늘 처리할 일이 <b>5건</b> 있어요
            </>
          )}
        </span>
      </div>
      <div className="spacer"></div>
      
      {/* 검색창 */}
      <div 
        className="search"
        style={{
          background: 'var(--white)',
          border: '1px solid var(--dark)',
          borderRadius: '12px'
        }}
      >
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="var(--dark)" strokeWidth="1.8" />
          <path d="M16 16l5 5" stroke="var(--dark)" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <input placeholder="캠페인·인플루언서 검색" className="font-sans" />
      </div>

      {/* 새 캠페인 버튼 */}
      <button 
        onClick={handleCreateCampaign} 
        className="btn cursor-pointer font-sans"
        style={{
          background: 'var(--dark)',
          color: 'var(--white)',
          borderRadius: '12px',
          border: '1px solid var(--dark)'
        }}
      >
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        새 캠페인
      </button>
    </header>
  )
}
