'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Header } from '@/components/layout/Header'

const CATEGORY_OPTIONS = ['푸드', '리빙', '뷰티', '패션', 'IT/테크', '육아', '여행', '기타']

export default function NewInfluencerPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    handle: '',
    email: '',
    phone: '',
    channel: 'instagram',
    channel_url: '',
    followers: '',
    categories: ['푸드'] as string[],
    min_fee: '',
    max_fee: '',
    memo: '',
  })

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
    try {
      const res = await fetch('/api/influencers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          handle: formData.handle,
          email: formData.email,
          phone: formData.phone,
          channel: formData.channel,
          channel_url: formData.channel_url,
          followers: formData.followers ? Number(formData.followers) : 0,
          category: formData.categories.join('·') || '기타',
          fee: formData.min_fee ? Number(formData.min_fee) : 0,
          min_fee: formData.min_fee ? Number(formData.min_fee) : 0,
          max_fee: formData.max_fee ? Number(formData.max_fee) : 0,
          memo: formData.memo,
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <label className="text-xs font-bold text-[var(--dark)]">핸들 (@아이디)</label>
                  <input
                    type="text"
                    placeholder="예: @yuri_cooks"
                    value={formData.handle}
                    onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
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

            {/* 채널 및 성능 정보 */}
            <div>
              <h3 className="text-base font-bold text-[var(--dark)] mb-4 border-b pb-2">
                채널 및 지표 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[var(--dark)]">주요 채널</label>
                  <select
                    value={formData.channel}
                    onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dark)] bg-[var(--white)] text-sm font-sans focus:outline-none"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="youtube">YouTube</option>
                    <option value="tiktok">TikTok</option>
                    <option value="blog">Naver Blog</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[var(--dark)]">채널 URL</label>
                  <input
                    type="url"
                    placeholder="https://instagram.com/yuri_cooks"
                    value={formData.channel_url}
                    onChange={(e) => setFormData({ ...formData, channel_url: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dark)] bg-[var(--white)] text-sm font-sans focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-[var(--dark)]">팔로워 (구독자) 수</label>
                  <input
                    type="number"
                    placeholder="예: 125000"
                    value={formData.followers}
                    onChange={(e) => setFormData({ ...formData, followers: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dark)] bg-[var(--white)] text-sm font-sans focus:outline-none"
                  />
                </div>
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
