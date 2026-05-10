import { Card, PageHeader, StatCard, Badge, Loading, FetchError } from '../GestaoLayout.jsx'
import { useFetch } from '../hooks/useFetch.js'

const SCORE_COLOR = s => s >= 80 ? '#1D9E75' : s >= 60 ? '#BA7517' : '#E24B4A'

export default function GestaoHome() {
  const { data, loading, error } = useFetch('/api/gestao/dashboard')

  return (
    <div className="p-6">
      <PageHeader title="Dashboard" subtitle="Visão geral da frota em tempo real" />

      {loading && <Loading />}
      {error   && <FetchError msg={error} />}

      {data && (
        <div className="flex flex-col gap-5">
          {/* ── Stat cards ── */}
          <div className="grid grid-cols-4 gap-4">
            <StatCard label="Total de Leituras"   value={data.totalLeituras.toLocaleString('pt-BR')} />
            <StatCard label="Veículos Ativos"     value={data.veiculosAtivos} />
            <StatCard label="Alertas Críticos"    value={data.alertasDanger}  color="#E24B4A" />
            <StatCard label="Alertas de Atenção"  value={data.alertasWarning} color="#BA7517" />
          </div>

          {/* ── Score bars ── */}
          <Card>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-3">Score por Veículo</p>
            <div className="flex flex-col gap-3">
              {data.scores.map(v => (
                <div key={v.vehicleId} className="flex items-center gap-3">
                  <p className="text-xs text-gray-400 w-24 flex-shrink-0">{v.nome}</p>
                  <div className="flex-1 bg-gray-800 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ width: `${v.score}%`, backgroundColor: SCORE_COLOR(v.score) }}
                    />
                  </div>
                  <p className="text-xs font-bold tabular-nums w-8 text-right" style={{ color: SCORE_COLOR(v.score) }}>
                    {v.score}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* ── Status summary ── */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">Saúde da Frota</p>
              {data.alertasDanger === 0 && data.alertasWarning === 0 ? (
                <p className="text-sm text-emerald-400">Todos os veículos operando normalmente.</p>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {data.alertasDanger > 0 && (
                    <div className="flex items-center gap-2">
                      <Badge level="danger" />
                      <span className="text-xs text-gray-400">{data.alertasDanger} evento(s) crítico(s) registrado(s)</span>
                    </div>
                  )}
                  {data.alertasWarning > 0 && (
                    <div className="flex items-center gap-2">
                      <Badge level="warning" />
                      <span className="text-xs text-gray-400">{data.alertasWarning} alerta(s) de atenção</span>
                    </div>
                  )}
                </div>
              )}
            </Card>
            <Card>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">Score Médio da Frota</p>
              {data.scores.length > 0 ? (
                <>
                  <p className="text-3xl font-bold tabular-nums" style={{ color: SCORE_COLOR(Math.round(data.scores.reduce((s, v) => s + v.score, 0) / data.scores.length)) }}>
                    {Math.round(data.scores.reduce((s, v) => s + v.score, 0) / data.scores.length)}
                  </p>
                  <p className="text-[11px] text-gray-600 mt-1">de 100 pontos</p>
                </>
              ) : (
                <p className="text-xs text-gray-600">Sem dados ainda.</p>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
