import { Card, PageHeader, Badge, DataTable, Loading, FetchError } from '../GestaoLayout.jsx'
import { useFetch } from '../hooks/useFetch.js'

export default function Manutencao() {
  const { data, loading, error } = useFetch('/api/gestao/manutencao')

  const rows = (data ?? []).map(m => [
    <span className="font-medium text-white">{m.veiculo}</span>,
    m.tipo,
    <span className="tabular-nums font-bold text-amber-400">{m.ocorrencias}</span>,
    <Badge level={m.prioridade} />,
  ])

  return (
    <div className="p-6">
      <PageHeader title="Manutenção" subtitle="Alertas agrupados por tipo e veículo" />
      {loading && <Loading />}
      {error   && <FetchError msg={error} />}

      {data && (
        <div className="flex flex-col gap-5">
          {data.length === 0 ? (
            <Card>
              <p className="text-xs text-emerald-400 text-center py-4">
                Nenhum alerta de manutenção registrado — frota em bom estado.
              </p>
            </Card>
          ) : (
            <Card>
              <DataTable
                cols={['Veículo', 'Tipo de Alerta', 'Ocorrências', 'Prioridade']}
                rows={rows}
              />
            </Card>
          )}

          <Card className="flex gap-6 text-xs text-gray-500">
            <div>
              <span className="text-red-400 font-medium">Crítico</span> — mais de 10 eventos
            </div>
            <div>
              <span className="text-amber-400 font-medium">Atenção</span> — 4 a 10 eventos
            </div>
            <div>
              <span className="text-indigo-400 font-medium">Info</span> — até 3 eventos
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
