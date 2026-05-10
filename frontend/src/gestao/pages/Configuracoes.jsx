import { Card, PageHeader, Loading, FetchError } from '../GestaoLayout.jsx'
import { useFetch } from '../hooks/useFetch.js'

function ThresholdRow({ label, warning, danger, unit }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
      <span className="text-xs text-gray-400">{label}</span>
      <div className="flex gap-4 text-xs tabular-nums">
        <span className="text-amber-400">⚠ {warning} {unit}</span>
        <span className="text-red-400">✕ {danger} {unit}</span>
      </div>
    </div>
  )
}

export default function Configuracoes() {
  const { data, loading, error } = useFetch('/api/gestao/configuracoes')

  return (
    <div className="p-6">
      <PageHeader title="Configurações" subtitle="Parâmetros do sistema de telemetria (somente leitura)" />
      {loading && <Loading />}
      {error   && <FetchError msg={error} />}

      {data && (
        <div className="grid grid-cols-2 gap-4">
          {/* Thresholds */}
          <Card>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-3">Limiares de Alerta</p>
            <ThresholdRow label="Velocidade"  warning={data.thresholds.velocidade.warning}  danger={data.thresholds.velocidade.danger}  unit="km/h" />
            <ThresholdRow label="Temperatura" warning={data.thresholds.temperatura.warning} danger={data.thresholds.temperatura.danger} unit="°C"   />
            <ThresholdRow label="RPM"         warning={data.thresholds.rpm.warning}         danger={data.thresholds.rpm.danger}         unit="rpm"  />
            <div className="flex items-center justify-between py-2">
              <span className="text-xs text-gray-400">Lambda (A/F)</span>
              <span className="text-xs text-amber-400 tabular-nums">
                ⚠ &lt;{data.thresholds.lambda.min} ou &gt;{data.thresholds.lambda.max} {data.thresholds.lambda.unit}
              </span>
            </div>
          </Card>

          {/* Frota */}
          <Card>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-3">Frota</p>
            {[
              ['Veículos',           data.frota.veiculos],
              ['Consumo médio',      `${data.frota.consumo_l100km} L/100km`],
              ['Preço do combustível', `R$ ${data.frota.preco_litro_brl.toFixed(2)}/L`],
              ['Intervalo de leitura', `${data.frota.intervalo_leitura_s}s`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 border-b border-gray-800 last:border-0">
                <span className="text-xs text-gray-400">{k}</span>
                <span className="text-xs text-gray-200">{v}</span>
              </div>
            ))}
          </Card>

          {/* MQTT */}
          <Card>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-3">MQTT</p>
            {[
              ['Broker',  data.mqtt.broker],
              ['Tópico',  data.mqtt.topico],
              ['QoS',     data.mqtt.qos],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 border-b border-gray-800 last:border-0">
                <span className="text-xs text-gray-400">{k}</span>
                <span className="text-xs font-mono text-gray-300">{v}</span>
              </div>
            ))}
          </Card>

          {/* PIDs monitorados */}
          <Card>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-3">PIDs Monitorados</p>
            {[
              ['0x05', 'Temperatura',  'A − 40',              '°C'],
              ['0x0B', 'MAP',          'A',                   'kPa'],
              ['0x0C', 'RPM',          '(A×256+B)/4',         'rpm'],
              ['0x0D', 'Velocidade',   'A',                   'km/h'],
              ['0x24', 'Lambda (A/F)', '(A×256+B)×2/65536×14.7', 'A/F'],
            ].map(([pid, nome, formula, unit]) => (
              <div key={pid} className="flex justify-between py-2 border-b border-gray-800 last:border-0">
                <span className="text-xs font-mono text-indigo-400">{pid}</span>
                <span className="text-xs text-gray-300">{nome}</span>
                <span className="text-xs text-gray-600 font-mono">{unit}</span>
              </div>
            ))}
          </Card>
        </div>
      )}
    </div>
  )
}
