'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import type { ClientData } from '@/lib/clientsStore'

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function fetchClients() {
      try {
        const res = await fetch('/api/clients')
        if (res.ok) {
          const json = await res.json()
          setClients(Array.isArray(json) ? json : json.data || [])
        }
      } catch (err) {
        console.error('Failed to load clients:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchClients()
  }, [])

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.contact_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="main select-none">
      <Header
        title="광고주"
        subTitle={`총 ${clients.length}개사`}
        searchPlaceholder="광고주·업종·담당자 검색"
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        actionButton={
          <Link
            href="/clients/new"
            className="btn cursor-pointer font-sans"
            style={{
              background: 'var(--dark)',
              color: 'var(--white)',
              borderRadius: '12px',
              border: '1px solid var(--dark)',
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" style={{ width: 18, height: 18 }}>
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            + 광고주 추가
          </Link>
        }
      />

      <div className="content font-sans">
        <div className="card" style={{ background: 'var(--white)', borderRadius: 'var(--r-lg)', border: '1px solid var(--dark)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
          {loading ? (
            <div className="p-8 text-center text-sm text-[var(--muted)] font-sans">
              광고주 목록을 불러오는 중...
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="p-8 text-center text-sm text-[var(--muted)] font-sans">
              등록된 광고주가 없습니다.
            </div>
          ) : (
            <>
              <table className="tbl font-sans">
                <thead>
                  <tr>
                    <th>회사명</th>
                    <th>업종</th>
                    <th>담당자</th>
                    <th>이메일</th>
                    <th>수수료율</th>
                    <th>진행 캠페인 수</th>
                    <th>상태</th>
                    <th style={{ textAlign: 'right' }}>액션</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client) => (
                    <tr key={client.id}>
                      <td style={{ fontWeight: 700 }}>{client.name}</td>
                      <td>{client.industry}</td>
                      <td>{client.contact_name}</td>
                      <td style={{ color: 'var(--muted)' }}>{client.contact_email}</td>
                      <td style={{ fontWeight: 600 }}>
                        {Math.round((client.commission_rate || 0.15) * 100)}%
                      </td>
                      <td style={{ fontWeight: 500 }}>
                        {client.campaign_count ?? 0}건
                      </td>
                      <td>
                        {client.is_active !== false ? (
                          <span className="badge soft">활성</span>
                        ) : (
                          <span className="badge gray">비활성</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <Link href={`/clients/${client.id}`} className="rowbtn">
                          상세
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* 하단 버튼 영역 */}
              <div style={{ padding: '16px 20px', borderTop: '1px solid var(--line-soft)', display: 'flex', justifyContent: 'flex-start' }}>
                <Link href="/clients/new" className="rowbtn" style={{ fontWeight: 600 }}>
                  + 광고주 추가
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
