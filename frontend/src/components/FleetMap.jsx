import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// ── Constants ───────────────────────────────────────────────────────────────
const CENTER = [-18.9386, -46.9928]  // Patrocínio-MG
const ZOOM   = 13

// Prevent Leaflet from trying to load its own default marker images
delete L.Icon.Default.prototype._getIconUrl

// ── Route waypoints [lat, lng] following real Patrocínio streets ─────────────
const ROUTES = {
  // Fiat Mobi — Av. Dr. Laerte Vieira → loop pelo centro
  mobi: [
    [-18.9355, -46.9935],
    [-18.9368, -46.9918],
    [-18.9380, -46.9905],
    [-18.9393, -46.9896],
    [-18.9403, -46.9912],
    [-18.9392, -46.9930],
    [-18.9376, -46.9944],
    [-18.9360, -46.9940],
  ],
  // VW Saveiro — BR-365 norte (Patos de Minas)
  saveiro: [
    [-18.9218, -46.9852],
    [-18.9245, -46.9873],
    [-18.9272, -46.9892],
    [-18.9298, -46.9908],
    [-18.9320, -46.9916],
    [-18.9295, -46.9901],
    [-18.9265, -46.9882],
    [-18.9238, -46.9863],
  ],
  // VW Polo — Bairro Comercial
  polo: [
    [-18.9416, -46.9908],
    [-18.9428, -46.9891],
    [-18.9420, -46.9872],
    [-18.9406, -46.9865],
    [-18.9393, -46.9879],
    [-18.9401, -46.9897],
    [-18.9411, -46.9912],
  ],
  // Fiat Strada — MG-187 sul (Monte Carmelo)
  strada: [
    [-18.9538, -46.9952],
    [-18.9516, -46.9936],
    [-18.9493, -46.9924],
    [-18.9470, -46.9918],
    [-18.9458, -46.9929],
    [-18.9476, -46.9942],
    [-18.9500, -46.9950],
    [-18.9524, -46.9957],
  ],
}

const DRIVERS = {
  mobi:    { driver: 'João Belo',    plate: 'PBM-3421' },
  saveiro: { driver: 'Maria Silva',  plate: 'QCX-7890' },
  polo:    { driver: 'Carlos Lima',  plate: 'RTD-5566' },
  strada:  { driver: 'Ana Ferreira', plate: 'SYE-1234' },
}

const STATUS_LABEL = { ok: 'Normal', warning: 'Atenção', danger: 'Alerta' }
const STATUS_COLOR = { ok: '#1D9E75', warning: '#BA7517', danger: '#E24B4A' }

// ── Helpers ──────────────────────────────────────────────────────────────────
function makeIcon(vehicle) {
  return L.divIcon({
    html: `<div style="
      width:34px;height:34px;border-radius:50%;
      background:${vehicle.color};border:2.5px solid #fff;
      display:flex;align-items:center;justify-content:center;
      font-size:11px;font-weight:700;color:#fff;
      font-family:Inter,ui-sans-serif,sans-serif;
      box-shadow:0 2px 12px rgba(0,0,0,0.55);
    ">${vehicle.name.slice(0, 2).toUpperCase()}</div>`,
    className: '',
    iconSize:    [34, 34],
    iconAnchor:  [17, 17],
    popupAnchor: [0, -20],
  })
}

// ── MapController — flyTo logic (must live inside MapContainer) ──────────────
function MapController({ activeVehicleId, events, posRef }) {
  const map          = useMap()
  const prevActiveId = useRef(null)
  const prevEventId  = useRef(null)

  // flyTo when sidebar / wheel changes active vehicle
  useEffect(() => {
    if (activeVehicleId === prevActiveId.current) return
    prevActiveId.current = activeVehicleId
    const pos = posRef.current[activeVehicleId]
    if (pos) map.flyTo([pos.lat, pos.lng], 15, { duration: 1.5 })
  }, [activeVehicleId, map, posRef])

  // flyTo on new WebSocket event
  useEffect(() => {
    if (!events.length) return
    const latest = events[0]
    if (latest.id === prevEventId.current) return
    prevEventId.current = latest.id
    const pos = posRef.current[latest.vehicleId]
    if (pos) map.flyTo([pos.lat, pos.lng], 16, { duration: 1.2 })
  }, [events, map, posRef])

  return null
}

