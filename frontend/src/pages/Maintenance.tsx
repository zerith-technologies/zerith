import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { maintenanceHistory, formatDate } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Maintenance = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("todos");
  const navigate = useNavigate();

  const filteredHistory = maintenanceHistory.filter((record) => {
    const matchesSearch = record.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          record.technician.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          record.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === "todos" || record.type.toLowerCase() === typeFilter.toLowerCase();
    
    return matchesSearch && matchesType;
  });

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h2 className="text-2xl font-bold">Histórico de Manutenção</h2>
          <p className="text-muted-foreground">
            Total de {filteredHistory.length} registros de manutenção
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <Input
            placeholder="Buscar por veículo, técnico..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="sm:max-w-xs"
          />
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-44 sm:ml-auto bg-white text-[#1A1333] border border-[#1D3557] placeholder:text-[#666] focus:ring-2 focus:ring-[#1D3557] focus:ring-offset-2 shadow-sm">
              <SelectValue placeholder="Filtrar por tipo" className="text-[#666]" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os tipos</SelectItem>
              <SelectItem value="preventiva">Preventiva</SelectItem>
              <SelectItem value="corretiva">Corretiva</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registros de Manutenção</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Veículo</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Técnico</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Componentes</TableHead>
                  <TableHead>Custo (R$)</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      Nenhum registro de manutenção encontrado com os filtros selecionados.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredHistory
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.vehicleId}</TableCell>
                        <TableCell>{formatDate(record.date)}</TableCell>
                        <TableCell>{record.technician}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            record.type === "Preventiva" 
                              ? "bg-blue-100 text-blue-800" 
                              : "bg-purple-100 text-purple-800"
                          }`}>
                            {record.type}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-sm">
                          <div className="flex flex-wrap gap-1">
                            {record.components.map((component, index) => (
                              <span 
                                key={index}
                                className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
                              >
                                {component}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{record.cost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/veiculo/${record.vehicleId}`)}
                            className="bg-[#4A148C] text-white font-bold hover:bg-[#6A1B9A]"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver Veículo
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Maintenance;
