import { Card, PageHeader, Badge, DataTable, Loading, FetchError } from '../GestaoLayout.jsx'
import { useFetch } from '../hooks/useFetch.js'

export default function Veiculos() {
  const { data, loading, error } = useFetch('/api/gestao/veiculos')

  const rows = (data ?? []).map(v => [
    <span className="font-medium text-white">{v.nome}</span>,
    <span className="font-mono text-gray-500">{v.placa}</span>,
    `${v.velMedia} km/h`,
    `${v.rpmMedio} rpm`,
    `${v.tempMedia} °C`,
    `${v.velMax} km/h`,
    v.totalLeituras.toLocaleString('pt-BR'),
    <Badge level={v.status} />,
  ])

  return (
    <div className="p-6">
      <PageHeader title="Veículos" subtitle="Estatísticas técnicas por veículo" />
      {loading && <Loading />}
      {error   && <FetchError msg={error} />}
      {data && (
        <Card>
          <DataTable
            cols={['Veículo', 'Placa', 'Vel. Média', 'RPM Médio', 'Temp. Média', 'Vel. Máx.', 'Leituras', 'Status']}
            rows={rows}
          />
        </Card>
      )}
    </div>
  )
}
