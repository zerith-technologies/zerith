import { useRef, useEffect, useCallback } from 'react'

const W = 620, H = 330
const CX = W / 2          // 310 — horizontal center
const CY = H              // 330 — circle center sits at the very bottom edge
const R = 304             // just touches the canvas sides
const N = 4               // vehicles / slices
const SLICE = (2 * Math.PI) / N   // 90° each
const DURATION = 2800

function ease(t) {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2
}

// Rotation that places slice `idx` center at the top (-π/2)
function targetRot(idx) {
  return -Math.PI / 2 - (idx * SLICE + SLICE / 2)
}

// Shortest signed delta between two angles
function shortestArc(from, to) {
  return ((to - from + 3 * Math.PI) % (2 * Math.PI)) - Math.PI
}

function paint(ctx, vehicles, rot, activeId) {
  ctx.clearRect(0, 0, W, H)

  vehicles.forEach((v, i) => {
    const a0 = rot + i * SLICE
    const a1 = a0 + SLICE
    const am = a0 + SLICE / 2    // midpoint angle of this slice
    const active = v.id === activeId

    // ── Slice fill ──────────────────────────────────────────────────
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(CX, CY)
    ctx.arc(CX, CY, R, a0, a1)
    ctx.closePath()
    if (active) { ctx.shadowColor = v.color; ctx.shadowBlur = 24 }
    ctx.fillStyle = active ? v.color + 'dd' : v.color + '3a'
    ctx.fill()
    ctx.shadowBlur = 0
    ctx.strokeStyle = '#0f172a'
    ctx.lineWidth = 3
    ctx.stroke()
    ctx.restore()

    // ── Text & dots — skip if midpoint is below the canvas edge ─────
    const tmx = CX + R * 0.62 * Math.cos(am)
    const tmy = CY + R * 0.62 * Math.sin(am)
    if (tmy >= CY) return

    // Rotate text so it reads from center outward
    ctx.save()
    ctx.translate(tmx, tmy)
    let ta = am + Math.PI / 2
    // Flip so text never reads upside-down
    if (Math.sin(ta) > 0) ta += Math.PI
    ctx.rotate(ta)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // Initials
    ctx.font = 'bold 18px Inter, ui-sans-serif, sans-serif'
    ctx.fillStyle = active ? '#ffffff' : 'rgba(255,255,255,0.42)'
    ctx.fillText(v.name.slice(0, 2).toUpperCase(), 0, -11)

    // Model name
    ctx.font = '12px Inter, ui-sans-serif, sans-serif'
    ctx.fillStyle = active ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.28)'
    ctx.fillText(v.name, 0, 7)
    ctx.restore()

    // ── Alert dot (red = danger, amber = warning) ────────────────────
    if (v.status && v.status !== 'ok') {
      const dr = R * 0.83
      const dx = CX + dr * Math.cos(am)
      const dy = CY + dr * Math.sin(am)
      if (dy < CY) {
        const col = v.status === 'danger' ? '#ef4444' : '#f59e0b'
        ctx.beginPath()
        ctx.arc(dx, dy, 6, 0, 2 * Math.PI)
        ctx.fillStyle = col
        ctx.shadowColor = col
        ctx.shadowBlur = 10
        ctx.fill()
        ctx.shadowBlur = 0
      }
    }

    // ── Online dot (green, smaller) ──────────────────────────────────
    if (v.on) {
      const or_ = R * 0.73
      const ox = CX + or_ * Math.cos(am)
      const oy = CY + or_ * Math.sin(am)
      if (oy < CY) {
        ctx.beginPath()
        ctx.arc(ox, oy, 4, 0, 2 * Math.PI)
        ctx.fillStyle = '#22c55e'
        ctx.shadowColor = '#22c55e'
        ctx.shadowBlur = 8
        ctx.fill()
        ctx.shadowBlur = 0
      }
    }
  })

  // ── Rim (top semicircle outline) ──────────────────────────────────
  ctx.beginPath()
  ctx.arc(CX, CY, R, Math.PI, 0, true)
  ctx.strokeStyle = 'rgba(255,255,255,0.1)'
  ctx.lineWidth = 2
  ctx.stroke()

  // Inner hub circle
  ctx.beginPath()
  ctx.arc(CX, CY, 18, 0, 2 * Math.PI)
  ctx.fillStyle = '#1e293b'
  ctx.strokeStyle = 'rgba(255,255,255,0.15)'
  ctx.lineWidth = 2
  ctx.fill()
  ctx.stroke()

  // ── Pointer triangle at top center, tip pointing DOWN ────────────
  ctx.beginPath()
  ctx.moveTo(CX,      30)   // tip
  ctx.lineTo(CX - 13,  6)   // left base
  ctx.lineTo(CX + 13,  6)   // right base
  ctx.closePath()
  ctx.fillStyle = '#f8fafc'
  ctx.shadowColor = '#f8fafc'
  ctx.shadowBlur = 14
  ctx.fill()
  ctx.shadowBlur = 0
}

export default function WheelCanvas({ vehicles = [], activeVehicleId, onSpin }) {
  const canvasRef = useRef(null)
  const rotRef    = useRef(targetRot(0))
  const rafRef    = useRef(null)
  const animRef   = useRef(null)
  const vRef      = useRef(vehicles)
  const aRef      = useRef(activeVehicleId)

  useEffect(() => { vRef.current = vehicles },        [vehicles])
  useEffect(() => { aRef.current = activeVehicleId }, [activeVehicleId])

  const redraw = useCallback((r) => {
    const ctx = canvasRef.current?.getContext('2d')
    if (ctx) paint(ctx, vRef.current, r, aRef.current)
  }, [])

  // Animate wheel to the target rotation on activeVehicleId change
  useEffect(() => {
    if (!vehicles.length) return
    const idx = vehicles.findIndex(v => v.id === activeVehicleId)
    if (idx < 0) return

    const from = rotRef.current
    const to   = from + shortestArc(from, targetRot(idx))

    cancelAnimationFrame(rafRef.current)
    animRef.current = { from, to, t0: null }

    function step(ts) {
      const s = animRef.current
      if (!s.t0) s.t0 = ts
      const t = Math.min((ts - s.t0) / DURATION, 1)
      const r = s.from + (s.to - s.from) * ease(t)
      rotRef.current = r
      redraw(r)
      if (t < 1) rafRef.current = requestAnimationFrame(step)
      else rotRef.current = s.to
    }

    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [activeVehicleId, vehicles, redraw])

  // First paint when vehicles array arrives
  useEffect(() => {
    if (vehicles.length) redraw(rotRef.current)
  }, [vehicles, redraw])

  const handleClick = useCallback((e) => {
    if (!onSpin || !vRef.current.length) return
    const canvas = canvasRef.current
    const rect   = canvas.getBoundingClientRect()
    const mx = (e.clientX - rect.left) * (W / rect.width)
    const my = (e.clientY - rect.top)  * (H / rect.height)

    if (my >= CY) return                             // below fold
    const dx = mx - CX, dy = my - CY
    if (dx * dx + dy * dy > R * R) return            // outside circle

    // Map click angle → slice index (accounting for current rotation)
    let ang = Math.atan2(dy, dx) - rotRef.current
    ang = ((ang % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
    const idx = Math.floor(ang / SLICE) % vRef.current.length
    onSpin(vRef.current[idx].id)
  }, [onSpin])

  return (
    <canvas
      ref={canvasRef}
      width={W}
      height={H}
      onClick={handleClick}
      style={{ cursor: 'pointer', display: 'block' }}
    />
  )
}
