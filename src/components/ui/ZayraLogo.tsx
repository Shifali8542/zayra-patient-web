import React from 'react'
import iconPng from '../../assets/icon.png'
import logoPng from '../../assets/zayra-logo.png'

interface ZayraLogoProps {
  size?: number
  showText?: boolean
  className?: string
  imgClassName?: string
  variant?: 'icon' | 'logo'
}

export function ZayraLogo({ size = 210, showText = true, className = '', imgClassName = '', variant = 'logo' }: ZayraLogoProps) {
  const src = variant === 'icon' ? iconPng : logoPng
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src={src}
        alt="Zayra"
        style={{ width: size, height: size }}
        className={`rounded-lg flex-shrink-0 object-cover ${imgClassName}`}
      />
      {showText && (
        <span className="font-display text-lg font-semibold tracking-tight">
          Zayra
        </span>
      )}
    </div>
  )
}