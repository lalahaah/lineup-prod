import React from 'react'
import type { CampaignStage } from '@/types'
import { STAGE_LABELS, STAGE_COLORS } from '@/types'

interface StageChipProps {
  stage: CampaignStage
  count: number
}

export function StageChip({ stage, count }: StageChipProps) {
  const dotColor = STAGE_COLORS[stage] || '#191A23'
  const label = STAGE_LABELS[stage] || stage

  return (
    <div className="col-head">
      <span className="dotc" style={{ background: dotColor }} />
      <span className="nm">{label}</span>
      <span className="ct">{count}</span>
    </div>
  )
}
