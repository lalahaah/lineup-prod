import React from 'react'

export const metadata = {
  title: 'Lineup — 인플루언서 협업 안내',
  description: '라운드미디어가 보낸 안전한 인플루언서 협업 링크',
}

export default function InfLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#E8E8EA',
        padding: '40px 16px',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {children}
    </div>
  )
}
