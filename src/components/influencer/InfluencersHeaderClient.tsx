'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'

interface InfluencersHeaderClientProps {
  totalCount: number
  onOpenBulkModal?: () => void
}

export function InfluencersHeaderClient({ totalCount, onOpenBulkModal }: InfluencersHeaderClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const initialQ = searchParams.get('q') || ''
  const [searchTerm, setSearchTerm] = useState(initialQ)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setSearchTerm(searchParams.get('q') || '')
  }, [searchParams])

  const handleSearchChange = (term: string) => {
    setSearchTerm(term)
    if (timerRef.current) clearTimeout(timerRef.current)

    // 300ms debounce
    timerRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (term.trim()) {
        params.set('q', term.trim())
      } else {
        params.delete('q')
      }
      router.push(`${pathname}?${params.toString()}`)
    }, 300)
  }

  return (
    <Header
      title="인플루언서 DB"
      subTitle={
        <>
          총 <b>{totalCount}</b>명 · 블랙리스트 제외
        </>
      }
      searchPlaceholder="이름·핸들 검색"
      searchValue={searchTerm}
      onSearchChange={handleSearchChange}
      actionButton={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {onOpenBulkModal && (
            <button
              type="button"
              onClick={onOpenBulkModal}
              className="btn btn-ghost font-sans cursor-pointer"
              style={{
                background: 'var(--white)',
                color: 'var(--dark)',
                borderRadius: '12px',
                border: '1px solid var(--dark)',
              }}
            >
              📄 엑셀 일괄 추가
            </button>
          )}
          <Link href="/influencers/new" className="btn font-sans">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            인플루언서 추가
          </Link>
        </div>
      }
    />
  )
}
