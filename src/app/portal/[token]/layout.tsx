import React from 'react'

export const metadata = {
  title: 'Lineup — 광고주 포털',
  description: '라운드미디어가 보낸 인플루언서 후보 제안',
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--gray)',
        color: 'var(--dark)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {children}
    </div>
  )
}