// ── Animated vehicle marker ───────────────────────────────────────────────────
// targetPos updates every 3 s. A local interval interpolates displayPos smoothly
// toward targetPos and passes it to react-leaflet as the position prop — no jumps.
function VehicleMarker({ vehicle, targetPos }) {
  const [displayPos, setDisplayPos] = useState(targetPos)
  const curRef    = useRef(targetPos)
  const targetRef = useRef(targetPos)

  useEffect(() => { targetRef.current = targetPos }, [targetPos])

  useEffect(() => {
    const id = setInterval(() => {
      const t   = targetRef.current
      const c   = curRef.current
      const dlat = t.lat - c.lat
      const dlng = t.lng - c.lng
      if (Math.abs(dlat) < 1e-7 && Math.abs(dlng) < 1e-7) return
      const next = { lat: c.lat + dlat * 0.14, lng: c.lng + dlng * 0.14 }
      curRef.current = next
      setDisplayPos(next)
    }, 80)  // ~12 fps interpolation
    return () => clearInterval(id)
  }, [])

  const info  = DRIVERS[vehicle.id] ?? { driver: vehicle.name, plate: '—' }
  const speed = vehicle.sensors?.['0x0D']?.value

  return (
    <Marker
      position={[displayPos.lat, displayPos.lng]}
      icon={makeIcon(vehicle)}
    >
      <Popup>
        <div style={{ fontFamily: 'Inter, ui-sans-serif, sans-serif', minWidth: 168, fontSize: 12 }}>
          <p style={{ fontWeight: 700, margin: '0 0 8px', fontSize: 13 }}>{info.driver}</p>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <tbody>
              {[
                ['Modelo',     vehicle.name],
                ['Placa',      info.plate],
                ['Velocidade', speed != null ? `${speed} km/h` : '—'],
                ['Status',     STATUS_LABEL[vehicle.status] ?? 'Normal'],
              ].map(([k, v]) => (
                <tr key={k}>
                  <td style={{ color: '#888', paddingRight: 10, paddingBottom: 4 }}>{k}</td>
                  <td style={{
                    fontWeight: 600,
                    color: k === 'Status'
                      ? (STATUS_COLOR[vehicle.status] ?? '#1D9E75')
                      : '#111',
                  }}>
                    {v}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Popup>
    </Marker>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function FleetMap({ vehicles = [], activeVehicleId, events = [] }) {
  const wpRef      = useRef({})
  const vehiclesRef = useRef(vehicles)
  useEffect(() => { vehiclesRef.current = vehicles }, [vehicles])

  // Target positions (updated every 3 s by waypoint timer)
  const [positions, setPositions] = useState(() => {
    const p = {}
    vehicles.forEach(v => {
      const r = ROUTES[v.id]
      if (r) { p[v.id] = { lat: r[0][0], lng: r[0][1] }; wpRef.current[v.id] = 0 }
    })
    return p
  })

  // posRef used by MapController for flyTo (always current)
  const posRef = useRef(positions)
  useEffect(() => { posRef.current = positions }, [positions])

  // Init positions for vehicles that arrive after mount
  useEffect(() => {
    setPositions(prev => {
      const next = { ...prev }
      vehicles.forEach(v => {
        if (v.id in next) return
        const r = ROUTES[v.id]
        if (r) { next[v.id] = { lat: r[0][0], lng: r[0][1] }; wpRef.current[v.id] = 0 }
      })
      return next
    })
  }, [vehicles])

  // Advance to next waypoint every 3 s
  useEffect(() => {
    const t = setInterval(() => {
      setPositions(prev => {
        const next = { ...prev }
        vehiclesRef.current.forEach(v => {
          if (v.on === false) return
          const r = ROUTES[v.id]
          if (!r) return
          const cur = wpRef.current[v.id] ?? 0
          const nxt = (cur + 1) % r.length
          wpRef.current[v.id] = nxt
          next[v.id] = { lat: r[nxt][0], lng: r[nxt][1] }
        })
        return next
      })
    }, 3000)
    return () => clearInterval(t)
  }, [])

  return (
    <MapContainer
      center={CENTER}
      zoom={ZOOM}
      style={{ width: '100%', height: '100%' }}
      zoomControl={false}
    >
      {/* CartoDB Dark Matter tiles — matches the dark dashboard theme */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      <MapController
        activeVehicleId={activeVehicleId}
        events={events}
        posRef={posRef}
      />

      {vehicles.map(v => {
        if (v.on === false) return null
        const pos = positions[v.id]
        if (!pos) return null
        return <VehicleMarker key={v.id} vehicle={v} targetPos={pos} />
      })}
    </MapContainer>
  )
}
