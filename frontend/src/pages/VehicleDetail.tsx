import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import * as vehicleService from '@/services/vehicleService';
import * as telemetryService from '@/services/telemetryService';
import type { TelemetryReading } from '@/types';

const STATUS_LABEL: Record<string, string> = {
  ATIVO: 'Ativo',
  INATIVO: 'Inativo',
  MANUTENCAO: 'Manutenção',
};

const STATUS_COLORS: Record<string, string> = {
  ATIVO: 'bg-green-100 text-green-800',
  INATIVO: 'bg-gray-100 text-gray-800',
  MANUTENCAO: 'bg-yellow-100 text-yellow-800',
};

const MOTOR_LABEL: Record<string, string> = {
  LIGADO: 'Ligado',
  DESLIGADO: 'Desligado',
  FALHA: 'Falha',
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso));
}

function toChartPoint(r: TelemetryReading) {
  return {
    date: new Date(r.timestampLeitura).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    'Temp. Motor (°C)': Number(r.temperaturaMotorC),
    'Tensão Bat. (V)': Number(r.tensaoBateriaV),
    'Combustível (%)': Number(r.nivelCombustivelPct),
  };
}

const VehicleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: vehicle, isLoading: loadingVehicle, isError: errorVehicle } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => vehicleService.getById(id!),
    enabled: !!id,
  });

  const { data: latestTelemetry } = useQuery({
    queryKey: ['telemetry-latest', id],
    queryFn: () => telemetryService.getLatest(id!),
    enabled: !!id,
  });

  const { data: telemetryHistory = [] } = useQuery({
    queryKey: ['telemetry-history', id],
    queryFn: () => telemetryService.getHistory(id!, 0, 20),
    enabled: !!id,
  });

  const chartData = [...telemetryHistory].reverse().map(toChartPoint);

  if (loadingVehicle) {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (errorVehicle || !vehicle) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <h2 className="text-2xl font-bold">Veículo não encontrado</h2>
          <Button onClick={() => navigate('/veiculos')}>Voltar para lista de veículos</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            onClick={() => navigate('/veiculos')}
            className="bg-white text-[#1D3557] border border-[#1D3557] shadow-sm hover:bg-[#1D3557] hover:text-white"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Voltar
          </Button>
          <h2 className="text-2xl font-bold" style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>
            {vehicle.apelido ?? vehicle.modelo}
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Informações do veículo */}
          <Card>
            <CardHeader>
              <CardTitle style={{ color: '#1A1333' }}>Informações do Veículo</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {[
                ['Placa', vehicle.placa],
                ['Marca', vehicle.marca],
                ['Modelo', vehicle.modelo],
                ['Ano', vehicle.ano],
                ['Tipo', vehicle.tipo],
                ['Odômetro', `${vehicle.odometroKm?.toLocaleString('pt-BR')} km`],
                ['Cadastrado em', formatDate(vehicle.criadoEm)],
                ['Atualizado em', formatDate(vehicle.atualizadoEm)],
              ].map(([label, value]) => (
                <div key={String(label)}>
                  <p className="text-sm font-medium text-muted-foreground">{label}</p>
                  <p>{value}</p>
                </div>
              ))}
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium mt-1 ${STATUS_COLORS[vehicle.status] ?? ''}`}>
                  {STATUS_LABEL[vehicle.status] ?? vehicle.status}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Última leitura */}
          <Card>
            <CardHeader>
              <CardTitle style={{ color: '#1A1333' }}>Última Telemetria</CardTitle>
              <CardDescription style={{ color: '#1A1333' }}>
                {latestTelemetry
                  ? formatDate(latestTelemetry.timestampLeitura)
                  : 'Nenhuma leitura cadastrada'}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {latestTelemetry ? (
                <>
                  {[
                    ['Velocidade', `${latestTelemetry.velocidadeKmh} km/h`],
                    ['RPM', latestTelemetry.rpm],
                    ['Temp. Motor', `${latestTelemetry.temperaturaMotorC} °C`],
                    ['Combustível', `${latestTelemetry.nivelCombustivelPct} %`],
                    ['Tensão Bat.', `${latestTelemetry.tensaoBateriaV} V`],
                    ['DTC', latestTelemetry.codigoDtc ?? '—'],
                  ].map(([label, value]) => (
                    <div key={String(label)}>
                      <p className="text-sm font-medium text-muted-foreground">{label}</p>
                      <p>{value}</p>
                    </div>
                  ))}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Motor</p>
                    <p>{MOTOR_LABEL[latestTelemetry.statusMotor] ?? latestTelemetry.statusMotor}</p>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground col-span-2 py-4 text-center">
                  Sem dados de telemetria para este veículo.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Gráfico histórico */}
        {chartData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle style={{ color: '#1A1333' }}>Histórico de Telemetria</CardTitle>
              <CardDescription style={{ color: '#1A1333' }}>Últimas {chartData.length} leituras</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Temp. Motor (°C)" stroke="#1D3557" strokeWidth={2} dot={{ r: 2 }} />
                    <Line type="monotone" dataKey="Tensão Bat. (V)" stroke="#457B9D" strokeWidth={2} dot={{ r: 2 }} />
                    <Line type="monotone" dataKey="Combustível (%)" stroke="#E63946" strokeWidth={2} dot={{ r: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default VehicleDetail;
