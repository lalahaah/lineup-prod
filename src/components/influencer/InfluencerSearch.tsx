'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { CHANNEL_LABELS } from '@/lib/utils'

const CATEGORY_OPTIONS = ['푸드', '리빙', '뷰티', '패션', 'IT/테크', '육아', '여행', '기타']

export function InfluencerSearch() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // URL Query states (모든 chip 기본값 = 비활성)
  const selectedChannels = searchParams.get('channels') || ''
  const selectedCategories = searchParams.get('categories') || ''
  const followerFilter = searchParams.get('follower') || ''
  const priceFilter = searchParams.get('price') || ''

  // Dropdown UI states
  const [openDropdown, setOpenDropdown] = useState<'channel' | 'category' | null>(null)
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

  const channelCount = selectedChannels ? selectedChannels.split(',').filter(Boolean).length : 0
  const categoryCount = selectedCategories ? selectedCategories.split(',').filter(Boolean).length : 0

  return (
    <div className="toolbar" ref={dropdownRef} style={{ position: 'relative', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {/* 1. 채널 필터 Chip */}
      <div style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => setOpenDropdown(openDropdown === 'channel' ? null : 'channel')}
          className={`fdrop ${selectedChannels ? 'on' : ''}`}
        >
          채널 {channelCount > 0 ? `(${channelCount})` : ''}
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
              minWidth: '160px',
            }}
          >
            {Object.entries(CHANNEL_LABELS).map(([ch, label]) => {
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
          카테고리 {categoryCount > 0 ? `(${categoryCount})` : ''}
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
              minWidth: '150px',
            }}
          >
            {CATEGORY_OPTIONS.map((cat) => {
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
            const next = followerFilter === '50k-500k' ? null : '50k-500k'
            updateQueryParams('follower', next)
          }}
          className={`fdrop ${followerFilter === '50k-500k' ? 'on' : ''}`}
        >
          팔로워 5만~50만
        </button>
      </div>

      {/* 4. 단가 필터 Chip */}
      <div style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => {
            const next = priceFilter === '3m' ? null : '3m'
            updateQueryParams('price', next)
          }}
          className={`fdrop ${priceFilter === '3m' ? 'on' : ''}`}
        >
          단가 ~300만
        </button>
      </div>

      {/* 5. + 필터 추가 Chip (블랙리스트 포함 토글) */}
      <button
        type="button"
        className={`fdrop ${searchParams.get('exclude_blacklist') === 'false' ? 'on' : ''}`}
        style={{ borderStyle: 'dashed' }}
        onClick={() => {
          const isCurrentlyShowingBlacklist = searchParams.get('exclude_blacklist') === 'false'
          updateQueryParams('exclude_blacklist', isCurrentlyShowingBlacklist ? null : 'false')
        }}
      >
        + 블랙리스트 포함
      </button>
    </div>
  )
}
