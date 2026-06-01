import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { vehicles, formatDate, statusColors } from "@/data/mockData";
import { Input } from "@/components/ui/input";

const Vehicles = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredVehicles = vehicles.filter((vehicle) => 
    vehicle.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <h2 className="text-2xl font-bold" style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>Veículos Monitorados</h2>
          <Input
            placeholder="Buscar por ID, placa ou modelo..."
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>ID</TableHead>
                  <TableHead style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>Placa</TableHead>
                  <TableHead style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>Modelo</TableHead>
                  <TableHead style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>Status do Sistema</TableHead>
                  <TableHead style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>Última Análise</TableHead>
                  <TableHead className="text-right" style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">{vehicle.id}</TableCell>
                    <TableCell>{vehicle.placa}</TableCell>
                    <TableCell>{vehicle.modelo}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusColors[vehicle.status as keyof typeof statusColors]}`}>
                        {vehicle.status === "normal" ? "Normal" : 
                         vehicle.status === "alerta" ? "Alerta" : "Crítico"}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(vehicle.ultimaAnalise)}</TableCell>
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
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Vehicles;
