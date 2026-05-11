export default function VehicleBlueprint({ status, isDarkMode, isScanning }) {
  const color = status === 'critical' ? '#ef4444' : status === 'warning' ? '#f59e0b' : '#3b82f6'
  const rimColor = '#facc15'
  const tireColor = isDarkMode ? '#020617' : '#111827'
  const hubColor = isDarkMode ? '#1e293b' : '#334155'
  const bodyTop = isDarkMode ? '#64748b' : '#ffffff'
  const bodyBottom = isDarkMode ? '#334155' : '#e2e8f0'
  const bodyStroke = isDarkMode ? '#475569' : '#cbd5e1'

  return (
    <svg
      viewBox="0 0 400 170"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full drop-shadow-xl"
      style={{ filter: `drop-shadow(0px 10px 20px ${color}30)` }}
    >
      <defs>
        <linearGradient id="scan-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={bodyTop} />
          <stop offset="100%" stopColor={bodyBottom} />
        </linearGradient>
        <linearGradient id="glassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="30%" stopColor="#020617" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>
      </defs>

      <ellipse cx="200" cy="155" rx="160" ry="8" fill="#000000" opacity={isDarkMode ? '0.6' : '0.15'} style={{ filter: 'blur(6px)' }} />

      <path d="M 25 130 L 76 130 A 28 28 0 0 1 132 130 L 260 130 A 28 28 0 0 1 316 130 L 360 130 C 370 130, 375 120, 375 110 L 365 92 C 340 88, 300 85, 280 86 L 215 52 C 180 48, 140 50, 90 70 C 55 82, 30 95, 15 105 C 10 110, 15 130, 25 130 Z" fill="url(#bodyGrad)" stroke={bodyStroke} strokeWidth="1.5" />
      <path d="M 275 87 L 212 55 C 175 50, 135 52, 85 72 C 55 83, 35 92, 22 101 L 90 94 L 275 87 Z" fill="url(#glassGrad)" />

      <path d="M 20 105 Q 180 90 365 95" stroke={isDarkMode ? '#94a3b8' : '#64748b'} strokeWidth="1.5" opacity="0.4" />
      <path d="M 132 120 L 260 115" stroke={bodyStroke} strokeWidth="2" opacity="0.8" />
      <path d="M 68 130 A 34 34 0 0 1 140 130" stroke={bodyStroke} strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M 252 130 A 34 34 0 0 1 324 130" stroke={bodyStroke} strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M 132 130 L 132 93" stroke={bodyStroke} strokeWidth="1.5" opacity="0.5" />
      <path d="M 220 130 L 220 89" stroke={bodyStroke} strokeWidth="1.5" opacity="0.5" />
      <rect x="140" y="93" width="14" height="3" rx="1.5" fill="#94a3b8" />
      <rect x="230" y="90" width="14" height="3" rx="1.5" fill="#94a3b8" />
      <path d="M 265 85 L 285 83 L 280 90 L 265 90 Z" fill={bodyTop} stroke={bodyStroke} strokeWidth="1" />

      <g transform="translate(104, 130)">
        <circle cx="0" cy="0" r="24" fill={tireColor} />
        <circle cx="0" cy="0" r="16" fill="none" stroke={rimColor} strokeWidth="3" style={{ filter: 'drop-shadow(0 0 3px #facc15)' }} />
        <circle cx="0" cy="0" r="6" fill={hubColor} />
      </g>
      <g transform="translate(288, 130)">
        <circle cx="0" cy="0" r="24" fill={tireColor} />
        <circle cx="0" cy="0" r="16" fill="none" stroke={rimColor} strokeWidth="3" style={{ filter: 'drop-shadow(0 0 3px #facc15)' }} />
        <circle cx="0" cy="0" r="6" fill={hubColor} />
      </g>

      <path d="M 372 105 L 340 96 L 345 92 L 368 98 Z" fill="#ffffff" style={{ filter: 'drop-shadow(0 0 4px #ffffff)' }} />
      <path d="M 15 105 L 35 98 L 30 108 L 20 110 Z" fill="#ef4444" style={{ filter: 'drop-shadow(0 0 4px #ef4444)' }} />
      <polygon points="375,110 355,112 350,125 365,128" fill="#020617" />

      {isScanning && (
        <g>
          <line x1="0" y1="0" x2="0" y2="170" stroke="#3b82f6" strokeWidth="3" opacity="0.8">
            <animate attributeName="x1" values="-20;420;-20" dur="2.5s" repeatCount="indefinite" />
            <animate attributeName="x2" values="-20;420;-20" dur="2.5s" repeatCount="indefinite" />
          </line>
          <rect x="0" y="0" width="60" height="170" fill="url(#scan-grad)" opacity="0.3">
            <animate attributeName="x" values="-80;380;-80" dur="2.5s" repeatCount="indefinite" />
          </rect>
        </g>
      )}

      {status === 'critical' && (
        <g>
          <circle cx="104" cy="130" r="32" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="6 6" className="animate-spin-slow" style={{ transformOrigin: '104px 130px' }} />
          <line x1="104" y1="130" x2="64" y2="50" stroke="#ef4444" strokeWidth="1.5" opacity="0.8" />
          <circle cx="64" cy="50" r="5" fill="#ef4444" className="animate-pulse" />
        </g>
      )}
      {status === 'warning' && (
        <g>
          <circle cx="288" cy="130" r="32" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 6" className="animate-spin-slow" style={{ transformOrigin: '288px 130px' }} />
        </g>
      )}
    </svg>
  )
}
