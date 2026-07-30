import { headers } from 'next/headers'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { MetricCard } from '@/components/shared/MetricCard'
import { PriorityQueue } from '@/components/campaign/PriorityQueue'
import { ActivityFeed } from '@/components/shared/ActivityFeed'

async function getDashboardData() {
  try {
    const headersList = await headers()
    const host = headersList.get('host') || 'localhost:3000'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const cookie = headersList.get('cookie') || ''

    const res = await fetch(`${protocol}://${host}/api/dashboard`, {
      headers: {
        cookie,
      },
      next: { revalidate: 0 }
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch dashboard data: ${res.status}`)
    }

    return await res.json()
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return {
      activeCampaigns: 0,
      pendingDrafts: 0,
      pendingShipments: 0,
      monthlyRevenue: 0,
      priorityQueue: [],
      recentActivities: []
    }
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()

  const activeCount = data.activeCampaigns ?? 0
  const draftsCount = data.pendingDrafts ?? 0
  const shipmentsCount = data.pendingShipments ?? 0
  const revenue = data.monthlyRevenue ?? 0
  const revenueFormatted = revenue > 0 ? `₩${(revenue / 1000000).toFixed(1)}M` : '₩0'

  return (
    <div className="main select-none">
      {/* HEADER */}
      <Header title="대시보드" />

      {/* CONTENT */}
      <div className="content">
        
        {/* STATS */}
        <div className="stat-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22, marginBottom: 24 }}>
          <MetricCard
            variant="default"
            label="진행 중 캠페인"
            value={String(activeCount)}
            delta={`총 ${activeCount}건 진행 중`}
            deltaUp
            icon={
              <svg viewBox="0 0 24 24" fill="none" style={{ width: 18, height: 18 }}>
                <rect x="3" y="4" width="5" height="16" rx="1.3" stroke="#191A23" strokeWidth="1.7" />
                <rect x="10" y="4" width="5" height="11" rx="1.3" stroke="#191A23" strokeWidth="1.7" />
                <rect x="17" y="4" width="4" height="8" rx="1.3" stroke="#191A23" strokeWidth="1.7" />
              </svg>
            }
          />
          <MetricCard
            variant="green"
            label="이번 주 마감"
            value={String(shipmentsCount)}
            delta={`배송/마감 예정 ${shipmentsCount}건`}
            icon={
              <svg viewBox="0 0 24 24" fill="none" style={{ width: 18, height: 18 }}>
                <path d="M12 7v5l3 2" stroke="#B9FF66" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="12" cy="12" r="8" stroke="#B9FF66" strokeWidth="1.8" />
              </svg>
            }
          />
          <MetricCard
            variant="default"
            label="검수 대기 원고"
            value={String(draftsCount)}
            delta={`검수 대기 ${draftsCount}건`}
            icon={
              <svg viewBox="0 0 24 24" fill="none" style={{ width: 18, height: 18 }}>
                <path d="M6 3h9l4 4v14H6z" stroke="#191A23" strokeWidth="1.7" strokeLinejoin="round" />
                <path d="M14 3v5h5" stroke="#191A23" strokeWidth="1.7" />
              </svg>
            }
          />
          <MetricCard
            variant="dark"
            label="이번 달 정산 예정"
            value={revenueFormatted}
            delta="정산 대상 금액"
            deltaUp
            icon={
              <svg viewBox="0 0 24 24" fill="none" style={{ width: 18, height: 18 }}>
                <path d="M5 4h14v16l-3-2-2 2-2-2-2 2-3-2V4z" stroke="#191A23" strokeWidth="1.7" strokeLinejoin="round" />
              </svg>
            }
          />
        </div>

        {/* SECTION TITLE */}
        <div className="sec-title" style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '34px 0 16px' }}>
          <h2 style={{ fontSize: 21, fontWeight: 700 }}>우선순위 큐</h2>
          <span className="pill" style={{ background: 'var(--green)', borderRadius: 6, padding: '1px 8px', fontSize: 13, fontWeight: 500, color: 'var(--dark)' }}>D-3 이내</span>
          <div style={{ flex: 1 }}></div>
          <Link href="/campaigns" className="more" style={{ fontSize: 14, color: 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
            전체 캠페인 보기 →
          </Link>
        </div>

        {/* DASHBOARD GRID */}
        <div className="dash-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 22, alignItems: 'start' }}>
          
          {/* LEFT: Priority Queue */}
          <PriorityQueue />

          {/* RIGHT: Live Feed & Pipeline Minichart */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            
            {/* Realtime Activity */}
            <div className="card card-pad" style={{ background: 'var(--white)', border: '1px solid var(--dark)', borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow)', padding: 26 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700 }}>실시간 활동</h2>
                <span className="badge soft" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 500, padding: '4px 11px', borderRadius: 30, border: '1px solid var(--dark)', background: 'var(--green-soft)', color: 'var(--dark)' }}>
                  <span className="dot" style={{ width: 7, height: 7, borderRadius: '50%', background: '#1f8a3b' }}></span> Live
                </span>
              </div>
              <ActivityFeed />
            </div>

            {/* Pipeline Minichart */}
            <div className="card card-pad" style={{ background: 'var(--white)', border: '1px solid var(--dark)', borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow)', padding: 26 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>파이프라인 현황</h2>
              <div className="mini-pipe" style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                <div className="mp-row" style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14 }}>
                  <span className="mp-l" style={{ width: 56, color: 'var(--muted)' }}>브리핑</span>
                  <span className="bar" style={{ flex: 1, height: 8, borderRadius: 6, background: 'var(--gray)', border: '1px solid var(--line-soft)', overflow: 'hidden', position: 'relative' }}>
                    <span style={{ display: 'block', height: '100%', background: 'var(--green)', width: '25%' }}></span>
                  </span>
                  <span className="mp-n" style={{ width: 22, textAlign: 'right', fontWeight: 500 }}>1</span>
                </div>
                <div className="mp-row" style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14 }}>
                  <span className="mp-l" style={{ width: 56, color: 'var(--muted)' }}>제안</span>
                  <span className="bar" style={{ flex: 1, height: 8, borderRadius: 6, background: 'var(--gray)', border: '1px solid var(--line-soft)', overflow: 'hidden', position: 'relative' }}>
                    <span style={{ display: 'block', height: '100%', background: 'var(--green)', width: '50%' }}></span>
                  </span>
                  <span className="mp-n" style={{ width: 22, textAlign: 'right', fontWeight: 500 }}>2</span>
                </div>
                <div className="mp-row" style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14 }}>
                  <span className="mp-l" style={{ width: 56, color: 'var(--muted)' }}>섭외</span>
                  <span className="bar" style={{ flex: 1, height: 8, borderRadius: 6, background: 'var(--gray)', border: '1px solid var(--line-soft)', overflow: 'hidden', position: 'relative' }}>
                    <span style={{ display: 'block', height: '100%', background: 'var(--green)', width: '25%' }}></span>
                  </span>
                  <span className="mp-n" style={{ width: 22, textAlign: 'right', fontWeight: 500 }}>1</span>
                </div>
                <div className="mp-row" style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14 }}>
                  <span className="mp-l" style={{ width: 56, color: 'var(--muted)' }}>배송</span>
                  <span className="bar" style={{ flex: 1, height: 8, borderRadius: 6, background: 'var(--gray)', border: '1px solid var(--line-soft)', overflow: 'hidden', position: 'relative' }}>
                    <span style={{ display: 'block', height: '100%', background: 'var(--green)', width: '25%' }}></span>
                  </span>
                  <span className="mp-n" style={{ width: 22, textAlign: 'right', fontWeight: 500 }}>1</span>
                </div>
                <div className="mp-row" style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14 }}>
                  <span className="mp-l" style={{ width: 56, color: 'var(--muted)' }}>검수</span>
                  <span className="bar" style={{ flex: 1, height: 8, borderRadius: 6, background: 'var(--gray)', border: '1px solid var(--line-soft)', overflow: 'hidden', position: 'relative' }}>
                    <span style={{ display: 'block', height: '100%', background: 'var(--green)', width: '50%' }}></span>
                  </span>
                  <span className="mp-n" style={{ width: 22, textAlign: 'right', fontWeight: 500 }}>2</span>
                </div>
                <div className="mp-row" style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14 }}>
                  <span className="mp-l" style={{ width: 56, color: 'var(--muted)' }}>정산</span>
                  <span className="bar" style={{ flex: 1, height: 8, borderRadius: 6, background: 'var(--gray)', border: '1px solid var(--line-soft)', overflow: 'hidden', position: 'relative' }}>
                    <span style={{ display: 'block', height: '100%', background: 'var(--green)', width: '25%' }}></span>
                  </span>
                  <span className="mp-n" style={{ width: 22, textAlign: 'right', fontWeight: 500 }}>1</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}
