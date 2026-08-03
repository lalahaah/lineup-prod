import React from 'react'
import type { CampaignStage } from '@/types'
import { STAGE_LABELS } from '@/types'

interface CampaignStepperProps {
  currentStage: CampaignStage
}

const STAGE_ORDER: CampaignStage[] = [
  'preparing',
  'client_review',
  'outreaching',
  'reviewing',
  'done',
]

export function CampaignStepper({ currentStage }: CampaignStepperProps) {
  const currentIndex = STAGE_ORDER.indexOf(currentStage) !== -1
    ? STAGE_ORDER.indexOf(currentStage)
    : 0

  return (
    <div className="steps">
      {STAGE_ORDER.map((stage, idx) => {
        const isDone = idx < currentIndex
        const isCur = idx === currentIndex
        const label = STAGE_LABELS[stage] || stage
        const stepNum = idx + 1

        let stepClass = 'step'
        if (isDone) stepClass += ' done'
        if (isCur) stepClass += ' cur'

        return (
          <React.Fragment key={stage}>
            <div className={stepClass}>
              <span className="b">{isDone ? '✓' : stepNum}</span>
              {label}
            </div>
            {idx < STAGE_ORDER.length - 1 && (
              <span className={`step-seg ${isDone ? 'done' : ''}`} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
