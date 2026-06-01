import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Páginas
import Home from "./pages/Home";         // ✅ nova homepage
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import VehicleDetail from "./pages/VehicleDetail";
import Alerts from "./pages/Alerts";
import Maintenance from "./pages/Maintenance";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/zerith">
        <AuthProvider>
          <Routes>
            {/* Página inicial pública */}
            <Route path="/" element={<Landing />} />

            {/* Rotas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Rotas protegidas */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/veiculos" element={<ProtectedRoute><Vehicles /></ProtectedRoute>} />
            <Route path="/veiculo/:id" element={<ProtectedRoute><VehicleDetail /></ProtectedRoute>} />
            <Route path="/alertas" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
            <Route path="/historico" element={<ProtectedRoute><Maintenance /></ProtectedRoute>} />
            <Route path="/configuracoes" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

            {/* Página 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
