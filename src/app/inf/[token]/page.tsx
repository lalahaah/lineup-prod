'use client'

import { use, useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { InfTokenData } from '@/app/api/inf/[token]/route'

interface PageProps {
  params: Promise<{ token: string }>
}

type InfStep = 'intro' | 'address' | 'draft' | 'done' | 'rejected'

const REJECTION_REASONS = [
  '일정이 맞지 않습니다',
  '단가 조정이 필요합니다',
  '브랜드/제품이 맞지 않습니다',
  '기타 (직접 입력)',
]

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const mb = bytes / (1024 * 1024)
  if (mb >= 1) {
    return `${mb.toFixed(1)} MB`
  }
  const kb = bytes / 1024
  return `${kb.toFixed(0)} KB`
}

export default function InfPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const token = resolvedParams.token

  const [infData, setInfData] = useState<InfTokenData | null>(null)
  const [loading, setLoading] = useState(true)

  // Step 관리: 'intro' | 'address' | 'draft' | 'done' | 'rejected'
  const [step, setStep] = useState<InfStep>('intro')
  const [isAlreadyConfirmed, setIsAlreadyConfirmed] = useState(false)

  // 거절 모달 상태
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [selectedReasonOption, setSelectedReasonOption] = useState(REJECTION_REASONS[0])
  const [customReason, setCustomReason] = useState('')
  const [isRejecting, setIsRejecting] = useState(false)

  // Step 1 수락 로딩
  const [isAccepting, setIsAccepting] = useState(false)

  // Step 2 배송지 폼 상태
  const [addressData, setAddressData] = useState({
    name: '',
    phone: '',
    address: '',
    detail_address: '',
  })
  const [isSavingAddress, setIsSavingAddress] = useState(false)

  // Step 3 원고 파일 업로드 상태
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState(false)
  const [caption, setCaption] = useState('')

  // 데이터 로드 (페이지 로드 시 자동 수락 완전 제거, 조회만 수행)
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const res = await fetch(`/api/inf/${token}`)
        if (res.ok) {
          const json: InfTokenData = await res.json()
          setInfData(json)

          if (json.status === 'rejected') {
            setStep('rejected')
          } else if (json.status === 'confirmed') {
            setIsAlreadyConfirmed(true)
            if (json.shipping_address && json.shipping_address.name && json.shipping_address.address) {
              setAddressData({
                name: json.shipping_address.name || '',
                phone: json.shipping_address.phone || '',
                address: json.shipping_address.address || '',
                detail_address: json.shipping_address.detail_address || '',
              })
              setStep('draft')
            } else {
              setStep('address')
            }
          } else {
            // 기본 대기 상태 (수락/거절 선택 화면)
            setStep('intro')
          }
        }
      } catch (err) {
        console.error('Error fetching influencer token data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [token])

  // 1. 수락하기 버튼 클릭 시에만 API 호출
  const handleAccept = async () => {
    try {
      setIsAccepting(true)
      const res = await fetch(`/api/inf/${token}/response`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'accept' }),
      })
      if (!res.ok) throw new Error('수락 처리 실패')

      toast.success('섭외를 수락하셨습니다! 제품 배송지를 입력해주세요.')
      setStep('address')
    } catch (error) {
      console.error(error)
      toast.error('오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsAccepting(false)
    }
  }

  // 2. 거절 모달에서 확인 클릭 시 API 호출
  const handleConfirmReject = async () => {
    const finalReason =
      selectedReasonOption === '기타 (직접 입력)'
        ? customReason.trim() || '기타 사유'
        : selectedReasonOption

    try {
      setIsRejecting(true)
      const res = await fetch(`/api/inf/${token}/response`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reject',
          rejection_reason: finalReason,
        }),
      })
      if (!res.ok) throw new Error('거절 처리 실패')

      setIsRejectModalOpen(false)
      setStep('rejected')
      toast.info('거절이 전달되었습니다.')
    } catch (error) {
      console.error(error)
      toast.error('오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsRejecting(false)
    }
  }

  // 3. 배송지 저장
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!addressData.name || !addressData.phone || !addressData.address) {
      toast.error('배송지 필수 정보를 모두 입력해 주세요.')
      return
    }

    setIsSavingAddress(true)
    try {
      const res = await fetch(`/api/inf/${token}/address`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressData),
      })
      if (!res.ok) throw new Error('배송지 저장 실패')

      toast.success('배송지가 정상적으로 저장되었습니다.')
      setStep('draft')
    } catch (err) {
      console.error(err)
      toast.error('배송지 저장에 실패했습니다.')
    } finally {
      setIsSavingAddress(false)
    }
  }

  // 4. 원고 제출
  const handleSubmitDraft = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!selectedFile || !caption.trim()) {
      toast.error('원고 파일과 캡션 내용을 모두 입력해 주세요.')
      return
    }

    try {
      setIsUploading(true)
      setUploadProgress(10)

      // Supabase Storage 업로드
      const supabase = createClient()
      const timestamp = Date.now()
      const safeFileName = selectedFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const campaignId = (infData as any)?.campaign_id || 'campaign'
      const influencerId = (infData as any)?.influencer_id || 'influencer'
      const filePath = `${campaignId}/${influencerId}/${timestamp}_${safeFileName}`

      setUploadProgress(30)

      const { error: uploadError } = await supabase.storage
        .from('drafts')
        .upload(filePath, selectedFile, {
          upsert: true,
          contentType: selectedFile.type || 'application/octet-stream',
        })

      if (uploadError) {
        console.warn('Storage upload error:', uploadError)
      }

      setUploadProgress(70)

      const {
        data: { publicUrl },
      } = supabase.storage.from('drafts').getPublicUrl(filePath)

      setUploadProgress(90)

      // drafts INSERT API 호출
      const res = await fetch(`/api/inf/${token}/draft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file_url: publicUrl || `/mock/drafts/${safeFileName}`,
          file_name: selectedFile.name,
          caption,
          planned_upload_at: new Date().toISOString(),
        }),
      })

      if (!res.ok) throw new Error('제출 실패')

      setUploadProgress(100)
      setIsUploading(false)
      setStep('done')
      toast.success('원고가 성공적으로 제출되었습니다.')
    } catch (error) {
      console.error('업로드 오류:', error)
      setIsUploading(false)
      setUploadProgress(0)
      toast.error('업로드 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  const influencerName = infData?.influencer_name || '인플루언서'
  const campaignTitle = infData?.campaign_title || '캠페인'
  const clientName = infData?.client_name || '광고주'
  const channelLabel = infData?.channel_label || '인스타그램'
  const proposedFee = infData?.proposed_fee_formatted || '₩0'
  const contentDeadline = infData?.content_deadline || '-'
  const postPeriod = infData?.post_period || '-'
  const requiredTags = infData?.required_tags || '#협찬'

  const isSubmitDisabled = !selectedFile || !caption.trim() || isUploading

  if (loading) {
    return (
      <div className="phone select-none" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <p className="muted" style={{ fontSize: '14px' }}>협업 정보를 불러오는 중...</p>
      </div>
    )
  }

  return (
    <div className="phone select-none">
      {/* 숨겨진 File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (!file) return
          setSelectedFile(file)
          if (file.type.startsWith('image/')) {
            setPreviewUrl(URL.createObjectURL(file))
          } else {
            setPreviewUrl(null)
          }
        }}
      />

      {/* Header */}
      <div className="mhead">
        <div className="brand">
          <svg className="mark" viewBox="0 0 34 34" fill="none">
            <circle cx="17" cy="17" r="16" fill="#B9FF66" />
            <path d="M17 6a11 11 0 1 0 0 22" stroke="#191A23" strokeWidth="3.4" />
            <circle cx="17" cy="17" r="4" fill="#191A23" />
          </svg>
          Lineup
        </div>
        <div className="lock">
          <svg viewBox="0 0 24 24" fill="none">
            <rect x="4" y="10" width="16" height="11" rx="2" stroke="#9a9ba5" strokeWidth="1.7" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="#9a9ba5" strokeWidth="1.7" />
          </svg>
          안전한 협업 링크
        </div>
      </div>

      {/* Body */}
      <div className="mbody">
        {/* 거절 완료 상태 */}
        {step === 'rejected' ? (
          <div style={{ textAlign: 'center', padding: '40px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'var(--gray)',
                border: '1px solid var(--dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
              }}
            >
              ✉️
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px', color: 'var(--dark)' }}>
                거절이 전달되었습니다
              </h2>
              <p className="muted" style={{ fontSize: 14, margin: 0, lineHeight: 1.6 }}>
                제안에 응답해 주셔서 감사합니다.
                <br />
                다음 기회에 더 좋은 협업으로 찾아뵙겠습니다.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* 상단 인사말 및 캠페인 정보 카드 */}
            <div>
              <div className="greet">{influencerName} 님, 안녕하세요 👋</div>
              <p className="muted" style={{ fontSize: '14px', marginTop: '6px' }}>
                {clientName} 캠페인 협업을 제안드려요. 아래 내용을 확인하고 수락 여부를 선택해 주세요.
              </p>
            </div>

            {/* Campaign Card */}
            <div className="mcard green">
              <div className="row between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge dark">{clientName}</span>
                <span className="badge" style={{ background: '#fff' }}>
                  {channelLabel}
                </span>
              </div>
              <div style={{ fontWeight: 500, fontSize: '18px', margin: '12px 0 2px' }}>
                {campaignTitle}
              </div>
              <div className="kv2">
                <div className="k">
                  <b>제안 단가</b>
                  {proposedFee}
                </div>
                <div className="k">
                  <b>원고 마감</b>
                  {contentDeadline}
                </div>
                <div className="k">
                  <b>게시 기간</b>
                  {postPeriod}
                </div>
                <div className="k">
                  <b>필수 태그</b>
                  {requiredTags}
                </div>
              </div>
            </div>

            {/* 이미 수락된 경우 안내 태그 */}
            {isAlreadyConfirmed && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: 'var(--gray)',
                  border: '1px solid var(--line-soft)',
                  fontSize: '13px',
                  color: 'var(--dark)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span style={{ color: '#1f8a3b', fontWeight: 700 }}>✓</span>
                <span>이미 수락 완료된 협업 제안입니다.</span>
              </div>
            )}

            {/* ─── STEP 1: 'intro' (수락 / 거절 버튼) ─── */}
            {step === 'intro' && (
              <div>
                <div className="mlabel">
                  <span className="step-no cur">1</span>
                  섭외 수락 여부
                </div>
                <div className="two mt-3">
                  <button
                    type="button"
                    onClick={() => setIsRejectModalOpen(true)}
                    disabled={isAccepting}
                    className="mbtn ghost cursor-pointer"
                  >
                    거절
                  </button>
                  <button
                    type="button"
                    onClick={handleAccept}
                    disabled={isAccepting}
                    className="mbtn green cursor-pointer"
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
                    {isAccepting ? '처리 중...' : '수락하기'}
                  </button>
                </div>
              </div>
            )}

            {/* ─── STEP 2: 'address' (배송지 입력) ─── */}
            {step === 'address' && (
              <div>
                <div className="mlabel">
                  <span className="step-no cur">2</span>
                  제품 수령 배송지 입력
                </div>
                <form onSubmit={handleSaveAddress} className="field mt-3">
                  <input
                    placeholder="받는 분 이름"
                    value={addressData.name}
                    onChange={(e) => setAddressData({ ...addressData, name: e.target.value })}
                  />
                  <input
                    placeholder="연락처 (- 없이)"
                    value={addressData.phone}
                    onChange={(e) => setAddressData({ ...addressData, phone: e.target.value })}
                  />
                  <input
                    placeholder="주소"
                    value={addressData.address}
                    onChange={(e) => setAddressData({ ...addressData, address: e.target.value })}
                  />
                  <input
                    placeholder="상세주소"
                    value={addressData.detail_address}
                    onChange={(e) => setAddressData({ ...addressData, detail_address: e.target.value })}
                  />
                  <button
                    type="submit"
                    disabled={isSavingAddress}
                    className="mbtn dark cursor-pointer"
                  >
                    {isSavingAddress ? '저장 중...' : '배송지 저장 및 다음'}
                  </button>
                </form>
              </div>
            )}

            {/* ─── STEP 3: 'draft' (원고 제출) ─── */}
            {step === 'draft' && (
              <div>
                <div className="mlabel">
                  <span className="step-no cur">3</span>
                  원고 제출
                </div>

                <div className="mt-3">
                  {/* 파일 업로드 영역 */}
                  {!selectedFile ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        width: '100%',
                        minHeight: '140px',
                        borderRadius: '14px',
                        background: 'var(--gray)',
                        border: '1px solid var(--dark)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        color: 'var(--muted)',
                        cursor: 'pointer',
                        fontSize: '13px',
                        padding: '20px',
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" style={{ width: 32, height: 32 }}>
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="var(--dark)" strokeWidth="1.8" strokeLinecap="round" />
                        <path d="M17 8l-5-5-5 5" stroke="var(--dark)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 3v12" stroke="var(--dark)" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                      <span style={{ fontWeight: 500, color: 'var(--dark)' }}>
                        원고 파일 업로드 (영상·이미지)
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                        클릭하여 사진 또는 동영상 선택
                      </span>
                    </div>
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        borderRadius: '14px',
                        background: 'var(--gray)',
                        border: '1px solid var(--dark)',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="미리보기"
                          style={{
                            maxHeight: '140px',
                            maxWidth: '100%',
                            borderRadius: '8px',
                            objectFit: 'contain',
                            border: '1px solid var(--line-soft)',
                          }}
                        />
                      ) : (
                        <div style={{ fontSize: '36px' }}>🎬</div>
                      )}

                      <div style={{ textAlign: 'center', minWidth: 0, width: '100%' }}>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: '13px',
                            color: 'var(--dark)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {selectedFile.name}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>
                          {formatFileSize(selectedFile.size)}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          fileInputRef.current?.click()
                        }}
                        style={{
                          padding: '6px 14px',
                          fontSize: '12px',
                          borderRadius: '8px',
                          border: '1px solid var(--dark)',
                          background: 'white',
                          cursor: 'pointer',
                        }}
                      >
                        다시 선택
                      </button>
                    </div>
                  )}

                  {/* 업로드 중 프로그레스 바 */}
                  {isUploading && (
                    <div style={{ marginTop: '12px' }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '12px',
                          color: 'var(--muted)',
                          marginBottom: '4px',
                        }}
                      >
                        <span>업로드 중...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div
                        style={{
                          width: '100%',
                          height: '8px',
                          background: 'var(--gray)',
                          borderRadius: '4px',
                          overflow: 'hidden',
                          border: '1px solid var(--line-soft)',
                        }}
                      >
                        <div
                          style={{
                            width: `${uploadProgress}%`,
                            height: '100%',
                            background: 'var(--green)',
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmitDraft} className="field mt-3">
                    <textarea
                      placeholder="캡션 원고를 입력하세요 (#필수태그 포함)"
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      disabled={isUploading}
                    />
                    <button
                      type="submit"
                      disabled={isSubmitDisabled}
                      className="mbtn dark"
                      style={{
                        opacity: isSubmitDisabled ? 0.5 : 1,
                        cursor: isSubmitDisabled ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {isUploading ? `업로드 중 (${uploadProgress}%)` : '원고 제출하기'}
                    </button>
                  </form>

                  <p className="muted" style={{ fontSize: '12px', textAlign: 'center', marginTop: '4px' }}>
                    제출 후에도 운영팀 피드백에 따라 재제출할 수 있어요.
                  </p>
                </div>
              </div>
            )}

            {/* ─── STEP 4: 'done' (제출 완료 화면) ─── */}
            {step === 'done' && (
              <div style={{ textAlign: 'center', padding: '30px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: 'var(--green)',
                    border: '1px solid var(--dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 26,
                    color: 'var(--dark)',
                  }}
                >
                  ✓
                </div>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 6px', color: 'var(--dark)' }}>
                    원고 제출 완료 🎉
                  </h2>
                  <p className="muted" style={{ fontSize: 13, margin: 0, lineHeight: 1.5 }}>
                    제출해주신 원고를 운영팀에서 확인 중입니다.
                    <br />
                    검수 완료 및 피드백은 알림으로 안내드릴게요.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setStep('draft')}
                  className="mbtn ghost mt-2 cursor-pointer"
                  style={{ fontSize: 13 }}
                >
                  원고 수정/재제출하기
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ─── 거절 사유 선택 모달 (직접 구현) ─── */}
      {isRejectModalOpen && (
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
          onClick={() => setIsRejectModalOpen(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 20,
              border: '1px solid var(--dark)',
              boxShadow: '0 4px 0 0 var(--dark)',
              width: 440,
              maxWidth: 'calc(100vw - 40px)',
              padding: 24,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: 'var(--dark)' }}>
                협업 제안 거절
              </h3>
              <button
                type="button"
                onClick={() => setIsRejectModalOpen(false)}
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
              거절 사유를 선택해 주시면 향후 더 알맞은 협업 제안을 드리는 데 도움이 됩니다.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {REJECTION_REASONS.map((reason) => {
                const isSelected = selectedReasonOption === reason
                return (
                  <label
                    key={reason}
                    onClick={() => setSelectedReasonOption(reason)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: `1px solid ${isSelected ? 'var(--dark)' : 'var(--line-soft)'}`,
                      background: isSelected ? 'var(--gray)' : 'white',
                      cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: isSelected ? 600 : 400,
                      color: 'var(--dark)',
                    }}
                  >
                    <input
                      type="radio"
                      name="rejection_reason"
                      checked={isSelected}
                      onChange={() => setSelectedReasonOption(reason)}
                      style={{ accentColor: 'var(--dark)' }}
                    />
                    <span>{reason}</span>
                  </label>
                )
              })}

              {selectedReasonOption === '기타 (직접 입력)' && (
                <input
                  type="text"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="거절 사유를 직접 입력해 주세요"
                  className="w-full p-2.5 rounded-xl border border-[var(--dark)] bg-[var(--white)] text-sm font-sans focus:outline-none mt-1"
                />
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button
                type="button"
                onClick={() => setIsRejectModalOpen(false)}
                disabled={isRejecting}
                className="mbtn ghost"
                style={{ height: 38, padding: '0 16px', fontSize: 13 }}
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                disabled={isRejecting}
                className="mbtn dark"
                style={{ height: 38, padding: '0 16px', fontSize: 13 }}
              >
                {isRejecting ? '처리 중...' : '거절 확인'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
