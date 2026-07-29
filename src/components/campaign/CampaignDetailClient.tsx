'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { CampaignStepper } from '@/components/campaign/CampaignStepper'
import type { CampaignDetailData } from '@/app/api/campaigns/[id]/route'
import type { CampaignInfluencerDetail } from '@/app/api/campaigns/[id]/influencers/route'

interface CampaignDetailClientProps {
  campaign: CampaignDetailData
  influencers: CampaignInfluencerDetail[]
}

export function CampaignDetailClient({ campaign, influencers: initialInfluencers }: CampaignDetailClientProps) {
  const [influencers, setInfluencers] = useState<CampaignInfluencerDetail[]>(initialInfluencers)
  const [selectedInfId, setSelectedInfId] = useState<string>(initialInfluencers[0]?.id || 'ci-1')
  const [selectedVersion, setSelectedVersion] = useState<string>('v2')

  const currentInfluencer = influencers.find((i) => i.id === selectedInfId) || influencers[0]

  const handleCopyPortalLink = () => {
    const link = `${window.location.origin}/portal/${campaign.portal_token}`
    navigator.clipboard.writeText(link)
    toast.success('광고주 포털 링크가 클립보드에 복사됐습니다.')
  }

  const handleApprove = () => {
    if (!currentInfluencer) return
    setInfluencers((prev) =>
      prev.map((item) =>
        item.id === currentInfluencer.id
          ? {
              ...item,
              badge_label: '승인',
              badge_variant: 'soft',
              status_text: '광고주 승인 완료',
            }
          : item
      )
    )
    toast.success(`${currentInfluencer.name} 님의 원고를 승인하여 광고주 포털로 전달했습니다.`)
  }

  const handleRequestRevision = () => {
    if (!currentInfluencer) return
    setInfluencers((prev) =>
      prev.map((item) =>
        item.id === currentInfluencer.id
          ? {
              ...item,
              badge_label: '수정요청',
              badge_variant: 'danger',
              status_text: '수정 요청 → 재제출 대기',
            }
          : item
      )
    )
    toast.info(`${currentInfluencer.name} 님에게 원고 수정 요청을 전달했습니다.`)
  }

  const handleReject = () => {
    if (!currentInfluencer) return
    toast.error(`${currentInfluencer.name} 님의 원고를 반려 처리했습니다.`)
  }

  return (
    <div className="main select-none">
      {/* Top Header */}
      <header className="topbar">
        <div className="h">
          <Link href="/campaigns" className="back">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M15 6l-6 6 6 6"
                stroke="var(--muted)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            캠페인
          </Link>
          <h1 className="font-bold text-2xl tracking-tight text-[var(--dark)]">
            {campaign.title}
          </h1>
        </div>
        <div className="spacer" />
        <span className="badge dark">{campaign.client}</span>
        <span className={`dday ${campaign.dday_variant === 'hot' ? 'hot' : 'warm'}`}>
          {campaign.dday}
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
              <b style={{ fontSize: '16px' }}>원고 검수 · Review</b>
            </div>
            <span className="muted" style={{ fontSize: '13px' }}>
              담당 {campaign.assignee} · 인플루언서 {campaign.influencer_count}명
            </span>
          </div>

          <CampaignStepper currentStage={campaign.stage} />
        </div>

        {/* 2-Column Detail Grid */}
        <div className="det-grid">
          {/* LEFT Column (340px) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {/* Card 1: Influencers List */}
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
              <div
                className="row between"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '6px',
                  padding: '0 4px',
                }}

              >
                <h2 style={{ fontSize: '17px', fontWeight: 700 }}>참여 인플루언서</h2>
                <span className="badge soft">승인 {campaign.approved_count} / {influencers.length}</span>
              </div>

              <div className="inf-list">
                {influencers.map((inf) => {
                  const isSelected = inf.id === selectedInfId
                  return (
                    <div
                      key={inf.id}
                      onClick={() => setSelectedInfId(inf.id)}
                      className={`inf-row ${isSelected ? 'sel' : ''}`}
                    >
                      <span className={`av ${inf.avatar_color_class || 'c1'}`}>
                        {inf.avatar_initial}
                      </span>
                      <div className="info">
                        <div className="nm">{inf.name}</div>
                        <div className="st">{inf.status_text}</div>
                      </div>
                      <span className={`badge ${inf.badge_variant}`}>{inf.badge_label}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Card 2: Campaign Guide */}
            <div
              className="card card-pad"
              style={{
                background: 'var(--white)',
                border: '1px solid var(--dark)',
                borderRadius: 'var(--r-lg)',
                boxShadow: 'var(--shadow)',
                padding: '22px',
              }}
            >
              <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px' }}>
                캠페인 가이드
              </h2>
              <div className="grid-2" style={{ gap: '14px' }}>
                <div className="kv">
                  <b>제품</b>
                  {campaign.product_name}
                </div>
                <div className="kv">
                  <b>채널</b>
                  {campaign.channels_text}
                </div>
                <div className="kv">
                  <b>원고 마감</b>
                  {campaign.content_deadline}
                </div>
                <div className="kv">
                  <b>게시 기간</b>
                  {campaign.post_period}
                </div>
              </div>
              <div className="guide-row">
                {campaign.hashtags.map((tag, idx) => (
                  <span key={idx} className="badge gray">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT Column (1fr) - Draft Review Panel */}
          {currentInfluencer && (
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
              {/* Review Header */}
              <div className="review-head">
                <div className="row" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className={`av ${currentInfluencer.avatar_color_class || 'c3'}`}>
                    {currentInfluencer.avatar_initial}
                  </span>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '17px' }}>
                      {currentInfluencer.name}{' '}
                      <span className="muted" style={{ fontWeight: 400, fontSize: '14px' }}>
                        {currentInfluencer.handle}
                      </span>
                    </div>
                    <div className="muted" style={{ fontSize: '13px' }}>
                      {currentInfluencer.channel_info}
                    </div>
                  </div>
                </div>
                <span className={`badge ${currentInfluencer.badge_variant}`}>
                  {currentInfluencer.badge_label}
                </span>
              </div>

              {/* Version Tabs */}
              <div className="ver-tabs">
                <span
                  className={`ver-tab ${selectedVersion === 'v1' ? 'on' : ''}`}
                  onClick={() => setSelectedVersion('v1')}
                >
                  v1 <span className="vb muted">반려</span>
                </span>
                <span
                  className={`ver-tab ${selectedVersion === 'v2' ? 'on' : ''}`}
                  onClick={() => setSelectedVersion('v2')}
                >
                  v2 <span className="vb">검수 중</span>
                </span>
                <span className="ver-tab" style={{ borderStyle: 'dashed', color: 'var(--muted)' }}>
                  + 재제출 대기
                </span>
              </div>

              {/* Draft Content Area */}
              <div className="draft-area">
                {/* Left: Media Placeholder & Download */}
                <div>
                  <div
                    style={{
                      width: '100%',
                      height: '300px',
                      borderRadius: '16px',
                      background: 'var(--gray)',
                      border: '1px solid var(--dark)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',

                      gap: '10px',
                      color: 'var(--muted)',
                      padding: '20px',
                      textAlign: 'center',
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" style={{ width: 42, height: 42 }}>
                      <rect x="3" y="3" width="18" height="18" rx="4" stroke="var(--dark)" strokeWidth="1.8" />
                      <circle cx="8.5" cy="8.5" r="1.5" fill="var(--dark)" />
                      <path d="M21 15l-5-5-8 8" stroke="var(--dark)" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                    <span className="text-xs font-semibold text-[var(--dark)]">
                      {currentInfluencer.media_info?.placeholder || '원고 영상/이미지 미리보기'}
                    </span>
                  </div>

                  <div className="row" style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <button
                      type="button"
                      className="rowbtn"
                      onClick={() => toast.success('원본 파일 다운로드가 시작되었습니다.')}
                      style={{
                        fontSize: '13px',
                        padding: '8px 13px',
                        border: '1px solid var(--dark)',
                        borderRadius: '9px',
                        background: '#fff',
                        cursor: 'pointer',
                      }}
                    >
                      원본 다운로드
                    </button>
                    {currentInfluencer.media_info?.duration && (
                      <span className="badge gray">
                        {currentInfluencer.media_info.duration} · {currentInfluencer.media_info.size}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Caption & Feedback */}
                <div>
                  <h4 style={{ fontSize: '14px', color: 'var(--muted)', fontWeight: 400, marginBottom: '6px' }}>
                    캡션 원고
                  </h4>
                  <p className="cap">{currentInfluencer.caption}</p>

                  <h4 style={{ fontSize: '14px', color: 'var(--muted)', fontWeight: 400, margin: '22px 0 6px' }}>
                    피드백 이력
                  </h4>
                  <div className="feedback">
                    {currentInfluencer.feedback_history.length > 0 ? (
                      currentInfluencer.feedback_history.map((fb) => (
                        <div key={fb.id} className={`fb ${fb.is_me ? 'me' : ''}`}>
                          <span className={`av ${fb.avatar_color_class || 'c1'} sm`}>
                            {fb.avatar_initial}
                          </span>
                          <div>
                            <div className="bub">{fb.message}</div>
                            <div className="meta">
                              {fb.sender_name} ({fb.sender_role}) · {fb.time}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-[var(--muted)] p-3 bg-[var(--gray)] rounded-xl">
                        등록된 피드백 이력이 없습니다.
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="actions">
                    <button type="button" onClick={handleApprove} className="btn btn-green cursor-pointer">
                      <svg viewBox="0 0 24 24" fill="none">
                        <path
                          d="M5 12l5 5L20 7"
                          stroke="#191A23"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      에이전시 승인 → 광고주
                    </button>
                    <button type="button" onClick={handleRequestRevision} className="btn btn-ghost cursor-pointer">
                      수정 요청
                    </button>
                    <button
                      type="button"
                      onClick={handleReject}
                      className="btn btn-ghost cursor-pointer"
                      style={{ marginLeft: 'auto' }}
                    >
                      반려
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
