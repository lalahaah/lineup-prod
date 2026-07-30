import { headers } from 'next/headers'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { CampaignsClient } from '@/components/campaign/CampaignsClient'
import { EmptyState } from '@/components/shared/EmptyState'
import type { CampaignCardData } from '@/app/api/campaigns/route'

async function getCampaigns(): Promise<{ items: CampaignCardData[]; totalActive: number }> {
  try {
    const headersList = await headers()
    const host = headersList.get('host') || 'localhost:3000'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const cookie = headersList.get('cookie') || ''

    const res = await fetch(`${protocol}://${host}/api/campaigns`, {
      headers: { cookie },
      next: { revalidate: 0 },
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch campaigns: ${res.status}`)
    }

    const json = await res.json()
    return {
      items: (json.data as CampaignCardData[]) || [],
      totalActive: json.totalActive ?? (json.data?.length || 0),
    }
  } catch (error) {
    console.error('Error fetching campaigns:', error)
    return { items: [], totalActive: 0 }
  }
}

export default async function CampaignsPage() {
  const { items, totalActive } = await getCampaigns()

  return (
    <div className="main select-none">
      <Header
        title="캠페인"
        subTitle={`9단계 파이프라인 · 진행 중 ${totalActive}건`}
        searchPlaceholder="캠페인 검색"
        actionButton={
          <Link href="/campaigns/new" className="btn font-sans">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            새 캠페인
          </Link>
        }
      />

      {items.length === 0 ? (
        <div className="content">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%' }}>
              <EmptyState
                icon="📋"
                title="진행 중인 캠페인이 없습니다"
                description="새 캠페인을 만들어 시작해보세요"
              />
            </div>
            <div style={{ marginTop: -20, marginBottom: 40 }}>
              <Link
                href="/campaigns/new"
                className="btn btn-green cursor-pointer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}
              >
                + 새 캠페인
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <CampaignsClient initialCampaigns={items} />
      )}
    </div>
  )
}
