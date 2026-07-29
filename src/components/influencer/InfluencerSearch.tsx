'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'

interface InfluencerSearchProps {
  onSearchChange?: (term: string) => void
}

export function InfluencerSearch({ onSearchChange }: InfluencerSearchProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // URL Query state
  const selectedChannels = searchParams.get('channels') || ''
  const selectedCategories = searchParams.get('categories') || '푸드,리빙'
  const followerFilter = searchParams.get('follower') || '50k-500k'
  const priceFilter = searchParams.get('price') || '3m'

  // Dropdown UI states
  const [openDropdown, setOpenDropdown] = useState<'channel' | 'category' | 'follower' | 'price' | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const updateQueryParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const toggleChannel = (ch: string) => {
    let current = selectedChannels ? selectedChannels.split(',').filter(Boolean) : []
    if (current.includes(ch)) {
      current = current.filter((item) => item !== ch)
    } else {
      current.push(ch)
    }
    updateQueryParams('channels', current.length > 0 ? current.join(',') : null)
  }

  const toggleCategory = (cat: string) => {
    let current = selectedCategories ? selectedCategories.split(',').filter(Boolean) : []
    if (current.includes(cat)) {
      current = current.filter((item) => item !== cat)
    } else {
      current.push(cat)
    }
    updateQueryParams('categories', current.length > 0 ? current.join(',') : null)
  }

  return (
    <div className="toolbar" ref={dropdownRef} style={{ position: 'relative' }}>
      {/* 1. 채널 필터 Chip */}
      <div style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => setOpenDropdown(openDropdown === 'channel' ? null : 'channel')}
          className={`fdrop ${selectedChannels ? 'on' : ''}`}
        >
          채널 {selectedChannels ? `(${selectedChannels.split(',').length})` : ''}
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="var(--dark)" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {openDropdown === 'channel' && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: '6px',
              background: 'var(--white)',
              border: '1px solid var(--dark)',
              borderRadius: '14px',
              boxShadow: 'var(--shadow-sm)',
              padding: '10px 14px',
              zIndex: 30,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              minWidth: '150px',
            }}
          >
            {['instagram', 'youtube', 'tiktok'].map((ch) => {
              const label = ch === 'instagram' ? '인스타' : ch === 'youtube' ? '유튜브' : '틱톡'
              const checked = selectedChannels.split(',').includes(ch)
              return (
                <label key={ch} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleChannel(ch)}
                  />
                  {label}
                </label>
              )
            })}
          </div>
        )}
      </div>

      {/* 2. 카테고리 필터 Chip */}
      <div style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => setOpenDropdown(openDropdown === 'category' ? null : 'category')}
          className={`fdrop ${selectedCategories ? 'on' : ''}`}
        >
          카테고리: {selectedCategories ? selectedCategories.replace(',', '·') : '전체'}
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="var(--dark)" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {openDropdown === 'category' && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: '6px',
              background: 'var(--white)',
              border: '1px solid var(--dark)',
              borderRadius: '14px',
              boxShadow: 'var(--shadow-sm)',
              padding: '10px 14px',
              zIndex: 30,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              minWidth: '140px',
            }}
          >
            {['푸드', '리빙', '뷰티', '패션'].map((cat) => {
              const checked = selectedCategories.split(',').includes(cat)
              return (
                <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleCategory(cat)}
                  />
                  {cat}
                </label>
              )
            })}
          </div>
        )}
      </div>

      {/* 3. 팔로워 필터 Chip */}
      <div style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => {
            const next = followerFilter === '50k-500k' ? 'all' : '50k-500k'
            updateQueryParams('follower', next === 'all' ? null : next)
          }}
          className={`fdrop ${followerFilter === '50k-500k' ? 'on' : ''}`}
        >
          팔로워 5만~50만
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="var(--dark)" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* 4. 단가 필터 Chip */}
      <div style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => {
            const next = priceFilter === '3m' ? 'all' : '3m'
            updateQueryParams('price', next === 'all' ? null : next)
          }}
          className={`fdrop ${priceFilter === '3m' ? 'on' : ''}`}
        >
          단가 ~300만
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="var(--dark)" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* 5. + 필터 추가 Chip */}
      <button
        type="button"
        className="fdrop"
        style={{ borderStyle: 'dashed' }}
        onClick={() => {
          updateQueryParams('exclude_blacklist', searchParams.get('exclude_blacklist') === 'false' ? 'true' : 'false')
        }}
      >
        + 필터 추가
      </button>
    </div>
  )
}
