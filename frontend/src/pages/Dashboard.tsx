import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Calendar, Car, LayoutDashboard, Percent } from "lucide-react";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { dashboardData, alerts, formatDate, alertStatusColors, riskColors } from "@/data/mockData";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>Bem-vindo, {user?.name}</h2>
          <p className="text-base font-medium mb-4" style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>
            Painel de controle de monitoramento de veículos | Última atualização: {formatDate(dashboardData.lastUpdate)}
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white/10 backdrop-blur-md border-none rounded-2xl shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium" style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>Total de Veículos</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.totalVehicles}</div>
              <p className="text-xs text-muted-foreground">veículos monitorados</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-md border-none rounded-2xl shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium" style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>Alertas Ativos</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.activeAlerts}</div>
              <p className="text-xs text-muted-foreground">necessitam atenção</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-md border-none rounded-2xl shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium" style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>Condição Crítica</CardTitle>
              <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((dashboardData.criticalVehicles / dashboardData.totalVehicles) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">veículos em estado crítico</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-md border-none rounded-2xl shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium" style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>Eficiência do Sistema IA</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.aiEfficiency}%</div>
              <p className="text-xs text-muted-foreground">previsões corretas</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-2 md:col-span-1 bg-white/10 backdrop-blur-md border-none rounded-2xl shadow-xl">
            <CardHeader>
              <CardTitle>Temperatura Média dos Veículos</CardTitle>
              <CardDescription>Últimos 7 dias (°C)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dashboardData.temperatureData}>
                    <XAxis dataKey="date" />
                    <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#1D3557" 
                      strokeWidth={2} 
                      dot={{ r: 4 }} 
                      activeDot={{ r: 6, stroke: "#1D3557", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-2 md:col-span-1 bg-white/10 backdrop-blur-md border-none rounded-2xl shadow-xl">
            <CardHeader>
              <CardTitle>Alertas por Nível de Risco</CardTitle>
              <CardDescription>Distribuição atual</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: "Baixo", value: alerts.filter(a => a.riskLevel === "baixo").length },
                    { name: "Médio", value: alerts.filter(a => a.riskLevel === "medio").length },
                    { name: "Alto", value: alerts.filter(a => a.riskLevel === "alto").length }
                  ]}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#1D3557" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="bg-white/40 backdrop-blur-md border-none rounded-2xl shadow-xl">
          <CardHeader>
            <CardTitle style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>Alertas Recentes</CardTitle>
            <CardDescription style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>Últimos alertas gerados pelo sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader className="bg-transparent">
                <TableRow>
                  <TableHead style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>ID do Veículo</TableHead>
                  <TableHead style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>Componente</TableHead>
                  <TableHead style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>Nível de Risco</TableHead>
                  <TableHead style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>Status</TableHead>
                  <TableHead style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 5)
                  .map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell className="font-medium" style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>{alert.vehicleId}</TableCell>
                      <TableCell style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>{alert.component}</TableCell>
                      <TableCell style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${riskColors[alert.riskLevel as keyof typeof riskColors]}`}> 
                          {alert.riskLevel === "baixo" ? "Baixo" : alert.riskLevel === "medio" ? "Médio" : "Alto"}
                        </span>
                      </TableCell>
                      <TableCell style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${alertStatusColors[alert.status as keyof typeof alertStatusColors]}`}>
                          {alert.status === "pendente" ? "Pendente" : alert.status === "agendado" ? "Agendado" : "Resolvido"}
                        </span>
                      </TableCell>
                      <TableCell style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>{formatDate(alert.date)}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;