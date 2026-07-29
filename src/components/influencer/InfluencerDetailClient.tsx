'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { AddToCampaignModal } from '@/components/influencer/AddToCampaignModal'
import { EmptyState } from '@/components/shared/EmptyState'
import type { InfluencerDetailItem } from '@/app/api/influencers/[id]/route'

interface InfluencerDetailClientProps {
  influencer: InfluencerDetailItem
}

export function InfluencerDetailClient({ influencer: initialData }: InfluencerDetailClientProps) {
  const router = useRouter()
  const [influencer, setInfluencer] = useState<InfluencerDetailItem>(initialData)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUpdatingBlacklist, setIsUpdatingBlacklist] = useState(false)

  const handleToggleBlacklist = async () => {
    setIsUpdatingBlacklist(true)
    const newBlacklistedState = !influencer.is_blacklisted
    try {
      const res = await fetch(`/api/influencers/${influencer.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_blacklisted: newBlacklistedState,
          status: newBlacklistedState ? 'blacklisted' : 'uncontacted',
          status_label: newBlacklistedState ? '블랙리스트' : '미접촉',
        }),
      })

      if (res.ok) {
        const updated = await res.json()
        setInfluencer(updated)
        toast.success(
          newBlacklistedState ? '블랙리스트로 등록되었습니다' : '블랙리스트가 해제되었습니다'
        )
      } else {
        toast.error('상태 변경에 실패했습니다')
      }
    } catch (error) {
      console.error(error)
      toast.error('오류가 발생했습니다')
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
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <span className={`av ${influencer.avatar_color_class || 'c1'}`}>
              {influencer.avatar_initial}
            </span>
            <div>
              <h1 className="text-2xl font-bold text-[var(--dark)] flex items-center gap-2">
                {influencer.name}
                <span className="text-sm font-normal text-[var(--muted)]">{influencer.handle}</span>
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

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="btn btn-green cursor-pointer font-sans"
            >
              캠페인에 추가
            </button>
            <button
              type="button"
              onClick={() => toast.info('편집 기능이 준비 중입니다')}
              className="btn btn-ghost cursor-pointer font-sans"
            >
              편집
            </button>
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
                      <span className="font-semibold text-[var(--dark)]">{influencer.handle}</span>
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
                      <span className="text-[var(--muted)] block text-xs">주요 채널</span>
                      <span className="font-semibold text-[var(--dark)]">{influencer.channel_label}</span>
                    </div>
                    <div>
                      <span className="text-[var(--muted)] block text-xs">팔로워 수</span>
                      <span className="font-semibold text-[var(--dark)]">{influencer.followers_formatted}</span>
                    </div>
                    <div>
                      <span className="text-[var(--muted)] block text-xs">평균 참여율</span>
                      <span className="font-semibold text-[var(--dark)]">{influencer.engagement_rate_formatted}</span>
                    </div>
                    <div>
                      <span className="text-[var(--muted)] block text-xs">제안 단가 범위</span>
                      <span className="font-semibold text-[var(--dark)]">{influencer.fee_range_formatted || influencer.fee_formatted}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[var(--muted)] block text-xs mb-1.5">카테고리 태그</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(influencer.categories_list || [influencer.category]).map((cat, i) => (
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
                    <textarea
                      rows={4}
                      defaultValue={influencer.memo || ''}
                      placeholder="특이사항이나 매니저 메모를 작성하세요."
                      className="w-full p-3 rounded-xl border border-[var(--dark)] bg-[var(--white)] text-sm font-sans focus:outline-none resize-none"
                    />
                  </div>

                  <div className="pt-2 border-t flex justify-end">
                    <button
                      type="button"
                      disabled={isUpdatingBlacklist}
                      onClick={handleToggleBlacklist}
                      className="px-4 py-2 rounded-xl text-sm font-bold border border-[#E08A80] bg-[#FFD5D0] text-[var(--dark)] hover:bg-[#ffbabb] transition-colors cursor-pointer"
                    >
                      {influencer.is_blacklisted ? '블랙리스트 해제' : '블랙리스트 등록'}
                    </button>
                  </div>
                </div>
              </div>
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
    </div>
  )
}
