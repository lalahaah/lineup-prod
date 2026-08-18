'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { CampaignStepper } from '@/components/campaign/CampaignStepper'
import type { CampaignDetailData } from '@/app/api/campaigns/[id]/route'
import type { CampaignInfluencerDetail } from '@/app/api/campaigns/[id]/influencers/route'
import { STAGE_LABELS, STAGE_COLORS, CI_STATUS_LABELS, type CampaignStage, type CIStatus } from '@/types'
import { CHANNEL_LABELS } from '@/lib/utils'

interface CampaignDetailClientProps {
  campaign: CampaignDetailData
  influencers: CampaignInfluencerDetail[]
}

const AVATAR_COLORS = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6']

function getInfluencerInfo(ci: CampaignInfluencerDetail) {
  const inf = ci.influencer || (ci as any)
  return {
    id: inf.id || (ci as any).influencer_id || '',
    name: inf.name || (ci as any).name || '알 수 없음',
    handle: inf.handle || (ci as any).handle || null,
    primaryChannel: inf.primary_channel || (ci as any).channel || 'instagram',
    followers: inf.followers || (ci as any).followers,
    feeMin: inf.fee_min,
    feeMax: inf.fee_max,
  }
}

function formatFollowers(followers: any, primaryChannel?: string | null): string {
  let count = 0
  if (typeof followers === 'number') {
    count = followers
  } else if (typeof followers === 'string') {
    const parsed = Number(followers)
    if (!isNaN(parsed)) {
      count = parsed
    } else {
      return followers
    }
  } else if (followers && typeof followers === 'object') {
    const key = primaryChannel || 'instagram'
    const val = followers[key] ?? followers['instagram'] ?? followers['youtube'] ?? followers['tiktok'] ?? 0
    if (typeof val === 'number') {
      count = val
    } else if (typeof val === 'string') {
      const parsed = Number(val)
      if (!isNaN(parsed)) {
        count = parsed
      } else {
        return val
      }
    }
  }

  if (!count || count === 0) return '0'
  if (count >= 10000) {
    const man = count / 10000
    return Number.isInteger(man) ? `${man}만` : `${parseFloat(man.toFixed(1))}만`
  }
  return count.toLocaleString('ko-KR')
}

function formatFee(proposedFee?: number | null, feeMin?: number | null, feeMax?: number | null): string {
  if (proposedFee !== undefined && proposedFee !== null && proposedFee > 0) {
    if (proposedFee >= 10000) {
      const man = proposedFee / 10000
      return Number.isInteger(man) ? `₩${man}만` : `₩${parseFloat(man.toFixed(1))}만`
    }
    return `₩${proposedFee.toLocaleString()}`
  }

  const hasMin = feeMin !== undefined && feeMin !== null && feeMin > 0
  const hasMax = feeMax !== undefined && feeMax !== null && feeMax > 0

  if (hasMin && hasMax) {
    const minStr = feeMin >= 10000 ? `${Number.isInteger(feeMin / 10000) ? feeMin / 10000 : parseFloat((feeMin / 10000).toFixed(1))}만` : `${feeMin.toLocaleString()}원`
    const maxStr = feeMax >= 10000 ? `${Number.isInteger(feeMax / 10000) ? feeMax / 10000 : parseFloat((feeMax / 10000).toFixed(1))}만` : `${feeMax.toLocaleString()}원`
    if (minStr === maxStr) return `₩${minStr}`
    return `₩${minStr} ~ ₩${maxStr}`
  } else if (hasMin) {
    const minStr = feeMin >= 10000 ? `${Number.isInteger(feeMin / 10000) ? feeMin / 10000 : parseFloat((feeMin / 10000).toFixed(1))}만` : `${feeMin.toLocaleString()}원`
    return `₩${minStr}~`
  } else if (hasMax) {
    const maxStr = feeMax >= 10000 ? `${Number.isInteger(feeMax / 10000) ? feeMax / 10000 : parseFloat((feeMax / 10000).toFixed(1))}만` : `${feeMax.toLocaleString()}원`
    return `~₩${maxStr}`
  }

  return '미정'
}

