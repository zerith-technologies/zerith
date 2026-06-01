import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { 
  LayoutDashboard, 
  Car, 
  Bell, 
  Calendar, 
  Settings, 
  LogOut
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
}

export function Sidebar({ collapsed }: SidebarProps) {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    {
      id: "dashboard",
      label: "Visão Geral",
      icon: LayoutDashboard,
      path: "/dashboard"
    },
    {
      id: "vehicles",
      label: "Veículos Monitorados",
      icon: Car,
      path: "/veiculos"
    },
    {
      id: "alerts",
      label: "Alertas Ativos",
      icon: Bell,
      path: "/alertas"
    },
    {
      id: "maintenance",
      label: "Histórico de Manutenção",
      icon: Calendar,
      path: "/historico"
    },
    {
      id: "settings",
      label: "Configurações",
      icon: Settings,
      path: "/configuracoes"
    },
  ];

  return (
    <aside
      className={cn(
        "flex flex-col transition-all duration-300 shadow-xl",
        collapsed ? "w-16" : "w-64",
        "bg-gradient-to-b from-[#2A0D5Bcc] via-[#4A148Ccc] to-[#6A1B9Aee] backdrop-blur-md border-r border-white/10"
      )}
    >
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        {!collapsed && (
          <span className="font-extrabold text-xl tracking-widest">
            <span style={{ color: '#FFDD00' }}>Z</span><span className="text-[#F5F5F5]">ehit AI</span>
          </span>
        )}
        {collapsed && <span className="font-bold text-lg text-white mx-auto">ZT</span>}
      </div>

      <div className="flex-1 py-6 overflow-y-auto scrollbar-hidden">
        <nav className="px-2 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center w-full px-3 py-3 text-base rounded-xl transition-colors font-medium gap-3",
                isActive
                  ? "bg-white/10 text-white shadow-md"
                  : "text-[#F5F5F5] hover:bg-white/5 hover:text-[#FFDD00]"
              )}
            >
              <item.icon
                className={cn("flex-shrink-0", collapsed ? "mx-auto" : "")}
                size={collapsed ? 28 : 24}
                color="white"
              />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
          
          <button
            onClick={logout}
            className="flex items-center w-full px-3 py-3 text-base rounded-xl transition-colors text-[#F5F5F5] hover:bg-white/5 mt-8 gap-3"
          >
            <LogOut
              className={cn("flex-shrink-0", collapsed ? "mx-auto" : "")}
              size={collapsed ? 28 : 24}
              color="white"
            />
            {!collapsed && <span>Sair do Sistema</span>}
          </button>
        </nav>
      </div>

      <div className="p-6 border-t border-white/10 flex items-center">
        <div className="flex items-center space-x-3 w-full justify-center">
          {!collapsed && (
            <>
              <div className="w-10 h-10 bg-[#4A148C] rounded-full flex items-center justify-center ring-2 ring-[#FFDD00]">
                <span className="text-white font-bold text-lg">RL</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-[#F5F5F5] font-semibold">Eng. Rafael Lima</span>
                <span className="text-xs text-[#F5F5F5] opacity-70">Velox Motors</span>
              </div>
            </>
          )}
          {collapsed && (
            <div className="w-10 h-10 bg-[#4A148C] rounded-full flex items-center justify-center ring-2 ring-[#FFDD00] mx-auto">
              <span className="text-white font-bold text-lg">RL</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
