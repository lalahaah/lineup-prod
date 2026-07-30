'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Header } from '@/components/layout/Header'

const ASSIGNEE_OPTIONS = ['김현우', '이소연', '박지수']
const GOAL_OPTIONS = [
  { id: 'awareness', label: '브랜드 인지' },
  { id: 'review', label: '제품 리뷰' },
  { id: 'conversion', label: '구매 전환' },
]
const CHANNEL_OPTIONS = ['인스타그램', '유튜브', '틱톡', '블로그']
const CATEGORY_OPTIONS = ['푸드', '뷰티', '패션', '라이프', '테크', '기타']

export default function NewCampaignPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [clientOptions, setClientOptions] = useState<string[]>(['CUCKOO', '유한킴벌리', 'CJ올리브영'])

  // 폼 상태
  const [formData, setFormData] = useState({
    client_name: 'CUCKOO',
    title: '',
    product_name: '',
    product_description: '',
    goal: 'awareness',
    channels: ['인스타그램'],
    target_influencers_count: '5',
    categories: ['푸드'],
    content_direction: '',
    prohibitions: '',
    shipping_date: '',
    content_deadline: '',
    upload_deadline: '',
    assignee: '김현우',
    budget: '',
  })

  useEffect(() => {
    async function loadClients() {
      try {
        const res = await fetch('/api/clients')
        if (res.ok) {
          const json = await res.json()
          const list = Array.isArray(json) ? json : json.data || []
          if (list.length > 0) {
            const names = list.map((c: any) => c.name)
            setClientOptions(names)
            setFormData((prev) => ({
              ...prev,
              client_name: prev.client_name && names.includes(prev.client_name) ? prev.client_name : names[0]
            }))
          }
        }
      } catch (err) {
        console.error('Error fetching clients for dropdown:', err)
      }
    }
    loadClients()
  }, [])

  const handleChannelToggle = (channel: string) => {
    if (formData.channels.includes(channel)) {
      setFormData({
        ...formData,
        channels: formData.channels.filter((c) => c !== channel),
      })
    } else {
      setFormData({
        ...formData,
        channels: [...formData.channels, channel],
      })
    }
  }

  const handleCategoryToggle = (category: string) => {
    if (formData.categories.includes(category)) {
      setFormData({
        ...formData,
        categories: formData.categories.filter((c) => c !== category),
      })
    } else {
      setFormData({
        ...formData,
        categories: [...formData.categories, category],
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error('캠페인명을 입력해주세요.')
      return
    }
    if (!formData.product_name.trim()) {
      toast.error('제품명을 입력해주세요.')
      return
    }
    if (!formData.content_deadline) {
      toast.error('원고 제출 마감일을 선택해주세요.')
      return
    }
    if (!formData.upload_deadline) {
      toast.error('업로드 희망일을 선택해주세요.')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: formData.client_name,
          title: formData.title,
          product_name: formData.product_name,
          product_description: formData.product_description,
          goal: formData.goal,
          channels: formData.channels,
          target_influencers_count: Number(formData.target_influencers_count) || 0,
          categories: formData.categories,
          content_direction: formData.content_direction,
          prohibitions: formData.prohibitions,
          shipping_date: formData.shipping_date || null,
          content_deadline: formData.content_deadline,
          upload_deadline: formData.upload_deadline,
          assignee: formData.assignee,
          budget: formData.budget ? Number(formData.budget) : null,
        }),
      })

      if (res.ok) {
        toast.success('새 캠페인이 성공적으로 생성되었습니다.')
        router.push('/campaigns')
        router.refresh()
      } else {
        toast.error('캠페인 생성에 실패했습니다.')
      }
    } catch (error) {
      console.error('Error submitting new campaign:', error)
      toast.error('오류가 발생했습니다. 다시 시도해 주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Input & Label 커스텀 스타일
  const cardStyle: React.CSSProperties = {
    background: 'var(--white)',
    border: '1px solid var(--dark)',
    borderRadius: '28px',
    boxShadow: '0 4px 0 0 var(--dark)',
    padding: '26px',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '14px',
    color: 'var(--muted)',
    marginBottom: '6px',
    display: 'block',
    fontWeight: 500,
  }

  const inputStyle: React.CSSProperties = {
    border: '1px solid var(--dark)',
    borderRadius: '12px',
    padding: '11px 16px',
    fontFamily: 'inherit',
    fontSize: '15px',
    width: '100%',
    background: 'var(--white)',
    outline: 'none',
  }

  return (
    <div className="main select-none">
      <Header
        title="새 캠페인 생성"
        subTitle="새로운 인플루언서 캠페인 정보와 브리핑 일정을 입력하세요."
      />

      <div className="content">
        <div className="mb-4">
          <Link
            href="/campaigns"
            className="text-xs font-semibold text-[var(--muted)] hover:text-[var(--dark)] transition-colors inline-flex items-center gap-1"
          >
            ← 목록으로 돌아가기
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 2열 그리드 레이아웃 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 좌측 카드: 기본 정보 */}
            <div style={cardStyle} className="flex flex-col gap-5">
              <h2 className="text-lg font-bold text-[var(--dark)] border-b pb-3">기본 정보</h2>

              {/* 광고주 선택 */}
              <div>
                <label style={labelStyle}>광고주 선택</label>
                <select
                  style={inputStyle}
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                >
                  {clientOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* 캠페인명 */}
              <div>
                <label style={labelStyle}>
                  캠페인명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  style={inputStyle}
                  placeholder="예: 쿠쿠 트윈프레셔 신제품 런칭"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              {/* 제품명 */}
              <div>
                <label style={labelStyle}>
                  제품명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  style={inputStyle}
                  placeholder="예: 트윈프레셔 마스터셰프 밥솥"
                  value={formData.product_name}
                  onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                />
              </div>

              {/* 제품 설명 */}
              <div>
                <label style={labelStyle}>제품 설명</label>
                <textarea
                  rows={3}
                  style={{ ...inputStyle, resize: 'none' }}
                  placeholder="제품의 주요 기능과 특징을 간략히 작성해 주세요."
                  value={formData.product_description}
                  onChange={(e) =>
                    setFormData({ ...formData, product_description: e.target.value })
                  }
                />
              </div>

              {/* 캠페인 목표 (라디오 3개) */}
              <div>
                <label style={labelStyle}>캠페인 목표</label>
                <div className="flex items-center gap-4 mt-1">
                  {GOAL_OPTIONS.map((g) => (
                    <label
                      key={g.id}
                      className="inline-flex items-center gap-2 cursor-pointer text-sm font-medium text-[var(--dark)]"
                    >
                      <input
                        type="radio"
                        name="campaign_goal"
                        value={g.id}
                        checked={formData.goal === g.id}
                        onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                        className="accent-[var(--dark)]"
                      />
                      {g.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* 희망 채널 (체크박스 멀티) */}
              <div>
                <label style={labelStyle}>희망 채널</label>
                <div className="flex flex-wrap gap-3 mt-1">
                  {CHANNEL_OPTIONS.map((ch) => {
                    const isChecked = formData.channels.includes(ch)
                    return (
                      <label
                        key={ch}
                        className="inline-flex items-center gap-2 cursor-pointer text-sm font-medium text-[var(--dark)]"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleChannelToggle(ch)}
                          className="accent-[var(--dark)]"
                        />
                        {ch}
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* 희망 인플루언서 수 */}
              <div>
                <label style={labelStyle}>희망 인플루언서 수</label>
                <input
                  type="number"
                  min="1"
                  style={inputStyle}
                  placeholder="예: 5"
                  value={formData.target_influencers_count}
                  onChange={(e) =>
                    setFormData({ ...formData, target_influencers_count: e.target.value })
                  }
                />
              </div>

              {/* 카테고리 (체크박스 멀티) */}
              <div>
                <label style={labelStyle}>카테고리</label>
                <div className="flex flex-wrap gap-3 mt-1">
                  {CATEGORY_OPTIONS.map((cat) => {
                    const isChecked = formData.categories.includes(cat)
                    return (
                      <label
                        key={cat}
                        className="inline-flex items-center gap-2 cursor-pointer text-sm font-medium text-[var(--dark)]"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleCategoryToggle(cat)}
                          className="accent-[var(--dark)]"
                        />
                        {cat}
                      </label>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* 우측 영역: 3개 카드 (콘텐츠 가이드, 일정, 운영 설정) */}
            <div className="flex flex-col gap-4">
              {/* 우측 카드 1: 콘텐츠 가이드 */}
              <div style={cardStyle} className="flex flex-col gap-4">
                <h2 className="text-lg font-bold text-[var(--dark)] border-b pb-3">콘텐츠 가이드</h2>

                <div>
                  <label style={labelStyle}>콘텐츠 방향성</label>
                  <textarea
                    rows={3}
                    style={{ ...inputStyle, resize: 'none' }}
                    placeholder="제품의 어떤 점을 강조할까요?"
                    value={formData.content_direction}
                    onChange={(e) =>
                      setFormData({ ...formData, content_direction: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label style={labelStyle}>금지사항</label>
                  <textarea
                    rows={2}
                    style={{ ...inputStyle, resize: 'none' }}
                    placeholder="경쟁사 언급 금지 등"
                    value={formData.prohibitions}
                    onChange={(e) =>
                      setFormData({ ...formData, prohibitions: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* 우측 카드 2: 일정 */}
              <div style={cardStyle} className="flex flex-col gap-4">
                <h2 className="text-lg font-bold text-[var(--dark)] border-b pb-3">일정</h2>

                <div>
                  <label style={labelStyle}>제품 발송 예정일</label>
                  <input
                    type="date"
                    style={inputStyle}
                    value={formData.shipping_date}
                    onChange={(e) =>
                      setFormData({ ...formData, shipping_date: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    원고 제출 마감일 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    style={inputStyle}
                    value={formData.content_deadline}
                    onChange={(e) =>
                      setFormData({ ...formData, content_deadline: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    업로드 희망일 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    style={inputStyle}
                    value={formData.upload_deadline}
                    onChange={(e) =>
                      setFormData({ ...formData, upload_deadline: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* 우측 카드 3: 운영 설정 */}
              <div style={cardStyle} className="flex flex-col gap-4">
                <h2 className="text-lg font-bold text-[var(--dark)] border-b pb-3">운영 설정</h2>

                <div>
                  <label style={labelStyle}>담당자 배정</label>
                  <select
                    style={inputStyle}
                    value={formData.assignee}
                    onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                  >
                    {ASSIGNEE_OPTIONS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>예산 (선택, 내부 참고용)</label>
                  <input
                    type="number"
                    style={inputStyle}
                    placeholder="₩ 내부 참고용 (광고주 미노출)"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 하단 버튼 영역 */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <Link href="/campaigns" className="btn btn-ghost font-sans">
              취소
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-green font-sans cursor-pointer"
            >
              {isSubmitting ? '생성 중...' : '캠페인 생성'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
