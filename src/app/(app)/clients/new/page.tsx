'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Header } from '@/components/layout/Header'

export default function NewClientPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    commission_rate: '15',
    notes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error('회사명을 입력해주세요.')
      return
    }

    setIsSubmitting(true)

    try {
      const rateNum = parseFloat(formData.commission_rate) / 100

      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          industry: formData.industry,
          contact_name: formData.contact_name,
          contact_email: formData.contact_email,
          contact_phone: formData.contact_phone,
          commission_rate: isNaN(rateNum) ? 0.15 : rateNum,
          notes: formData.notes,
        }),
      })

      if (res.ok) {
        toast.success('신규 광고주가 등록되었습니다.')
        router.push('/clients')
        router.refresh()
      } else {
        toast.error('광고주 등록에 실패했습니다.')
      }
    } catch (error) {
      console.error('Error creating new client:', error)
      toast.error('오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const cardStyle: React.CSSProperties = {
    background: 'var(--white)',
    border: '1px solid var(--dark)',
    borderRadius: '28px',
    boxShadow: '0 4px 0 0 var(--dark)',
    padding: '26px',
    maxWidth: '680px',
    margin: '0 auto'
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
    <div className="main select-none font-sans">
      <Header
        title="신규 광고주 등록"
        subTitle="플랫폼에 새 광고주 회사 및 담당자 정보를 추가합니다."
      />

      <div className="content">
        <div className="mb-4 max-w-[680px] mx-auto">
          <Link
            href="/clients"
            className="text-xs font-semibold text-[var(--muted)] hover:text-[var(--dark)] transition-colors inline-flex items-center gap-1"
          >
            ← 목록으로 돌아가기
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={cardStyle} className="flex flex-col gap-5">
            <h2 className="text-lg font-bold text-[var(--dark)] border-b pb-3">광고주 정보</h2>

            {/* 회사명 */}
            <div>
              <label style={labelStyle}>
                회사명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                style={inputStyle}
                placeholder="예: 쿠쿠전자"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* 업종 & 수수료율 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label style={labelStyle}>업종</label>
                <input
                  type="text"
                  style={inputStyle}
                  placeholder="예: 가전, 뷰티, FMCG"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                />
              </div>

              <div>
                <label style={labelStyle}>대행 수수료율 (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  style={inputStyle}
                  placeholder="15"
                  value={formData.commission_rate}
                  onChange={(e) => setFormData({ ...formData, commission_rate: e.target.value })}
                />
              </div>
            </div>

            {/* 담당자명 & 연락처 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label style={labelStyle}>담당자명</label>
                <input
                  type="text"
                  style={inputStyle}
                  placeholder="예: 김마케터"
                  value={formData.contact_name}
                  onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                />
              </div>

              <div>
                <label style={labelStyle}>연락처</label>
                <input
                  type="text"
                  style={inputStyle}
                  placeholder="예: 010-1234-5678"
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                />
              </div>
            </div>

            {/* 이메일 */}
            <div>
              <label style={labelStyle}>담당자 이메일</label>
              <input
                type="email"
                style={inputStyle}
                placeholder="예: marketing@company.com"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
              />
            </div>

            {/* 메모 */}
            <div>
              <label style={labelStyle}>메모</label>
              <textarea
                rows={3}
                style={{ ...inputStyle, resize: 'none' }}
                placeholder="광고주 특이사항이나 브리핑 관련 참고 메모"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            {/* 하단 버튼 */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <Link href="/clients" className="btn btn-ghost font-sans">
                취소
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-green font-sans cursor-pointer"
              >
                {isSubmitting ? '등록 중...' : '추가하기'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
