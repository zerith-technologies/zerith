import { Card, PageHeader, Badge, DataTable, Loading, FetchError } from '../GestaoLayout.jsx'
import { useFetch } from '../hooks/useFetch.js'

const SCORE_COLOR = s => s >= 80 ? '#1D9E75' : s >= 60 ? '#BA7517' : '#E24B4A'

export default function Motoristas() {
  const { data, loading, error } = useFetch('/api/gestao/motoristas')

  const rows = (data ?? []).map(m => [
    <span className="font-medium text-white">{m.nome}</span>,
    m.veiculo,
    <span className="font-mono text-gray-500">{m.placa}</span>,
    <span className="font-bold tabular-nums" style={{ color: SCORE_COLOR(m.score) }}>{m.score}</span>,
    m.alertas,
    `${m.kmRodados} km`,
    m.totalLeituras.toLocaleString('pt-BR'),
    <Badge level={m.status} />,
  ])

  return (
    <div className="p-6">
      <PageHeader title="Motoristas" subtitle="Desempenho individual por condutor" />
      {loading && <Loading />}
      {error   && <FetchError msg={error} />}
      {data && (
        <Card>
          <DataTable
            cols={['Motorista', 'Veículo', 'Placa', 'Score', 'Alertas', 'Km Rodados', 'Leituras', 'Status']}
            rows={rows}
          />
        </Card>
      )}
    </div>
  )
}
