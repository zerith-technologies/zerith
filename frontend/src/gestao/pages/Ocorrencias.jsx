import { Card, PageHeader, Badge, DataTable, Loading, FetchError } from '../GestaoLayout.jsx'
import { useFetch } from '../hooks/useFetch.js'

function fmtTs(ts) {
  if (!ts) return '—'
  const d = new Date(ts)
  return d.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'medium' })
}

export default function Ocorrencias() {
  const { data, loading, error } = useFetch('/api/gestao/ocorrencias')

  const rows = (data ?? []).map(o => [
    <span className="text-gray-500 tabular-nums">{fmtTs(o.timestamp)}</span>,
    <span className="font-medium text-white">{o.veiculo}</span>,
    o.tipo,
    <span className="tabular-nums font-bold">{o.valor} {o.unidade}</span>,
    <Badge level={o.nivel} />,
  ])

  return (
    <div className="p-6">
      <PageHeader title="Ocorrências" subtitle="Últimas 50 leituras fora dos limiares configurados" />
      {loading && <Loading />}
      {error   && <FetchError msg={error} />}

      {data && (
        <Card>
          <DataTable
            cols={['Data / Hora', 'Veículo', 'Tipo', 'Valor', 'Nível']}
            rows={rows}
          />
        </Card>
      )}
    </div>
  )
}
