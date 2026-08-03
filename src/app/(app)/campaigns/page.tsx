import { headers } from 'next/headers'
import { CampaignsClient } from '@/components/campaign/CampaignsClient'
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
      <CampaignsClient initialCampaigns={items} totalActive={totalActive} />
    </div>
  )
}
