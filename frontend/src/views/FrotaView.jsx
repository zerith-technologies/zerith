import { Search, Car, Phone, Mail, MoreVertical } from 'lucide-react'

export default function FrotaView({ theme, isDarkMode, fleetDrivers }) {
  return (
    <section className="flex-1 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className={`text-2xl font-light tracking-tight ${theme.textMain}`}>Gestão de Frota Leve</h2>
          <p className={`text-sm ${theme.textMuted} mt-1`}>Controle completo de motoristas e veículos designados.</p>
        </div>
        <div className={`flex items-center gap-2 ${theme.card} rounded-full p-1 border shadow-sm`}>
          <div className="relative flex items-center bg-transparent rounded-full">
            <Search size={16} className="text-gray-500 ml-3" />
            <input
              type="text"
              placeholder="Procurar motorista..."
              className={`bg-transparent ${isDarkMode ? 'text-white' : 'text-gray-700'} placeholder-gray-500 py-2 px-3 text-sm focus:outline-none w-48`}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {fleetDrivers.map((driver) => (
          <div key={driver.id} className={`${theme.card} border rounded-[1.5rem] p-5 hover:border-blue-500/50 transition-all duration-300 shadow-sm relative overflow-hidden group`}>
            <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: driver.carColor }}></div>
            <div className="flex justify-end mb-2">
              <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                driver.status === 'em_rota'
                  ? 'bg-blue-500/10 text-blue-500'
                  : driver.status === 'manutencao'
                    ? 'bg-red-500/10 text-red-500'
                    : 'bg-green-500/10 text-green-500'
              }`}>
                {driver.status === 'em_rota' ? 'Em Rota' : driver.status === 'manutencao' ? 'Em Manutenção' : 'Disponível'}
              </span>
            </div>
            <div className="flex items-center gap-4 mb-5">
              <img
                src={driver.avatar}
                alt={driver.name}
                className={`w-14 h-14 rounded-full border-2 ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-gray-50'}`}
              />
              <div>
                <h3 className={`text-base font-bold ${theme.textMain}`}>{driver.name}</h3>
                <div className={`flex items-center gap-1.5 text-xs ${theme.textMuted} mt-1`}>
                  <Phone size={12} /> {driver.phone}
                </div>
                <div className={`flex items-center gap-1.5 text-xs ${theme.textMuted} mt-0.5`}>
                  <Mail size={12} /> {driver.email}
                </div>
              </div>
            </div>
            <div className={`h-px w-full ${theme.border} mb-4`}></div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <Car size={18} className={theme.textMuted} />
                </div>
                <div>
                  <p className={`text-sm font-bold ${theme.textMain}`}>{driver.model}</p>
                  <p className={`text-[10px] font-black uppercase tracking-wider ${theme.textMuted} mt-0.5`}>{driver.placa}</p>
                </div>
              </div>
              <button className={`p-2 rounded-full ${theme.hover} transition-colors`}>
                <MoreVertical size={16} className={theme.textMuted} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
