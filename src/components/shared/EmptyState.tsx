import React from 'react'

interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  icon = '🔍',
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div
      className="card card-pad"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        textAlign: 'center',
        background: 'var(--white)',
        border: '1px solid var(--dark)',
        borderRadius: 'var(--r-lg)',
      }}
    >
      <div
        style={{
          fontSize: '48px',
          marginBottom: '16px',
          lineHeight: 1,
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontSize: '20px',
          fontWeight: 700,
          color: 'var(--dark)',
          marginBottom: '8px',
        }}
      >
        {title}
      </h3>
      {description && (
        <p
          style={{
            fontSize: '14px',
            color: 'var(--muted)',
            marginBottom: actionLabel ? '24px' : '0',
            maxWidth: '360px',
          }}
        >
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="btn btn-green cursor-pointer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
