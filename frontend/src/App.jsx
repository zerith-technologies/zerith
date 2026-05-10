import { useMemo, useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useFleet }     from './hooks/useFleet'
import WheelCanvas      from './components/WheelCanvas'
import EventFeed        from './components/EventFeed'
import VehicleSidebar   from './components/VehicleSidebar'
import FleetMap         from './components/FleetMap'
import ScoreChart       from './components/ScoreChart'
import AlertHistory     from './components/AlertHistory'

const PID_KEY = { '0x0C': 'rpm', '0x0D': 'speed', '0x05': 'temp', '0x0B': 'map', '0x24': 'lambda' }

const WS_LABEL = { connected: '● online', disconnected: '○ offline', error: '⚠ erro' }
const WS_COLOR = { connected: '#1D9E75',  disconnected: '#64748b',    error: '#E24B4A' }

export default function App() {
  const { fleet, vehicles, activeVehicleId, wsStatus, spinTo } = useFleet()

  // ── Enriched vehicle list ──────────────────────────────────────────────────
  const vehicleList = useMemo(() =>
    vehicles.map(v => {
      const fd = fleet[v.id] ?? {}
      const on = Object.values(fd.sensors ?? {}).some(s => s.value != null)
      return { ...v, ...fd, on }
    }),
  [fleet, vehicles])

  // ── Sensor snapshot helper ─────────────────────────────────────────────────
  const sensorSnap = (fd) =>
    Object.entries(fd.sensors ?? {}).reduce((acc, [pid, s]) => {
      const k = PID_KEY[pid]
      if (k) acc[k] = { value: s.value, unit: s.unit }
      return acc
    }, {})

  // ── Events feed (merged alerts from all vehicles) ──────────────────────────
  const events = useMemo(() => {
    const all = []
    vehicles.forEach(v => {
      const fd = fleet[v.id]
      if (!fd) return
      fd.alerts.forEach(a => {
        all.push({
          id:        a.id,
          vehicleId: v.id,
          type:      a.level === 'danger' ? 'danger' : 'warn',
          msg:       `${a.name.replace(/_/g, ' ')}: ${
                       typeof a.value === 'number'
                         ? a.value.toFixed(a.value < 10 ? 2 : 0)
                         : a.value
                     } ${a.unit}`,
          ts:        a.timestamp,
          vehicle: {
            initials: v.name.slice(0, 2).toUpperCase(),
            model:    v.name,
            color:    '#fff',
            bg:       v.color,
          },
          sensors: sensorSnap(fd),
        })
      })
    })
    return all.sort((a, b) => new Date(b.ts) - new Date(a.ts)).slice(0, 10)
  }, [fleet, vehicles])  // eslint-disable-line react-hooks/exhaustive-deps

  // ── Alert history for right panel ─────────────────────────────────────────
  const alertHistory = useMemo(() =>
    events.slice(0, 8).map(e => ({
      type: e.type,
      msg:  `${e.vehicle.model} — ${e.msg}`,
      ts:   e.ts,
    })),
  [events])

  // ── Score history (snapshot every 5 s, keep last 40 frames) ───────────────
  const [scoreHistory, setScoreHistory] = useState([[]])
  const fleetRef    = useRef(fleet)
  const vehiclesRef = useRef(vehicles)
  useEffect(() => { fleetRef.current    = fleet    }, [fleet])
  useEffect(() => { vehiclesRef.current = vehicles }, [vehicles])

  useEffect(() => {
    const t = setInterval(() => {
      const frame = vehiclesRef.current.map(v => fleetRef.current[v.id]?.score ?? 100)
      setScoreHistory(prev => [...prev, frame].slice(-40))
    }, 5000)
    return () => clearInterval(t)
  }, [])

  // ── Layout ─────────────────────────────────────────────────────────────────
  return (
    <div
      className="h-screen overflow-hidden bg-gray-950 text-gray-100 font-sans"
      style={{ display: 'grid', gridTemplateColumns: '196px 1fr 176px', gridTemplateRows: 'auto 1fr' }}
    >
      {/* ── Navbar (spans all 3 cols) ──────────────────────────────────────── */}
      <header
        className="border-b border-gray-800 px-5 py-3 flex items-center gap-3 bg-gray-950"
        style={{ gridColumn: '1 / -1' }}
      >
        <span className="text-sm font-bold tracking-tight text-white">ZERITH</span>
        <span className="text-[10px] text-gray-500 uppercase tracking-widest">Fleet Intelligence</span>
        <Link
          to="/gestao"
          className="ml-auto mr-4 text-[10px] uppercase tracking-widest text-gray-500 hover:text-gray-300 transition-colors"
        >
          Gestão →
        </Link>
        <span className="text-[10px] tabular-nums" style={{ color: WS_COLOR[wsStatus] ?? '#64748b' }}>
          {WS_LABEL[wsStatus] ?? wsStatus}
        </span>
      </header>

      {/* ── Left: VehicleSidebar ──────────────────────────────────────────── */}
      <VehicleSidebar
        vehicles={vehicleList}
        activeVehicleId={activeVehicleId}
        onSpin={spinTo}
      />

      {/* ── Center: wheel (top) + map & feed (bottom) ─────────────────────── */}
      <main
        className="flex flex-col overflow-hidden border-x border-gray-800"
      >
        {/* Half-moon wheel — flex-shrink-0 so it never compresses */}
        <div className="flex justify-center flex-shrink-0 bg-gray-950 border-b border-gray-800 overflow-hidden">
          <WheelCanvas
            vehicles={vehicleList}
            activeVehicleId={activeVehicleId}
            onSpin={spinTo}
          />
        </div>

        {/* Below wheel: FleetMap (left) | EventFeed (right) */}
        <div
          className="flex-1 overflow-hidden"
          style={{ display: 'grid', gridTemplateColumns: '1fr 300px' }}
        >
          <FleetMap
            vehicles={vehicleList}
            activeVehicleId={activeVehicleId}
            events={events}
          />

          <div className="border-l border-gray-800 overflow-hidden flex flex-col">
            <EventFeed
              events={events}
              onFocus={spinTo}
              onSpin={spinTo}
            />
          </div>
        </div>
      </main>

      {/* ── Right: AlertHistory (top) + ScoreChart (bottom) ──────────────── */}
      <aside className="flex flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden border-b border-gray-800">
          <AlertHistory alertHistory={alertHistory} />
        </div>
        <div className="flex-shrink-0">
          <ScoreChart vehicles={vehicleList} scoreHistory={scoreHistory} />
        </div>
      </aside>
    </div>
  )
}