function renderChannelBadge(primaryChannel?: string | null) {
  const ch = primaryChannel || 'instagram'
  const label = CHANNEL_LABELS[ch] || ch

  return (
    <span className="row" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
      {ch === 'instagram' && (
        <span className="ch-ico ig">
          <svg viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="5" stroke="#fff" strokeWidth="1.8" />
            <circle cx="12" cy="12" r="4" stroke="#fff" strokeWidth="1.8" />
            <circle cx="17.5" cy="6.5" r="1.2" fill="#fff" />
          </svg>
        </span>
      )}
      {ch === 'youtube' && (
        <span className="ch-ico yt">
          <svg viewBox="0 0 24 24" fill="#fff">
            <path d="M5 7l14 .2c1 0 1.6.6 1.7 1.6.2 2 .2 4.4 0 6.4-.1 1-.7 1.6-1.7 1.6L5 17c-1 0-1.6-.6-1.7-1.6-.2-2-.2-4.4 0-6.4C3.4 7.6 4 7 5 7zm5 2.2v5.6l5-2.8z" />
          </svg>
        </span>
      )}
      {ch === 'tiktok' && (
        <span className="ch-ico tt">
          <svg viewBox="0 0 24 24" fill="#fff">
            <path d="M14 4c.3 2 1.6 3.6 3.6 3.9v2.3c-1.3.1-2.5-.3-3.6-1v5.4a4.8 4.8 0 1 1-4.8-4.8c.3 0 .5 0 .8.1v2.4a2.4 2.4 0 1 0 1.7 2.3V4H14z" />
          </svg>
        </span>
      )}
      <span>{label}</span>
    </span>
  )
}

function renderStatusBadge(status: string) {
  switch (status) {
    case 'candidate':
      return <span className="badge soft">후보</span>
    case 'selected':
      return <span className="badge green">선택</span>
    case 'confirmed':
      return <span className="badge dark">확정</span>
    default:
      return <span className="badge gray">{CI_STATUS_LABELS[status as CIStatus] || status}</span>
  }
}

