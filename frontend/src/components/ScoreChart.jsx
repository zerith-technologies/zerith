import { useRef, useEffect } from 'react'

const W = 164, H = 68
const PAD = { t: 6, r: 6, b: 14, l: 20 }

export default function ScoreChart({ vehicles = [], scoreHistory = [] }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, W, H)

    // Background
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, W, H)

    const iw = W - PAD.l - PAD.r
    const ih = H - PAD.t - PAD.b

    // Horizontal grid lines at 25, 50, 75, 100
    ctx.strokeStyle = '#1e293b'
    ctx.lineWidth = 0.5
    ;[0, 25, 50, 75, 100].forEach(v => {
      const py = PAD.t + (1 - v / 100) * ih
      ctx.beginPath()
      ctx.moveTo(PAD.l, py)
      ctx.lineTo(W - PAD.r, py)
      ctx.stroke()

      // Y-axis labels
      if (v % 50 === 0) {
        ctx.fillStyle = '#334155'
        ctx.font = '5px Inter, sans-serif'
        ctx.textAlign = 'right'
        ctx.fillText(String(v), PAD.l - 2, py + 2)
      }
    })

    if (!scoreHistory.length || !vehicles.length) return

    const n = scoreHistory.length

    vehicles.forEach((v, vi) => {
      const pts = scoreHistory.map((frame, fi) => ({
        x: PAD.l + (fi / Math.max(n - 1, 1)) * iw,
        y: PAD.t + (1 - (frame[vi] ?? 100) / 100) * ih,
      }))

      if (pts.length < 2) return

      // Line
      ctx.beginPath()
      ctx.moveTo(pts[0].x, pts[0].y)
      pts.slice(1).forEach(p => ctx.lineTo(p.x, p.y))
      ctx.strokeStyle = v.color
      ctx.lineWidth = 1.5
      ctx.lineJoin = 'round'
      ctx.stroke()

      // Terminal dot
      const last = pts[pts.length - 1]
      ctx.beginPath()
      ctx.arc(last.x, last.y, 2.5, 0, 2 * Math.PI)
      ctx.fillStyle = v.color
      ctx.fill()
    })

    // Legend row at bottom
    vehicles.forEach((v, vi) => {
      const lx = PAD.l + (vi / vehicles.length) * iw
      const ly = H - 5
      ctx.beginPath()
      ctx.arc(lx + 3, ly, 2, 0, 2 * Math.PI)
      ctx.fillStyle = v.color
      ctx.fill()
      ctx.fillStyle = '#64748b'
      ctx.font = '5px Inter, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(v.name.slice(0, 2).toUpperCase(), lx + 7, ly + 1.5)
    })
  }, [vehicles, scoreHistory])

  return (
    <div className="flex flex-col gap-1 p-2">
      <p className="text-[10px] uppercase tracking-widest text-gray-500">Score</p>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="rounded"
        style={{ imageRendering: 'crisp-edges' }}
      />
    </div>
  )
}
