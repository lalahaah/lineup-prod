import React from 'react'

export interface DraftFeedbackProps {
  content: string
  authorType: 'agency' | 'client' | 'influencer'
  authorName: string
  authorRole?: string
  avatarInitial?: string
  avatarColorClass?: string
  createdAt: string
  actionLabel?: string
}

export function DraftFeedback({
  content,
  authorType,
  authorName,
  authorRole = '운영',
  avatarInitial = '우',
  avatarColorClass = 'c1',
  createdAt,
  actionLabel,
}: DraftFeedbackProps) {
  const isMe = authorType === 'agency'

  return (
    <div className={`fb ${isMe ? 'me' : ''}`}>
      <span className={`av ${avatarColorClass} sm`}>{avatarInitial}</span>
      <div>
        <div className="bub">{content}</div>
        <div className="meta">
          {authorName} ({authorRole}) · {createdAt}
          {actionLabel ? ` · ${actionLabel}` : ''}
        </div>
      </div>
    </div>
  )
}
