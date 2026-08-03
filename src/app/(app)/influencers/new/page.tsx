'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Header } from '@/components/layout/Header'

const CATEGORY_OPTIONS = ['푸드', '리빙', '뷰티', '패션', 'IT/테크', '육아', '여행', '기타']

const CHANNEL_OPTIONS = [
  { value: 'instagram', label: '인스타그램' },
  { value: 'youtube', label: '유튜브' },
  { value: 'tiktok', label: '틱톡' },
  { value: 'blog', label: '블로그' },
  { value: 'naver_tv', label: '네이버TV' },
  { value: 'threads', label: '스레드' },
]

interface ChannelRow {
  type: string
  handle: string
  url: string
  followers: string
}

export default function NewInfluencerPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    categories: ['푸드'] as string[],
    min_fee: '',
    max_fee: '',
    memo: '',
  })

  // 채널 목록 (초기 1개, 최대 5개)
  const [channels, setChannels] = useState<ChannelRow[]>([
    { type: 'instagram', handle: '', url: '', followers: '' },
  ])

  const handleAddChannel = () => {
    if (channels.length >= 5) {
      toast.error('채널은 최대 5개까지 추가할 수 있습니다.')
      return
    }
    const usedTypes = channels.map((c) => c.type)
    const nextOption = CHANNEL_OPTIONS.find((opt) => !usedTypes.includes(opt.value)) || CHANNEL_OPTIONS[0]
    setChannels([...channels, { type: nextOption.value, handle: '', url: '', followers: '' }])
  }

  const handleRemoveChannel = (index: number) => {
    if (channels.length <= 1) return
    setChannels(channels.filter((_, i) => i !== index))
  }

  const handleChannelChange = (index: number, field: keyof ChannelRow, value: string) => {
    const updated = [...channels]
    updated[index] = { ...updated[index], [field]: value }
    setChannels(updated)
  }

  const getHandlePlaceholder = (type: string) => {
    switch (type) {
      case 'instagram':
      case 'tiktok':
      case 'threads':
        return '@아이디'
      case 'youtube':
        return '채널명 또는 @아이디'
      case 'blog':
        return '블로그명'
      case 'naver_tv':
        return '채널명'
      default:
        return '핸들/채널명'
    }
  }

  const handleCategoryToggle = (cat: string) => {
    if (formData.categories.includes(cat)) {
      setFormData({
        ...formData,
        categories: formData.categories.filter((c) => c !== cat),
      })
    } else {
      setFormData({
        ...formData,
        categories: [...formData.categories, cat],
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error('이름은 필수 입력 항목입니다.')
      return
    }

    setIsSubmitting(true)

    const formattedChannels = channels.map((ch) => ({
      type: ch.type,
      handle: ch.handle.trim(),
      url: ch.url.trim(),
      followers: ch.followers ? Number(ch.followers) : 0,
    }))

    try {
      const res = await fetch('/api/influencers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim() || null,
          phone: formData.phone.trim() || null,
          channels: formattedChannels,
          categories: formData.categories,
          fee_min: formData.min_fee ? Number(formData.min_fee) : 0,
          fee_max: formData.max_fee ? Number(formData.max_fee) : 0,
          notes: formData.memo.trim() || null,
        }),
      })

      if (res.ok) {
        toast.success('신규 인플루언서가 등록되었습니다.')
        router.push('/influencers')
        router.refresh()
      } else {
        toast.error('인플루언서 등록에 실패했습니다.')
      }
    } catch (error) {
      console.error(error)
      toast.error('오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="main select-none">
      <Header
        title="신규 인플루언서 추가"
        subTitle="DB에 보관할 인플루언서의 주요 정보와 단가를 입력하세요."
      />

      <div className="content">
        <div className="mb-4">
          <Link
            href="/influencers"
            className="text-xs font-semibold text-[var(--muted)] hover:text-[var(--dark)] transition-colors inline-flex items-center gap-1"
          >
            ← 목록으로 돌아가기
          </Link>
        </div>

        <div
          className="card card-pad max-w-3xl"
          style={{
            background: 'var(--white)',
            border: '1px solid var(--dark)',
            borderRadius: 'var(--r-lg)',
            boxShadow: 'var(--shadow)',
            padding: '32px',
          }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* 기본 정보 */}
            <div>
              <h3 className="text-base font-bold text-[var(--dark)] mb-4 border-b pb-2">
                기본 인적사항
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[var(--dark)]">
                    이름 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="예: 유리쿡"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dark)] bg-[var(--white)] text-sm font-sans focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[var(--dark)]">이메일</label>
                  <input
                    type="email"
                    placeholder="yuri@cooks.kr"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dark)] bg-[var(--white)] text-sm font-sans focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[var(--dark)]">연락처</label>
                  <input
                    type="text"
                    placeholder="010-1234-5678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dark)] bg-[var(--white)] text-sm font-sans focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 동적 채널 및 지표 정보 */}
            <div>
              <h3 className="text-base font-bold text-[var(--dark)] mb-4 border-b pb-2">
                채널 및 지표 정보
              </h3>
              <div className="flex flex-col gap-3">
                {channels.map((ch, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 2fr 1fr auto',
                      gap: '12px',
                      alignItems: 'center',
                    }}
                  >
                    {/* 채널 종류 select */}
                    <select
                      value={ch.type}
                      onChange={(e) => handleChannelChange(idx, 'type', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dark)] bg-[var(--white)] text-sm font-sans focus:outline-none"
                    >
                      {CHANNEL_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>

                    {/* 핸들/채널명 input */}
                    <input
                      type="text"
                      placeholder={getHandlePlaceholder(ch.type)}
                      value={ch.handle}
                      onChange={(e) => handleChannelChange(idx, 'handle', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dark)] bg-[var(--white)] text-sm font-sans focus:outline-none"
                    />

                    {/* 채널 URL input */}
                    <input
                      type="url"
                      placeholder="채널 URL (https://...)"
                      value={ch.url}
                      onChange={(e) => handleChannelChange(idx, 'url', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dark)] bg-[var(--white)] text-sm font-sans focus:outline-none"
                    />

                    {/* 팔로워 수 input */}
                    <input
                      type="number"
                      placeholder="팔로워 수 (숫자)"
                      value={ch.followers}
                      onChange={(e) => handleChannelChange(idx, 'followers', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dark)] bg-[var(--white)] text-sm font-sans focus:outline-none"
                    />

                    {/* 삭제 버튼 (X) */}
                    <button
                      type="button"
                      disabled={channels.length <= 1}
                      onClick={() => handleRemoveChannel(idx)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        border: '1px solid var(--line-soft)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: channels.length <= 1 ? 'not-allowed' : 'pointer',
                        opacity: channels.length <= 1 ? 0.4 : 1,
                        transition: 'all 0.15s ease',
                      }}
                      className="hover:bg-[var(--dark)] hover:text-white transition-colors"
                      title="채널 삭제"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                {/* "+ 채널 추가" 버튼 */}
                {channels.length < 5 && (
                  <button
                    type="button"
                    onClick={handleAddChannel}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '12px',
                      border: '1.5px dashed var(--line-soft)',
                      background: 'transparent',
                      color: 'var(--dark)',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      marginTop: '4px',
                      transition: 'all 0.15s ease',
                    }}
                    className="hover:border-[var(--dark)] font-sans"
                  >
                    + 채널 추가
                  </button>
                )}
              </div>
            </div>

            {/* 카테고리 및 단가 */}
            <div>
              <h3 className="text-base font-bold text-[var(--dark)] mb-4 border-b pb-2">
                카테고리 및 단가 정보
              </h3>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[var(--dark)]">카테고리 (다중 선택)</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {CATEGORY_OPTIONS.map((cat) => {
                      const isSelected = formData.categories.includes(cat)
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => handleCategoryToggle(cat)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[var(--green)] border-[var(--dark)] text-[var(--dark)]'
                              : 'bg-[var(--white)] border-[var(--dark)] text-[var(--dark)] hover:bg-[var(--gray)]'
                          }`}
                        >
                          {cat} {isSelected && '✓'}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[var(--dark)]">최소 제안 단가 (원)</label>
                    <input
                      type="number"
                      placeholder="예: 600000"
                      value={formData.min_fee}
                      onChange={(e) => setFormData({ ...formData, min_fee: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dark)] bg-[var(--white)] text-sm font-sans focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[var(--dark)]">최대 제안 단가 (원)</label>
                    <input
                      type="number"
                      placeholder="예: 1000000"
                      value={formData.max_fee}
                      onChange={(e) => setFormData({ ...formData, max_fee: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dark)] bg-[var(--white)] text-sm font-sans focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 메모 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--dark)]">운영 메모</label>
              <textarea
                rows={4}
                placeholder="인플루언서 성향, 협업 시 주의사항 등 특이사항을 적어주세요."
                value={formData.memo}
                onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                className="w-full p-3.5 rounded-xl border border-[var(--dark)] bg-[var(--white)] text-sm font-sans focus:outline-none resize-none"
              />
            </div>

            {/* Submit buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Link href="/influencers" className="btn btn-ghost font-sans">
                취소
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-green font-sans cursor-pointer"
              >
                {isSubmitting ? '등록 중...' : '인플루언서 등록'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
