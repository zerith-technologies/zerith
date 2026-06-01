import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, AlertTriangle } from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from "recharts";
import { 
  getVehicleById, 
  getAlertsByVehicleId, 
  formatDate, 
  riskColors,
  alertStatusColors,
  sensorData,
  simulateNewReading,
  simulateFailure
} from "@/data/mockData";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const VehicleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [readings, setReadings] = useState(
    sensorData[id as keyof typeof sensorData] || []
  );
  const [simulationComponent, setSimulationComponent] = useState("Motor");
  
  const vehicle = getVehicleById(id || "");
  const alerts = getAlertsByVehicleId(id || "");
  
  if (!vehicle) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-2xl font-bold mb-4">Veículo não encontrado</h2>
          <Button onClick={() => navigate("/veiculos")}>Voltar para lista de veículos</Button>
        </div>
      </DashboardLayout>
    );
  }

  const handleNewReading = () => {
    if (!id) return;
    
    const newReading = simulateNewReading(id);
    if (newReading) {
      setReadings((prev) => {
        const updated = [...prev, newReading];
        // Keep only the latest 14 readings
        return updated.slice(Math.max(0, updated.length - 14));
      });
      
      toast({
        title: "Nova leitura registrada",
        description: `Temperatura: ${newReading.temperature}°C, Vibração: ${newReading.vibration}g, Tensão: ${newReading.voltage}V`,
      });
    }
  };

  const handleSimulateFailure = () => {
    if (!id) return;
    
    const newAlert = simulateFailure(id, simulationComponent);
    if (newAlert) {
      toast({
        title: "Alerta simulado criado",
        description: `Novo alerta de ${simulationComponent} criado com nível de risco ${newAlert.riskLevel}`,
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              onClick={() => navigate("/veiculos")}
              className="bg-white text-[#1D3557] border border-[#1D3557] shadow-sm hover:bg-[#1D3557] hover:text-white focus:ring-2 focus:ring-[#1D3557] focus:ring-offset-2"
              style={{ minWidth: 90 }}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Voltar
            </Button>
            <h2 className="text-2xl font-bold" style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>Detalhes do Veículo: {vehicle.modelo}</h2>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>Informações do Veículo</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ID do Veículo</p>
                  <p>{vehicle.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Placa</p>
                  <p>{vehicle.placa}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Modelo</p>
                  <p>{vehicle.modelo}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ano</p>
                  <p>{vehicle.ano}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tipo</p>
                  <p>{vehicle.tipo}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Quilometragem</p>
                  <p>{vehicle.km.toLocaleString()} km</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Motorista</p>
                  <p>{vehicle.motorista}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium mt-1 ${
                    vehicle.status === "normal" ? "bg-green-100 text-green-800" :
                    vehicle.status === "alerta" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {vehicle.status === "normal" ? "Normal" : 
                     vehicle.status === "alerta" ? "Alerta" : "Crítico"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>Ações</CardTitle>
                <CardDescription style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>Ferramentas de simulação</CardDescription>
              </div>
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Button 
                  onClick={handleNewReading} 
                  className="w-full bg-[#1D3557] text-white shadow-md hover:bg-[#16305c] focus:ring-2 focus:ring-[#1D3557] focus:ring-offset-2">
                  Simular Nova Leitura de Sensores
                </Button>
              </div>
              
              <div className="flex flex-col space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Simular falha em componente:</p>
                <div className="flex space-x-2">
                  <Select value={simulationComponent} onValueChange={setSimulationComponent}>
                    <SelectTrigger className="w-full bg-white text-[#1A1333] border border-[#1D3557] placeholder:text-[#888] focus:ring-2 focus:ring-[#1D3557] focus:ring-offset-2 shadow-sm">
                      <SelectValue placeholder="Selecione um componente" className="text-[#888]" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Motor">Motor</SelectItem>
                      <SelectItem value="Bateria">Bateria</SelectItem>
                      <SelectItem value="Alternador">Alternador</SelectItem>
                      <SelectItem value="Freios">Freios</SelectItem>
                      <SelectItem value="Transmissão">Transmissão</SelectItem>
                      <SelectItem value="Sistema de Arrefecimento">Sistema de Arrefecimento</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    style={{ background: '#E63946', color: '#fff', boxShadow: '0 2px 8px #E6394640' }}
                    className="hover:bg-[#b92d3a] focus:ring-2 focus:ring-[#E63946] focus:ring-offset-2"
                    onClick={handleSimulateFailure}>
                    Simular Falha
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              Estas ações são apenas para fins de demonstração e não afetam sistemas reais.
            </CardFooter>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>Leituras dos Sensores</CardTitle>
            <CardDescription style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>Últimos 14 dias ou medições</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={readings}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    name="Temperatura (°C)"
                    stroke="#1D3557"
                    strokeWidth={2}
                    dot={{ r: 2 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="vibration"
                    name="Vibração (g)"
                    stroke="#E63946"
                    strokeWidth={2}
                    dot={{ r: 2 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="voltage"
                    name="Tensão (V)"
                    stroke="#457B9D"
                    strokeWidth={2}
                    dot={{ r: 2 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>Histórico de Alertas</CardTitle>
            <CardDescription style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>Alertas registrados para este veículo</CardDescription>
          </CardHeader>
          <CardContent>
            {alerts.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">Nenhum alerta registrado para este veículo.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>Componente</TableHead>
                    <TableHead style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>Nível de Risco</TableHead>
                    <TableHead style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>Status</TableHead>
                    <TableHead style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>Data</TableHead>
                    <TableHead style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>Descrição</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>{alert.component}</TableCell>
                        <TableCell style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${riskColors[alert.riskLevel as keyof typeof riskColors]}`}>
                            {alert.riskLevel === "baixo" ? "Baixo" : alert.riskLevel === "medio" ? "Médio" : "Alto"}
                          </span>
                        </TableCell>
                        <TableCell style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${alertStatusColors[alert.status as keyof typeof alertStatusColors]}`}>
                            {alert.status === "pendente" ? "Pendente" : 
                             alert.status === "agendado" ? "Agendado" : "Resolvido"}
                          </span>
                        </TableCell>
                        <TableCell style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>{formatDate(alert.date)}</TableCell>
                        <TableCell style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>{alert.description}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default VehicleDetail;
