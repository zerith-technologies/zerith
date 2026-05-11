import { useState, useMemo } from 'react'
import {
  Filter, ChevronLeft, ChevronRight, Activity, Wrench, Brain,
  TrendingUp, Gauge, Thermometer, BatteryWarning, AlertTriangle,
  Calendar, CheckCircle2, PenLine, Zap,
} from 'lucide-react'
import VehicleBlueprint from '../components/VehicleBlueprint'
import DriverUberCard   from '../components/DriverUberCard'

const FILTERS = ['Todos', 'Alertas IA', 'Performance', 'Sensores', 'Manutenção']

// Mapeamento PID → texto humano para carousel e previsões
const PID_ALERT = {
  '0x05': {
    title: 'Temperatura Alta do Motor',
    desc:  (v) => `Motor a ${v?.toFixed(0) ?? '--'}°C — acima do limite seguro (100°C).`,
    Icon: Thermometer,
    predIssue: 'Superaquecimento do Motor',
    timeframe: 'em ~500 km',
    risk: (v) => Math.min(98, Math.round((v - 90) * 8)),
  },
  '0x0C': {
    title: 'RPM Elevado',
    desc:  (v) => `${v?.toFixed(0) ?? '--'} RPM — risco de desgaste interno.`,
    Icon: Activity,
    predIssue: 'Desgaste Prematuro do Motor',
    timeframe: 'em ~5.000 km',
    risk: (v) => Math.min(95, Math.round((v - 5000) / 100 * 5)),
  },
  '0x0D': {
    title: 'Velocidade Excessiva',
    desc:  (v) => `${v?.toFixed(0) ?? '--'} km/h — condução de alto risco.`,
    Icon: AlertTriangle,
    predIssue: 'Desgaste de Pneus e Freios',
    timeframe: 'em ~3.000 km',
    risk: (v) => Math.min(90, Math.round((v - 80) * 5)),
  },
  '0x24': {
    title: 'Lambda Fora do Ideal',
    desc:  (v) => `Razão A/F: ${v?.toFixed(2) ?? '--'} — mistura ar/combustível incorreta.`,
    Icon: Gauge,
    predIssue: 'Falha na Mistura A/F (Sonda λ)',
    timeframe: 'em ~2.000 km',
    risk: (v) => Math.min(88, Math.round(Math.abs(v - 14.7) * 20)),
  },
  '0x0B': {
    title: 'Pressão MAP Anormal',
    desc:  (v) => `${v?.toFixed(0) ?? '--'} kPa — verificar sistema de admissão.`,
    Icon: Gauge,
    predIssue: 'Falha no Sistema de Admissão',
    timeframe: 'em ~4.000 km',
    risk: (_v) => 65,
  },
}

