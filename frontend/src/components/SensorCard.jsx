const RANGES = {
  '0x0B': { min: 0,   max: 255,  warn: 200 },
  '0x0C': { min: 0,   max: 8000, warn: 6500 },
  '0x0D': { min: 0,   max: 200,  warn: 160 },
  '0x05': { min: -40, max: 150,  warn: 105 },
  '0x24': { min: 10,  max: 20,   warn: 18 },
}

const LABELS = {
  '0x0B': 'MAP',
  '0x0C': 'RPM',
  '0x0D': 'Velocidade',
  '0x05': 'Temperatura',
  '0x24': 'Lambda A/F',
}

export function SensorCard({ pid, value, unit }) {
  const range = RANGES[pid] ?? { min: 0, max: 100, warn: 80 }
  const label = LABELS[pid] ?? pid

  const pct = value === null
    ? 0
    : Math.min(100, Math.max(0, ((value - range.min) / (range.max - range.min)) * 100))

  const isWarn = value !== null && value >= range.warn

  const barColor = isWarn
    ? 'bg-amber-400'
    : 'bg-emerald-400'

  const valueColor = isWarn ? 'text-amber-400' : 'text-emerald-400'

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 flex flex-col gap-3 min-w-0">
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          {label}
        </span>
        <span className="text-xs text-gray-500">{pid}</span>
      </div>

      <div className={`text-4xl font-bold tabular-nums ${valueColor}`}>
        {value === null ? '—' : value.toFixed(1)}
        <span className="ml-1 text-sm font-normal text-gray-400">{unit}</span>
      </div>

      {/* gauge bar */}
      <div className="h-2 rounded-full bg-gray-700 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex justify-between text-[10px] text-gray-600">
        <span>{range.min}</span>
        <span>{range.max}</span>
      </div>
    </div>
  )
}
