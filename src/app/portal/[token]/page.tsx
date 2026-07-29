'use client'

import { use, useState, useEffect } from 'react'
import { toast } from 'sonner'
import type { PortalCandidate, PortalData } from '@/app/api/portal/[token]/route'

interface PageProps {
  params: Promise<{ token: string }>
}

export default function PortalPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const token = resolvedParams.token

  const [portalData, setPortalData] = useState<PortalData | null>(null)
  const [candidates, setCandidates] = useState<PortalCandidate[]>([])
  const [activeTab, setActiveTab] = useState<'review' | 'draft' | 'report'>('review')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/portal/${token}`)
        if (res.ok) {
          const json: PortalData = await res.json()
          setPortalData(json)
          setCandidates(json.candidates)
        }
      } catch (err) {
        console.error('Error fetching portal data:', err)
      }
    }
    fetchData()
  }, [token])

  const handlePickSelect = (id: string) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            status: c.status === 'chosen' ? 'neutral' : 'chosen',
          }
        }
        return c
      })
    )
  }

  const handlePickPass = (id: string) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            status: c.status === 'passed' ? 'neutral' : 'passed',
          }
        }
        return c
      })
    )
  }

  const handleSubmitSelections = async () => {
    setIsSubmitting(true)
    try {
      const chosenList = candidates.filter((c) => c.status === 'chosen')
      const passedList = candidates.filter((c) => c.status === 'passed')

      const res = await fetch(`/api/portal/${token}/select`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selections: {
            chosen: chosenList.map((c) => c.id),
            passed: passedList.map((c) => c.id),
          },
        }),
      })

      if (res.ok) {
        setIsSubmitted(true)
        toast.success('✓ 운영팀에 전달되었습니다')
      } else {
        toast.error('제출에 실패했습니다.')
      }
    } catch (err) {
      console.error(err)
      toast.error('오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const chosenCandidates = candidates.filter((c) => c.status === 'chosen')
  const totalChosenFee = chosenCandidates.reduce((acc, curr) => acc + curr.fee, 0)
  const totalChosenFeeFormatted = (totalChosenFee / 10000).toLocaleString()

  const campaignTitle = portalData?.campaign_title || '쿠쿠 에어프라이어 봄 캠페인'
  const clientName = portalData?.client_name || 'CUCKOO'
  const candidateCount = portalData?.candidate_count || 8
  const totalBudget = portalData?.total_budget_formatted || '₩12,000,000'
  const deadline = portalData?.deadline || '06.09 (D-3)'

  return (
    <div>
      {/* Navigation Bar */}
      <div className="pnav">
        <div className="in">
          <div className="brand select-none">
            <svg className="mark" viewBox="0 0 34 34" fill="none">
              <circle cx="17" cy="17" r="16" fill="#191A23" />
              <path d="M17 6a11 11 0 1 0 0 22" stroke="#B9FF66" strokeWidth="3.4" />
              <circle cx="17" cy="17" r="4" fill="#B9FF66" />
            </svg>
            Lineup
          </div>
          <span className="token select-none">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="4" y="10" width="16" height="11" rx="2" stroke="#6a6a72" strokeWidth="1.7" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="#6a6a72" strokeWidth="1.7" />
            </svg>
            안전한 링크 · 로그인 불필요
          </span>
        </div>
      </div>

      <div className="pwrap select-none">
        {/* Hero Area */}
        <div className="phero">
          <div className="ey">라운드미디어가 보낸 인플루언서 후보 제안</div>
          <h1 className="font-bold text-[var(--dark)] tracking-tight">{campaignTitle}</h1>
          <p className="muted" style={{ fontSize: '15px' }}>
            아래 후보 중 함께하고 싶은 인플루언서를 선택해 주세요. 선택은 자동 저장되며, 다 고르셨으면 하단에서 제출하시면 됩니다.
          </p>
          <div className="summary">
            <div className="scard">
              <b>광고주</b>
              <span>{clientName}</span>
            </div>
            <div className="scard">
              <b>제안 후보</b>
              <span>{candidateCount}명</span>
            </div>
            <div className="scard">
              <b>총 예산</b>
              <span>{totalBudget}</span>
            </div>
            <div className="scard">
              <b>회신 기한</b>
              <span>{deadline}</span>
            </div>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="tabbar">
          <span
            className={`ptab ${activeTab === 'review' ? 'on' : ''}`}
            onClick={() => setActiveTab('review')}
          >
            후보 검토 <span className="n">{candidateCount}</span>
          </span>
          <span
            className={`ptab ${activeTab === 'draft' ? 'on' : ''}`}
            onClick={() => setActiveTab('draft')}
          >
            원고 컨펌 <span className="n">대기</span>
          </span>
          <span
            className={`ptab ${activeTab === 'report' ? 'on' : ''}`}
            onClick={() => setActiveTab('report')}
          >
            성과 리포트
          </span>
        </div>

        {/* Candidate Grid */}
        {activeTab === 'review' ? (
          <div className="cand-grid">
            {candidates.map((cand) => {
              const isChosen = cand.status === 'chosen'
              const isPassed = cand.status === 'passed'

              let candClass = 'cand'
              if (isChosen) candClass += ' chosen'
              if (isPassed) candClass += ' passed'

              return (
                <div key={cand.id} className={candClass}>
                  {/* Top */}
                  <div className="top">
                    <span className={`av ${cand.avatar_color_class || 'c1'}`}>
                      {cand.avatar_initial}
                    </span>
                    <div>
                      <div style={{ fontWeight: 500 }}>{cand.name}</div>
                      <div className="muted" style={{ fontSize: '13px' }}>
                        {cand.handle}
                      </div>
                    </div>
                  </div>

                  {/* Media Slot Placeholder */}
                  <div
                    className="pic"
                    style={{
                      height: '150px',
                      background: 'var(--gray)',
                      border: '1px solid var(--dark)',
                      borderRadius: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--muted)',
                      fontSize: '13px',
                      fontWeight: 500,
                    }}
                  >
                    대표 콘텐츠 미리보기
                  </div>

                  {/* Meta 2x2 */}
                  <div className="meta mt-4">
                    <div className="kv">
                      <b>채널</b>
                      {cand.channel} · {cand.category}
                    </div>
                    <div className="kv">
                      <b>팔로워</b>
                      {cand.followers}
                    </div>
                    <div className="kv">
                      <b>참여율</b>
                      {cand.engagement}
                    </div>
                    <div className="kv">
                      <b>제안 단가</b>
                      {cand.fee_formatted}
                    </div>
                  </div>

                  {/* Tag */}
                  <div style={{ padding: '0 20px 16px' }}>
                    <span className="cat">{cand.tag}</span>
                  </div>

                  {/* Selection Buttons */}
                  <div className="pick">
                    <button
                      type="button"
                      className="pass"
                      onClick={() => handlePickPass(cand.id)}
                    >
                      <svg viewBox="0 0 24 24" fill="none">
                        <path
                          d="M6 6l12 12M18 6L6 18"
                          stroke="#6a6a72"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                      {isPassed ? '패스함' : '패스'}
                    </button>
                    <button
                      type="button"
                      className="sel"
                      onClick={() => handlePickSelect(cand.id)}
                    >
                      <svg viewBox="0 0 24 24" fill="none">
                        <path
                          d="M5 12l5 5L20 7"
                          stroke="#191A23"
                          strokeWidth="2.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {isChosen ? '선택됨' : '선택'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div
            className="card card-pad"
            style={{
              background: 'var(--white)',
              border: '1px solid var(--dark)',
              borderRadius: '24px',
              padding: '60px 20px',
              textAlign: 'center',
              color: 'var(--muted)',
            }}
          >
            {activeTab === 'draft' ? '후보 선택이 진행 중입니다. 후보 선택 완료 후 원고 검수가 개시됩니다.' : '캠페인 완료 후 성과 리포트가 생성됩니다.'}
          </div>
        )}

        {/* Floating Sticky Subbar */}
        <div className="subbar">
          <div className="av-stack">
            {chosenCandidates.map((c) => (
              <span key={c.id} className={`av ${c.avatar_color_class || 'c1'}`} title={c.name}>
                {c.avatar_initial}
              </span>
            ))}
          </div>
          <div>
            <div style={{ fontWeight: 500 }}>
              {chosenCandidates.length}명 선택됨 · 예상 비용 ₩{totalChosenFeeFormatted}만
            </div>
            <div className="muted" style={{ fontSize: '13px' }}>
              선택은 자동 저장됩니다. 제출 시 운영팀에 알림이 전송돼요.
            </div>
          </div>
          <button
            type="button"
            onClick={handleSubmitSelections}
            disabled={isSubmitting}
            className="btn btn-green"
            style={{ marginLeft: 'auto', padding: '14px 26px', fontSize: '16px' }}
          >
            {isSubmitted
              ? '✓ 제출 완료됨'
              : isSubmitting
              ? '전달 중...'
              : '선택 완료 제출 →'}
          </button>
        </div>
      </div>
    </div>
  )
}
