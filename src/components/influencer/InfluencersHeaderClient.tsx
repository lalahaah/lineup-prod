'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'

interface InfluencersHeaderClientProps {
  totalCount: number
}

export function InfluencersHeaderClient({ totalCount }: InfluencersHeaderClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const q = searchParams.get('q') || ''

  const handleSearchChange = (term: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (term.trim()) {
      params.set('q', term.trim())
    } else {
      params.delete('q')
    }
    router.push(`${pathname}?${params.toString()}`)
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
      searchValue={q}
      onSearchChange={handleSearchChange}
      actionButton={
        <Link href="/influencers/new" className="btn font-sans">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          인플루언서 추가
        </Link>
      }
    />
  )
}
