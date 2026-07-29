'use client'

import { useRouter } from 'next/navigation'
import type { CampaignStage } from '@/types'
import type { CampaignCardData } from '@/app/api/campaigns/route'
import { StageChip } from '@/components/campaign/StageChip'
import { CampaignCard } from '@/components/campaign/CampaignCard'

interface CampaignKanbanProps {
  campaigns: CampaignCardData[]
}

const STAGES: CampaignStage[] = [
  'briefing',
  'search',
  'proposal',
  'selection',
  'outreach',
  'shipping',
  'review',
  'uploaded',
  'billing',
]

export function CampaignKanban({ campaigns }: CampaignKanbanProps) {
  const router = useRouter()

  const getCardsByStage = (stage: CampaignStage) => {
    return campaigns.filter((c) => c.stage === stage)
  }

  const handleAddCampaign = () => {
    router.push('/campaigns/new')
  }

  return (
    <div className="board">
      {STAGES.map((stage) => {
        const stageCards = getCardsByStage(stage)
        return (
          <div key={stage} className="col">
            <StageChip stage={stage} count={stageCards.length} />
            <div className="col-body">
              {stageCards.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
              {stage === 'briefing' && (
                <div onClick={handleAddCampaign} className="add-card font-sans">
                  + 캠페인 추가
                </div>
              )}
            </div>
          </div>
        )
      })}

    </div>
  )
}
