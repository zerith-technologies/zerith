import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'

import LandingPage   from './pages/LandingPage'
import LoginPage     from './pages/LoginPage'
import ProtectedRoute from './components/ProtectedRoute'

import App           from './App.jsx'
import GestaoLayout  from './gestao/GestaoLayout.jsx'
import GestaoHome    from './gestao/pages/GestaoHome.jsx'
import Motoristas    from './gestao/pages/Motoristas.jsx'
import Veiculos      from './gestao/pages/Veiculos.jsx'
import Financeiro    from './gestao/pages/Financeiro.jsx'
import Manutencao    from './gestao/pages/Manutencao.jsx'
import Ocorrencias   from './gestao/pages/Ocorrencias.jsx'
import Relatorios    from './gestao/pages/Relatorios.jsx'
import Configuracoes from './gestao/pages/Configuracoes.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* ── Público ────────────────────────────────────────────────────── */}
        <Route path="/"      element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />}   />

        {/* ── Dashboard (protegido) ───────────────────────────────────────── */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          }
        />

        {/* ── Módulo gerencial (protegido) ────────────────────────────────── */}
        <Route
          path="/gestao"
          element={
            <ProtectedRoute>
              <GestaoLayout />
            </ProtectedRoute>
          }
        >
          <Route index                element={<GestaoHome />}    />
          <Route path="motoristas"    element={<Motoristas />}    />
          <Route path="veiculos"      element={<Veiculos />}      />
          <Route path="financeiro"    element={<Financeiro />}    />
          <Route path="manutencao"    element={<Manutencao />}    />
          <Route path="ocorrencias"   element={<Ocorrencias />}   />
          <Route path="relatorios"    element={<Relatorios />}    />
          <Route path="configuracoes" element={<Configuracoes />} />
        </Route>

        {/* ── Fallback ────────────────────────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
