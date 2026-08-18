'use client'

import { use, useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { InfTokenData } from '@/app/api/inf/[token]/route'

interface PageProps {
  params: Promise<{ token: string }>
}

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

  // Step 진행 상태
  const [step1Done, setStep1Done] = useState(false)
  const [step2Done, setStep2Done] = useState(false)
  const [step3Done, setStep3Done] = useState(false)

  // Step 2 폼 상태
  const [addressData, setAddressData] = useState({
    name: '',
    phone: '',
    address: '',
    detail_address: '',
  })

  // Step 3 폼 상태 & 실제 파일 업로드 상태
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState(false)
  const [caption, setCaption] = useState('')

  const [isSubmitting1, setIsSubmitting1] = useState(false)
  const [isSubmitting2, setIsSubmitting2] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/inf/${token}`)
        if (res.ok) {
          const json: InfTokenData = await res.json()
          setInfData(json)
          if (json.status === 'confirmed') {
            setStep1Done(true)
          }
        }
      } catch (err) {
        console.error('Error fetching influencer token data:', err)
      }
    }
    fetchData()
  }, [token])

  // Step 1: 섭외 수락 / 거절
  const handleAccept = async () => {
    setIsSubmitting1(true)
    try {
      const res = await fetch(`/api/inf/${token}/response`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'accept' }),
      })
      if (res.ok) {
        setStep1Done(true)
        toast.success('섭외를 수락하셨습니다! 다음 단계로 이동해주세요.')
      } else {
        toast.error('오류가 발생했습니다.')
      }
    } catch (err) {
      console.error(err)
      toast.error('오류가 발생했습니다.')
    } finally {
      setIsSubmitting1(false)
    }
  }

  const handleReject = async () => {
    setIsSubmitting1(true)
    try {
      const res = await fetch(`/api/inf/${token}/response`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject' }),
      })
      if (res.ok) {
        toast.info('섭외를 거절하셨습니다.')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting1(false)
    }
  }

  // Step 2: 배송지 저장
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!addressData.name || !addressData.phone || !addressData.address) {
      toast.error('배송지 필수 정보를 모두 입력해 주세요.')
      return
    }

    setIsSubmitting2(true)
    try {
      const res = await fetch(`/api/inf/${token}/address`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressData),
      })
      if (res.ok) {
        setStep2Done(true)
        toast.success('배송지가 정상적으로 저장되었습니다.')
      } else {
        toast.error('배송지 저장에 실패했습니다.')
      }
    } catch (err) {
      console.error(err)
      toast.error('오류가 발생했습니다.')
    } finally {
      setIsSubmitting2(false)
    }
  }

  // Step 3: 실제 파일 Supabase Storage 업로드 및 원고 제출
  const handleSubmit = async (e?: React.FormEvent) => {
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
      setStep3Done(true)
      toast.success('원고가 성공적으로 제출되었습니다.')
    } catch (error) {
      console.error('업로드 오류:', error)
      setIsUploading(false)
      setUploadProgress(0)
      toast.error('업로드 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  const influencerName = infData?.influencer_name || '인플루언서'
  const campaignTitle = infData?.campaign_title || '신제품 런칭 캠페인'
  const clientName = infData?.client_name || '광고주'
  const channelLabel = infData?.channel_label || '인스타그램'
  const proposedFee = infData?.proposed_fee_formatted || '₩500,000'
  const contentDeadline = infData?.content_deadline || '-'
  const postPeriod = infData?.post_period || '-'
  const requiredTags = infData?.required_tags || '#신제품'

  const isSubmitDisabled = !selectedFile || !caption.trim() || isUploading

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

        {/* STEP 1: 섭외 수락 */}
        <div>
          <div className="mlabel">
            <span className={`step-no ${step1Done ? 'done' : 'cur'}`}>
              {step1Done ? '✓' : '1'}
            </span>
            섭외 수락
          </div>

          {step1Done ? (
            <span className="done-tag mt-2">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12l5 5L20 7"
                  stroke="#1f8a3b"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              섭외 수락됨
            </span>
          ) : (
            <div className="two">
              <button
                type="button"
                onClick={handleReject}
                disabled={isSubmitting1}
                className="mbtn ghost cursor-pointer"
              >
                거절
              </button>
              <button
                type="button"
                onClick={handleAccept}
                disabled={isSubmitting1}
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
                {isSubmitting1 ? '처리 중...' : '수락하기'}
              </button>
            </div>
          )}
        </div>

        <div className="divider" />

        {/* STEP 2: 배송지 입력 */}
        <div>
          <div className="mlabel">
            <span className={`step-no ${step2Done ? 'done' : step1Done ? 'cur' : ''}`}>
              {step2Done ? '✓' : '2'}
            </span>
            배송지 입력
          </div>

          {step2Done ? (
            <span className="done-tag mt-2">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12l5 5L20 7"
                  stroke="#1f8a3b"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              배송지 저장됨
            </span>
          ) : (
            <form onSubmit={handleSaveAddress} className="field">
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
                disabled={isSubmitting2}
                className="mbtn dark cursor-pointer"
              >
                {isSubmitting2 ? '저장 중...' : '배송지 저장'}
              </button>
            </form>
          )}
        </div>

        <div className="divider" />

        {/* STEP 3: 원고 제출 */}
        <div>
          <div className="mlabel">
            <span className={`step-no ${step3Done ? 'done' : step2Done ? 'cur' : ''}`}>
              {step3Done ? '✓' : '3'}
            </span>
            원고 제출
          </div>

          {step3Done ? (
            <span className="done-tag mt-2">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12l5 5L20 7"
                  stroke="#1f8a3b"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              원고 제출 완료
            </span>
          ) : (
            <div>
              {/* 업로드 영역 */}
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

              {/* 업로드 중 진행 상태 UI */}
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

              <form onSubmit={handleSubmit} className="field mt-3">
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
          )}
        </div>
      </div>
    </div>
  )
}
