'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className="nav select-none"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'var(--white)',
        borderBottom: scrolled ? '1px solid var(--line-soft)' : '1px solid transparent',
        transition: 'border-bottom 0.2s, box-shadow 0.2s',
        boxShadow: scrolled ? '0 2px 8px rgba(0,0,0,0.04)' : 'none',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand */}
        <Link
          href="/"
          className="brand"
          style={{ textDecoration: 'none', color: 'var(--dark)' }}
        >
          <svg className="mark" viewBox="0 0 34 34" fill="none">
            <circle cx="17" cy="17" r="16" fill="#191A23" />
            <path d="M17 6a11 11 0 1 0 0 22" stroke="#B9FF66" strokeWidth="3.4" fill="none" />
            <circle cx="17" cy="17" r="4" fill="#B9FF66" />
          </svg>
          Lineup
        </Link>

        {/* Menu */}
        <nav
          className="hidden md:flex"
          style={{ display: 'flex', alignItems: 'center', gap: '32px', fontSize: '16px', fontWeight: 500 }}
        >
          <a href="#features" style={{ color: 'var(--dark)', textDecoration: 'none' }}>
            기능
          </a>
          <a href="#problem" style={{ color: 'var(--dark)', textDecoration: 'none' }}>
            문제해결
          </a>
          <a href="#portal-preview" style={{ color: 'var(--dark)', textDecoration: 'none' }}>
            광고주 포털
          </a>
          <a href="#pricing" style={{ color: 'var(--dark)', textDecoration: 'none' }}>
            요금제
          </a>
        </nav>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            href="/auth/login"
            className="btn btn-ghost"
            style={{ fontSize: '15px', padding: '10px 18px', textDecoration: 'none' }}
          >
            로그인
          </Link>
          <Link
            href="/auth/login"
            className="btn btn-dark"
            style={{
              fontSize: '15px',
              padding: '10px 20px',
              backgroundColor: 'var(--dark)',
              color: 'var(--white)',
              textDecoration: 'none',
              borderRadius: '12px',
              fontWeight: 500,
            }}
          >
            무료로 시작하기
          </Link>
        </div>
      </div>
    </header>
  )
}
