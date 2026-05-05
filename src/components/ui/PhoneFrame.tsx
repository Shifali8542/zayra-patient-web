import React, { type ReactNode } from 'react'

interface PhoneFrameProps {
  children: ReactNode
  className?: string
}

export function PhoneFrame({ children, className = '' }: PhoneFrameProps) {
  return (
    <div className={`relative bg-white rounded-[2.5rem] shadow-zayra-lg border-2 border-gray-100 overflow-hidden ${className}`}>
      {/* Notch */}
      <div className="flex justify-center pt-3 pb-1">
        <div className="w-24 h-6 bg-gray-900 rounded-full" />
      </div>
      {/* Content */}
      <div className="overflow-y-auto" style={{ maxHeight: 680 }}>
        {children}
      </div>
    </div>
  )
}
