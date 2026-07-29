import React from 'react'
import type { DraftItem } from '@/app/api/drafts/[id]/route'

interface VersionHistoryProps {
  drafts: DraftItem[]
  activeVersion: number
  onSelectVersion: (version: number) => void
}

export function VersionHistory({ drafts, activeVersion, onSelectVersion }: VersionHistoryProps) {
  const getVersionLabel = (draft: DraftItem) => {
    switch (draft.status) {
      case 'rejected':
        return '반려'
      case 'revision_requested':
        return '수정요청'
      case 'agency_reviewing':
        return '검수 중'
      case 'agency_approved':
        return '에이전시 승인'
      case 'client_approved':
        return '광고주 승인'
      default:
        return '검수 중'
    }
  }

  return (
    <div className="ver-tabs">
      {drafts.map((d) => {
        const isOn = d.version === activeVersion
        const label = getVersionLabel(d)
        const isMuted = d.status === 'rejected' || d.status === 'revision_requested'

        return (
          <span
            key={d.id}
            onClick={() => onSelectVersion(d.version)}
            className={`ver-tab ${isOn ? 'on' : ''}`}
          >
            v{d.version} <span className={`vb ${isMuted ? 'muted' : ''}`}>{label}</span>
          </span>
        )
      })}
      <span className="ver-tab" style={{ borderStyle: 'dashed', color: 'var(--muted)' }}>
        + 재제출 대기
      </span>
    </div>
  )
}
