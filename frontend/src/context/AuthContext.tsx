
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

// Tipo de usuário
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  company: string;
}

// Interface do contexto de autenticação
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Dados simulados do usuário
const MOCK_USER: User = {
  id: "1",
  name: "Eng. Rafael Lima",
  email: "rafael@velox.com",
  role: "Engenheiro Chefe",
  company: "Velox Motors"
};

// Credenciais simuladas
const MOCK_CREDENTIALS = {
  email: "rafael@velox.com",
  password: "admin123"
};

// Criar o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

// Provider do contexto
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Verificar se o usuário está armazenado no localStorage ao iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Função de login simulada
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (email === MOCK_CREDENTIALS.email && password === MOCK_CREDENTIALS.password) {
      setUser(MOCK_USER);
      localStorage.setItem("user", JSON.stringify(MOCK_USER));
      setIsLoading(false);
      
      toast({
        title: "Login bem-sucedido",
        description: `Bem-vindo, ${MOCK_USER.name}!`,
      });
      
      return true;
    } else {
      setIsLoading(false);
      
      toast({
        title: "Erro de autenticação",
        description: "Email ou senha incorretos.",
        variant: "destructive",
      });
      
      return false;
    }
  };

  // Função de logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
    
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
