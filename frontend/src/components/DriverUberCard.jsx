import TopDownCar from './TopDownCar'

export default function DriverUberCard({ driver, theme, isDarkMode }) {
  const isOnline = driver.status === 'em_rota'
  return (
    <div className={`p-4 ${theme.card} rounded-[1.5rem] border flex items-center justify-between group cursor-pointer hover:border-blue-500/50 transition-all duration-300 shadow-sm relative overflow-hidden`}>
      {isOnline && (
        <div
          className="absolute -right-10 -top-10 w-24 h-24 rounded-full blur-2xl opacity-10"
          style={{ backgroundColor: driver.carColor }}
        />
      )}
      <div className="flex items-center gap-3 relative z-10">
        <div className="relative">
          <img
            src={driver.avatar}
            className={`w-11 h-11 rounded-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} object-cover border-2 ${isDarkMode ? 'border-[#1a2130]' : 'border-white'} shadow-sm`}
            alt={driver.name}
          />
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${isDarkMode ? 'border-[#1a2130]' : 'border-white'} ${isOnline ? 'bg-green-500' : 'bg-gray-400'} flex items-center justify-center`}>
            {isOnline && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>}
          </div>
        </div>
        <div>
          <p className={`text-sm font-bold ${theme.textMain}`}>{driver.name}</p>
          <p className={`text-[10px] uppercase font-bold tracking-wider mt-0.5 ${isOnline ? 'text-blue-500' : theme.textMuted}`}>
            {isOnline ? `A ${driver.time} do destino` : 'Aguardando Viagem'}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 relative z-10">
        <TopDownCar color={driver.carColor} isDarkMode={isDarkMode} />
        <p className={`text-[9px] font-black mt-1.5 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded ${theme.textMain}`}>{driver.placa}</p>
      </div>
    </div>
  )
}
