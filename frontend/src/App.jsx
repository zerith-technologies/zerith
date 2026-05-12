import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Menu, Search, SlidersHorizontal, Bell, ChevronDown,
  User, Settings, LogOut, Home, Car, Activity, Wrench,
  DollarSign, Moon, Sun,
} from 'lucide-react'

import { useFleet } from './hooks/useFleet'
import { logout } from './auth'
import NavItem        from './components/NavItem'
import VehicleModal   from './components/VehicleModal'
import DashboardView  from './views/DashboardView'
import FrotaView      from './views/FrotaView'
import FinanceiraView from './views/FinanceiraView'

// Motoristas da frota ZERITH — vinculados ao ID real do veículo
const DRIVERS = {
  mobi:    { name: 'Carlos Silva',  phone: '(34) 98811-2233', email: 'carlos.silva@zerith.com.br',  avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=CarlosSilvaZerith&backgroundColor=e2e8f0',  placa: 'HDJ-5823', model: 'Fiat Mobi 1.0 2022'        },
  saveiro: { name: 'Ana Paula',     phone: '(34) 97722-3344', email: 'ana.paula@zerith.com.br',     avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=AnaPaulaZerith&backgroundColor=e2e8f0',     placa: 'QLP-3947', model: 'VW Saveiro G7 1.6'          },
  polo:    { name: 'João Marcos',   phone: '(34) 96633-4455', email: 'joao.marcos@zerith.com.br',   avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=JoaoMarcosZerith&backgroundColor=e2e8f0',   placa: 'KRT-2156', model: 'VW Polo GTS 1.0 TSI 2023'  },
  strada:  { name: 'Mariana Costa', phone: '(34) 95544-5566', email: 'mariana.costa@zerith.com.br', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=MarianaCosta&backgroundColor=e2e8f0',       placa: 'BFN-8432', model: 'Fiat Strada Endurance 2023' },
  argo:    { name: 'Ricardo Dias',  phone: '(34) 94455-6677', email: 'ricardo.dias@zerith.com.br',  avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=RicardoDiasZerith&backgroundColor=e2e8f0',  placa: 'MXV-6019', model: 'Fiat Argo Drive 1.0 2023'  },
}

// ETA estável por veículo (não muda a cada render)
const VEHICLE_ETA = { mobi: '14 min', saveiro: '8 min', polo: '22 min', strada: '5 min', argo: '17 min' }

const WS_DOT = { connected: 'bg-green-500', disconnected: 'bg-gray-500', error: 'bg-red-500' }

export default function App() {
  const navigate = useNavigate()
  const { fleet, vehicles, wsStatus } = useFleet()

  const [currentView,     setCurrentView]     = useState('dashboard')
  const [isSidebarOpen,   setIsSidebarOpen]   = useState(true)
  const [isDarkMode,      setIsDarkMode]      = useState(false)
  const [isUserMenuOpen,  setIsUserMenuOpen]  = useState(false)
  const [isNotifOpen,     setIsNotifOpen]     = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState(null)

  // ── Lista enriquecida: base + telemetria + motorista ───────────────────────
  const vehicleList = useMemo(() =>
    vehicles.map(v => {
      const fd  = fleet[v.id] ?? {}
      const dr  = DRIVERS[v.id] ?? {}
      const on  = Object.values(fd.sensors ?? {}).some(s => s.value != null)
      const rawStatus = fd.status ?? 'ok'
      const uiStatus  = rawStatus === 'danger' ? 'critical' : rawStatus
      const frotaStatus = !on ? 'disponivel' : uiStatus === 'critical' ? 'manutencao' : 'em_rota'

      return {
        // Veículo
        id: v.id, name: v.name, color: v.color, carColor: v.color,
        // Telemetria
        sensors: fd.sensors ?? {}, alerts: fd.alerts ?? [], score: fd.score ?? 100,
        // Derivado
        on, status: uiStatus, uiStatus, frotaStatus,
        time: on ? (VEHICLE_ETA[v.id] ?? '10 min') : '-',
        // Motorista
        driver: dr.name ?? 'N/A',
        phone:  dr.phone  ?? '-',
        email:  dr.email  ?? '-',
        avatar: dr.avatar ?? '',
        placa:  dr.placa  ?? 'N/A',
        model:  dr.model  ?? v.name,
      }
    }),
  [fleet, vehicles])

  // Veículo com alerta mais grave (para notificações)
  const alertVehicle =
    vehicleList.find(v => v.uiStatus === 'critical') ??
    vehicleList.find(v => v.uiStatus === 'warning')

  const hasAlerts = !!alertVehicle

  const theme = {
    bg:       isDarkMode ? 'bg-[#0f141e]'                          : 'bg-[#f5f7fa]',
    textMain: isDarkMode ? 'text-gray-100'                         : 'text-gray-800',
    textMuted:isDarkMode ? 'text-gray-400'                         : 'text-gray-500',
    header:   isDarkMode ? 'bg-[#151b28] border-b border-gray-800' : 'bg-[#1e2532]',
    sidebar:  isDarkMode ? 'bg-[#151b28] border-r border-gray-800' : 'bg-white border-r border-gray-100',
    card:     isDarkMode ? 'bg-[#1a2130] border-gray-800 shadow-none' : 'bg-white border-gray-100 shadow-sm',
    searchBg: isDarkMode ? 'bg-[#0f141e]'                          : 'bg-[#f4ecec]',
    hover:    isDarkMode ? 'hover:bg-white/5'                      : 'hover:bg-gray-50',
    border:   isDarkMode ? 'border-gray-800'                       : 'border-gray-200',
    studioBg: isDarkMode ? 'from-gray-900 via-gray-800 to-[#1a2130]' : 'from-gray-100 via-gray-200 to-white',
  }

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.textMain} font-sans transition-colors duration-300 flex flex-col`}>

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header className={`sticky top-0 z-50 flex items-center justify-between px-6 py-3 ${theme.header} text-white shadow-md transition-colors duration-300`}>
        <div className="flex items-center gap-6 min-w-[200px]">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hover:bg-white/10 p-2 rounded-lg transition-colors">
            <Menu size={24} />
          </button>
          <span className="text-[22px] font-light tracking-[0.25em] mt-1 text-white select-none">ZERITH</span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-2xl px-8 relative">
          <div className={`relative flex items-center ${theme.searchBg} rounded-full transition-all duration-300 ${isSearchFocused ? 'ring-2 ring-blue-400 shadow-lg' : 'shadow-inner'}`}>
            <Search size={16} className="text-gray-500 ml-5" />
            <input
              type="text"
              placeholder="Buscar placa, motorista ou relatório..."
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className={`w-full bg-transparent ${isDarkMode ? 'text-white' : 'text-gray-700'} placeholder-gray-500 py-2.5 px-4 text-sm focus:outline-none`}
            />
            <button className="pr-5 text-gray-500 hover:text-blue-500 transition-colors">
              <SlidersHorizontal size={16} />
            </button>
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-4 min-w-[200px] justify-end">
          <span
            title={`WebSocket: ${wsStatus}`}
            className={`w-2 h-2 rounded-full ${WS_DOT[wsStatus] ?? 'bg-gray-500'} ${wsStatus === 'connected' ? 'animate-pulse' : ''}`}
          />

          {/* Notificações */}
          <div className="relative">
            <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="hover:bg-white/10 p-2 rounded-full transition-colors relative">
              <Bell size={20} />
              {hasAlerts && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[#1e2532] animate-pulse"></span>
              )}
            </button>
            {isNotifOpen && (
              <div className={`absolute right-0 mt-3 w-80 ${theme.card} rounded-[1.5rem] shadow-xl border ${theme.border} py-2 z-50 animate-in fade-in slide-in-from-top-2`}>
                <div className={`px-4 py-3 border-b ${theme.border} flex justify-between items-center mb-1`}>
                  <h3 className={`text-[10px] font-bold ${theme.textMuted} uppercase tracking-wider`}>Notificações</h3>
                  {hasAlerts && <span className="text-[10px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full font-bold">Ação Exigida</span>}
                </div>
                {alertVehicle ? (
                  <button
                    onClick={() => { setSelectedVehicle(alertVehicle); setIsNotifOpen(false); setCurrentView('dashboard') }}
                    className={`w-full text-left flex items-start gap-3 px-4 py-3 ${theme.hover} transition-colors border-l-2 ${alertVehicle.uiStatus === 'critical' ? 'border-red-500 bg-red-500/5' : 'border-yellow-500 bg-yellow-500/5'}`}
                  >
                    <div className="mt-1">
                      <span className="flex h-2 w-2 relative">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${alertVehicle.uiStatus === 'critical' ? 'bg-red-400' : 'bg-yellow-400'}`}></span>
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${alertVehicle.uiStatus === 'critical' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                      </span>
                    </div>
                    <div>
                      <p className={`text-xs font-bold mb-0.5 ${alertVehicle.uiStatus === 'critical' ? 'text-red-500' : 'text-yellow-500'}`}>
                        Atenção: {alertVehicle.name} ({alertVehicle.driver})
                      </p>
                      <p className={`text-xs ${theme.textMuted}`}>
                        {alertVehicle.alerts?.[0]?.name?.replace(/_/g, ' ') ?? 'Verificar imediatamente'}
                        {alertVehicle.alerts?.[0]?.value != null && ` — ${alertVehicle.alerts[0].value.toFixed(1)} ${alertVehicle.alerts[0].unit}`}
                      </p>
                      <p className={`text-[10px] ${theme.textMuted} mt-1 font-medium`}>AGORA</p>
                    </div>
                  </button>
                ) : (
                  <div className={`px-4 py-4 text-xs ${theme.textMuted} text-center`}>Nenhuma notificação pendente</div>
                )}
              </div>
            )}
          </div>

          <div className="w-px h-6 bg-gray-600/50 mx-1"></div>

          {/* User menu */}
          <div className="relative">
            <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center gap-2 hover:bg-white/10 p-1 pr-2.5 rounded-full transition-colors focus:outline-none">
              <div className="w-7 h-7 bg-gradient-to-tr from-gray-500 to-gray-400 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            {isUserMenuOpen && (
              <div className={`absolute right-0 mt-3 w-56 ${theme.card} rounded-2xl shadow-xl border ${theme.border} py-2 z-30`}>
                <div className={`px-4 py-3 border-b ${theme.border} mb-1`}>
                  <p className={`text-sm font-medium ${theme.textMain}`}>Administrador</p>
                  <p className={`text-xs ${theme.textMuted}`}>admin@zerith.com.br</p>
                </div>
                <button className={`w-full text-left flex items-center gap-3 px-4 py-2 ${theme.hover} transition-colors`}>
                  <Settings size={16} className={theme.textMain} />
                  <span className={`text-sm ${theme.textMain}`}>Configurações</span>
                </button>
                <div className={`h-px ${theme.border} my-1`}></div>
                <button
                  onClick={() => { logout(); navigate('/login') }}
                  className={`w-full text-left flex items-center gap-3 px-4 py-2 ${isDarkMode ? 'hover:bg-red-900/20' : 'hover:bg-red-50'} transition-colors`}
                >
                  <LogOut size={16} className="text-red-500" />
                  <span className="text-sm text-red-500">Sair</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── MAIN LAYOUT ────────────────────────────────────────────────────── */}
      <main className="max-w-[1500px] mx-auto w-full pt-6 px-6 flex gap-6 flex-1">

        {/* ── SIDEBAR ──────────────────────────────────────────────────────── */}
        <aside className={`hidden md:flex flex-col shrink-0 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-[240px]' : 'w-[64px]'}`}>
          <nav className="sticky top-24 flex flex-col gap-1 flex-1">
            <NavItem icon={<Home />} text="Visão Global"       active={currentView === 'dashboard'}  onClick={() => setCurrentView('dashboard')}  isOpen={isSidebarOpen} theme={theme} isDarkMode={isDarkMode} />
            <NavItem icon={<Car />}  text="Frota Leve"         active={currentView === 'frota'}       onClick={() => setCurrentView('frota')}       isOpen={isSidebarOpen} theme={theme} isDarkMode={isDarkMode} />
            <NavItem icon={<Activity />} text="Modelos Preditivos" alert={hasAlerts}
              active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')}
              isOpen={isSidebarOpen} theme={theme} isDarkMode={isDarkMode} />
            <NavItem icon={<Wrench />}    text="Plano de Manutenção" active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} isOpen={isSidebarOpen} theme={theme} isDarkMode={isDarkMode} />
            <NavItem icon={<DollarSign />} text="Gestão Financeira"  active={currentView === 'financeira'} onClick={() => setCurrentView('financeira')} isOpen={isSidebarOpen} theme={theme} isDarkMode={isDarkMode} />

            <hr className={`my-4 ${theme.border}`} />
            {isSidebarOpen
              ? <h3 className={`px-3 text-[10px] font-bold ${theme.textMuted} uppercase mb-2 animate-in fade-in`}>Filiais</h3>
              : <div className={`w-6 h-px ${theme.border} mx-auto mb-2`}></div>
            }
            <NavItem text="Matriz (São Paulo)" small isOpen={isSidebarOpen} textOnly theme={theme} />
            <NavItem text="Operação Sul"       small isOpen={isSidebarOpen} textOnly theme={theme} />
          </nav>

          <div className={`sticky bottom-6 mt-8 p-1 ${isSidebarOpen ? 'bg-transparent' : 'flex justify-center'}`}>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              title="Alternar Tema"
              className={`flex items-center ${isSidebarOpen ? 'justify-between w-full px-4 py-3' : 'justify-center p-3'} rounded-xl ${isDarkMode ? 'bg-[#1e2532] text-blue-400' : 'bg-white shadow-sm border border-gray-100 text-gray-700'} hover:opacity-80 transition-all`}
            >
              <div className="flex items-center gap-3">
                {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
                {isSidebarOpen && <span className="font-medium text-sm">Modo {isDarkMode ? 'Escuro' : 'Claro'}</span>}
              </div>
            </button>
          </div>
        </aside>

        {/* ── VIEWS ──────────────────────────────────────────────────────────── */}
        {currentView === 'dashboard' && (
          <DashboardView
            theme={theme}
            isDarkMode={isDarkMode}
            isSidebarOpen={isSidebarOpen}
            setSelectedVehicle={setSelectedVehicle}
            vehicleList={vehicleList}
            wsStatus={wsStatus}
          />
        )}

        {currentView === 'frota' && (
          <FrotaView theme={theme} isDarkMode={isDarkMode} vehicleList={vehicleList} />
        )}

        {currentView === 'financeira' && (
          <FinanceiraView theme={theme} isDarkMode={isDarkMode} />
        )}
      </main>

      {/* ── MODAL ──────────────────────────────────────────────────────────── */}
      {selectedVehicle && (
        <VehicleModal
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
          theme={theme}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  )
}