export function CampaignDetailClient({ campaign: initialCampaign, influencers: initialInfluencers }: CampaignDetailClientProps) {
  const router = useRouter()
  const [campaign, setCampaign] = useState<CampaignDetailData>(initialCampaign)
  const safeInfluencers = Array.isArray(initialInfluencers) ? initialInfluencers : []
  const [influencers, setInfluencers] = useState<CampaignInfluencerDetail[]>(safeInfluencers)
  const [activeTab, setActiveTab] = useState<'influencers' | 'guide' | 'review' | 'shipping' | 'billing'>('influencers')

  // Selected influencer for draft review tab
  const [selectedInfId, setSelectedInfId] = useState<string>(safeInfluencers[0]?.id || '')

  // Outreach Modal state
  const [isOutreachModalOpen, setIsOutreachModalOpen] = useState(false)
  const [isSendingOutreach, setIsSendingOutreach] = useState(false)

  // Selection for preparing table
  const [selectedPreparingIds, setSelectedPreparingIds] = useState<string[]>([])

  const currentStage = (campaign?.stage || 'preparing') as CampaignStage
  const currentInfluencer = (influencers || []).find((i) => i.id === selectedInfId) || (influencers || [])[0]

  const safeChannels = Array.isArray(campaign?.channels) ? campaign.channels : []
  const safeCategories = Array.isArray(campaign?.categories) ? campaign.categories : []
  const safeHashtags = Array.isArray(campaign?.hashtags) ? campaign.hashtags : safeCategories.length > 0 ? safeCategories : ['#신제품']

  // 1. 포털 링크 복사
  const handleCopyPortalLink = () => {
    const link = `${window.location.origin}/portal/${campaign?.portal_token || ''}`
    navigator.clipboard.writeText(link)
    toast.success('포털 링크가 복사됐습니다 🔗')
  }

  // 2. 준비중 -> 광고주 검토 단계 이동 (포털 링크 발송)
  const handleSendToClient = async () => {
    if (influencers.length === 0) {
      toast.error('최소 1명 이상의 인플루언서를 추가해 주세요.')
      return
    }

    try {
      const res = await fetch(`/api/campaigns/${campaign.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: 'client_review' }),
      })

      if (res.ok) {
        setCampaign((prev) => ({ ...prev, stage: 'client_review' }))
        handleCopyPortalLink()
        toast.success('포털 링크가 복사됐습니다. 광고주에게 전달해주세요 🔗')
      } else {
        toast.error('단계 변경 실패')
      }
    } catch (err) {
      console.error(err)
      toast.error('단계 변경 중 오류가 발생했습니다.')
    }
  }

  // 3. 광고주 검토 완료 -> 섭외중 단계 수동 이동
  const handleCompleteClientReview = async () => {
    try {
      const res = await fetch(`/api/campaigns/${campaign.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: 'outreaching' }),
      })

      if (res.ok) {
        setCampaign((prev) => ({ ...prev, stage: 'outreaching' }))
        toast.success('섭외중 단계로 이동했습니다 ✉️')
      }
    } catch (err) {
      console.error(err)
    }
  }

  // 4. 일괄 섭외 이메일 발송
  const handleBatchOutreach = async () => {
    const selectedList = influencers.filter((inf) => inf.status === 'selected' || (inf as any).badge_label === '선택' || true)
    if (selectedList.length === 0) {
      toast.error('섭외할 인플루언서가 없습니다.')
      return
    }

    setIsSendingOutreach(true)

    try {
      const res = await fetch(`/api/campaigns/${campaign.id}/influencers/batch/outreach`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ influencer_ids: selectedList.map((i) => i.id) }),
      })

      if (res.ok) {
        const data = await res.json()
        toast.success(`${data.sentCount || selectedList.length}명에게 섭외 이메일을 발송했습니다 📧`)
        setIsOutreachModalOpen(false)
        setInfluencers((prev) =>
          prev.map((item) =>
            item.status === 'selected'
              ? { ...item, status: 'outreached' }
              : item
          )
        )
      } else {
        toast.error('섭외 이메일 발송 실패')
      }
    } catch (err) {
      console.error(err)
      toast.error('오류가 발생했습니다.')
    } finally {
      setIsSendingOutreach(false)
    }
  }

  // 5. 섭외중 -> 원고 검수 단계 이동
  const handleMoveToReviewing = async () => {
    try {
      const res = await fetch(`/api/campaigns/${campaign.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: 'reviewing' }),
      })

      if (res.ok) {
        setCampaign((prev) => ({ ...prev, stage: 'reviewing' }))
        setActiveTab('review')
        toast.success('원고 검수 단계로 이동했습니다 📝')
      }
    } catch (err) {
      console.error(err)
    }
  }

  // 삭제 액션 (candidate 상태만 삭제 가능, 확인 모달 없이 바로 삭제)
  const handleDeleteInfluencer = async (ciId: string) => {
    try {
      const res = await fetch(`/api/campaigns/${campaign.id}/influencers/${ciId}`, {
        method: 'DELETE',
      })
      const result = await res.json()
      if (!res.ok) {
        toast.error(result.error || '인플루언서 삭제에 실패했습니다.')
        return
      }
      setInfluencers((prev) => prev.filter((i) => i.id !== ciId))
      setSelectedPreparingIds((prev) => prev.filter((id) => id !== ciId))
      toast.success('인플루언서가 삭제되었습니다.')
    } catch (error) {
      console.error('Error deleting influencer:', error)
      toast.error('인플루언서 삭제 중 오류가 발생했습니다.')
    }
  }

  // Draft review actions
  const handleApproveDraft = () => {
    if (!currentInfluencer) return
    const currentInfo = getInfluencerInfo(currentInfluencer)
    setInfluencers((prev) =>
      prev.map((item) =>
        item.id === currentInfluencer.id
          ? { ...item, status: 'confirmed' }
          : item
      )
    )
    toast.success(`${currentInfo.name} 님의 원고를 승인했습니다.`)
  }

  const handleRequestRevision = () => {
    if (!currentInfluencer) return
    const currentInfo = getInfluencerInfo(currentInfluencer)
    toast.info(`${currentInfo.name} 님에게 수정 요청을 전달했습니다.`)
  }

  const handleRejectDraft = () => {
    if (!currentInfluencer) return
    const currentInfo = getInfluencerInfo(currentInfluencer)
    toast.error(`${currentInfo.name} 님의 원고를 반려했습니다.`)
  }

  return (
    <div className="main select-none">
      {/* Top Header */}
      <header className="topbar">
        <div className="h">
          <Link href="/campaigns" className="back">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M15 6l-6 6 6 6" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            캠페인
          </Link>
          <h1 className="font-bold text-2xl tracking-tight text-[var(--dark)]">
            {campaign?.title || '캠페인 상세'}
          </h1>
        </div>
        <div className="spacer" />
        <span className="badge dark">{campaign?.client || '광고주'}</span>
        <span className={`dday ${campaign?.dday_variant === 'hot' ? 'hot' : 'warm'}`}>
          {campaign?.dday || '마감 D-day'}
        </span>
        <span
          className="badge"
          style={{
            background: STAGE_COLORS[currentStage] || 'var(--gray)',
            color: 'var(--dark)',
            fontWeight: 600,
          }}
        >
          {STAGE_LABELS[currentStage] || currentStage}
        </span>
        <button
          type="button"
          onClick={handleCopyPortalLink}
          className="btn btn-ghost font-sans cursor-pointer"
        >
          포털 링크 복사
        </button>
      </header>

      {/* Main Content */}
      <div className="content">
        {/* Stepper Card */}
        <div
          className="card stepper-card"
          style={{
            background: 'var(--white)',
            border: '1px solid var(--dark)',
            borderRadius: 'var(--r-lg)',
            boxShadow: 'var(--shadow)',
          }}
        >
          <div className="row between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div className="row" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                className="pill"
                style={{
                  background: 'var(--green)',
                  borderRadius: '6px',
                  padding: '1px 9px',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: 'var(--dark)',
                }}
              >
                현재 단계
              </span>
              <b style={{ fontSize: '16px' }}>{STAGE_LABELS[currentStage]}</b>
            </div>
            <span className="muted" style={{ fontSize: '13px' }}>
              담당 {campaign?.assignee || '담당자'} · 인플루언서 {influencers.length}명
            </span>
          </div>

          <CampaignStepper currentStage={currentStage} />
        </div>

        {/* Tab Switcher */}
        <div className="filt flex items-center gap-2 mb-6 border-b pb-3">
          <div className="seg">
            <button
              type="button"
              className={activeTab === 'influencers' ? 'on' : ''}
              onClick={() => setActiveTab('influencers')}
            >
              인플루언서 ({influencers.length})
            </button>
            <button
              type="button"
              className={activeTab === 'guide' ? 'on' : ''}
              onClick={() => setActiveTab('guide')}
            >
              캠페인 정보
            </button>
            <button
              type="button"
              className={activeTab === 'review' ? 'on' : ''}
              onClick={() => setActiveTab('review')}
            >
              원고 검수
            </button>
            <button
              type="button"
              className={activeTab === 'shipping' ? 'on' : ''}
              onClick={() => setActiveTab('shipping')}
            >
              배송
            </button>
            <button
              type="button"
              className={activeTab === 'billing' ? 'on' : ''}
              onClick={() => setActiveTab('billing')}
            >
              정산
            </button>
          </div>
        </div>

        {/* 탭 1: 인플루언서 (핵심 - 스테이지별 다름) */}
        {activeTab === 'influencers' && (
          <div className="flex flex-col gap-6">
            {/* 1. 준비중 (preparing) */}
            {currentStage === 'preparing' && (
              <div
                className="card card-pad"
                style={{
                  background: 'var(--white)',
                  border: '1px solid var(--dark)',
                  borderRadius: 'var(--r-lg)',
                  boxShadow: 'var(--shadow)',
                  padding: '24px',
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-[var(--dark)]">인플루언서 리스트업 (준비중)</h2>
                    <p className="text-xs text-[var(--muted)]">광고주에게 전달할 인플루언서 후보를 선택하세요.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push('/influencers')}
                    className="btn btn-ghost font-sans text-xs cursor-pointer"
                  >
                    + 인플루언서 추가
                  </button>
                </div>

                <div className="overflow-x-auto border border-[var(--dark)] rounded-xl mb-4">
                  <table className="tbl w-full">
                    <thead>
                      <tr>
                        <th className="w-10 text-center">
                          <input
                            type="checkbox"
                            checked={selectedPreparingIds.length > 0 && selectedPreparingIds.length === influencers.length}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedPreparingIds(influencers.map((i) => i.id))
                              } else {
                                setSelectedPreparingIds([])
                              }
                            }}
                          />
                        </th>
                        <th>이름 / 핸들</th>
                        <th>채널</th>
                        <th className="right">팔로워</th>
                        <th className="right">단가</th>
                        <th>상태</th>
                        <th className="text-center">삭제</th>
                      </tr>
                    </thead>
                    <tbody>
                      {influencers.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-8 text-gray-500">
                            리스트업된 인플루언서가 없습니다. "+ 인플루언서 추가" 버튼을 눌러 추가하세요.
                          </td>
                        </tr>
                      ) : (
                        influencers.map((inf, idx) => {
                          const infData = getInfluencerInfo(inf)
                          const avatarInitial = infData.name ? infData.name[0] : '?'
                          const avatarColorClass = AVATAR_COLORS[idx % AVATAR_COLORS.length]

                          return (
                            <tr key={inf.id}>
                              <td className="text-center">
                                <input
                                  type="checkbox"
                                  checked={selectedPreparingIds.includes(inf.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedPreparingIds([...selectedPreparingIds, inf.id])
                                    } else {
                                      setSelectedPreparingIds(selectedPreparingIds.filter((id) => id !== inf.id))
                                    }
                                  }}
                                />
                              </td>
                              <td>
                                <div className="flex items-center gap-2">
                                  <span className={`av ${avatarColorClass}`}>{avatarInitial}</span>
                                  <div>
                                    <div className="font-bold">{infData.name}</div>
                                    {infData.handle && (
                                      <div className="text-xs text-[var(--muted)]">{infData.handle}</div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td>{renderChannelBadge(infData.primaryChannel)}</td>
                              <td className="right font-semibold">
                                {formatFollowers(infData.followers, infData.primaryChannel)}
                              </td>
                              <td className="right font-semibold">
                                {formatFee(inf.proposed_fee, infData.feeMin, infData.feeMax)}
                              </td>
                              <td>{renderStatusBadge(inf.status)}</td>
                              <td className="text-center">
                                {inf.status === 'candidate' ? (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteInfluencer(inf.id)}
                                    className="text-xs text-red-500 font-bold hover:underline cursor-pointer"
                                  >
                                    삭제
                                  </button>
                                ) : (
                                  <span className="text-xs text-[var(--muted)]">-</span>
                                )}
                              </td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-end pt-3 border-t">
                  <button
                    type="button"
                    disabled={influencers.length === 0}
                    onClick={handleSendToClient}
                    className="btn btn-green font-sans cursor-pointer"
                    style={{ opacity: influencers.length === 0 ? 0.5 : 1 }}
                  >
                    🚀 광고주에게 보내기 ({influencers.length}명)
                  </button>
                </div>
              </div>
            )}

            {/* 2. 광고주 검토 (client_review) */}
            {currentStage === 'client_review' && (
              <div
                className="card card-pad"
                style={{
                  background: 'var(--white)',
                  border: '1px solid var(--dark)',
                  borderRadius: 'var(--r-lg)',
                  boxShadow: 'var(--shadow)',
                  padding: '24px',
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-[var(--dark)]">광고주 검토 진행 중</h2>
                    <p className="text-xs text-[var(--muted)]">광고주가 포털에서 인플루언서를 선택/패스하고 있습니다.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => window.open(`/portal/${campaign.portal_token}`, '_blank')}
                      className="btn btn-ghost font-sans text-xs cursor-pointer"
                    >
                      🔗 광고주 포털 열기
                    </button>
                    <button
                      type="button"
                      onClick={handleCompleteClientReview}
                      className="btn btn-green font-sans text-xs cursor-pointer"
                    >
                      ✓ 광고주 선택 완료
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto border border-[var(--dark)] rounded-xl">
                  <table className="tbl w-full">
                    <thead>
                      <tr>
                        <th>이름 / 핸들</th>
                        <th>채널</th>
                        <th className="right">팔로워</th>
                        <th>광고주 선택 상태</th>
                      </tr>
                    </thead>
                    <tbody>
                      {influencers.map((inf, idx) => {
                        const infData = getInfluencerInfo(inf)
                        const avatarInitial = infData.name ? infData.name[0] : '?'
                        const avatarColorClass = AVATAR_COLORS[idx % AVATAR_COLORS.length]

                        const statusBadge =
                          inf.status === 'selected' ? (
                            <span className="badge soft">광고주 선택</span>
                          ) : inf.status === 'passed' ? (
                            <span className="badge danger">광고주 패스</span>
                          ) : (
                            <span className="badge gray">검토 대기</span>
                          )
                        return (
                          <tr key={inf.id}>
                            <td>
                              <div className="flex items-center gap-2">
                                <span className={`av ${avatarColorClass}`}>{avatarInitial}</span>
                                <div>
                                  <div className="font-bold">{infData.name}</div>
                                  {infData.handle && (
                                    <div className="text-xs text-[var(--muted)]">{infData.handle}</div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td>{renderChannelBadge(infData.primaryChannel)}</td>
                            <td className="right font-semibold">
                              {formatFollowers(infData.followers, infData.primaryChannel)}
                            </td>
                            <td>{statusBadge}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. 섭외중 (outreaching) */}
            {currentStage === 'outreaching' && (
              <div
                className="card card-pad"
                style={{
                  background: 'var(--white)',
                  border: '1px solid var(--dark)',
                  borderRadius: 'var(--r-lg)',
                  boxShadow: 'var(--shadow)',
                  padding: '24px',
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-[var(--dark)]">인플루언서 섭외 진행 중</h2>
                    <p className="text-xs text-[var(--muted)]">광고주가 선택한 인플루언서에게 섭외 요청을 발송하세요.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsOutreachModalOpen(true)}
                    className="btn btn-green font-sans text-xs cursor-pointer"
                  >
                    ✉️ 일괄 섭외 이메일 발송
                  </button>
                </div>

                <div className="overflow-x-auto border border-[var(--dark)] rounded-xl mb-4">
                  <table className="tbl w-full">
                    <thead>
                      <tr>
                        <th>이름 / 핸들</th>
                        <th>채널</th>
                        <th className="right">단가</th>
                        <th>섭외 상태</th>
                      </tr>
                    </thead>
                    <tbody>
                      {influencers.map((inf, idx) => {
                        const infData = getInfluencerInfo(inf)
                        const avatarInitial = infData.name ? infData.name[0] : '?'
                        const avatarColorClass = AVATAR_COLORS[idx % AVATAR_COLORS.length]

                        const statusBadge =
                          inf.status === 'confirmed' ? (
                            <span className="badge soft">✓ 섭외 확정</span>
                          ) : inf.status === 'rejected' ? (
                            <span className="badge danger">✕ 거절</span>
                          ) : (
                            <span className="badge warn">⏳ 응답 대기</span>
                          )
                        return (
                          <tr key={inf.id}>
                            <td>
                              <div className="flex items-center gap-2">
                                <span className={`av ${avatarColorClass}`}>{avatarInitial}</span>
                                <div>
                                  <div className="font-bold">{infData.name}</div>
                                  {infData.handle && (
                                    <div className="text-xs text-[var(--muted)]">{infData.handle}</div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td>{renderChannelBadge(infData.primaryChannel)}</td>
                            <td className="right font-semibold">
                              {formatFee(inf.proposed_fee, infData.feeMin, infData.feeMax)}
                            </td>
                            <td>{statusBadge}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-end pt-3 border-t">
                  <button
                    type="button"
                    onClick={handleMoveToReviewing}
                    className="btn btn-green font-sans cursor-pointer"
                  >
                    원고 검수 단계로 이동 ➡️
                  </button>
                </div>
              </div>
            )}

            {/* 4. 원고검수 / 정산완료 */}
            {(currentStage === 'reviewing' || currentStage === 'done') && (
              <div
                className="card card-pad"
                style={{
                  background: 'var(--white)',
                  border: '1px solid var(--dark)',
                  borderRadius: 'var(--r-lg)',
                  boxShadow: 'var(--shadow)',
                  padding: '24px',
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[var(--dark)]">참여 인플루언서 목록</h2>
                  <span className="badge soft">전원 섭외 확정</span>
                </div>
                <div className="overflow-x-auto border border-[var(--dark)] rounded-xl">
                  <table className="tbl w-full">
                    <thead>
                      <tr>
                        <th>이름 / 핸들</th>
                        <th>채널</th>
                        <th className="right">단가</th>
                        <th>상태</th>
                      </tr>
                    </thead>
                    <tbody>
                      {influencers.map((inf, idx) => {
                        const infData = getInfluencerInfo(inf)
                        const avatarInitial = infData.name ? infData.name[0] : '?'
                        const avatarColorClass = AVATAR_COLORS[idx % AVATAR_COLORS.length]

                        return (
                          <tr key={inf.id}>
                            <td>
                              <div className="flex items-center gap-2">
                                <span className={`av ${avatarColorClass}`}>{avatarInitial}</span>
                                <div>
                                  <div className="font-bold">{infData.name}</div>
                                  {infData.handle && (
                                    <div className="text-xs text-[var(--muted)]">{infData.handle}</div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td>{renderChannelBadge(infData.primaryChannel)}</td>
                            <td className="right font-semibold">
                              {formatFee(inf.proposed_fee, infData.feeMin, infData.feeMax)}
                            </td>
                            <td>
                              <span className="badge soft">
                                {CI_STATUS_LABELS[inf.status as CIStatus] || '섭외 확정'}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 탭 2: 캠페인 정보 */}
        {activeTab === 'guide' && (
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
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>캠페인 상세 가이드</h2>
            <div className="grid-2" style={{ gap: '16px', marginBottom: '20px' }}>
              <div className="kv">
                <b>제품명</b>
                {campaign?.product_name || '-'}
              </div>
              <div className="kv">
                <b>진행 채널</b>
                {campaign?.channels_text || (safeChannels.length > 0 ? safeChannels.join(' / ') : '-')}
              </div>
              <div className="kv">
                <b>원고 마감일</b>
                {campaign?.content_deadline || '-'}
              </div>
              <div className="kv">
                <b>게시 기간</b>
                {campaign?.post_period || '-'}
              </div>
              <div className="kv">
                <b>예산</b>
                {campaign?.budget ? `₩${(campaign.budget / 10000).toFixed(0)}만원` : '-'}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <b>필수 해시태그:</b>
              {safeHashtags.map((tag, idx) => (
                <span key={idx} className="badge gray">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 탭 3: 원고 검수 */}
        {activeTab === 'review' && (
          <div className="det-grid">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <div
                className="card card-pad"
                style={{
                  padding: '18px',
                  background: 'var(--white)',
                  border: '1px solid var(--dark)',
                  borderRadius: 'var(--r-lg)',
                  boxShadow: 'var(--shadow)',
                }}
              >
                <div className="row between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <h2 style={{ fontSize: '17px', fontWeight: 700 }}>인플루언서 목록</h2>
                </div>
                <div className="inf-list">
                  {influencers.map((inf, idx) => {
                    const isSelected = inf.id === selectedInfId
                    const infData = getInfluencerInfo(inf)
                    const avatarInitial = infData.name ? infData.name[0] : '?'
                    const avatarColorClass = AVATAR_COLORS[idx % AVATAR_COLORS.length]

                    return (
                      <div
                        key={inf.id}
                        onClick={() => setSelectedInfId(inf.id)}
                        className={`inf-row ${isSelected ? 'sel' : ''}`}
                      >
                        <span className={`av ${avatarColorClass}`}>{avatarInitial}</span>
                        <div className="info">
                          <div className="nm">{infData.name}</div>
                          <div className="st">{CI_STATUS_LABELS[inf.status as CIStatus] || inf.status}</div>
                        </div>
                        {renderStatusBadge(inf.status)}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {currentInfluencer && (() => {
              const curInfData = getInfluencerInfo(currentInfluencer)
              const curIdx = influencers.findIndex((i) => i.id === currentInfluencer.id)
              const avatarColorClass = AVATAR_COLORS[(curIdx >= 0 ? curIdx : 0) % AVATAR_COLORS.length]
              const avatarInitial = curInfData.name ? curInfData.name[0] : '?'

              return (
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
                  <div className="review-head">
                    <div className="row" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className={`av ${avatarColorClass}`}>{avatarInitial}</span>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '17px' }}>
                          {curInfData.name}{' '}
                          {curInfData.handle && (
                            <span className="muted" style={{ fontWeight: 400, fontSize: '14px' }}>
                              {curInfData.handle}
                            </span>
                          )}
                        </div>
                        <div className="muted" style={{ fontSize: '13px' }}>
                          {CHANNEL_LABELS[curInfData.primaryChannel] || curInfData.primaryChannel} · {formatFollowers(curInfData.followers, curInfData.primaryChannel)} 팔로워
                        </div>
                      </div>
                    </div>
                    {renderStatusBadge(currentInfluencer.status)}
                  </div>

                  <div className="draft-area" style={{ marginTop: '20px' }}>
                    <div>
                      <h4 style={{ fontSize: '14px', color: 'var(--muted)', fontWeight: 400, marginBottom: '6px' }}>캡션 원고</h4>
                      <p className="cap">{(currentInfluencer as any).caption || '작성된 캡션이 없습니다.'}</p>
                      <div className="actions" style={{ marginTop: '24px' }}>
                        <button type="button" onClick={handleApproveDraft} className="btn btn-green cursor-pointer">
                          에이전시 승인 → 광고주
                        </button>
                        <button type="button" onClick={handleRequestRevision} className="btn btn-ghost cursor-pointer">
                          수정 요청
                        </button>
                        <button type="button" onClick={handleRejectDraft} className="btn btn-ghost cursor-pointer" style={{ marginLeft: 'auto' }}>
                          반려
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>
        )}

        {/* 탭 4: 배송 */}
        {activeTab === 'shipping' && (
          <div className="card card-pad bg-[var(--white)] border border-[var(--dark)] rounded-[var(--r-lg)] p-6">
            <h2 className="text-lg font-bold mb-4">📦 배송 관리</h2>
            <p className="text-sm text-[var(--muted)]">인플루언서 제품 배송 주소 및 운송장 번호를 관리합니다.</p>
          </div>
        )}

        {/* 탭 5: 정산 */}
        {activeTab === 'billing' && (
          <div className="card card-pad bg-[var(--white)] border border-[var(--dark)] rounded-[var(--r-lg)] p-6">
            <h2 className="text-lg font-bold mb-4">💰 정산 관리</h2>
            <p className="text-sm text-[var(--muted)]">캠페인 정산 상태 및 세금계산서 발행을 관리합니다.</p>
          </div>
        )}
      </div>

      {/* 섭외 이메일 발송 확인 모달 */}
      {isOutreachModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card bg-[var(--white)] max-w-md w-full p-6 flex flex-col gap-4 border border-[var(--dark)] rounded-2xl shadow-lg">
            <h3 className="text-lg font-bold text-[var(--dark)]">✉️ 일괄 섭외 이메일 발송</h3>
            <p className="text-sm text-[var(--muted)]">
              선택된 <b>{influencers.length}명</b>의 인플루언서에게 섭외 요청 이메일을 발송합니다. 계속하시겠습니까?
            </p>
            <div className="flex items-center justify-end gap-3 pt-3 border-t">
              <button
                type="button"
                onClick={() => setIsOutreachModalOpen(false)}
                className="btn btn-ghost font-sans text-xs cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                disabled={isSendingOutreach}
                onClick={handleBatchOutreach}
                className="btn btn-green font-sans text-xs cursor-pointer"
              >
                {isSendingOutreach ? '발송 중...' : '발송하기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
