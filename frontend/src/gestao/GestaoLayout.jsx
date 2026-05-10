import { NavLink, Outlet, Link } from 'react-router-dom'

// ── Shared UI primitives (exported for pages) ─────────────────────────────────

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-gray-900 border border-gray-800 rounded-lg p-4 ${className}`}>
      {children}
    </div>
  )
}

export function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h1 className="text-base font-semibold text-white">{title}</h1>
      {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
  )
}

export function StatCard({ label, value, sub, color = '#fff' }) {
  return (
    <Card>
      <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold tabular-nums" style={{ color }}>{value}</p>
      {sub && <p className="text-[11px] text-gray-600 mt-1">{sub}</p>}
    </Card>
  )
}

export function Badge({ level }) {
  const cfg = {
    danger:  { cls: 'bg-red-900/40 text-red-400 border border-red-800',       label: 'Crítico'  },
    warning: { cls: 'bg-amber-900/40 text-amber-400 border border-amber-800', label: 'Atenção'  },
    ok:      { cls: 'bg-emerald-900/40 text-emerald-400 border border-emerald-800', label: 'Normal' },
    info:    { cls: 'bg-indigo-900/40 text-indigo-400 border border-indigo-800', label: 'Info'   },
  }[level] ?? { cls: 'bg-gray-800 text-gray-400', label: level }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${cfg.cls}`}>
      {cfg.label}
    </span>
  )
}

export function DataTable({ cols, rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-gray-800">
            {cols.map(c => (
              <th key={c} className="text-left py-2 px-3 text-[10px] uppercase tracking-widest text-gray-500 font-medium">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={cols.length} className="py-8 text-center text-gray-600">
                Sem dados — inicie o simulador para popular.
              </td>
            </tr>
          ) : rows.map((row, i) => (
            <tr key={i} className="border-b border-gray-900 hover:bg-gray-900/50 transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="py-2.5 px-3 text-gray-300">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Loading() {
  return (
    <div className="flex items-center justify-center h-40 text-gray-600 text-xs">
      Carregando...
    </div>
  )
}

export function FetchError({ msg }) {
  return (
    <div className="flex items-center justify-center h-40 text-red-500 text-xs">
      Erro ao carregar dados — backend online? ({msg})
    </div>
  )
}

// ── SVG icons ─────────────────────────────────────────────────────────────────

function Ico({ d, size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  )
}

const ICONS = {
  dashboard:    'M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z',
  motoristas:   'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  veiculos:     'M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2M9 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0M15 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0',
  financeiro:   'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
  manutencao:   'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
  ocorrencias:  'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01',
  relatorios:   'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',
  configuracoes:'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
}

const NAV = [
  { to: '/gestao',              label: 'Dashboard',     icon: 'dashboard'    },
  { to: '/gestao/motoristas',   label: 'Motoristas',    icon: 'motoristas'   },
  { to: '/gestao/veiculos',     label: 'Veículos',      icon: 'veiculos'     },
  { to: '/gestao/financeiro',   label: 'Financeiro',    icon: 'financeiro'   },
  { to: '/gestao/manutencao',   label: 'Manutenção',    icon: 'manutencao'   },
  { to: '/gestao/ocorrencias',  label: 'Ocorrências',   icon: 'ocorrencias'  },
  { to: '/gestao/relatorios',   label: 'Relatórios',    icon: 'relatorios'   },
  { to: '/gestao/configuracoes',label: 'Configurações', icon: 'configuracoes'},
]

// ── Layout ────────────────────────────────────────────────────────────────────

export default function GestaoLayout() {
  return (
    <div className="h-screen overflow-hidden bg-gray-950 text-gray-100 font-sans flex">
      {/* ── Sidebar ── */}
      <aside className="w-52 flex-shrink-0 flex flex-col border-r border-gray-800">
        <div className="px-4 py-4 border-b border-gray-800">
          <p className="text-sm font-bold tracking-tight text-white">ZERITH</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">Gestão de Frota</p>
        </div>

        <nav className="flex-1 px-2 py-3 overflow-y-auto">
          {NAV.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/gestao'}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-md mb-0.5 text-[13px] transition-colors
                 ${isActive
                   ? 'bg-gray-800 text-white'
                   : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900'}`
              }
            >
              <Ico d={ICONS[icon]} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-3 border-t border-gray-800">
          <Link to="/" className="flex items-center gap-2 text-[12px] text-gray-500 hover:text-gray-300 transition-colors">
            <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Voltar à Frota
          </Link>
        </div>
      </aside>

      {/* ── Page content ── */}
      <main className="flex-1 overflow-y-auto bg-gray-950">
        <Outlet />
      </main>
    </div>
  )
}
