import { useState } from 'react'
import { Search, Car, Phone, Mail, MoreVertical, Activity, Thermometer, Gauge } from 'lucide-react'

export default function FrotaView({ theme, isDarkMode, vehicleList }) {
  const [query, setQuery] = useState('')

  const filtered = vehicleList.filter(v =>
    !query ||
    v.driver.toLowerCase().includes(query.toLowerCase()) ||
    v.placa.toLowerCase().includes(query.toLowerCase()) ||
    v.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <section className="flex-1 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className={`text-2xl font-light tracking-tight ${theme.textMain}`}>Gestão de Frota Leve</h2>
          <p className={`text-sm ${theme.textMuted} mt-1`}>
            {vehicleList.filter(v => v.on).length} de {vehicleList.length} veículos com telemetria ativa
          </p>
        </div>
        <div className={`flex items-center gap-2 ${theme.card} rounded-full p-1 border shadow-sm`}>
          <div className="relative flex items-center bg-transparent rounded-full">
            <Search size={16} className="text-gray-500 ml-3" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Placa, motorista ou veículo..."
              className={`bg-transparent ${isDarkMode ? 'text-white' : 'text-gray-700'} placeholder-gray-500 py-2 px-3 text-sm focus:outline-none w-52`}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((v) => {
          const rpm   = v.sensors?.['0x0C']?.value
          const speed = v.sensors?.['0x0D']?.value
          const temp  = v.sensors?.['0x05']?.value

          return (
            <div key={v.id} className={`${theme.card} border rounded-[1.5rem] p-5 hover:border-blue-500/50 transition-all duration-300 shadow-sm relative overflow-hidden group`}>
              {/* Color bar top */}
              <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: v.color }}></div>

              {/* Status badge */}
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                  v.frotaStatus === 'em_rota'   ? 'bg-blue-500/10 text-blue-500' :
                  v.frotaStatus === 'manutencao'? 'bg-red-500/10 text-red-500'   :
                                                  'bg-green-500/10 text-green-500'
                }`}>
                  {v.frotaStatus === 'em_rota' ? '● Em Rota' : v.frotaStatus === 'manutencao' ? '⚠ Em Alerta' : '○ Disponível'}
                </span>
                {v.uiStatus !== 'ok' && (
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${v.uiStatus === 'critical' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                    {v.uiStatus === 'critical' ? 'CRÍTICO' : 'ATENÇÃO'}
                  </span>
                )}
              </div>

              {/* Driver info */}
              <div className="flex items-center gap-4 mb-5">
                <img src={v.avatar} alt={v.driver} className={`w-14 h-14 rounded-full border-2 ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-gray-50'}`} />
                <div>
                  <h3 className={`text-base font-bold ${theme.textMain}`}>{v.driver}</h3>
                  <div className={`flex items-center gap-1.5 text-xs ${theme.textMuted} mt-1`}>
                    <Phone size={12} /> {v.phone}
                  </div>
                  <div className={`flex items-center gap-1.5 text-xs ${theme.textMuted} mt-0.5`}>
                    <Mail size={12} /> {v.email}
                  </div>
                </div>
              </div>

              <div className={`h-px w-full ${theme.border} mb-4`}></div>

              {/* Vehicle info */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center`} style={{ backgroundColor: `${v.color}20` }}>
                    <Car size={18} style={{ color: v.color }} />
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${theme.textMain}`}>{v.model}</p>
                    <p className={`text-[10px] font-black uppercase tracking-wider ${theme.textMuted} mt-0.5`}>{v.placa}</p>
                  </div>
                </div>
                <button className={`p-2 rounded-full ${theme.hover} transition-colors`}>
                  <MoreVertical size={16} className={theme.textMuted} />
                </button>
              </div>

              {/* Live sensor badges (only when vehicle is online) */}
              {v.on && (
                <div className="flex gap-2 flex-wrap">
                  {rpm != null && (
                    <span className={`flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded-full ${rpm > 5000 ? 'bg-red-500/10 text-red-500' : isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                      <Activity size={10} /> {rpm.toFixed(0)} rpm
                    </span>
                  )}
                  {speed != null && (
                    <span className={`flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded-full ${speed > 100 ? 'bg-red-500/10 text-red-500' : isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                      <Gauge size={10} /> {speed.toFixed(0)} km/h
                    </span>
                  )}
                  {temp != null && (
                    <span className={`flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded-full ${temp > 100 ? 'bg-red-500/10 text-red-500' : isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                      <Thermometer size={10} /> {temp.toFixed(0)}°C
                    </span>
                  )}
                </div>
              )}
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className={`col-span-3 text-center py-12 ${theme.textMuted}`}>
            <Car size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Nenhum veículo encontrado para &quot;{query}&quot;</p>
          </div>
        )}
      </div>
    </section>
  )
}
