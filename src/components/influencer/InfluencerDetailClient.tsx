'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { AddToCampaignModal } from '@/components/influencer/AddToCampaignModal'
import { EmptyState } from '@/components/shared/EmptyState'
import type { InfluencerDetailItem, ChannelDetailInfo } from '@/app/api/influencers/[id]/route'
import { CHANNEL_LABELS } from '@/lib/utils'

const CATEGORY_OPTIONS = ['푸드', '리빙', '뷰티', '패션', 'IT/테크', '육아', '여행', '기타']
const CHANNEL_OPTIONS = [
  { value: 'instagram', label: '인스타그램' },
  { value: 'youtube', label: '유튜브' },
  { value: 'tiktok', label: '틱톡' },
  { value: 'blog', label: '블로그' },
  { value: 'threads', label: '스레드' },
  { value: 'naver_tv', label: '네이버TV' },
]

function getChannelIcon(type: string) {
  switch (type) {
    case 'instagram':
      return (
        <span className="ch-ico ig">
          <svg viewBox="0 0 24 24" fill="none">
            <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="currentColor" strokeWidth="2" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" strokeWidth="2" />
          </svg>
        </span>
      )
    case 'youtube':
      return (
        <span className="ch-ico yt">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.96c.46-1.77.46-5.33.46-5.33s0-3.56-.46-5.33z" stroke="currentColor" strokeWidth="2" fill="none" />
            <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
          </svg>
        </span>
      )
    case 'tiktok':
      return (
        <span className="ch-ico tt">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M14 4c.3 2 1.6 3.6 3.6 3.9v2.3c-1.3.1-2.5-.3-3.6-1v5.4a4.8 4.8 0 1 1-4.8-4.8c.3 0 .5 0 .8.1v2.4a2.4 2.4 0 1 0 1.7 2.3V4H14z" />
          </svg>
        </span>
      )
    default:
      return (
        <span className="ch-ico">
          <span className="text-xs font-bold">🌐</span>
        </span>
      )
  }
}

interface EditableChannel {
  type: string
  handle: string
  url: string
  followers: number | ''
}

interface InfluencerDetailClientProps {
  influencer: InfluencerDetailItem
}

