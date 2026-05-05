import React from 'react'

interface ECGChartProps {
  className?: string
  color?: string
  height?: number
}

export function ECGChart({ className = '', color = '#00C2B2', height = 60 }: ECGChartProps) {
  return (
    <div className={`w-full ${className}`}>
      <svg
        viewBox="0 0 300 60"
        xmlns="http://www.w3.org/2000/svg"
        style={{ height }}
        className="w-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="ecgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="50%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <path
          d="M0,30 L20,30 L25,30 L30,10 L35,50 L40,5 L45,55 L50,30 L60,30 L80,30 L85,30 L90,10 L95,50 L100,5 L105,55 L110,30 L120,30 L140,30 L145,30 L150,10 L155,50 L160,5 L165,55 L170,30 L180,30 L200,30 L205,30 L210,10 L215,50 L220,5 L225,55 L230,30 L240,30 L260,30 L265,30 L270,10 L275,50 L280,5 L285,55 L290,30 L300,30"
          fill="none"
          stroke={`url(#ecgGrad)`}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="ecg-line"
          style={{
            strokeDasharray: 800,
            strokeDashoffset: 0,
            animation: 'ecgDraw 3s linear infinite',
          }}
        />
        <style>{`
          @keyframes ecgDraw {
            0% { stroke-dashoffset: 800; opacity: 0.4; }
            50% { opacity: 1; }
            100% { stroke-dashoffset: 0; opacity: 0.4; }
          }
        `}</style>
      </svg>
    </div>
  )
}
