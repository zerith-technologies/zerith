// src/pages/Home.tsx
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 space-y-10">
      {/* Hero Section */}
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-vehipredict-blue mb-4">
          Bem-vindo à Zerith AI
        </h1>
        <p className="text-lg text-gray-600">
          A plataforma inteligente de manutenção preditiva para veículos elétricos.
        </p>
      </div>

      {/* Imagem de Destaque */}
      <img
        src="/carro-eletrico.jpg" // Coloque sua imagem na pasta public ou substitua por URL
        alt="Carro elétrico"
        className="w-full max-w-3xl rounded-lg shadow-lg"
      />

      {/* Botão de login */}
      <Button
        className="mt-6 px-8 py-3 text-lg font-semibold"
        onClick={() => navigate("/login")}
      >
        Entrar no Sistema
      </Button>

      {/* Sessão de Benefícios ou Features */}
      <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-6xl">
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold" style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>Monitoramento em Tempo Real</h3>
          <p className="text-gray-600">Acompanhe dados de sensores em tempo real com gráficos interativos.</p>
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold" style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>Alertas Inteligentes</h3>
          <p className="text-gray-600">Receba notificações sobre riscos antes que eles aconteçam.</p>
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold" style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>Eficiência com IA</h3>
          <p className="text-gray-600">Utilizamos inteligência artificial para prever falhas e reduzir custos.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
