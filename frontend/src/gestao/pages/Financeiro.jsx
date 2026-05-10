import { Card, PageHeader, StatCard, DataTable, Loading, FetchError } from '../GestaoLayout.jsx'
import { useFetch } from '../hooks/useFetch.js'

const R$ = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function Financeiro() {
  const { data, loading, error } = useFetch('/api/gestao/financeiro')

  const rows = (data?.porVeiculo ?? []).map(v => [
    <span className="font-medium text-white">{v.nome}</span>,
    `${v.km} km`,
    `${v.consumo} L`,
    <span className="font-bold text-emerald-400">{R$(v.custo)}</span>,
  ])

  return (
    <div className="p-6">
      <PageHeader title="Financeiro" subtitle={`Estimativas baseadas em 9 L/100km · R$ 6,00/L`} />
      {loading && <Loading />}
      {error   && <FetchError msg={error} />}

      {data && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-3 gap-4">
            <StatCard label="Km Total da Frota"    value={`${data.kmTotal} km`} />
            <StatCard label="Consumo Estimado"     value={`${(data.kmTotal * 9 / 100).toFixed(1)} L`} />
            <StatCard label="Custo Estimado"       value={R$(data.custoTotal)} color="#1D9E75" />
          </div>

          <Card>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-3">Por Veículo</p>
            <DataTable
              cols={['Veículo', 'Km Rodados', 'Combustível', 'Custo Estimado']}
              rows={rows}
            />
          </Card>

          <Card className="flex gap-6">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Consumo Médio</p>
              <p className="text-sm text-gray-300">{data.consumoMedio} L/100km</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Preço do Litro</p>
              <p className="text-sm text-gray-300">{R$(data.precoLitro)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Referência</p>
              <p className="text-sm text-gray-600">Gasolina comum · maio/2026</p>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
