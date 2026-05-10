const STATUS = {
  ok:      { label: 'OK',      cls: 'bg-emerald-900/50 text-emerald-400' },
  warning: { label: 'Atenção', cls: 'bg-amber-900/50   text-amber-400'   },
  danger:  { label: 'Alerta',  cls: 'bg-red-900/50     text-red-400'     },
}

function scoreColor(s) {
  if (s >= 80) return '#1D9E75'
  if (s >= 60) return '#BA7517'
  return '#E24B4A'
}

export default function VehicleSidebar({ vehicles = [], activeVehicleId, onSpin }) {
  const ranked = [...vehicles].sort((a, b) => (b.score ?? 100) - (a.score ?? 100))

  return (
    <aside className="flex flex-col border-r border-gray-800 bg-gray-950 overflow-hidden">

      {/* ── Vehicle list ──────────────────────────────────────── */}
      <div className="p-3 border-b border-gray-800 flex-shrink-0">
        <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">Veículos</p>
        <div className="flex flex-col gap-1">
          {vehicles.map(v => {
            const active = v.id === activeVehicleId
            const badge  = STATUS[v.status] ?? STATUS.ok
            return (
              <button
                key={v.id}
                onClick={() => onSpin?.(v.id)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-colors ${
                  active ? 'bg-gray-800' : 'hover:bg-gray-800/50'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: v.color }}
                />
                <span className="flex-1 text-xs font-medium text-gray-200 truncate">{v.name}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold flex-shrink-0 ${badge.cls}`}>
                  {badge.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Weekly ranking ────────────────────────────────────── */}
      <div className="p-3 overflow-y-auto flex-1">
        <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-3">Ranking semanal</p>
        <div className="flex flex-col gap-3">
          {ranked.map((v, i) => (
            <div key={v.id} className="flex items-center gap-2">
              <span className="text-[10px] text-gray-600 w-3 text-center font-mono">{i + 1}</span>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                style={{ backgroundColor: v.color + '28', color: v.color }}
              >
                {v.name.slice(0, 2).toUpperCase()}
              </div>
              <span className="flex-1 text-xs text-gray-300 truncate">{v.name.split(' ')[0]}</span>
              <span
                className="text-xs font-mono font-semibold tabular-nums"
                style={{ color: scoreColor(v.score ?? 100) }}
              >
                {v.score ?? 100}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
