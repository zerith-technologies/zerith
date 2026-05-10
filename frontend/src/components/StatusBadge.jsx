const CONFIG = {
  connecting:   { dot: 'bg-yellow-400 animate-pulse', text: 'Conectando...' },
  connected:    { dot: 'bg-emerald-400',              text: 'Conectado' },
  disconnected: { dot: 'bg-red-500',                  text: 'Desconectado' },
}

export function StatusBadge({ status }) {
  const { dot, text } = CONFIG[status] ?? CONFIG.disconnected
  return (
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${dot}`} />
      <span className="text-xs text-gray-400">{text}</span>
    </div>
  )
}
