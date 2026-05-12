import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Cpu, Wifi, BarChart2, MapPin, Bell, Star, Wrench,
  ArrowRight, X, CheckCircle, GitBranch, Mail, Truck,
  ChevronRight, Shield, Zap,
} from 'lucide-react'

// ── Beta request modal ────────────────────────────────────────────────────────
function BetaModal({ onClose }) {
  const [form, setForm]       = useState({ nome: '', empresa: '', email: '', veiculos: '' })
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md bg-[#151b28] border border-gray-700/60 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-700/60">
          <div>
            <h2 className="text-white font-semibold">Solicitar acesso beta</h2>
            <p className="text-gray-400 text-xs mt-0.5">Vagas limitadas — respondemos em até 48h</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-1">
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="px-6 py-12 text-center">
            <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={28} className="text-green-400" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Solicitação enviada!</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Obrigado, <strong className="text-white">{form.nome}</strong>!<br />
              Entraremos em contato com <span className="text-blue-400">{form.email}</span> em breve.
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-colors"
            >
              Fechar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            {[
              { key: 'nome',     label: 'Nome completo',          type: 'text',   placeholder: 'João Silva' },
              { key: 'empresa',  label: 'Empresa',                type: 'text',   placeholder: 'Transportadora XYZ' },
              { key: 'email',    label: 'E-mail corporativo',     type: 'email',  placeholder: 'joao@empresa.com.br' },
              { key: 'veiculos', label: 'Quantidade de veículos', type: 'number', placeholder: '5', min: '1' },
            ].map(({ key, label, type, placeholder, min }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
                <input
                  type={type}
                  required
                  min={min}
                  value={form[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full bg-[#0f141e] border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
            ))}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-colors text-sm mt-2"
            >
              Solicitar acesso
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

// ── Feature card ──────────────────────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, desc, accent = 'blue' }) {
  const colors = {
    blue:   'bg-blue-500/10 text-blue-400   border-blue-500/20',
    green:  'bg-green-500/10 text-green-400 border-green-500/20',
    amber:  'bg-amber-500/10 text-amber-400 border-amber-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  }
  return (
    <div className="bg-[#151b28] border border-gray-700/50 rounded-2xl p-6 hover:border-gray-600 transition-colors group">
      <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-4 ${colors[accent]}`}>
        <Icon size={22} />
      </div>
      <h3 className="text-white font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
  )
}

// ── Step card ─────────────────────────────────────────────────────────────────
function StepCard({ num, icon: Icon, title, desc }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative">
        <div className="w-16 h-16 bg-[#151b28] border border-gray-700 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
          <Icon size={28} className="text-blue-400" />
        </div>
        <span className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-[11px] font-bold text-white">
          {num}
        </span>
      </div>
      <h3 className="text-white font-semibold mb-1">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed max-w-[200px]">{desc}</p>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="min-h-screen bg-[#0f141e] text-white font-sans">

      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 bg-[#0f141e]/90 backdrop-blur border-b border-gray-800/60">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-[20px] font-light tracking-[0.25em] text-white select-none">ZERITH</span>
          <div className="flex items-center gap-6">
            <a href="#como-funciona" className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:block">Como funciona</a>
            <a href="#funcionalidades" className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:block">Funcionalidades</a>
            <Link
              to="/login"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Entrar
            </Link>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
            >
              Acesso beta
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        {/* Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-blue-400 text-xs font-medium">Versão beta em desenvolvimento</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
            Telemetria preditiva
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              para frotas leves
            </span>
          </h1>

          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Monitore sua frota em tempo real via OBD-II. Antecipe falhas mecânicas,
            reduza custos e tome decisões com dados — não com achismo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-sm"
            >
              Solicitar acesso beta
              <ArrowRight size={16} />
            </button>
            <a
              href="#como-funciona"
              className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-gray-700 text-white font-medium px-8 py-3.5 rounded-xl transition-colors text-sm"
            >
              Como funciona
              <ChevronRight size={16} />
            </a>
          </div>

          {/* Stats strip */}
          <div className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[
              { val: '5 PIDs', label: 'OBD-II monitorados' },
              { val: 'Tempo real', label: 'via WebSocket STOMP' },
              { val: 'ESP32', label: 'hardware embarcado' },
            ].map(({ val, label }) => (
              <div key={label} className="text-center">
                <p className="text-white font-semibold text-lg">{val}</p>
                <p className="text-gray-500 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ──────────────────────────────────────────────────── */}
      <section id="como-funciona" className="py-24 border-t border-gray-800/60">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-3">Como funciona</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Hardware embarcado nos veículos coleta dados OBD-II e envia para a nuvem em milissegundos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start relative">
            {/* Connector line (decorative) */}
            <div className="hidden md:block absolute top-8 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

            <StepCard
              num="1"
              icon={Cpu}
              title="ESP32 + OBD-II"
              desc="Módulo embarcado lê dados do barramento CAN do veículo via protocolo OBD-II"
            />
            <StepCard
              num="2"
              icon={Wifi}
              title="Backend em nuvem"
              desc="Spring Boot recebe os dados via MQTT, processa e distribui via WebSocket STOMP"
            />
            <StepCard
              num="3"
              icon={BarChart2}
              title="Dashboard em tempo real"
              desc="Gestores visualizam temperatura, RPM, velocidade e alertas preditivos ao vivo"
            />
          </div>

          {/* PIDs strip */}
          <div className="mt-16 bg-[#151b28] border border-gray-700/50 rounded-2xl p-6">
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-4 text-center">PIDs OBD-II monitorados</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                { pid: '0x05', name: 'Temperatura do motor', unit: '°C' },
                { pid: '0x0B', name: 'Pressão do coletor (MAP)', unit: 'kPa' },
                { pid: '0x0C', name: 'Rotação do motor (RPM)', unit: 'rpm' },
                { pid: '0x0D', name: 'Velocidade', unit: 'km/h' },
                { pid: '0x24', name: 'Sonda lambda (A/F)', unit: 'A/F' },
              ].map(({ pid, name, unit }) => (
                <div key={pid} className="flex items-center gap-2 bg-[#0f141e] border border-gray-700 rounded-xl px-4 py-2">
                  <span className="text-blue-400 font-mono text-xs font-bold">{pid}</span>
                  <span className="text-gray-300 text-xs">{name}</span>
                  <span className="text-gray-600 text-xs">{unit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FUNCIONALIDADES ────────────────────────────────────────────────── */}
      <section id="funcionalidades" className="py-24 border-t border-gray-800/60">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-3">Funcionalidades</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Tudo que sua equipe precisa para operar uma frota com mais inteligência e menos surpresas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FeatureCard
              icon={MapPin}
              accent="blue"
              title="Mapa ao vivo"
              desc="Rastreamento em tempo real de cada veículo da frota com status e velocidade."
            />
            <FeatureCard
              icon={Bell}
              accent="amber"
              title="Alertas inteligentes"
              desc="Notificações automáticas para temperatura alta, RPM excessivo e lambda fora do range."
            />
            <FeatureCard
              icon={Star}
              accent="green"
              title="Score de motoristas"
              desc="Avaliação de comportamento ao volante com histórico e ranking da equipe."
            />
            <FeatureCard
              icon={Wrench}
              accent="purple"
              title="Manutenção preditiva"
              desc="Antecipe falhas com base em padrões de telemetria antes que virem parada."
            />
          </div>
        </div>
      </section>

      {/* ── PARA QUEM É ────────────────────────────────────────────────────── */}
      <section className="py-24 border-t border-gray-800/60">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1 mb-6">
                <Truck size={13} className="text-green-400" />
                <span className="text-green-400 text-xs font-medium">Para quem é</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-6 leading-snug">
                PMEs do interior com frotas de veículos leves
              </h2>
              <p className="text-gray-400 leading-relaxed mb-8">
                ZERITH foi pensado para empresas que não têm departamento de TI e precisam de
                uma solução que funcione sem consultor — direto do veículo para o dashboard.
              </p>
              <ul className="space-y-3">
                {[
                  'Frotas de 2 a 50 veículos leves (carros, vans, pickups)',
                  'Empresas do interior que precisam reduzir custo com manutenção',
                  'Gestores que querem controle real sobre sua equipe em campo',
                  'Negócios que já perdem dinheiro com paradas não programadas',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle size={16} className="text-green-400 shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mini dashboard preview */}
            <div className="bg-[#151b28] border border-gray-700/50 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-semibold text-sm">Visão da frota</span>
                <span className="flex items-center gap-1.5 text-xs text-green-400">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  Ao vivo
                </span>
              </div>
              {[
                { name: 'Carlos Silva',  model: 'Fiat Mobi',   status: 'ok',      speed: '62 km/h', temp: '87°C'  },
                { name: 'Ana Paula',     model: 'VW Saveiro',  status: 'warning',  speed: '91 km/h', temp: '94°C'  },
                { name: 'João Marcos',   model: 'VW Polo',     status: 'ok',       speed: '48 km/h', temp: '82°C'  },
                { name: 'Mariana Costa', model: 'Fiat Strada', status: 'critical', speed: '0 km/h',  temp: '108°C' },
              ].map(({ name, model, status, speed, temp }) => {
                const s = { ok: ['text-green-400', 'Normal'], warning: ['text-amber-400', 'Atenção'], critical: ['text-red-400', 'Crítico'] }[status]
                return (
                  <div key={name} className="flex items-center gap-3 bg-[#0f141e] rounded-xl px-4 py-3">
                    <div className={`w-2 h-2 rounded-full ${status === 'ok' ? 'bg-green-500' : status === 'warning' ? 'bg-amber-500' : 'bg-red-500'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium truncate">{name}</p>
                      <p className="text-gray-500 text-[11px]">{model}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-semibold ${s[0]}`}>{s[1]}</p>
                      <p className="text-gray-500 text-[11px]">{speed} · {temp}</p>
                    </div>
                  </div>
                )
              })}
              <div className="pt-2 grid grid-cols-3 gap-3 border-t border-gray-700/60">
                {[['4', 'Veículos'], ['1', 'Alerta crítico'], ['85%', 'Disponibilidade']].map(([v, l]) => (
                  <div key={l} className="text-center">
                    <p className="text-white font-bold text-sm">{v}</p>
                    <p className="text-gray-500 text-[11px]">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ──────────────────────────────────────────────────────── */}
      <section className="py-24 border-t border-gray-800/60">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-br from-[#151b28] to-[#0f141e] border border-gray-700/50 rounded-3xl px-8 py-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-600/5 rounded-3xl" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 mb-6">
                <Shield size={18} className="text-blue-400" />
                <Zap size={18} className="text-blue-400" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Pronto para modernizar sua frota?
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed">
                Vagas de beta limitadas. Empresas do interior têm prioridade.
                Sem custo durante a fase beta.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-10 py-4 rounded-xl transition-colors"
              >
                Solicitar acesso beta
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-800/60 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-[18px] font-light tracking-[0.25em] text-white select-none">ZERITH</span>
            <p className="text-gray-600 text-xs mt-1">Desenvolvido em Patrocínio, MG · 2026</p>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/zerith-technologies/zerith"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-sm"
            >
              <GitBranch size={16} />
              GitHub
            </a>
            <a
              href="mailto:contato@zerith.com.br"
              className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-sm"
            >
              <Mail size={16} />
              contato@zerith.com.br
            </a>
            <Link to="/login" className="text-gray-400 hover:text-white transition-colors text-sm">
              Entrar
            </Link>
          </div>
        </div>
      </footer>

      {/* ── MODAL ──────────────────────────────────────────────────────────── */}
      {showModal && <BetaModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
