'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { CHANNEL_LABELS } from '@/lib/utils'

const CATEGORY_OPTIONS = ['푸드', '리빙', '뷰티', '패션', 'IT/테크', '육아', '여행', '기타']

const FOLLOWER_OPTIONS = [
  { label: '전체', value: 'all' },
  { label: '1만 이하', value: '0-10000' },
  { label: '1만~10만', value: '10000-100000' },
  { label: '10만~100만', value: '100000-1000000' },
  { label: '100만 이상', value: '1000000+' },
]

const FEE_OPTIONS = [
  { label: '전체', value: 'all' },
  { label: '50만 이하', value: '0-500000' },
  { label: '50만~100만', value: '500000-1000000' },
  { label: '100만~300만', value: '1000000-3000000' },
  { label: '300만~500만', value: '3000000-5000000' },
  { label: '500만~1,000만', value: '5000000-10000000' },
  { label: '1,000만~3,000만', value: '10000000-30000000' },
  { label: '3,000만 이상', value: '30000000+' },
  { label: '직접 입력', value: 'custom' },
]

const COLLAB_OPTIONS = [
  { label: '전체', value: 'all' },
  { label: '협업 이력 있음', value: 'has_collab' },
  { label: '미접촉', value: 'no_collab' },
]

export function InfluencerSearch() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Query values
  const selectedChannel = searchParams.get('channel') || searchParams.get('channels') || ''
  const selectedCategories = searchParams.get('categories') || ''
  const followerFilter = searchParams.get('followers_range') || ''
  const feeFilter = searchParams.get('fee_range') || ''
  const feeMinParam = searchParams.get('fee_min') || ''
  const feeMaxParam = searchParams.get('fee_max') || ''
  const collabStatus = searchParams.get('collab_status') || ''
  const includeBlacklist = searchParams.get('include_blacklist') === 'true' || searchParams.get('exclude_blacklist') === 'false'

  // Custom fee input states
  const [isCustomFee, setIsCustomFee] = useState(feeFilter === 'custom' || !!feeMinParam || !!feeMaxParam)
  const [customMinMan, setCustomMinMan] = useState(feeMinParam ? (Number(feeMinParam) / 10000).toString() : '')
  const [customMaxMan, setCustomMaxMan] = useState(feeMaxParam ? (Number(feeMaxParam) / 10000).toString() : '')
  const feeTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Dropdown states
  const [openDropdown, setOpenDropdown] = useState<'channel' | 'category' | 'follower' | 'fee' | 'collab' | null>(null)
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

  const updateQueryParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, val]) => {
      if (val) {
        params.set(key, val)
      } else {
        params.delete(key)
      }
    })
    router.push(`${pathname}?${params.toString()}`)
  }

  // 1. Channel toggle (Single select)
  const handleSelectChannel = (ch: string) => {
    setOpenDropdown(null)
    updateQueryParams({
      channel: ch === 'all' ? null : ch,
      channels: null,
    })
  }

  // 2. Category toggle (Multi select)
  const toggleCategory = (cat: string) => {
    let current = selectedCategories ? selectedCategories.split(',').filter(Boolean) : []
    if (current.includes(cat)) {
      current = current.filter((item) => item !== cat)
    } else {
      current.push(cat)
    }
    updateQueryParams({
      categories: current.length > 0 ? current.join(',') : null,
    })
  }

  // 3. Follower filter toggle (Single select)
  const handleSelectFollower = (val: string) => {
    setOpenDropdown(null)
    updateQueryParams({
      followers_range: val === 'all' ? null : val,
    })
  }

  // 4. Fee filter toggle
  const handleSelectFee = (val: string) => {
    if (val === 'custom') {
      setIsCustomFee(true)
    } else {
      setIsCustomFee(false)
      setOpenDropdown(null)
      updateQueryParams({
        fee_range: val === 'all' ? null : val,
        fee_min: null,
        fee_max: null,
      })
    }
  }

  // Handle custom fee input debounce (300ms)
  const handleCustomFeeChange = (minMan: string, maxMan: string) => {
    setCustomMinMan(minMan)
    setCustomMaxMan(maxMan)

    if (feeTimerRef.current) clearTimeout(feeTimerRef.current)

    feeTimerRef.current = setTimeout(() => {
      const minWon = minMan && !isNaN(Number(minMan)) ? (Number(minMan) * 10000).toString() : null
      const maxWon = maxMan && !isNaN(Number(maxMan)) ? (Number(maxMan) * 10000).toString() : null

      updateQueryParams({
        fee_range: 'custom',
        fee_min: minWon,
        fee_max: maxWon,
      })
    }, 300)
  }

  // 5. Collab status toggle (Single select)
  const handleSelectCollab = (val: string) => {
    setOpenDropdown(null)
    updateQueryParams({
      collab_status: val === 'all' ? null : val,
    })
  }

  // Labels
  const activeChannelLabel = selectedChannel && selectedChannel !== 'all' ? CHANNEL_LABELS[selectedChannel] || selectedChannel : ''
  const categoryCount = selectedCategories ? selectedCategories.split(',').filter(Boolean).length : 0
  const activeFollowerOpt = FOLLOWER_OPTIONS.find((o) => o.value === followerFilter && o.value !== 'all')
  const activeFeeOpt = FEE_OPTIONS.find((o) => o.value === feeFilter && o.value !== 'all')
  const activeCollabOpt = COLLAB_OPTIONS.find((o) => o.value === collabStatus && o.value !== 'all')

  return (
    <div className="flex flex-col gap-3 mb-6" ref={dropdownRef}>
      <div className="flex items-center gap-2 flex-wrap">
        {/* 1. 채널 드롭다운 */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenDropdown(openDropdown === 'channel' ? null : 'channel')}
            className="font-sans text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5"
            style={{
              border: '1px solid var(--dark)',
              borderRadius: '30px',
              padding: '8px 14px',
              background: activeChannelLabel ? 'var(--dark)' : 'var(--white)',
              color: activeChannelLabel ? 'var(--white)' : 'var(--dark)',
            }}
          >
            {activeChannelLabel ? `채널: ${activeChannelLabel}` : '채널 ▼'}
          </button>

          {openDropdown === 'channel' && (
            <div
              className="absolute top-full left-0 mt-1.5 bg-[var(--white)] border border-[var(--dark)] rounded-2xl p-2 z-30 shadow-md flex flex-col gap-1 min-w-[150px]"
            >
              <button
                type="button"
                onClick={() => handleSelectChannel('all')}
                className={`text-left px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[var(--gray)] transition-colors ${
                  !selectedChannel || selectedChannel === 'all' ? 'bg-[var(--green)] text-[var(--dark)]' : ''
                }`}
              >
                전체
              </button>
              {Object.entries(CHANNEL_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSelectChannel(key)}
                  className={`text-left px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[var(--gray)] transition-colors ${
                    selectedChannel === key ? 'bg-[var(--green)] text-[var(--dark)]' : ''
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2. 카테고리 드롭다운 */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenDropdown(openDropdown === 'category' ? null : 'category')}
            className="font-sans text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5"
            style={{
              border: '1px solid var(--dark)',
              borderRadius: '30px',
              padding: '8px 14px',
              background: categoryCount > 0 ? 'var(--dark)' : 'var(--white)',
              color: categoryCount > 0 ? 'var(--white)' : 'var(--dark)',
            }}
          >
            {categoryCount > 0 ? `카테고리 (${categoryCount})` : '카테고리 ▼'}
          </button>

          {openDropdown === 'category' && (
            <div
              className="absolute top-full left-0 mt-1.5 bg-[var(--white)] border border-[var(--dark)] rounded-2xl p-3 z-30 shadow-md flex flex-col gap-2 min-w-[160px]"
            >
              {CATEGORY_OPTIONS.map((cat) => {
                const checked = selectedCategories.split(',').includes(cat)
                return (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCategory(cat)}
                      className="rounded"
                    />
                    {cat}
                  </label>
                )
              })}
            </div>
          )}
        </div>

        {/* 3. 팔로워 드롭다운 */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenDropdown(openDropdown === 'follower' ? null : 'follower')}
            className="font-sans text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5"
            style={{
              border: '1px solid var(--dark)',
              borderRadius: '30px',
              padding: '8px 14px',
              background: activeFollowerOpt ? 'var(--dark)' : 'var(--white)',
              color: activeFollowerOpt ? 'var(--white)' : 'var(--dark)',
            }}
          >
            {activeFollowerOpt ? `팔로워: ${activeFollowerOpt.label}` : '팔로워 ▼'}
          </button>

          {openDropdown === 'follower' && (
            <div
              className="absolute top-full left-0 mt-1.5 bg-[var(--white)] border border-[var(--dark)] rounded-2xl p-2 z-30 shadow-md flex flex-col gap-1 min-w-[140px]"
            >
              {FOLLOWER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelectFollower(opt.value)}
                  className={`text-left px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[var(--gray)] transition-colors ${
                    (followerFilter || 'all') === opt.value ? 'bg-[var(--green)] text-[var(--dark)]' : ''
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 4. 단가 드롭다운 */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenDropdown(openDropdown === 'fee' ? null : 'fee')}
            className="font-sans text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5"
            style={{
              border: '1px solid var(--dark)',
              borderRadius: '30px',
              padding: '8px 14px',
              background: activeFeeOpt || isCustomFee ? 'var(--dark)' : 'var(--white)',
              color: activeFeeOpt || isCustomFee ? 'var(--white)' : 'var(--dark)',
            }}
          >
            {activeFeeOpt
              ? `단가: ${activeFeeOpt.label}`
              : isCustomFee
              ? '단가: 직접 입력'
              : '단가 ▼'}
          </button>

          {openDropdown === 'fee' && (
            <div
              className="absolute top-full left-0 mt-1.5 bg-[var(--white)] border border-[var(--dark)] rounded-2xl p-2 z-30 shadow-md flex flex-col gap-1 min-w-[160px]"
            >
              {FEE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelectFee(opt.value)}
                  className={`text-left px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[var(--gray)] transition-colors ${
                    (feeFilter || 'all') === opt.value || (opt.value === 'custom' && isCustomFee)
                      ? 'bg-[var(--green)] text-[var(--dark)]'
                      : ''
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 5. 협업상태 드롭다운 */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenDropdown(openDropdown === 'collab' ? null : 'collab')}
            className="font-sans text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5"
            style={{
              border: '1px solid var(--dark)',
              borderRadius: '30px',
              padding: '8px 14px',
              background: activeCollabOpt ? 'var(--dark)' : 'var(--white)',
              color: activeCollabOpt ? 'var(--white)' : 'var(--dark)',
            }}
          >
            {activeCollabOpt ? `협업상태: ${activeCollabOpt.label}` : '협업상태 ▼'}
          </button>

          {openDropdown === 'collab' && (
            <div
              className="absolute top-full left-0 mt-1.5 bg-[var(--white)] border border-[var(--dark)] rounded-2xl p-2 z-30 shadow-md flex flex-col gap-1 min-w-[150px]"
            >
              {COLLAB_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelectCollab(opt.value)}
                  className={`text-left px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[var(--gray)] transition-colors ${
                    (collabStatus || 'all') === opt.value ? 'bg-[var(--green)] text-[var(--dark)]' : ''
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 6. 블랙리스트 포함 토글 */}
        <button
          type="button"
          onClick={() => {
            updateQueryParams({
              include_blacklist: includeBlacklist ? null : 'true',
              exclude_blacklist: includeBlacklist ? 'true' : 'false',
            })
          }}
          className="font-sans text-xs font-semibold cursor-pointer transition-all"
          style={{
            border: '1px solid var(--dark)',
            borderRadius: '30px',
            padding: '8px 14px',
            background: includeBlacklist ? 'var(--dark)' : 'var(--white)',
            color: includeBlacklist ? 'var(--white)' : 'var(--dark)',
          }}
        >
          {includeBlacklist ? '블랙리스트 포함' : '블랙리스트 제외'}
        </button>
      </div>

      {/* 직접 입력 선택 시 인라인 노출 */}
      {isCustomFee && (
        <div className="flex items-center gap-2 p-3 bg-[var(--white)] border border-[var(--dark)] rounded-xl w-fit">
          <span className="text-xs font-bold text-[var(--dark)]">직접 입력:</span>
          <input
            type="number"
            placeholder="최소"
            value={customMinMan}
            onChange={(e) => handleCustomFeeChange(e.target.value, customMaxMan)}
            className="w-20 px-2 py-1 border border-[var(--dark)] rounded-lg text-xs focus:outline-none"
          />
          <span className="text-xs font-bold">만원 ~</span>
          <input
            type="number"
            placeholder="최대"
            value={customMaxMan}
            onChange={(e) => handleCustomFeeChange(customMinMan, e.target.value)}
            className="w-20 px-2 py-1 border border-[var(--dark)] rounded-lg text-xs focus:outline-none"
          />
          <span className="text-xs font-bold">만원</span>
          <button
            type="button"
            onClick={() => {
              setIsCustomFee(false)
              setCustomMinMan('')
              setCustomMaxMan('')
              updateQueryParams({ fee_range: null, fee_min: null, fee_max: null })
            }}
            className="text-xs text-red-500 font-bold ml-2 hover:underline cursor-pointer"
          >
            초기화
          </button>
        </div>
      )}
    </div>
  )
}
