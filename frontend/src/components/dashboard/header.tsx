import { useAuth } from "@/context/AuthContext";
import { Bell, Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";

interface HeaderProps {
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

export function Header({ onToggleSidebar, sidebarCollapsed }: HeaderProps) {
  const { user, logout } = useAuth();
  
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
    : "RL";

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between px-8 md:px-16 shadow-lg border-b border-white/10 bg-white/10 backdrop-blur-md" style={{ background: 'linear-gradient(90deg, #2A0D5Bcc 0%, #4A148Ccc 100%)' }}>
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="mr-4 text-white bg-transparent hover:bg-white/10 rounded-full transition-colors duration-200 focus:outline-none shadow-none border-none"
          onClick={onToggleSidebar}
          tabIndex={0}
          aria-label={sidebarCollapsed ? 'Abrir menu' : 'Fechar menu'}
        >
          {sidebarCollapsed ? <Menu className="h-7 w-7 text-white mx-auto" /> : <X className="h-7 w-7 text-white mx-auto" />}
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <h1 className="text-2xl font-extrabold tracking-widest flex items-center">
          <span style={{ color: '#FFDD00' }}>Z</span><span className="text-[#F5F5F5]">ehit AI</span>
          <span className="ml-4 hidden text-base font-normal text-[#F5F5F5] opacity-70 md:inline-block">
            Painel de Monitoramento Inteligente
          </span>
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          className="relative text-white bg-transparent hover:bg-white/10 rounded-full transition-colors duration-200 focus:outline-none shadow-none border-none"
          tabIndex={0}
          aria-label="Notificações"
        >
          <Bell className="h-7 w-7 text-white mx-auto" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
            3
          </span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 rounded-full bg-transparent hover:bg-white/10 transition-colors duration-200 focus:outline-none shadow-none border-none"
              tabIndex={0}
              aria-label="Abrir menu do usuário"
            >
              <Avatar className="h-11 w-11 bg-[#4A148C] text-white">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden text-base font-medium text-[#F5F5F5] md:inline-block">
                {user?.name}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white/90 backdrop-blur-md border-none rounded-xl shadow-xl">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center">
              <span className="text-sm">{user?.email}</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center">
              <span className="text-sm">{user?.company}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-red-600">
              Sair do sistema
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
