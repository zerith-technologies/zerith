import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import * as authService from '@/services/authService';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Verifica sessão ativa via cookie httpOnly ao montar
  useEffect(() => {
    authService.me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, senha: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const loggedUser = await authService.login({ email, senha });
      setUser(loggedUser);
      toast({ title: 'Login bem-sucedido', description: `Bem-vindo, ${loggedUser.nome}!` });
      return true;
    } catch {
      toast({
        title: 'Erro de autenticação',
        description: 'Email ou senha incorretos.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      navigate('/login');
      toast({ title: 'Logout realizado', description: 'Você foi desconectado com sucesso.' });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
