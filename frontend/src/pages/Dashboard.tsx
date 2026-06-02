import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Car, LayoutDashboard, Wrench } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import * as vehicleService from '@/services/vehicleService';
import { alerts, formatDate, alertStatusColors, riskColors } from '@/data/mockData';

export default function Dashboard() {
  const { user } = useAuth();

  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => vehicleService.getAll(),
  });

  const totalVehicles   = vehicles.length;
  const ativos          = vehicles.filter((v) => v.status === 'ATIVO').length;
  const manutencao      = vehicles.filter((v) => v.status === 'MANUTENCAO').length;
  const inativos        = vehicles.filter((v) => v.status === 'INATIVO').length;

  const statusChartData = [
    { name: 'Ativos',     value: ativos },
    { name: 'Manutenção', value: manutencao },
    { name: 'Inativos',   value: inativos },
  ];

  const activeAlerts = alerts.filter((a) => a.status !== 'resolvido').length;

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>
            Bem-vindo, {user?.nome}
          </h2>
          <p className="text-base font-medium mb-4" style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>
            Painel de controle de monitoramento de veículos
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { title: 'Total de Veículos', icon: <Car className="h-4 w-4 text-muted-foreground" />,           value: isLoading ? null : totalVehicles,  sub: 'veículos monitorados' },
            { title: 'Alertas Ativos',    icon: <AlertTriangle className="h-4 w-4 text-muted-foreground" />, value: activeAlerts,                       sub: 'necessitam atenção' },
            { title: 'Em Manutenção',     icon: <Wrench className="h-4 w-4 text-muted-foreground" />,        value: isLoading ? null : manutencao,      sub: 'veículos parados' },
            { title: 'Inativos',          icon: <LayoutDashboard className="h-4 w-4 text-muted-foreground" />, value: isLoading ? null : inativos,      sub: 'fora de operação' },
          ].map(({ title, icon, value, sub }) => (
            <Card key={title} className="bg-white/10 backdrop-blur-md border-none rounded-2xl shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium" style={{ color: '#1A1333' }}>{title}</CardTitle>
                {icon}
              </CardHeader>
              <CardContent>
                {value === null
                  ? <Skeleton className="h-8 w-16" />
                  : <div className="text-2xl font-bold">{value}</div>
                }
                <p className="text-xs text-muted-foreground">{sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-white/10 backdrop-blur-md border-none rounded-2xl shadow-xl">
            <CardHeader>
              <CardTitle>Veículos por Status</CardTitle>
              <CardDescription>Distribuição atual da frota</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusChartData}>
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#1D3557" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/40 backdrop-blur-md border-none rounded-2xl shadow-xl">
            <CardHeader>
              <CardTitle style={{ color: '#1A1333' }}>Alertas Recentes</CardTitle>
              <CardDescription style={{ color: '#1A1333' }}>Últimos alertas gerados pelo sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead style={{ color: '#1A1333' }}>Veículo</TableHead>
                    <TableHead style={{ color: '#1A1333' }}>Componente</TableHead>
                    <TableHead style={{ color: '#1A1333' }}>Risco</TableHead>
                    <TableHead style={{ color: '#1A1333' }}>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 5)
                    .map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell className="font-medium" style={{ color: '#1A1333' }}>{alert.vehicleId}</TableCell>
                        <TableCell style={{ color: '#1A1333' }}>{alert.component}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${riskColors[alert.riskLevel as keyof typeof riskColors]}`}>
                            {alert.riskLevel === 'baixo' ? 'Baixo' : alert.riskLevel === 'medio' ? 'Médio' : 'Alto'}
                          </span>
                        </TableCell>
                        <TableCell style={{ color: '#1A1333' }}>{formatDate(alert.date)}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
