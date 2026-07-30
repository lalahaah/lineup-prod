'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Header } from '@/components/layout/Header'
import type { ClientData } from '@/lib/clientsStore'

interface CampaignItem {
  id: string
  title: string
  stage: string
  stage_label: string
  progress_days: string
  amount: string
}

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const id = resolvedParams.id

  const [client, setClient] = useState<ClientData | null>(null)
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: '',
    industry: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    commission_rate: '15',
    notes: '',
    is_active: true
  })

  useEffect(() => {
    async function loadClientDetail() {
      try {
        const res = await fetch(`/api/clients/${id}`)
        if (res.ok) {
          const json = await res.json()
          const c: ClientData = json.data
          setClient(c)
          setCampaigns(json.campaigns || [])
          setEditForm({
            name: c.name || '',
            industry: c.industry || '',
            contact_name: c.contact_name || '',
            contact_email: c.contact_email || '',
            contact_phone: c.contact_phone || '',
            commission_rate: String(Math.round((c.commission_rate || 0.15) * 100)),
            notes: c.notes || '',
            is_active: c.is_active !== false
          })
        } else {
          toast.error('광고주 정보를 찾을 수 없습니다.')
        }
      } catch (err) {
        console.error('Failed to load client detail:', err)
      } finally {
        setLoading(false)
      }
    }
    loadClientDetail()
  }, [id])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!client) return

    setIsSaving(true)
    try {
      const rateNum = parseFloat(editForm.commission_rate) / 100
      const res = await fetch(`/api/clients/${client.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editForm.name,
          industry: editForm.industry,
          contact_name: editForm.contact_name,
          contact_email: editForm.contact_email,
          contact_phone: editForm.contact_phone,
          commission_rate: isNaN(rateNum) ? 0.15 : rateNum,
          notes: editForm.notes,
          is_active: editForm.is_active
        })
      })

      if (res.ok) {
        const json = await res.json()
        setClient(json.data)
        setIsEditing(false)
        toast.success('광고주 정보가 수정되었습니다.')
      } else {
        toast.error('수정에 실패했습니다.')
      }
    } catch (err) {
      console.error('Error updating client:', err)
      toast.error('오류가 발생했습니다.')
    } finally {
      setIsSaving(false)
    }
  }

  const cardStyle: React.CSSProperties = {
    background: 'var(--white)',
    border: '1px solid var(--dark)',
    borderRadius: '28px',
    boxShadow: '0 4px 0 0 var(--dark)',
    padding: '26px',
  }

  const inputStyle: React.CSSProperties = {
    border: '1px solid var(--dark)',
    borderRadius: '12px',
    padding: '9px 14px',
    fontFamily: 'inherit',
    fontSize: '14px',
    width: '100%',
    background: 'var(--white)',
    outline: 'none',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '13px',
    color: 'var(--muted)',
    marginBottom: '4px',
    display: 'block',
    fontWeight: 500,
  }

  if (loading) {
    return (
      <div className="main select-none">
        <Header title="광고주 상세" />
        <div className="content p-8 text-center text-sm text-[var(--muted)] font-sans">
          불러오는 중...
        </div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="main select-none">
        <Header title="광고주 상세" />
        <div className="content p-8 text-center text-sm text-[var(--muted)] font-sans">
          광고주 정보를 찾을 수 없습니다.{' '}
          <Link href="/clients" className="underline">
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="main select-none font-sans">
      <Header
        title={client.name}
        subTitle={`등록일: ${client.created_at || '2026-01-15'}`}
        actionButton={
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-green cursor-pointer font-sans"
              >
                편집
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="btn btn-ghost cursor-pointer font-sans"
              >
                취소
              </button>
            )}
          </div>
        }
      />

      <div className="content">
        <div className="mb-4">
          <Link
            href="/clients"
            className="text-xs font-semibold text-[var(--muted)] hover:text-[var(--dark)] transition-colors inline-flex items-center gap-1"
          >
            ← 광고주 목록으로
          </Link>
        </div>

        {/* 2열 레이아웃 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 좌측 카드: 기본 정보 */}
          <div style={cardStyle} className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-lg font-bold text-[var(--dark)]">기본 정보</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="rowbtn text-xs"
                >
                  수정
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSave} className="flex flex-col gap-4">
                <div>
                  <label style={labelStyle}>회사명</label>
                  <input
                    type="text"
                    required
                    style={inputStyle}
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label style={labelStyle}>업종</label>
                    <input
                      type="text"
                      style={inputStyle}
                      value={editForm.industry}
                      onChange={(e) => setEditForm({ ...editForm, industry: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>수수료율 (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      style={inputStyle}
                      value={editForm.commission_rate}
                      onChange={(e) => setEditForm({ ...editForm, commission_rate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label style={labelStyle}>담당자명</label>
                    <input
                      type="text"
                      style={inputStyle}
                      value={editForm.contact_name}
                      onChange={(e) => setEditForm({ ...editForm, contact_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>연락처</label>
                    <input
                      type="text"
                      style={inputStyle}
                      value={editForm.contact_phone}
                      onChange={(e) => setEditForm({ ...editForm, contact_phone: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>이메일</label>
                  <input
                    type="email"
                    style={inputStyle}
                    value={editForm.contact_email}
                    onChange={(e) => setEditForm({ ...editForm, contact_email: e.target.value })}
                  />
                </div>

                <div>
                  <label style={labelStyle}>메모</label>
                  <textarea
                    rows={2}
                    style={{ ...inputStyle, resize: 'none' }}
                    value={editForm.notes}
                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  />
                </div>

                <div className="flex items-center gap-2 mt-2 pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="btn btn-ghost text-sm py-2 flex-1"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="btn btn-green text-sm py-2 flex-1 cursor-pointer"
                  >
                    {isSaving ? '저장 중...' : '저장하기'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col gap-4 text-sm">
                <div className="grid grid-cols-2 gap-4 pb-3 border-b">
                  <div>
                    <span className="text-xs text-[var(--muted)] block font-medium">회사명</span>
                    <span className="font-bold text-base text-[var(--dark)]">{client.name}</span>
                  </div>
                  <div>
                    <span className="text-xs text-[var(--muted)] block font-medium">업종</span>
                    <span className="font-semibold text-[var(--dark)]">{client.industry || '-'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pb-3 border-b">
                  <div>
                    <span className="text-xs text-[var(--muted)] block font-medium">담당자</span>
                    <span className="font-medium text-[var(--dark)]">{client.contact_name || '-'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-[var(--muted)] block font-medium">연락처</span>
                    <span className="font-medium text-[var(--dark)]">{client.contact_phone || '-'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pb-3 border-b">
                  <div>
                    <span className="text-xs text-[var(--muted)] block font-medium">이메일</span>
                    <span className="font-medium text-[var(--dark)]">{client.contact_email || '-'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-[var(--muted)] block font-medium">대행 수수료율</span>
                    <span className="font-bold text-base text-[var(--dark)]">
                      {Math.round((client.commission_rate || 0.15) * 100)}%
                    </span>
                  </div>
                </div>

                {client.notes && (
                  <div>
                    <span className="text-xs text-[var(--muted)] block font-medium mb-1">메모</span>
                    <p className="text-xs text-[var(--dark)] bg-[var(--gray)] p-3 rounded-lg border border-[var(--line-soft)]">
                      {client.notes}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 우측 카드: 캠페인 이력 */}
          <div style={cardStyle} className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-lg font-bold text-[var(--dark)]">캠페인 이력</h2>
              <span className="badge gray text-xs font-semibold">{campaigns.length}건</span>
            </div>

            {campaigns.length === 0 ? (
              <div className="py-8 text-center text-sm text-[var(--muted)]">
                진행된 캠페인 이력이 없습니다.
              </div>
            ) : (
              <div className="flex flex-col gap-3 overflow-y-auto max-h-[460px] pr-1">
                {campaigns.map((camp) => (
                  <div
                    key={camp.id}
                    className="p-4 rounded-xl border border-[var(--line-soft)] bg-[var(--white)] hover:border-[var(--dark)] transition-colors flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-sm text-[var(--dark)] truncate">
                        {camp.title}
                      </div>
                      <div className="text-xs text-[var(--muted)] mt-1 flex items-center gap-2">
                        <span>{camp.progress_days}</span>
                        <span>·</span>
                        <span className="font-medium text-[var(--dark)]">{camp.amount}</span>
                      </div>
                    </div>

                    <span className="badge soft text-xs flex-shrink-0">
                      {camp.stage_label || camp.stage}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
