import { Clock, ChevronDown, TrendingUp, Activity, Wrench, Zap, DollarSign, Gauge } from 'lucide-react'

export default function FinanceiraView({ theme, isDarkMode }) {
  const bars = [
    { month: 'Jan', val: 60, cost: 'R$ 38k' },
    { month: 'Fev', val: 75, cost: 'R$ 45k' },
    { month: 'Mar', val: 50, cost: 'R$ 32k' },
    { month: 'Abr', val: 85, cost: 'R$ 50k' },
    { month: 'Mai', val: 65, cost: 'R$ 40k' },
    { month: 'Jun', val: 70, cost: 'R$ 42.5k', active: true },
  ]

  const transactions = [
    { title: 'Abastecimento L-105', desc: 'Posto Ipiranga', val: '- R$ 240,00', type: 'fuel', date: 'Hoje, 14:30' },
    { title: 'Revisão V-1042', desc: 'Oficina Autorizada', val: '- R$ 1.250,00', type: 'maintenance', date: 'Ontem, 09:15' },
    { title: 'Recarga EV L-301', desc: 'Eletroposto Matriz', val: '- R$ 45,00', type: 'energy', date: '12 Maio, 18:00' },
    { title: 'Seguro Frota Leve', desc: 'Apólice Mensal', val: '- R$ 8.400,00', type: 'fixed', date: '10 Maio, 10:00' },
    { title: 'Estacionamento', desc: 'Aeroporto CGH', val: '- R$ 85,00', type: 'other', date: '08 Maio, 20:45' },
  ]

  return (
    <section className="flex-1 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className={`text-2xl font-light tracking-tight ${theme.textMain}`}>Gestão Financeira</h2>
          <p className={`text-sm ${theme.textMuted} mt-1`}>Análise de custos, despesas e ROI da frota.</p>
        </div>
        <button className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${isDarkMode ? 'bg-[#1e2532] text-white hover:bg-gray-800' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm'}`}>
          <Clock size={16} /> Últimos 30 Dias <ChevronDown size={14} />
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        <div className={`${theme.card} border rounded-[1.5rem] p-5 shadow-sm`}>
          <p className={`text-xs ${theme.textMuted} font-bold uppercase tracking-wider`}>Custo Total (Mês)</p>
          <p className={`text-3xl font-light ${theme.textMain} mt-2`}>R$ 42.5K</p>
          <p className="text-[10px] text-red-500 font-bold tracking-wider mt-2 flex items-center gap-1">
            <TrendingUp size={12} /> +5.2% VS MÊS ANT.
          </p>
        </div>
        <div className={`${theme.card} border rounded-[1.5rem] p-5 shadow-sm`}>
          <p className={`text-xs ${theme.textMuted} font-bold uppercase tracking-wider`}>Economia Gerada (IA)</p>
          <p className="text-3xl font-light text-green-500 mt-2">R$ 5.230</p>
          <p className="text-[10px] text-green-500 font-bold tracking-wider mt-2 flex items-center gap-1">
            <Activity size={12} /> OTIMIZAÇÃO DE ROTAS
          </p>
        </div>
        <div className={`${theme.card} border rounded-[1.5rem] p-5 shadow-sm`}>
          <p className={`text-xs ${theme.textMuted} font-bold uppercase tracking-wider`}>Manutenção Preditiva</p>
          <p className={`text-3xl font-light ${theme.textMain} mt-2`}>R$ 12.8K</p>
          <p className="text-[10px] text-blue-500 font-bold tracking-wider mt-2 flex items-center gap-1">
            <Wrench size={12} /> 14 ORDENS DE SERVIÇO
          </p>
        </div>
        <div className={`${theme.card} border rounded-[1.5rem] p-5 shadow-sm`}>
          <p className={`text-xs ${theme.textMuted} font-bold uppercase tracking-wider`}>Combustível / Carga</p>
          <p className={`text-3xl font-light ${theme.textMain} mt-2`}>R$ 18.4K</p>
          <p className="text-[10px] text-green-500 font-bold tracking-wider mt-2 flex items-center gap-1">
            <Zap size={12} /> -2.1% EFICIÊNCIA EV
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Bar chart */}
        <div className={`xl:col-span-2 ${theme.card} border rounded-[2rem] p-6 shadow-sm`}>
          <h3 className={`font-medium text-lg ${theme.textMain} mb-6`}>Histórico de Custos (6 Meses)</h3>
          <div className="h-64 w-full flex items-end gap-4 px-2">
            {bars.map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end items-center gap-2 group cursor-pointer">
                <span className={`text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity ${bar.active ? 'text-blue-500 opacity-100' : theme.textMuted}`}>{bar.cost}</span>
                <div
                  className={`w-full max-w-[4rem] rounded-t-xl transition-all duration-500 ${bar.active ? 'bg-blue-500' : isDarkMode ? 'bg-gray-800 group-hover:bg-gray-700' : 'bg-gray-200 group-hover:bg-gray-300'}`}
                  style={{ height: `${bar.val}%` }}
                ></div>
                <span className={`text-xs font-medium mt-2 ${bar.active ? 'text-blue-500' : theme.textMuted}`}>{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Transactions */}
        <div className={`${theme.card} border rounded-[2rem] p-6 shadow-sm flex flex-col`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={`font-medium text-lg ${theme.textMain}`}>Transações Recentes</h3>
            <button className="text-xs font-bold text-blue-500 hover:text-blue-600">VER TODAS</button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {transactions.map((t, i) => (
              <div key={i} className="flex justify-between items-center group">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    {t.type === 'fuel'        ? <Gauge size={16} className="text-yellow-500" /> :
                     t.type === 'maintenance' ? <Wrench size={16} className="text-red-500" /> :
                     t.type === 'energy'      ? <Zap size={16} className="text-blue-500" /> :
                                               <DollarSign size={16} className="text-green-500" />}
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${theme.textMain}`}>{t.title}</p>
                    <p className={`text-[10px] ${theme.textMuted}`}>{t.desc} • {t.date}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${theme.textMain}`}>{t.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
