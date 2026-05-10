import { Card, PageHeader, StatCard, DataTable, Loading, FetchError } from '../GestaoLayout.jsx'
import { useFetch } from '../hooks/useFetch.js'

export default function Relatorios() {
  const { data, loading, error } = useFetch('/api/gestao/relatorios')

  const rows = (data?.porVeiculo ?? []).map(v => [
    <span className="font-medium text-white">{v.nome}</span>,
    v.totalLeituras.toLocaleString('pt-BR'),
    `${v.velMedia} km/h`,
    `${v.kmRodados} km`,
    v.alertasVelocidade,
    v.alertasTemperatura,
  ])

  return (
    <div className="p-6">
      <PageHeader title="Relatórios" subtitle="Consolidado de todos os dados disponíveis" />
      {loading && <Loading />}
      {error   && <FetchError msg={error} />}

      {data && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-3 gap-4">
            <StatCard label="Total de Leituras"  value={data.totalLeituras.toLocaleString('pt-BR')} />
            <StatCard label="Eventos Críticos"   value={data.totalDanger}  color="#E24B4A" />
            <StatCard label="Alertas de Atenção" value={data.totalWarning} color="#BA7517" />
          </div>

          <Card>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-3">Detalhamento por Veículo</p>
            <DataTable
              cols={['Veículo', 'Leituras', 'Vel. Média', 'Km Estimados', 'Alert. Velocidade', 'Alert. Temperatura']}
              rows={rows}
            />
          </Card>

          <Card>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Período</p>
            <p className="text-xs text-gray-400">Todos os registros na base de dados.</p>
            <p className="text-[11px] text-gray-600 mt-2">
              Km estimado = soma das leituras de velocidade ÷ 3600 (1 leitura/s).
            </p>
          </Card>
        </div>
      )}
    </div>
  )
}
