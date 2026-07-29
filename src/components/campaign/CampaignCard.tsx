import React from 'react'
import Link from 'next/link'
import type { CampaignCardData } from '@/app/api/campaigns/route'

interface CampaignCardProps {
  campaign: CampaignCardData
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const {
    id,
    client_name,
    title,
    status_badge,
    progress,
    meta_text,
    fee_info,
    assignees,
    dday,
    dday_variant,
    border_highlight,
  } = campaign

  const ddayClass =
    dday_variant === 'hot' ? 'dday hot' : dday_variant === 'warm' ? 'dday warm' : 'dday'

  return (
    <Link href={`/campaigns/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div
        className="kcard"
        style={border_highlight ? { borderWidth: '1.5px' } : undefined}
      >
        <div className="ctag">{client_name}</div>
        <div className="kt">{title}</div>

        {status_badge && (
          <div className="kmeta mb-2">
            <span className={`badge ${status_badge.variant}`}>{status_badge.label}</span>
          </div>
        )}

        {progress !== undefined && progress !== null && (
          <div className="bar">
            <span style={{ width: `${progress}%` }} />
          </div>
        )}

        {meta_text && (
          <div className="kmeta">
            <span className="muted" style={{ fontSize: '13px' }}>
              {meta_text}
            </span>
          </div>
        )}

        {fee_info && (
          <div className="kmeta" style={{ marginTop: '9px' }}>
            <span style={{ fontWeight: 600 }}>{fee_info.amount}</span>
            <span className="badge dark">{fee_info.fee_badge}</span>
          </div>
        )}

        <div className="kfoot">
          <div className="av-stack">
            {assignees.map((a, i) => (
              <span key={i} className={`av sm ${a.color || 'c1'}`} title={a.name}>
                {a.avatar}
              </span>
            ))}
          </div>
          <span className={ddayClass}>{dday}</span>
        </div>
      </div>
    </Link>
  )
}