export function InfluencerDetailClient({ influencer: initialData }: InfluencerDetailClientProps) {
  const router = useRouter()
  const [influencer, setInfluencer] = useState<InfluencerDetailItem>(initialData)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 편집 모드 상태
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // 편집 폼 상태
  const [editName, setEditName] = useState(influencer.name || '')
  const [editEmail, setEditEmail] = useState(influencer.email || '')
  const [editPhone, setEditPhone] = useState(influencer.phone || '')
  const [editCategories, setEditCategories] = useState<string[]>(influencer.categories_list || [influencer.category || '기타'])
  const [editFeeMin, setEditFeeMin] = useState<number | ''>(influencer.fee_min ?? influencer.fee ?? '')
  const [editFeeMax, setEditFeeMax] = useState<number | ''>(influencer.fee_max ?? '')
  const [editNotes, setEditNotes] = useState(influencer.notes || influencer.memo || '')
  const [editChannels, setEditChannels] = useState<EditableChannel[]>([])

  // 블랙리스트 상태 & 사유 입력 모달
  const [isBlacklistModalOpen, setIsBlacklistModalOpen] = useState(false)
  const [blacklistReason, setBlacklistReason] = useState('')
  const [isUpdatingBlacklist, setIsUpdatingBlacklist] = useState(false)

  const channelsList: ChannelDetailInfo[] =
    influencer.channels && influencer.channels.length > 0
      ? influencer.channels
      : [
          {
            type: influencer.channel || 'instagram',
            label: influencer.channel_label || '인스타그램',
            handle: influencer.handle || '',
            url: '',
            followers: typeof influencer.followers === 'number' ? influencer.followers : 0,
            followers_formatted: influencer.followers_formatted || '0',
          },
        ]

  // 편집 모드 시작 시 현재 데이터로 초기화
  const handleStartEditing = () => {
    setEditName(influencer.name || '')
    setEditEmail(influencer.email || '')
    setEditPhone(influencer.phone || '')
    setEditCategories(
      Array.isArray(influencer.categories_list) && influencer.categories_list.length > 0
        ? influencer.categories_list
        : influencer.category
        ? [influencer.category]
        : ['기타']
    )
    setEditFeeMin(influencer.fee_min ?? influencer.fee ?? '')
    setEditFeeMax(influencer.fee_max ?? '')
    setEditNotes(influencer.notes || influencer.memo || '')

    const initialChannels: EditableChannel[] = channelsList.map((ch) => ({
      type: ch.type || 'instagram',
      handle: ch.handle || '',
      url: ch.url || '',
      followers: ch.followers ?? '',
    }))

    setEditChannels(
      initialChannels.length > 0
        ? initialChannels
        : [{ type: 'instagram', handle: '', url: '', followers: '' }]
    )
    setIsEditing(true)
  }

  // 편집 취소
  const handleCancelEditing = () => {
    setIsEditing(false)
  }

  // 채널 추가
  const handleAddChannel = () => {
    setEditChannels([...editChannels, { type: 'instagram', handle: '', url: '', followers: '' }])
  }

  // 채널 삭제
  const handleRemoveChannel = (index: number) => {
    if (editChannels.length <= 1) {
      toast.info('최소 1개의 채널이 필요합니다.')
      return
    }
    setEditChannels(editChannels.filter((_, i) => i !== index))
  }

  // 채널 필드 변경
  const handleChannelChange = (index: number, field: keyof EditableChannel, value: any) => {
    const updated = [...editChannels]
    updated[index] = { ...updated[index], [field]: value }
    setEditChannels(updated)
  }

  // 카테고리 체크박스 토글
  const handleToggleCategory = (cat: string) => {
    if (editCategories.includes(cat)) {
      setEditCategories(editCategories.filter((c) => c !== cat))
    } else {
      setEditCategories([...editCategories, cat])
    }
  }

  // 저장 처리
  const handleSave = async () => {
    if (!editName.trim()) {
      toast.error('이름을 입력해 주세요.')
      return
    }

    setIsSaving(true)

    const channelUrls: Record<string, string> = {}
    const channelHandles: Record<string, string> = {}
    const followers: Record<string, number> = {}

    editChannels.forEach((ch) => {
      if (ch.type) {
        if (ch.url) channelUrls[ch.type] = ch.url
        if (ch.handle) channelHandles[ch.type] = ch.handle
        followers[ch.type] = typeof ch.followers === 'number' ? ch.followers : Number(ch.followers) || 0
      }
    })

    const primaryChannel = editChannels[0]?.type || 'instagram'

    const payload = {
      name: editName.trim(),
      email: editEmail.trim() || null,
      phone: editPhone.trim() || null,
      channel_urls: channelUrls,
      channel_handles: channelHandles,
      followers: followers,
      primary_channel: primaryChannel,
      categories: editCategories.length > 0 ? editCategories : ['기타'],
      fee_min: editFeeMin === '' ? null : Number(editFeeMin),
      fee_max: editFeeMax === '' ? null : Number(editFeeMax),
      notes: editNotes.trim(),
    }

    try {
      const res = await fetch(`/api/influencers/${influencer.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        throw new Error('저장 실패')
      }

      const updated = await res.json()
      setInfluencer(updated)
      setIsEditing(false)
      toast.success('저장됐습니다 ✅')
      router.refresh()
    } catch (error) {
      console.error('Error saving influencer:', error)
      toast.error('저장 중 오류가 발생했습니다.')
    } finally {
      setIsSaving(false)
    }
  }

  // 블랙리스트 버튼 클릭
  const handleClickBlacklistButton = () => {
    if (influencer.is_blacklisted) {
      // 이미 블랙리스트이면 확인 없이 바로 해제
      handleUnblacklist()
    } else {
      // 블랙리스트 등록 시 사유 입력 모달 오픈
      setBlacklistReason('')
      setIsBlacklistModalOpen(true)
    }
  }

  // 블랙리스트 해제
  const handleUnblacklist = async () => {
    setIsUpdatingBlacklist(true)
    try {
      const res = await fetch(`/api/influencers/${influencer.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_blacklisted: false,
          blacklist_reason: null,
        }),
      })

      if (res.ok) {
        const updated = await res.json()
        setInfluencer(updated)
        toast.success('블랙리스트에서 해제됐습니다')
        router.refresh()
      } else {
        toast.error('블랙리스트 해제에 실패했습니다.')
      }
    } catch (error) {
      console.error(error)
      toast.error('오류가 발생했습니다.')
    } finally {
      setIsUpdatingBlacklist(false)
    }
  }

  // 블랙리스트 등록 확인
  const handleConfirmBlacklist = async () => {
    setIsUpdatingBlacklist(true)
    try {
      const res = await fetch(`/api/influencers/${influencer.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_blacklisted: true,
          blacklist_reason: blacklistReason.trim() || '운영진에 의해 등록됨',
        }),
      })

      if (res.ok) {
        const updated = await res.json()
        setInfluencer(updated)
        setIsBlacklistModalOpen(false)
        toast.success('블랙리스트에 등록됐습니다')
        router.refresh()
      } else {
        toast.error('블랙리스트 등록에 실패했습니다.')
      }
    } catch (error) {
      console.error(error)
      toast.error('오류가 발생했습니다.')
    } finally {
      setIsUpdatingBlacklist(false)
    }
  }

  return (
    <div className="main select-none">
      {/* Top Header */}
      <div className="topbar flex-col items-start gap-3">
        <Link
          href="/influencers"
          className="text-xs font-semibold text-[var(--muted)] hover:text-[var(--dark)] transition-colors inline-flex items-center gap-1"
        >
          ← 인플루언서 목록으로 돌아가기
        </Link>
        <div className="flex items-center justify-between w-full flex-wrap gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className={`av ${influencer.avatar_color_class || 'c1'}`}>
              {influencer.avatar_initial || (influencer.name ? influencer.name[0] : '?')}
            </span>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-[var(--dark)] flex items-center gap-2 truncate">
                {influencer.name}
                {influencer.handle && (
                  <span className="text-sm font-normal text-[var(--muted)] truncate">{influencer.handle}</span>
                )}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="cat">{influencer.category}</span>
                {influencer.is_blacklisted ? (
                  <span className="badge danger">블랙리스트</span>
                ) : (
                  <span className="badge soft">
                    <span className="dot" style={{ background: '#1f8a3b' }}></span>
                    {influencer.status_label || '후보'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons: 평상시 vs 편집 모드 */}
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleCancelEditing}
                  disabled={isSaving}
                  className="btn btn-ghost cursor-pointer font-sans"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="btn btn-green cursor-pointer font-sans"
                >
                  {isSaving ? '저장 중...' : '저장'}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="btn btn-green cursor-pointer font-sans"
                >
                  캠페인에 추가
                </button>
                <button
                  type="button"
                  onClick={handleStartEditing}
                  className="btn btn-ghost cursor-pointer font-sans"
                >
                  편집
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="content">
        <Tabs defaultValue="info" className="w-full">
          <TabsList
            className="mb-6 flex gap-2 p-1"
            style={{
              background: 'var(--white)',
              border: '1px solid var(--dark)',
              borderRadius: '16px',
              width: 'fit-content',
            }}
          >
            <TabsTrigger
              value="info"
              className="px-5 py-2.5 rounded-xl font-bold text-sm cursor-pointer transition-all data-[state=active]:bg-[var(--dark)] data-[state=active]:text-[var(--white)]"
            >
              기본 정보
            </TabsTrigger>
            <TabsTrigger
              value="contacts"
              className="px-5 py-2.5 rounded-xl font-bold text-sm cursor-pointer transition-all data-[state=active]:bg-[var(--dark)] data-[state=active]:text-[var(--white)]"
            >
              컨택 이력 ({influencer.contact_history?.length || 0})
            </TabsTrigger>
            <TabsTrigger
              value="campaigns"
              className="px-5 py-2.5 rounded-xl font-bold text-sm cursor-pointer transition-all data-[state=active]:bg-[var(--dark)] data-[state=active]:text-[var(--white)]"
            >
              캠페인 이력 ({influencer.campaign_history?.length || 0})
            </TabsTrigger>
          </TabsList>

          {/* 1. 기본 정보 Tab */}
          <TabsContent value="info">
            <div
              className="card card-pad"
              style={{
                background: 'var(--white)',
                border: '1px solid var(--dark)',
                borderRadius: 'var(--r-lg)',
                boxShadow: 'var(--shadow)',
                padding: '26px',
              }}
            >
              {isEditing ? (
                /* ─── [인라인 편집 폼] ─── */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column (기본 정보 + 채널 정보 + 카테고리) */}
                  <div className="flex flex-col gap-6">
                    <h3 className="text-lg font-bold text-[var(--dark)] border-b pb-2">인적 및 채널 정보 편집</h3>

                    {/* 기본 인적 정보 input */}
                    <div className="flex flex-col gap-3">
                      <div>
                        <label className="text-[var(--dark)] block text-xs font-bold mb-1">
                          이름 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="인플루언서 이름"
                          className="w-full p-2.5 rounded-xl border border-[var(--dark)] bg-[var(--white)] text-sm font-sans focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[var(--dark)] block text-xs font-bold mb-1">이메일</label>
                          <input
                            type="email"
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                            placeholder="example@domain.com"
                            className="w-full p-2.5 rounded-xl border border-[var(--dark)] bg-[var(--white)] text-sm font-sans focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[var(--dark)] block text-xs font-bold mb-1">연락처</label>
                          <input
                            type="tel"
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                            placeholder="010-0000-0000"
                            className="w-full p-2.5 rounded-xl border border-[var(--dark)] bg-[var(--white)] text-sm font-sans focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 채널 정보 목록 편집 (추가/삭제 가능) */}
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[var(--dark)] block text-xs font-bold">
                          등록 채널 목록 ({editChannels.length})
                        </label>
                        <button
                          type="button"
                          onClick={handleAddChannel}
                          className="btn btn-ghost text-xs py-1 px-2.5 cursor-pointer font-sans"
                        >
                          + 채널 추가
                        </button>
                      </div>

                      <div className="flex flex-col gap-3">
                        {editChannels.map((ch, index) => (
                          <div
                            key={index}
                            className="p-3.5 rounded-xl border border-[var(--dark)] bg-[var(--gray)] flex flex-col gap-2.5"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 flex-1">
                                <select
                                  value={ch.type}
                                  onChange={(e) => handleChannelChange(index, 'type', e.target.value)}
                                  className="p-2 rounded-lg border border-[var(--dark)] bg-white text-xs font-bold"
                                >
                                  {CHANNEL_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </option>
                                  ))}
                                </select>
                                <input
                                  type="text"
                                  value={ch.handle}
                                  onChange={(e) => handleChannelChange(index, 'handle', e.target.value)}
                                  placeholder="핸들 (@username)"
                                  className="p-2 rounded-lg border border-[var(--dark)] bg-white text-xs flex-1 min-w-0"
                                />
                              </div>
                              {editChannels.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveChannel(index)}
                                  className="text-xs text-red-500 font-bold hover:underline cursor-pointer px-1"
                                >
                                  삭제
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <input
                                type="url"
                                value={ch.url}
                                onChange={(e) => handleChannelChange(index, 'url', e.target.value)}
                                placeholder="프로필 URL (https://...)"
                                className="p-2 rounded-lg border border-[var(--dark)] bg-white text-xs"
                              />
                              <input
                                type="number"
                                value={ch.followers}
                                onChange={(e) =>
                                  handleChannelChange(
                                    index,
                                    'followers',
                                    e.target.value === '' ? '' : Number(e.target.value)
                                  )
                                }
                                placeholder="팔로워 수"
                                className="p-2 rounded-lg border border-[var(--dark)] bg-white text-xs"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 카테고리 체크박스 멀티선택 */}
                    <div>
                      <label className="text-[var(--dark)] block text-xs font-bold mb-2">
                        카테고리 선택 (다중 선택 가능)
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {CATEGORY_OPTIONS.map((cat) => {
                          const isSelected = editCategories.includes(cat)
                          return (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => handleToggleCategory(cat)}
                              style={{
                                padding: '6px 14px',
                                borderRadius: '10px',
                                border: '1px solid var(--dark)',
                                background: isSelected ? 'var(--dark)' : 'white',
                                color: isSelected ? 'white' : 'var(--dark)',
                                fontSize: '13px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'all .15s',
                              }}
                            >
                              {isSelected ? `✓ ${cat}` : cat}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right Column (단가 + 메모) */}
                  <div className="flex flex-col gap-6">
                    <h3 className="text-lg font-bold text-[var(--dark)] border-b pb-2">단가 및 특이사항 편집</h3>

                    {/* 단가 편집 */}
                    <div>
                      <label className="text-[var(--dark)] block text-xs font-bold mb-1">
                        협업 단가 범위 (원 단위)
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-xs text-[var(--muted)] block mb-1">최소 단가 (원)</span>
                          <input
                            type="number"
                            value={editFeeMin}
                            onChange={(e) => setEditFeeMin(e.target.value === '' ? '' : Number(e.target.value))}
                            placeholder="예: 500000"
                            className="w-full p-2.5 rounded-xl border border-[var(--dark)] bg-[var(--white)] text-sm font-sans focus:outline-none"
                          />
                        </div>
                        <div>
                          <span className="text-xs text-[var(--muted)] block mb-1">최대 단가 (원)</span>
                          <input
                            type="number"
                            value={editFeeMax}
                            onChange={(e) => setEditFeeMax(e.target.value === '' ? '' : Number(e.target.value))}
                            placeholder="예: 1000000"
                            className="w-full p-2.5 rounded-xl border border-[var(--dark)] bg-[var(--white)] text-sm font-sans focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 운영 메모 편집 */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[var(--dark)] block text-xs font-bold">운영 메모</label>
                      <textarea
                        rows={6}
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        placeholder="특이사항이나 매니저 메모를 작성하세요."
                        className="w-full p-3 rounded-xl border border-[var(--dark)] bg-[var(--white)] text-sm font-sans focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* ─── [일반 상세 뷰] ─── */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="flex flex-col gap-6">
                    <h3 className="text-lg font-bold text-[var(--dark)] border-b pb-2">인적 및 채널 정보</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-[var(--muted)] block text-xs">이름</span>
                        <span className="font-semibold text-[var(--dark)]">{influencer.name}</span>
                      </div>
                      <div>
                        <span className="text-[var(--muted)] block text-xs">핸들</span>
                        <span className="font-semibold text-[var(--dark)]">{influencer.handle || '-'}</span>
                      </div>
                      <div>
                        <span className="text-[var(--muted)] block text-xs">이메일</span>
                        <span className="font-semibold text-[var(--dark)]">{influencer.email || '-'}</span>
                      </div>
                      <div>
                        <span className="text-[var(--muted)] block text-xs">연락처</span>
                        <span className="font-semibold text-[var(--dark)]">{influencer.phone || '-'}</span>
                      </div>
                      <div>
                        <span className="text-[var(--muted)] block text-xs">평균 참여율</span>
                        <span className="font-semibold text-[var(--dark)]">{influencer.engagement_rate_formatted || '-'}</span>
                      </div>
                      <div>
                        <span className="text-[var(--muted)] block text-xs">제안 단가 범위</span>
                        <span className="font-semibold text-[var(--dark)]">
                          {influencer.fee_range_formatted || influencer.fee_formatted || '-'}
                        </span>
                      </div>
                    </div>

                    {/* 등록된 채널 목록 */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[var(--muted)] block text-xs font-semibold">
                        등록된 채널 목록 ({channelsList.length})
                      </span>
                      <div className="flex flex-col gap-2">
                        {channelsList.map((ch, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-3 rounded-xl border border-[var(--line-soft)] bg-[var(--gray)]"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {getChannelIcon(ch.type)}
                              <div className="flex flex-col min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-sm text-[var(--dark)] shrink-0">{ch.label}</span>
                                  {ch.handle && (
                                    <span className="text-xs font-semibold text-[var(--dark)] bg-[var(--white)] px-2 py-0.5 rounded border border-[var(--line-soft)] truncate">
                                      {ch.handle}
                                    </span>
                                  )}
                                </div>
                                {ch.url ? (
                                  <a
                                    href={ch.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs text-[var(--muted)] hover:underline truncate max-w-[240px] mt-0.5"
                                  >
                                    {ch.url}
                                  </a>
                                ) : (
                                  <span className="text-xs text-[var(--muted)] mt-0.5">-</span>
                                )}
                              </div>
                            </div>
                            <span className="text-xs font-bold text-[var(--dark)] shrink-0 pl-2">
                              {ch.followers_formatted || (ch.followers ? `${(ch.followers / 10000).toFixed(1)}만` : '0')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 카테고리 태그 */}
                    <div>
                      <span className="text-[var(--muted)] block text-xs mb-1.5">카테고리 태그</span>
                      <div className="flex flex-wrap gap-1.5">
                        {(influencer.categories_list || [influencer.category || '기타']).map((cat, i) => (
                          <span key={i} className="cat font-medium">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="flex flex-col gap-6">
                    <h3 className="text-lg font-bold text-[var(--dark)] border-b pb-2">히스토리 및 특이사항</h3>
                    <div>
                      <span className="text-[var(--muted)] block text-xs mb-1.5">과거 협업 브랜드</span>
                      <div className="flex flex-wrap gap-1.5">
                        {influencer.past_brands && influencer.past_brands.length > 0 ? (
                          influencer.past_brands.map((b, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 text-xs rounded-lg bg-[var(--gray)] border border-[var(--line-soft)] font-medium text-[var(--dark)]"
                            >
                              {b}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-[var(--muted)]">-</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-[var(--muted)] block text-xs">응답률</span>
                        <span className="font-semibold text-[var(--dark)]">{influencer.response_rate || '90%'}</span>
                      </div>
                      <div>
                        <span className="text-[var(--muted)] block text-xs">총 협업 횟수</span>
                        <span className="font-semibold text-[var(--dark)]">{influencer.total_collaborations || 0} 회</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-[var(--muted)] block text-xs font-medium">운영 메모</span>
                      <div className="w-full p-3 rounded-xl border border-[var(--line-soft)] bg-[var(--gray)] text-sm font-sans min-h-[100px] whitespace-pre-wrap text-[var(--dark)]">
                        {influencer.notes || influencer.memo || '작성된 메모가 없습니다.'}
                      </div>
                    </div>

                    {/* 블랙리스트 토글 버튼 */}
                    <div className="pt-2 border-t flex justify-end">
                      <button
                        type="button"
                        disabled={isUpdatingBlacklist}
                        onClick={handleClickBlacklistButton}
                        className="px-4 py-2 rounded-xl text-sm font-bold border border-[#E08A80] bg-[#FFD5D0] text-[var(--dark)] hover:bg-[#ffbabb] transition-colors cursor-pointer"
                      >
                        {influencer.is_blacklisted ? '블랙리스트 해제' : '블랙리스트 등록'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* 2. 컨택 이력 Tab */}
          <TabsContent value="contacts">
            {influencer.contact_history && influencer.contact_history.length > 0 ? (
              <div
                className="card card-pad"
                style={{
                  background: 'var(--white)',
                  border: '1px solid var(--dark)',
                  borderRadius: 'var(--r-lg)',
                  boxShadow: 'var(--shadow)',
                  padding: '26px',
                }}
              >
                <div className="flex flex-col gap-4">
                  {influencer.contact_history.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border border-[var(--line-soft)] bg-[var(--gray)] flex flex-col gap-1.5"
                    >
                      <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                        <div className="flex items-center gap-2">
                          <span className="badge dark">{item.type}</span>
                          <span className="badge gray">{item.direction}</span>
                          <span className="font-semibold text-[var(--dark)]">{item.sender}</span>
                        </div>
                        <span>{item.sent_at}</span>
                      </div>
                      <h4 className="font-bold text-sm text-[var(--dark)] mt-1">{item.subject}</h4>
                      <p className="text-xs text-[var(--muted)] leading-relaxed">{item.preview}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState
                icon="💬"
                title="컨택 이력이 없습니다"
                description="아직 이 인플루언서와 주고받은 이메일이나 DM 이력이 기록되지 않았습니다."
              />
            )}
          </TabsContent>

          {/* 3. 캠페인 이력 Tab */}
          <TabsContent value="campaigns">
            {influencer.campaign_history && influencer.campaign_history.length > 0 ? (
              <div
                className="card card-pad"
                style={{
                  background: 'var(--white)',
                  border: '1px solid var(--dark)',
                  borderRadius: 'var(--r-lg)',
                  boxShadow: 'var(--shadow)',
                  padding: '26px',
                }}
              >
                <div className="flex flex-col gap-4">
                  {influencer.campaign_history.map((camp) => (
                    <div
                      key={camp.id}
                      className="p-4 rounded-xl border border-[var(--dark)] bg-[var(--white)] flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-bold text-base text-[var(--dark)]">{camp.campaign_name}</h4>
                        <span className="text-xs text-[var(--muted)]">
                          광고주: <b>{camp.client_name}</b> · 참여 기간: {camp.period}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-[var(--dark)]">{camp.confirmed_fee_formatted}</span>
                        <span className={`badge ${camp.status_variant}`}>{camp.status_label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState
                icon="📢"
                title="참여한 캠페인 이력이 없습니다"
                description="아직 Lineup 내에서 진행한 캠페인 이력이 없습니다."
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Add To Campaign Modal */}
      <AddToCampaignModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        influencerName={influencer.name}
        influencerId={influencer.id}
      />

      {/* 블랙리스트 등록 사유 입력 모달 (직접 구현) */}
      {isBlacklistModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setIsBlacklistModalOpen(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 20,
              border: '1px solid var(--dark)',
              boxShadow: '0 4px 0 0 var(--dark)',
              width: 460,
              maxWidth: 'calc(100vw - 40px)',
              padding: 24,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: 'var(--dark)' }}>
                블랙리스트 등록
              </h3>
              <button
                type="button"
                onClick={() => setIsBlacklistModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 20,
                  cursor: 'pointer',
                  color: 'var(--muted)',
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>
            <p style={{ fontSize: 13, color: 'var(--muted)', margin: '0 0 16px', lineHeight: 1.5 }}>
              <b>{influencer.name}</b> 님을 블랙리스트로 등록하는 사유를 입력해 주세요.
            </p>

            <textarea
              rows={4}
              value={blacklistReason}
              onChange={(e) => setBlacklistReason(e.target.value)}
              placeholder="예: 연락 두절, 원고 마감 미준수, 비협조적 태도 등"
              className="w-full p-3 rounded-xl border border-[var(--dark)] bg-[var(--white)] text-sm font-sans focus:outline-none resize-none mb-4"
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button
                type="button"
                onClick={() => setIsBlacklistModalOpen(false)}
                disabled={isUpdatingBlacklist}
                className="btn btn-ghost font-sans text-xs cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirmBlacklist}
                disabled={isUpdatingBlacklist}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-[#E08A80] bg-[#FFD5D0] text-[var(--dark)] hover:bg-[#ffbabb] transition-colors cursor-pointer"
              >
                {isUpdatingBlacklist ? '등록 중...' : '블랙리스트 등록'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