export default function DashboardView({
  theme, isDarkMode, isSidebarOpen, setSelectedVehicle,
  vehicleList, wsStatus,
}) {
  const [activeFilter,   setActiveFilter]   = useState('Todos')
  const [carouselIndex,  setCarouselIndex]  = useState(0)
  const [driverTab,      setDriverTab]      = useState('em_rota')
  const [resolvedIssues, setResolvedIssues] = useState([])

  // ── KPIs calculados dos dados reais ───────────────────────────────────────
  const kpis = useMemo(() => {
    const total    = vehicleList.length
    const critical = vehicleList.filter(v => v.uiStatus === 'critical').length
    const warning  = vehicleList.filter(v => v.uiStatus === 'warning').length
    const disponib = total > 0
      ? ((total - critical) / total * 100).toFixed(1)
      : '100.0'
    return { disponib, pendentes: critical + warning }
  }, [vehicleList])

  // ── Veículos do carrossel: ordenados por severidade (critical → warning → ok) ─
  const carouselVehicles = useMemo(() => {
    const order = { critical: 0, warning: 1, ok: 2 }
    return [...vehicleList]
      .sort((a, b) => (order[a.uiStatus] ?? 2) - (order[b.uiStatus] ?? 2))
      .map(v => {
        const alert  = v.alerts?.[0]
        const pidMap = alert ? PID_ALERT[alert.pid] : null
        return {
          id:       v.name,
          vehicleId:v.id,
          placa:    v.placa,
          status:   v.uiStatus,
          driver:   v.driver,
          title:    pidMap?.title ?? 'Sistema em Ordem',
          desc:     pidMap ? pidMap.desc(alert.value) : 'Todos os sensores dentro dos limites operacionais.',
          color:    v.color,
        }
      })
  }, [vehicleList])

  // ── Previsões da IA: veículos com alertas ─────────────────────────────────
  const aiPredictions = useMemo(() =>
    vehicleList
      .filter(v => v.uiStatus !== 'ok' && v.alerts.length > 0)
      .slice(0, 3)
      .map(v => {
        const alert  = v.alerts[0]
        const pidMap = PID_ALERT[alert.pid]
        if (!pidMap) return null
        return {
          vehicleName: v.name,
          driverName:  v.driver,
          placa:       v.placa,
          issue:       pidMap.predIssue,
          prob:        pidMap.risk(alert.value),
          timeframe:   pidMap.timeframe,
          Icon:        pidMap.Icon,
        }
      })
      .filter(Boolean),
  [vehicleList])

  // ── Sensor real: primeiro veículo online, fallback para mock ──────────────
  const activeVehicle  = vehicleList.find(v => v.on) ?? vehicleList[0]
  const activeSensors  = activeVehicle?.sensors ?? {}
  const realTemp  = activeSensors['0x05']?.value
  const realMap   = activeSensors['0x0B']?.value
  const sensorTemp = realTemp != null ? Math.round(realTemp) : 90
  const sensorMap  = realMap  != null ? Math.round(realMap)  : 24
  const wsConnected = wsStatus === 'connected'

  // ── Contagem de tabs ──────────────────────────────────────────────────────
  const onRoute    = vehicleList.filter(v => v.frotaStatus === 'em_rota').length
  const available  = vehicleList.filter(v => v.frotaStatus === 'disponivel').length

  const currentAlert = carouselVehicles[carouselIndex] ?? carouselVehicles[0]

  const nextCarousel = (e) => { e.stopPropagation(); setCarouselIndex(p => (p + 1) % carouselVehicles.length) }
  const prevCarousel = (e) => { e.stopPropagation(); setCarouselIndex(p => p === 0 ? carouselVehicles.length - 1 : p - 1) }
  const handleResolve = (id) => setResolvedIssues(p => [...p, id])

  if (!currentAlert) return null

  return (
    <>
      <section className={`flex-1 flex flex-col gap-5 transition-all duration-300 ${isSidebarOpen ? 'max-w-[700px]' : 'max-w-[850px] mx-auto'}`}>

        {/* ── KPIs ── */}
        <div className={`${theme.card} rounded-[1.5rem] border p-5 transition-colors duration-300`}>
          <h2 className={`text-xs font-bold ${theme.textMuted} uppercase mb-4 tracking-wider`}>
            Saúde da Frota Leve
            {wsConnected && <span className="ml-2 text-green-500 font-normal normal-case">● ao vivo</span>}
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className={`${isDarkMode ? 'bg-[#151b28] border-gray-800' : 'bg-[#f8fafc] border-gray-100'} rounded-xl p-4 border`}>
              <p className={`text-xs ${theme.textMuted} font-medium`}>Disponibilidade</p>
              <p className={`text-2xl font-light mt-1 ${kpis.pendentes > 0 ? 'text-yellow-500' : 'text-green-500'}`}>{kpis.disponib}%</p>
            </div>
            <div className={`${isDarkMode ? 'bg-[#151b28] border-gray-800' : 'bg-[#f8fafc] border-gray-100'} rounded-xl p-4 border`}>
              <p className={`text-xs ${theme.textMuted} font-medium`}>Alertas Ativos</p>
              <p className={`text-2xl font-light mt-1 ${kpis.pendentes > 0 ? 'text-red-500' : 'text-green-500'}`}>{kpis.pendentes}</p>
            </div>
            <div className={`${isDarkMode ? 'bg-[#151b28] border-gray-800' : 'bg-[#f8fafc] border-gray-100'} rounded-xl p-4 border`}>
              <p className={`text-xs ${theme.textMuted} font-medium`}>Veículos Online</p>
              <p className={`text-2xl font-light ${theme.textMain} mt-1`}>{vehicleList.filter(v => v.on).length}/{vehicleList.length}</p>
            </div>
          </div>
        </div>

        {/* ── Filtros ── */}
        <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-hide">
          <Filter size={16} className={`${theme.textMuted} mr-2 shrink-0`} />
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm transition-all duration-200 ${
                activeFilter === f
                  ? 'bg-[#1a2235] text-white shadow-md font-medium'
                  : isDarkMode
                    ? 'bg-[#1e2532] text-gray-300 border border-gray-700 hover:border-blue-500 hover:text-blue-400'
                    : 'bg-white text-gray-500 border border-gray-200 hover:border-blue-400 hover:text-blue-500'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* ── ALERTAS / CARROSSEL ── */}
        {['Todos', 'Alertas IA'].includes(activeFilter) && (
          <>
            <div
              className={`${theme.card} rounded-[2rem] border overflow-hidden relative flex flex-col h-[580px] animate-in fade-in slide-in-from-bottom-4 duration-500 cursor-pointer shadow-sm`}
              onClick={() => setSelectedVehicle({ ...vehicleList.find(v => v.name === currentAlert.id), id: currentAlert.id })}
            >
              {/* Carousel stage */}
              <div className={`absolute top-0 left-0 w-full h-[60%] bg-gradient-to-b ${theme.studioBg} flex items-center justify-center overflow-hidden`}>
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 ${isDarkMode ? 'bg-blue-500/5' : 'bg-white/60'} rounded-full blur-[60px]`}></div>
                <button onClick={prevCarousel} className={`absolute left-4 z-40 p-2 ${isDarkMode ? 'bg-gray-800/50 text-white' : 'bg-white/60 text-gray-800'} hover:bg-white/80 rounded-full backdrop-blur-sm shadow-sm transition-all hover:scale-110`}>
                  <ChevronLeft size={24} />
                </button>

                <div className="relative w-full h-full flex items-center justify-center">
                  {carouselVehicles.map((vehicle, index) => {
                    let diff = index - carouselIndex
                    const total = carouselVehicles.length
                    if (diff > Math.floor(total / 2)) diff -= total
                    if (diff < -Math.floor(total / 2)) diff += total

                    let transformStyle = '', opacity = 0, zIndex = 10, blur = 'blur(0px)'
                    if (diff === 0)       { transformStyle = 'translate(-50%, -60%) scale(1)';     opacity = 1;                        zIndex = 30 }
                    else if (diff === 1)  { transformStyle = 'translate(10%, -65%) scale(0.65)';   opacity = isDarkMode ? 0.2 : 0.4;  zIndex = 20; blur = 'blur(3px)' }
                    else if (diff === -1) { transformStyle = 'translate(-110%, -65%) scale(0.65)'; opacity = isDarkMode ? 0.2 : 0.4;  zIndex = 20; blur = 'blur(3px)' }

                    return (
                      <div
                        key={vehicle.id}
                        className="absolute top-1/2 left-1/2 w-[85%] max-w-[300px] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
                        style={{ transform: transformStyle, opacity, zIndex, filter: blur }}
                        onClick={(e) => { if (diff !== 0) { e.stopPropagation(); setCarouselIndex(index) } }}
                      >
                        <VehicleBlueprint status={vehicle.status} isDarkMode={isDarkMode} />
                      </div>
                    )
                  })}
                </div>

                <button onClick={nextCarousel} className={`absolute right-4 z-40 p-2 ${isDarkMode ? 'bg-gray-800/50 text-white' : 'bg-white/60 text-gray-800'} hover:bg-white/80 rounded-full backdrop-blur-sm shadow-sm transition-all hover:scale-110`}>
                  <ChevronRight size={24} />
                </button>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-40">
                  {carouselVehicles.map((_, idx) => (
                    <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === carouselIndex ? `w-6 ${isDarkMode ? 'bg-white' : 'bg-gray-800'}` : `w-2 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-400/50'}`}`}></div>
                  ))}
                </div>
              </div>

              {/* Status badge */}
              <div className="px-6 py-5 flex justify-between items-start z-20 relative">
                <div className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest flex items-center gap-2 shadow-lg ${
                  currentAlert.status === 'critical' ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                  : currentAlert.status === 'warning' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                  : 'bg-green-500/10 text-green-500 border border-green-500/20'
                }`}>
                  <span className="flex h-1.5 w-1.5 relative">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${currentAlert.status === 'critical' ? 'bg-red-500' : currentAlert.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
                    <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${currentAlert.status === 'critical' ? 'bg-red-500' : currentAlert.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
                  </span>
                  {currentAlert.status === 'critical' ? 'AÇÃO NECESSÁRIA' : currentAlert.status === 'warning' ? 'VERIFICAÇÃO SUGERIDA' : 'SISTEMA OK'}
                </div>
              </div>

              <div className="flex-1"></div>

              {/* Info panel */}
              <div key={`info-${currentAlert.id}`} className={`relative z-20 ${theme.card} rounded-t-[2.5rem] pt-6 px-8 pb-6 flex flex-col items-center animate-in slide-in-from-bottom-2 fade-in duration-300 shadow-[0_-15px_40px_rgba(0,0,0,0.05)]`}>
                <div className={`w-12 h-1 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full absolute top-4 left-1/2 -translate-x-1/2`}></div>
                <div className="text-center mb-5 w-full mt-2">
                  <h3 className={`font-light ${theme.textMain} text-3xl tracking-tight mb-1`}>{currentAlert.id}</h3>
                  <p className={`text-xs ${theme.textMuted} font-medium mb-4`}>Placa: {currentAlert.placa} • Motorista: {currentAlert.driver}</p>
                  <div className={`border rounded-2xl p-4 text-left flex gap-4 items-center transition-colors ${
                    currentAlert.status === 'critical' ? isDarkMode ? 'bg-red-950/20 border-red-900/30' : 'bg-red-50 border-red-100'
                    : currentAlert.status === 'warning' ? isDarkMode ? 'bg-yellow-950/20 border-yellow-900/30' : 'bg-yellow-50 border-yellow-100'
                    : isDarkMode ? 'bg-green-950/20 border-green-900/30' : 'bg-green-50 border-green-100'
                  }`}>
                    <div className={`p-3 rounded-full ${
                      currentAlert.status === 'critical' ? 'bg-red-100/10 text-red-500'
                      : currentAlert.status === 'warning' ? 'bg-yellow-100/10 text-yellow-500'
                      : 'bg-green-100/10 text-green-500'
                    }`}>
                      {currentAlert.status === 'ok' ? <CheckCircle2 size={24} /> : <Wrench size={24} />}
                    </div>
                    <div>
                      <p className={`font-medium text-sm ${currentAlert.status === 'critical' ? 'text-red-500' : currentAlert.status === 'warning' ? 'text-yellow-500' : 'text-green-500'}`}>
                        {currentAlert.title}
                      </p>
                      <p className={`text-xs mt-1 ${theme.textMuted}`}>{currentAlert.desc}</p>
                    </div>
                  </div>
                </div>
                <button className={`w-full max-w-[320px] h-12 rounded-full font-medium text-xs tracking-wider transition-all flex items-center justify-center gap-2 ${isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-[#1e2532] text-white hover:bg-black'}`}>
                  <Activity size={16} /> INICIAR DIAGNÓSTICO
                </button>
              </div>
            </div>

            {/* ── Previsões da IA ── */}
            {activeFilter === 'Alertas IA' && (
              <div className={`${theme.card} rounded-[2rem] border p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-8 duration-500 shadow-sm mt-2`}>
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-3 rounded-full ${isDarkMode ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                    <Brain size={24} />
                  </div>
                  <div>
                    <h3 className={`font-medium text-lg ${theme.textMain}`}>Análise Preditiva a Longo Prazo</h3>
                    <p className={`text-xs ${theme.textMuted} mt-0.5`}>
                      {aiPredictions.length > 0
                        ? `${aiPredictions.length} anomalia(s) identificada(s) pela IA`
                        : 'Nenhuma anomalia detectada — frota operando normalmente'}
                    </p>
                  </div>
                </div>

                {aiPredictions.length === 0 ? (
                  <div className={`p-6 rounded-2xl border text-center ${isDarkMode ? 'border-green-900/30 bg-green-950/10' : 'border-green-100 bg-green-50'}`}>
                    <CheckCircle2 size={32} className="text-green-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-green-500">Todos os veículos dentro dos parâmetros normais</p>
                    <p className={`text-xs mt-1 ${theme.textMuted}`}>Modelos preditivos não identificaram riscos iminentes.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {aiPredictions.map((pred, i) => (
                      <div key={i} className={`flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl border transition-all ${isDarkMode ? 'border-gray-800 bg-[#151b28]' : 'border-gray-100 bg-gray-50'}`}>
                        <div className="flex items-center gap-4 mb-4 md:mb-0 w-full md:w-1/2">
                          <div className={`p-2.5 rounded-xl ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white shadow-sm text-gray-500'}`}>
                            <pred.Icon size={18} />
                          </div>
                          <div>
                            <p className={`text-sm font-bold ${theme.textMain}`}>{pred.issue}</p>
                            <p className={`text-xs mt-0.5 ${theme.textMuted}`}>{pred.vehicleName} ({pred.placa}) • {pred.driverName}</p>
                          </div>
                        </div>
                        <div className="w-full md:w-1/3 space-y-1.5 px-2">
                          <div className="flex justify-between text-[11px] font-bold">
                            <span className={isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}>{pred.prob}% de Risco</span>
                            <span className={theme.textMuted}>{pred.timeframe}</span>
                          </div>
                          <div className={`h-2 w-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${pred.prob}%` }}></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ── PERFORMANCE ── */}
        {['Todos', 'Performance'].includes(activeFilter) && (
          <div className={`${theme.card} rounded-[2rem] border p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-8 duration-500 shadow-sm`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h3 className={`font-medium text-lg ${theme.textMain}`}>Eficiência Global da Frota</h3>
                  <p className={`text-xs ${theme.textMuted} mt-0.5`}>Score médio baseado em telemetria real</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-3xl font-light ${theme.textMain}`}>
                  {(vehicleList.reduce((acc, v) => acc + (v.score ?? 100), 0) / Math.max(vehicleList.length, 1)).toFixed(1)}
                  <span className={`text-base ${theme.textMuted}`}>/100</span>
                </div>
                <p className={`text-[10px] font-bold tracking-wider mt-1 ${kpis.pendentes > 0 ? 'text-yellow-500' : 'text-green-500'}`}>
                  {kpis.pendentes > 0 ? `${kpis.pendentes} ALERTA(S) ATIVO(S)` : 'FROTA EM ORDEM'}
                </p>
              </div>
            </div>
            <div className="space-y-6">
              {[
                { label: 'Economia de Combustível/Energia', pct: 98, color: 'bg-blue-500' },
                { label: 'Score de Condução (Média dos Motoristas)', pct: Math.round(vehicleList.reduce((a, v) => a + (v.score ?? 100), 0) / Math.max(vehicleList.length, 1)), color: 'bg-green-500' },
                { label: 'Veículos Sem Alertas', pct: Math.round((vehicleList.filter(v => v.uiStatus === 'ok').length / Math.max(vehicleList.length, 1)) * 100), color: 'bg-purple-500' },
              ].map((m, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-end text-xs">
                    <span className={`font-medium ${theme.textMuted}`}>{m.label}</span>
                    <span className={`font-bold ${m.pct < 70 ? 'text-yellow-500' : theme.textMain}`}>{m.pct}%</span>
                  </div>
                  <div className={`h-2.5 w-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-full overflow-hidden`}>
                    <div className={`h-full ${m.color} rounded-full transition-all duration-1000`} style={{ width: `${m.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            {activeFilter === 'Performance' && (
              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                <h4 className={`text-xs font-bold uppercase tracking-wider ${theme.textMuted} mb-4`}>Ranking de Motoristas (Score)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...vehicleList]
                    .sort((a, b) => (b.score ?? 100) - (a.score ?? 100))
                    .slice(0, 4)
                    .map((v, i) => (
                      <div key={v.id} className={`flex items-center justify-between p-3 rounded-xl border ${isDarkMode ? 'border-gray-800 bg-[#151b28]' : 'border-gray-100 bg-gray-50'}`}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-xs">{i + 1}º</div>
                          <div>
                            <p className={`text-sm font-medium ${theme.textMain}`}>{v.driver}</p>
                            <p className={`text-[10px] ${theme.textMuted}`}>{v.name} — {v.placa}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          (v.score ?? 100) >= 90 ? 'bg-green-500/10 text-green-500'
                          : (v.score ?? 100) >= 70 ? 'bg-blue-500/10 text-blue-500'
                          : 'bg-yellow-500/10 text-yellow-500'
                        }`}>{v.score ?? 100} pts</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── SENSORES ── */}
        {['Todos', 'Sensores'].includes(activeFilter) && (
          <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
            {/* MAP / Pressão */}
            <div className={`${theme.card} rounded-[1.5rem] border p-5 shadow-sm flex flex-col gap-4 relative overflow-hidden group hover:border-yellow-500/50 transition-colors`}>
              <div className="flex justify-between items-start relative z-10">
                <Gauge size={22} className={isDarkMode ? 'text-yellow-400' : 'text-yellow-500'} />
                <span className="text-[9px] font-bold tracking-widest bg-yellow-500/10 text-yellow-500 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></div>
                  {wsConnected ? `${activeVehicle?.name ?? '—'} (OBD)` : 'SENSOR MAP'}
                </span>
              </div>
              <div className="relative z-10 mt-2">
                <p className={`text-3xl font-light ${theme.textMain} tracking-tight`}>{sensorMap} <span className={`text-sm font-medium ${theme.textMuted}`}>kPa</span></p>
                <p className={`text-[11px] uppercase tracking-wider font-bold mt-1 ${isDarkMode ? 'text-yellow-500/70' : 'text-yellow-600'}`}>Pressão MAP</p>
              </div>
              <div className="mt-2 h-10 w-full opacity-60">
                <svg viewBox="0 0 100 30" className="w-full h-full" preserveAspectRatio="none">
                  <path d="M0 10 L20 12 L40 8 L60 15 L80 25 L100 28" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-yellow-500/5 rounded-full blur-xl group-hover:bg-yellow-500/10 transition-colors"></div>
            </div>

            {/* Temperatura */}
            <div className={`${theme.card} rounded-[1.5rem] border p-5 shadow-sm flex flex-col gap-4 relative overflow-hidden group ${sensorTemp > 100 ? 'hover:border-red-500/50' : 'hover:border-green-500/50'} transition-colors`}>
              <div className="flex justify-between items-start relative z-10">
                <Thermometer size={22} className={sensorTemp > 100 ? 'text-red-500' : isDarkMode ? 'text-green-400' : 'text-green-500'} />
                <span className={`text-[9px] font-bold tracking-widest px-2.5 py-1 rounded-full ${sensorTemp > 100 ? 'bg-red-500/10 text-red-500 flex items-center gap-1.5' : 'bg-green-500/10 text-green-500'}`}>
                  {sensorTemp > 100 && <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></div>}
                  {sensorTemp > 100 ? 'ALERTA TEMP' : wsConnected ? `${activeVehicle?.name ?? '—'} (OBD)` : 'NORMAL'}
                </span>
              </div>
              <div className="relative z-10 mt-2">
                <p className={`text-3xl font-light tracking-tight ${sensorTemp > 100 ? 'text-red-500' : theme.textMain}`}>{sensorTemp} <span className={`text-sm font-medium ${theme.textMuted}`}>°C</span></p>
                <p className={`text-[11px] uppercase tracking-wider font-bold mt-1 ${theme.textMuted}`}>Temp. Motor</p>
              </div>
              <div className="mt-2 h-10 w-full opacity-60">
                <svg viewBox="0 0 100 30" className="w-full h-full" preserveAspectRatio="none">
                  <path d="M0 20 L20 18 L40 22 L60 19 L80 21 L100 20" fill="none" stroke={sensorTemp > 100 ? '#ef4444' : '#22c55e'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Score da frota */}
            <div className={`${theme.card} rounded-[1.5rem] border p-5 shadow-sm flex flex-col gap-4 relative overflow-hidden group hover:border-blue-500/50 transition-colors`}>
              <div className="flex justify-between items-start relative z-10">
                <BatteryWarning size={22} className={isDarkMode ? 'text-blue-400' : 'text-blue-500'} />
                <span className="text-[9px] font-bold tracking-widest bg-blue-500/10 text-blue-500 px-2.5 py-1 rounded-full">SCORE FROTA</span>
              </div>
              <div className="relative z-10 mt-2">
                <p className={`text-3xl font-light ${theme.textMain} tracking-tight`}>
                  {(vehicleList.reduce((a, v) => a + (v.score ?? 100), 0) / Math.max(vehicleList.length, 1)).toFixed(0)} <span className={`text-sm font-medium ${theme.textMuted}`}>/100</span>
                </p>
                <p className={`text-[11px] uppercase tracking-wider font-bold mt-1 ${theme.textMuted}`}>Score Médio da Frota</p>
              </div>
            </div>

            {/* Veículos com alerta */}
            <div className={`${theme.card} rounded-[1.5rem] border p-5 shadow-sm flex flex-col gap-4 relative overflow-hidden group ${kpis.pendentes > 0 ? 'hover:border-red-500/50' : 'hover:border-green-500/50'} transition-colors`}>
              <div className="flex justify-between items-start relative z-10">
                <AlertTriangle size={22} className={kpis.pendentes > 0 ? (isDarkMode ? 'text-red-400' : 'text-red-500') : (isDarkMode ? 'text-green-400' : 'text-green-500')} />
                <span className={`text-[9px] font-bold tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1.5 ${kpis.pendentes > 0 ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                  {kpis.pendentes > 0 && <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></div>}
                  {kpis.pendentes > 0 ? `${kpis.pendentes} ALERTA(S)` : 'FROTA OK'}
                </span>
              </div>
              <div className="relative z-10 mt-2">
                <p className={`text-3xl font-light tracking-tight ${kpis.pendentes > 0 ? 'text-red-500' : 'text-green-500'}`}>{kpis.pendentes}</p>
                <p className={`text-[11px] uppercase tracking-wider font-bold mt-1 ${isDarkMode ? 'text-red-500/70' : 'text-red-600'}`}>Veículos com Alertas</p>
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-red-500/5 rounded-full blur-xl group-hover:bg-red-500/10 transition-colors"></div>
            </div>
          </div>
        )}

        {/* ── MANUTENÇÃO ── */}
        {['Todos', 'Manutenção'].includes(activeFilter) && (
          <div className={`${theme.card} rounded-[2rem] border p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200 fill-mode-both shadow-sm`}>
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-3 rounded-full ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                <Calendar size={24} />
              </div>
              <div>
                <h3 className={`font-medium text-lg ${theme.textMain}`}>Cronograma de Intervenções</h3>
                <p className={`text-xs ${theme.textMuted} mt-0.5`}>
                  {vehicleList.filter(v => v.uiStatus !== 'ok').length} veículo(s) necessitam atenção
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {/* Itens dinâmicos a partir de veículos com alerta */}
              {vehicleList.filter(v => v.uiStatus !== 'ok').slice(0, 3).map((v) => {
                const alert = v.alerts?.[0]
                const rid = `real-${v.id}`
                const pidMap = alert ? PID_ALERT[alert.pid] : null
                return (
                  <div key={rid} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-all ${
                    resolvedIssues.includes(rid)
                      ? isDarkMode ? 'border-green-900/30 bg-green-950/10' : 'border-green-100 bg-green-50'
                      : v.uiStatus === 'critical'
                        ? isDarkMode ? 'border-red-900/30 bg-red-950/10' : 'border-red-100 bg-red-50/50'
                        : isDarkMode ? 'border-yellow-900/30 bg-yellow-950/10' : 'border-yellow-100 bg-yellow-50/50'
                  }`}>
                    <div className="flex items-center gap-4 mb-4 sm:mb-0">
                      <div className={`p-3 rounded-xl ${
                        resolvedIssues.includes(rid) ? 'bg-green-100 text-green-600'
                        : v.uiStatus === 'critical' ? isDarkMode ? 'bg-red-500/20 text-red-500' : 'bg-red-100 text-red-600'
                        : isDarkMode ? 'bg-yellow-500/20 text-yellow-500' : 'bg-yellow-100 text-yellow-600'
                      }`}>
                        {resolvedIssues.includes(rid) ? <CheckCircle2 size={20} /> : <PenLine size={20} />}
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${resolvedIssues.includes(rid) ? 'text-green-600' : v.uiStatus === 'critical' ? isDarkMode ? 'text-red-400' : 'text-red-600' : isDarkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
                          {resolvedIssues.includes(rid) ? 'Agendado com Sucesso' : (pidMap?.title ?? 'Verificar Veículo')}
                        </p>
                        <p className={`text-xs mt-0.5 font-medium ${theme.textMuted}`}>
                          {v.name} ({v.placa}) • {v.driver}
                          {alert?.value != null && ` • ${alert.value.toFixed(1)} ${alert.unit}`}
                        </p>
                      </div>
                    </div>
                    {!resolvedIssues.includes(rid) && (
                      <button
                        onClick={() => handleResolve(rid)}
                        className={`text-[10px] uppercase font-bold tracking-wider text-white px-5 py-2.5 rounded-full transition-colors shadow-sm ${
                          v.uiStatus === 'critical' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 'bg-yellow-500 hover:bg-yellow-600 shadow-yellow-500/20'
                        }`}
                      >
                        AGENDAR AGORA
                      </button>
                    )}
                  </div>
                )
              })}

              {/* Item fixo de revisão agendada */}
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-all ${
                resolvedIssues.includes('revisao')
                  ? isDarkMode ? 'border-green-900/30 bg-green-950/10' : 'border-green-100 bg-green-50'
                  : isDarkMode ? 'border-gray-800 bg-[#1e2532]/50' : 'border-gray-100 bg-gray-50/50'
              }`}>
                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                  <div className={`p-3 rounded-xl ${resolvedIssues.includes('revisao') ? 'bg-green-100 text-green-600' : isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white shadow-sm text-gray-500'}`}>
                    {resolvedIssues.includes('revisao') ? <CheckCircle2 size={20} /> : <Wrench size={20} />}
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${resolvedIssues.includes('revisao') ? 'text-green-600' : theme.textMain}`}>
                      {resolvedIssues.includes('revisao') ? 'Orçamento Aprovado' : 'Revisão Preventiva 10.000km'}
                    </p>
                    <p className={`text-xs mt-0.5 font-medium ${theme.textMuted}`}>Frota completa • Próxima quinzena</p>
                  </div>
                </div>
                {!resolvedIssues.includes('revisao') && (
                  <button
                    onClick={() => handleResolve('revisao')}
                    className={`text-[10px] uppercase font-bold tracking-wider px-5 py-2.5 rounded-full border transition-colors ${isDarkMode ? 'border-gray-700 text-gray-300 hover:bg-blue-600 hover:border-blue-600 hover:text-white' : 'border-gray-200 text-gray-600 hover:bg-blue-500 hover:text-white hover:border-blue-500'}`}
                  >
                    APROVAR ORÇAMENTO
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── DIRETÓRIO RÁPIDO (direita) ─────────────────────────────────────── */}
      <aside className="hidden lg:block w-[300px] shrink-0">
        <div className="sticky top-24 flex flex-col gap-4 h-[calc(100vh-8rem)]">
          <div className="flex items-center justify-between px-2">
            <h3 className={`text-[10px] font-bold ${theme.textMuted} uppercase tracking-wider`}>Diretório Rápido</h3>
          </div>
          <div className={`flex ${theme.card} rounded-full p-1 border shadow-sm shrink-0`}>
            <button onClick={() => setDriverTab('em_rota')} className={`flex-1 text-xs font-bold py-2 rounded-full transition-all ${driverTab === 'em_rota' ? isDarkMode ? 'bg-[#1e2532] text-white shadow-md' : 'bg-white text-gray-900 shadow-md' : 'text-gray-400 hover:text-gray-500'}`}>
              EM ROTA ({onRoute})
            </button>
            <button onClick={() => setDriverTab('disponivel')} className={`flex-1 text-xs font-bold py-2 rounded-full transition-all ${driverTab === 'disponivel' ? isDarkMode ? 'bg-[#1e2532] text-white shadow-md' : 'bg-white text-gray-900 shadow-md' : 'text-gray-400 hover:text-gray-500'}`}>
              DISPONÍVEL ({available})
            </button>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col gap-3 pb-4 pr-1">
            {vehicleList.filter(v => v.frotaStatus === driverTab).map(v => (
              <DriverUberCard
                key={v.id}
                driver={{
                  id:       v.id,
                  name:     v.driver,
                  status:   v.frotaStatus,
                  time:     v.time,
                  placa:    v.placa,
                  avatar:   v.avatar,
                  carColor: v.color,
                }}
                theme={theme}
                isDarkMode={isDarkMode}
              />
            ))}
            {vehicleList.filter(v => v.frotaStatus === driverTab).length === 0 && (
              <p className={`text-xs ${theme.textMuted} text-center py-4`}>Nenhum motorista neste status</p>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
