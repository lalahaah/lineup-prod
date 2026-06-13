import * as React from 'react'

interface MetricCardProps {
  label: string
  value: string
  delta?: string
  deltaUp?: boolean
  variant?: 'default' | 'green' | 'dark'
  icon: React.ReactNode
}

export function MetricCard({
  label,
  value,
  delta,
  deltaUp,
  variant = 'default',
  icon
}: MetricCardProps) {
  const commonStyle: React.CSSProperties = {
    border: '1px solid var(--dark)',
    borderRadius: 28,
    boxShadow: '0 4px 0 0 var(--dark)',
    padding: '24px 26px',
    boxSizing: 'border-box'
  }

  const variantStyles: Record<'default' | 'green' | 'dark', React.CSSProperties> = {
    default: {
      background: 'var(--white)',
      color: 'var(--dark)'
    },
    green: {
      background: 'var(--green)',
      color: 'var(--dark)'
    },
    dark: {
      background: 'var(--dark)',
      color: 'white'
    }
  }

  const icBg = variant === 'green' ? 'var(--dark)' : 'var(--green)'
  const icStyle: React.CSSProperties = {
    width: 34,
    height: 34,
    borderRadius: 9,
    background: icBg,
    float: 'right',
    display: 'grid',
    placeItems: 'center'
  }

  const lblStyle: React.CSSProperties = {
    fontSize: 14,
    color: variant === 'dark' ? '#A9AAB4' : 'var(--muted)',
    display: 'flex',
    alignItems: 'center',
    gap: 8
  }

  const valStyle: React.CSSProperties = {
    fontSize: 42,
    fontWeight: 600,
    letterSpacing: -1.5,
    marginTop: 8,
    lineHeight: 1
  }

  let deltaColor = 'var(--muted)'
  if (variant === 'green') {
    deltaColor = 'var(--dark)'
  } else if (deltaUp) {
    deltaColor = '#1f8a3b'
  } else if (variant === 'dark') {
    deltaColor = '#A9AAB4'
  }

  const deltaStyle: React.CSSProperties = {
    fontSize: 13,
    marginTop: 10,
    color: deltaColor,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5
  }

  return (
    <div style={{ ...commonStyle, ...variantStyles[variant] }} className="stat">
      {icon && (
        <div style={icStyle} className="ic">
          {icon}
        </div>
      )}
      <div style={lblStyle} className="lbl">
        {label}
      </div>
      <div style={valStyle} className="num">
        {value}
      </div>
      {delta && (
        <div style={deltaStyle} className="delta">
          {delta}
        </div>
      )}
    </div>
  )
}
