const DOT = {
  danger: '#E24B4A',
  warn:   '#BA7517',
  ok:     '#1D9E75',
  info:   '#534AB7',
}

function timeAgo(ts) {
  const s = Math.floor((Date.now() - new Date(ts).getTime()) / 1000)
  if (s < 60)   return `${s}s`
  if (s < 3600) return `${Math.floor(s / 60)}m`
  return `${Math.floor(s / 3600)}h`
}

export default function AlertHistory({ alertHistory = [] }) {
  const visible = alertHistory.slice(0, 8)

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <p className="text-[10px] uppercase tracking-widest text-gray-500 px-3 pt-3 pb-2 flex-shrink-0">
        Histórico
      </p>

      <div className="flex-1 overflow-y-auto px-3 pb-3">
        {visible.length === 0 ? (
          <p className="text-xs text-gray-600 text-center pt-6">
            Nenhum alerta ainda...
          </p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {visible.map((a, i) => (
              <div key={i} className="flex gap-2 items-start">
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-[5px]"
                  style={{ backgroundColor: DOT[a.type] ?? DOT.info }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-gray-300 leading-snug break-words">{a.msg}</p>
                  <time className="text-[10px] text-gray-600 tabular-nums">{timeAgo(a.ts)}</time>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
