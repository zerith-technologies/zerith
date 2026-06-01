import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { alerts, formatDate, riskColors, alertStatusColors } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Alerts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("todos");
  const [statusFilter, setStatusFilter] = useState("todos");
  const navigate = useNavigate();

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch = alert.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.component.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRisk = riskFilter === "todos" || alert.riskLevel === riskFilter;
    const matchesStatus = statusFilter === "todos" || alert.status === statusFilter;
    
    return matchesSearch && matchesRisk && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h2 className="text-2xl font-bold">Alertas Ativos</h2>
          <p className="text-muted-foreground">
            Total de {filteredAlerts.length} alertas encontrados
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <Input
            placeholder="Buscar por veículo, componente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="sm:max-w-xs"
          />
          
          <div className="flex flex-wrap gap-2">
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-36 bg-white text-[#1A1333] border border-[#1D3557] placeholder:text-[#666] focus:ring-2 focus:ring-[#1D3557] focus:ring-offset-2 shadow-sm">
                <SelectValue placeholder="Filtrar por risco" className="text-[#666]" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os riscos</SelectItem>
                <SelectItem value="baixo">Risco Baixo</SelectItem>
                <SelectItem value="medio">Risco Médio</SelectItem>
                <SelectItem value="alto">Risco Alto</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36 bg-white text-[#1A1333] border border-[#1D3557] placeholder:text-[#666] focus:ring-2 focus:ring-[#1D3557] focus:ring-offset-2 shadow-sm">
                <SelectValue placeholder="Filtrar por status" className="text-[#666]" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="agendado">Agendado</SelectItem>
                <SelectItem value="resolvido">Resolvido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>Lista de Alertas</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>ID do Veículo</TableHead>
                  <TableHead style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>Componente</TableHead>
                  <TableHead style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>Nível de Risco</TableHead>
                  <TableHead style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>Status</TableHead>
                  <TableHead style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>Data</TableHead>
                  <TableHead style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>Recomendação</TableHead>
                  <TableHead className="text-right" style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlerts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      Nenhum alerta encontrado com os filtros selecionados.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAlerts
                    .sort((a, b) => {
                      // Ordenar primeiro por status (pendentes primeiro)
                      if (a.status !== b.status) {
                        if (a.status === "pendente") return -1;
                        if (b.status === "pendente") return 1;
                        if (a.status === "agendado") return -1;
                        if (b.status === "agendado") return 1;
                      }
                      // Depois por nível de risco (alto primeiro)
                      if (a.riskLevel !== b.riskLevel) {
                        if (a.riskLevel === "alto") return -1;
                        if (b.riskLevel === "alto") return 1;
                        if (a.riskLevel === "medio") return -1;
                        if (b.riskLevel === "medio") return 1;
                      }
                      // Por fim, por data (mais recente primeiro)
                      return new Date(b.date).getTime() - new Date(a.date).getTime();
                    })
                    .map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell className="font-medium">{alert.vehicleId}</TableCell>
                        <TableCell>{alert.component}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${riskColors[alert.riskLevel as keyof typeof riskColors]}`}>
                            {alert.riskLevel === "baixo" ? "Baixo" : 
                             alert.riskLevel === "medio" ? "Médio" : "Alto"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${alertStatusColors[alert.status as keyof typeof alertStatusColors]}`}>
                            {alert.status === "pendente" ? "Pendente" : 
                             alert.status === "agendado" ? "Agendado" : "Resolvido"}
                          </span>
                        </TableCell>
                        <TableCell>{formatDate(alert.date)}</TableCell>
                        <TableCell className="max-w-md">{alert.recommendation}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/veiculo/${alert.vehicleId}`)}
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

export default Alerts;
