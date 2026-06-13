import * as React from 'react'
import { cn } from '@/lib/utils'

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | number
  color?: string // Ignored
  showText?: boolean
}

export function Logo({
  size = 'md',
  color, // Ignored
  showText = true,
  className,
  ...props
}: LogoProps) {
  const sizeMap = {
    sm: 24,
    md: 30,
    lg: 36,
  }

  const resolvedSize = typeof size === 'number'
    ? size
    : sizeMap[size || 'md']

  return (
    <div className={cn("flex items-center gap-2.5 select-none", className)} {...props}>
      <svg width={resolvedSize} height={resolvedSize} viewBox="0 0 34 34" fill="none">
        <circle cx="17" cy="17" r="16" fill="#B9FF66"/>
        <path d="M17 6a11 11 0 1 0 0 22" stroke="#191A23" strokeWidth="3.4"/>
        <circle cx="17" cy="17" r="4" fill="#191A23"/>
      </svg>
      {showText && (
        <span className="font-bold text-xl tracking-tight text-white">
          Lineup
        </span>
      )}
    </div>
  )
}
