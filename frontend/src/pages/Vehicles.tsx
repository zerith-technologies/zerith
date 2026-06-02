import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, RefreshCw } from 'lucide-react';
import * as vehicleService from '@/services/vehicleService';
import type { Vehicle } from '@/types';

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

const Vehicles = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const { data: vehicles = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => vehicleService.getAll(),
  });

  const filteredVehicles = vehicles.filter((v: Vehicle) =>
    v.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (v.apelido?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false),
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <h2 className="text-2xl font-bold" style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>
            Veículos Monitorados
          </h2>
          <Input
            placeholder="Buscar por placa, modelo ou apelido..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>Frota Atual</CardTitle>
          </CardHeader>
          <CardContent>
            {isError && (
              <div className="flex flex-col items-center py-8 space-y-3">
                <p className="text-muted-foreground">Erro ao carregar veículos.</p>
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Tentar novamente
                </Button>
              </div>
            )}

            {isLoading && (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full rounded" />
                ))}
              </div>
            )}

            {!isLoading && !isError && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead style={{ color: '#1A1333' }}>Placa</TableHead>
                    <TableHead style={{ color: '#1A1333' }}>Modelo</TableHead>
                    <TableHead style={{ color: '#1A1333' }}>Marca</TableHead>
                    <TableHead style={{ color: '#1A1333' }}>Ano</TableHead>
                    <TableHead style={{ color: '#1A1333' }}>Status</TableHead>
                    <TableHead style={{ color: '#1A1333' }}>Odômetro</TableHead>
                    <TableHead className="text-right" style={{ color: '#1A1333' }}>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell className="font-medium">{vehicle.placa}</TableCell>
                      <TableCell>{vehicle.apelido ?? vehicle.modelo}</TableCell>
                      <TableCell>{vehicle.marca}</TableCell>
                      <TableCell>{vehicle.ano}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${STATUS_COLORS[vehicle.status] ?? ''}`}>
                          {STATUS_LABEL[vehicle.status] ?? vehicle.status}
                        </span>
                      </TableCell>
                      <TableCell>{vehicle.odometroKm?.toLocaleString('pt-BR')} km</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/veiculo/${vehicle.id}`)}
                          className="bg-[#4A148C] text-white font-bold hover:bg-[#6A1B9A]"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredVehicles.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Nenhum veículo encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Vehicles;
