import React from 'react'
import iconPng from '../../assets/icon.png'

interface ZayraLogoProps {
  size?: number
  showText?: boolean
  className?: string
}

export function ZayraLogo({ size = 40, showText = true, className = '' }: ZayraLogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src={iconPng}
        alt="Zayra"
        style={{ width: size, height: size }}
        className="rounded-full flex-shrink-0 object-contain"
      />

      {/* ✅ FIXED: Bold, large text matching Image 1 */}
      {showText && (
        <span
          className="font-display font-bold text-zayra-navy dark:text-white"
          style={{ fontSize: size * 0.48, letterSpacing: '-0.01em' }}
        >
          Zayra
        </span>
      )}
    </div>
  )
}
