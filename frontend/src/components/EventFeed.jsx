import { useState, useRef, useEffect } from 'react'

const TYPE_BORDER = { danger: '#E24B4A', warn: '#BA7517', ok: '#1D9E75', info: '#534AB7' }

const SENSORS = [
  { key: 'rpm',    label: 'RPM',   unit: 'rpm',  max: 8000, warn: 5000, danger: 6000 },
  { key: 'speed',  label: 'Vel.',  unit: 'km/h', max: 160,  warn: 80,   danger: 100  },
  { key: 'temp',   label: 'Temp.', unit: '°C',   max: 120,  warn: 90,   danger: 100  },
  { key: 'map',    label: 'MAP',   unit: 'kPa',  max: 120,  warn: 80,   danger: 100  },
  { key: 'lambda', label: 'λ A/F', unit: 'A/F',  max: 20,   warn: null, danger: null },
]

const ANIM_CSS = `
@keyframes zerith-slide-in {
  from { transform: translateY(-14px); opacity: 0; }
  to   { transform: translateY(0);     opacity: 1; }
}
.zerith-event-new { animation: zerith-slide-in 0.35s ease-out; }
`

function barColor(sensor, value) {
  if (value == null) return '#374151'
  if (sensor.key === 'lambda') {
    const dev = Math.abs(value - 14.7)   // deviation from stoichiometric
    if (dev > 3.0) return '#E24B4A'
    if (dev > 1.5) return '#BA7517'
    return '#1D9E75'
  }
  if (sensor.danger != null && value >= sensor.danger) return '#E24B4A'
  if (sensor.warn  != null && value >= sensor.warn)   return '#BA7517'
  return '#1D9E75'
}

function barPct(sensor, value) {
  if (value == null) return 0
  return Math.min(100, (value / sensor.max) * 100)
}

function timeAgo(ts) {
  const s = Math.floor((Date.now() - new Date(ts).getTime()) / 1000)
  if (s < 60)   return `${s}s`
  if (s < 3600) return `${Math.floor(s / 60)}m`
  return `${Math.floor(s / 3600)}h`
}

// ── Gauge row ───────────────────────────────────────────────────────────────
function Gauge({ sensor, value }) {
  const col = barColor(sensor, value)
  const w   = barPct(sensor, value)
  const display = value != null
    ? `${typeof value === 'number' ? value.toFixed(value < 10 ? 2 : 0) : value} ${sensor.unit}`
    : '—'

  return (
    <div className="grid items-center gap-2" style={{ gridTemplateColumns: '3rem 1fr 5rem' }}>
      <span className="text-[10px] text-gray-400">{sensor.label}</span>
      <div className="h-1.5 rounded-full bg-gray-700 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${w}%`, backgroundColor: col }}
        />
      </div>
      <span className="text-[10px] font-mono text-right tabular-nums" style={{ color: col }}>
        {display}
      </span>
    </div>
  )
}

// ── Single event card ───────────────────────────────────────────────────────
function EventCard({ event, isNew, onFocus, onSpin }) {
  const [open, setOpen] = useState(false)
  const elRef = useRef(null)

  // Trigger slide-in animation whenever this card is flagged as new
  useEffect(() => {
    if (!isNew || !elRef.current) return
    const el = elRef.current
    el.classList.remove('zerith-event-new')
    void el.offsetHeight   // force reflow so the removal takes effect
    el.classList.add('zerith-event-new')
  }, [isNew])

  const borderColor = TYPE_BORDER[event.type] ?? TYPE_BORDER.info

  return (
    <article
      ref={elRef}
      className="rounded-xl bg-gray-800/80 border border-gray-700/60 overflow-hidden"
      style={{ borderLeft: `4px solid ${borderColor}` }}
    >
      {/* ── Header row ─────────────────────────────────────────── */}
      <div className="p-3">
        <div className="flex gap-3 items-start">

          {/* Avatar — click to focus in sidebar */}
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 hover:ring-2 hover:ring-white/20 transition"
            style={{ backgroundColor: event.vehicle.bg, color: event.vehicle.color }}
            onClick={() => onFocus?.(event.vehicleId)}
            title="Ir para veículo"
          >
            {event.vehicle.initials}
          </button>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-baseline gap-1 mb-0.5">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-sm font-semibold text-white leading-none truncate">
                  {event.vehicle.initials}
                </span>
                <span className="text-[11px] text-gray-500 truncate">{event.vehicle.model}</span>
              </div>
              <time className="text-[11px] text-gray-500 flex-shrink-0 tabular-nums">
                {timeAgo(event.ts)}
              </time>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">{event.msg}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-2 pl-12 flex gap-4">
          <button
            onClick={() => setOpen(o => !o)}
            className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
          >
            {open ? 'Fechar ▲' : 'Ver detalhes ▼'}
          </button>
          <button
            onClick={() => onSpin?.(event.vehicleId)}
            className="text-[11px] text-gray-400 hover:text-white transition-colors"
          >
            Focar
          </button>
        </div>
      </div>

      {/* ── Inline sensor panel ─────────────────────────────────── */}
      {open && (
        <div className="border-t border-gray-700/60 bg-gray-900/60 px-3 pt-2.5 pb-3 flex flex-col gap-2">
          <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-0.5">
            Sensores — {event.vehicle.model}
          </p>
          {SENSORS.map(s => (
            <Gauge
              key={s.key}
              sensor={s}
              value={event.sensors?.[s.key]?.value ?? null}
            />
          ))}
        </div>
      )}
    </article>
  )
}

// ── Feed ────────────────────────────────────────────────────────────────────
export default function EventFeed({ events = [], onFocus, onSpin }) {
  const prevIds = useRef(new Set())
  const [newIds, setNewIds] = useState(new Set())

  useEffect(() => {
    const incoming = events.map(e => e.id).filter(id => !prevIds.current.has(id))
    prevIds.current = new Set(events.map(e => e.id))
    if (!incoming.length) return

    setNewIds(prev => new Set([...prev, ...incoming]))
    const t = setTimeout(() => {
      setNewIds(prev => {
        const next = new Set(prev)
        incoming.forEach(id => next.delete(id))
        return next
      })
    }, 400)
    return () => clearTimeout(t)
  }, [events])

  const visible = events.slice(0, 10)

  return (
    <>
      <style>{ANIM_CSS}</style>
      <div className="flex flex-col gap-2 overflow-y-auto p-3 h-full">
        {visible.length === 0 && (
          <p className="text-xs text-gray-600 text-center pt-8">Sem eventos recentes</p>
        )}
        {visible.map(event => (
          <EventCard
            key={event.id}
            event={event}
            isNew={newIds.has(event.id)}
            onFocus={onFocus}
            onSpin={onSpin}
          />
        ))}
      </div>
    </>
  )
}
