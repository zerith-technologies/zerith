import { useState, useEffect } from 'react'
import { X, Activity, Wrench, CheckCircle2, Calendar } from 'lucide-react'
import VehicleBlueprint from './VehicleBlueprint'

export default function VehicleModal({ vehicle, onClose, theme, isDarkMode }) {
  const [diagState, setDiagState] = useState('idle')
  const [progress, setProgress] = useState(0)
  const [diagStep, setDiagStep] = useState(0)

  const isOk = vehicle.status === 'ok' || vehicle.status === 'active'
  const statusText = isOk ? 'OPERAÇÃO NORMAL' : vehicle.status === 'warning' ? 'VERIFICAR SISTEMA' : 'AÇÃO NECESSÁRIA'

  const diagSteps = [
    'Iniciando handshake OBD-II...',
    'Analisando telemetria de sensores...',
    'Buscando anomalias no padrão do motor...',
    'Cruzando dados com IA na nuvem...',
    'Consolidando relatório de diagnóstico...',
  ]

  useEffect(() => {
    let interval
    if (diagState === 'running') {
      interval = setInterval(() => {
        setProgress(old => {
          if (old >= 100) { clearInterval(interval); setDiagState('completed'); return 100 }
          if (old === 20) setDiagStep(1)
          if (old === 40) setDiagStep(2)
          if (old === 60) setDiagStep(3)
          if (old === 80) setDiagStep(4)
          return old + 2
        })
      }, 60)
    }
    return () => clearInterval(interval)
  }, [diagState])

  const startDiagnosis = (e) => {
    e.stopPropagation()
    setDiagState('running')
    setProgress(0)
    setDiagStep(0)
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`${theme.card} w-full max-w-[420px] h-[700px] rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col animate-in zoom-in-95 duration-300`}
        onClick={e => e.stopPropagation()}
      >
        {/* Blueprint area */}
        <div className={`absolute top-0 left-0 w-full h-[55%] bg-gradient-to-b ${theme.studioBg} flex flex-col items-center justify-center`}>
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 ${isDarkMode ? 'bg-blue-500/5' : 'bg-white/60'} rounded-full blur-[50px] opacity-70`}></div>
          <div className="w-[90%] max-w-[320px] max-h-[240px] relative z-10 flex items-center justify-center">
            <VehicleBlueprint status={vehicle.status} isDarkMode={isDarkMode} isScanning={diagState === 'running'} />
          </div>
        </div>

        {/* Status badge + close */}
        <div className="px-6 py-6 flex justify-between items-start z-20 relative">
          <div className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest flex items-center gap-2 shadow-sm ${
            isOk
              ? 'bg-green-500/10 text-green-500 border border-green-500/20'
              : vehicle.status === 'warning'
                ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                : 'bg-red-500/10 text-red-500 border border-red-500/20'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${isOk ? 'bg-green-500' : vehicle.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500 animate-ping'}`}></div>
            {statusText}
          </div>
          <button onClick={onClose} className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-800/50 hover:bg-gray-700' : 'bg-black/5 hover:bg-black/10'} transition-colors`}>
            <X size={18} className={theme.textMain} />
          </button>
        </div>

        <div className="flex-1"></div>

        {/* Bottom panel */}
        <div className={`relative z-20 ${theme.card} rounded-t-[2.5rem] pt-8 px-8 pb-8 flex flex-col h-[50%] border-t ${theme.border} shadow-[0_-15px_40px_rgba(0,0,0,0.05)]`}>
          <div className={`w-12 h-1 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full absolute top-4 left-1/2 -translate-x-1/2`}></div>

          <div className="mt-0 mb-5">
            <h2 className={`text-3xl font-light ${theme.textMain} tracking-tight`}>{vehicle.id}</h2>
            <p className={`text-xs ${theme.textMuted} font-medium mt-1`}>Placa: {vehicle.placa || 'N/A'} • {vehicle.driver || 'Sem motorista'}</p>
          </div>

          {diagState === 'idle' && (
            <div className={`rounded-2xl p-4 text-left flex gap-4 items-center mb-auto border ${
              isOk
                ? isDarkMode ? 'bg-green-950/20 border-green-900/30' : 'bg-green-50 border-green-100'
                : vehicle.status === 'warning'
                  ? isDarkMode ? 'bg-yellow-950/20 border-yellow-900/30' : 'bg-yellow-50 border-yellow-100'
                  : isDarkMode ? 'bg-red-950/20 border-red-900/30' : 'bg-red-50 border-red-100'
            }`}>
              <div className={`p-3 rounded-full ${isOk ? 'bg-green-100/10 text-green-500' : vehicle.status === 'warning' ? 'bg-yellow-100/10 text-yellow-500' : 'bg-red-100/10 text-red-500'}`}>
                {isOk ? <CheckCircle2 size={24} /> : vehicle.status === 'warning' ? <Activity size={24} /> : <Wrench size={24} />}
              </div>
              <div>
                <p className={`font-medium text-sm ${isOk ? 'text-green-500' : vehicle.status === 'warning' ? 'text-yellow-500' : 'text-red-500'}`}>
                  {isOk ? 'Todos os sistemas normais' : vehicle.status === 'warning' ? 'Atenção ao motor/vibração' : 'Problema Detectado nos Freios'}
                </p>
                <p className={`text-xs mt-1 ${theme.textMuted}`}>
                  {isOk
                    ? 'Veículo operando na rota com segurança.'
                    : vehicle.status === 'warning'
                      ? 'Recomenda-se verificação em breve.'
                      : 'Risco de falha de frenagem. Ação requerida.'}
                </p>
              </div>
            </div>
          )}

          {diagState === 'running' && (
            <div className="flex flex-col justify-center mb-auto h-full w-full px-2">
              <div className="flex justify-between items-center mb-3">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${theme.textMuted}`}>{diagSteps[diagStep]}</span>
                <span className={`text-xs font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{progress}%</span>
              </div>
              <div className={`h-2.5 w-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                <div className="h-full bg-blue-500 rounded-full transition-all duration-75" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}

          {diagState === 'completed' && (
            <div className="flex flex-col gap-3 mb-auto animate-in fade-in zoom-in-95 duration-300 w-full">
              <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-green-900/10 border-green-900/30' : 'bg-green-50 border-green-100'} flex items-start gap-3`}>
                <CheckCircle2 size={18} className="text-green-500 mt-0.5 shrink-0" />
                <div>
                  <p className={`text-sm font-bold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>Diagnóstico Preditivo Concluído</p>
                  <p className={`text-[11px] ${theme.textMuted} mt-1 leading-relaxed`}>
                    {vehicle.status === 'critical'
                      ? 'Confirmação de anomalia no bloco de válvulas do ABS (traseira direita). Probabilidade de falha mecânica: 98.4%. O.S. recomendada.'
                      : 'Sistema verificado. Dados enviados para o histórico da frota. Tudo pronto para prosseguir.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {diagState === 'idle' && (
            <button
              onClick={startDiagnosis}
              className={`w-full h-12 rounded-full font-medium text-xs tracking-wider transition-all flex items-center justify-center gap-2 group/btn ${
                isOk
                  ? isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-[#1e2532] text-white hover:bg-black'
              }`}
            >
              {isOk ? 'VER HISTÓRICO DA ROTA' : (
                <>
                  <Activity size={16} className={`${vehicle.status === 'critical' && !isDarkMode ? 'text-blue-400' : 'text-white'} group-hover/btn:animate-pulse`} />
                  {vehicle.status === 'warning' ? 'AGENDAR REVISÃO' : 'INICIAR DIAGNÓSTICO'}
                </>
              )}
            </button>
          )}

          {diagState === 'running' && (
            <button disabled className={`w-full h-12 rounded-full font-medium text-xs tracking-wider flex items-center justify-center gap-2 ${isDarkMode ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-400'} cursor-not-allowed`}>
              <Activity size={16} className="animate-spin" /> PROCESSANDO...
            </button>
          )}

          {diagState === 'completed' && (
            <button
              onClick={onClose}
              className={`w-full h-12 rounded-full font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 ${
                vehicle.status === 'critical'
                  ? isDarkMode ? 'bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30' : 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100'
                  : isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {vehicle.status === 'critical' ? (
                <><Calendar size={16} /> GERAR ORDEM DE SERVIÇO (O.S.)</>
              ) : 'FECHAR E RETORNAR'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
