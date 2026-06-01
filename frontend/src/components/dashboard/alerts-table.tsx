
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Mock data for the alerts table
const alertsData = [
  {
    id: "VHC-1024",
    component: "Motor",
    risk: "Alta",
    status: "Pendente",
    date: "15/05/2025",
  },
  {
    id: "VHC-0873",
    component: "Bateria",
    risk: "Média",
    status: "Agendado",
    date: "14/05/2025",
  },
  {
    id: "VHC-1142",
    component: "Alternador",
    risk: "Baixa",
    status: "Resolvido",
    date: "13/05/2025",
  },
  {
    id: "VHC-0956",
    component: "Freios",
    risk: "Alta",
    status: "Pendente",
    date: "13/05/2025",
  },
  {
    id: "VHC-1237",
    component: "Transmissão",
    risk: "Média",
    status: "Agendado",
    date: "12/05/2025",
  },
];

export function AlertsTable() {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Alertas Recentes</CardTitle>
        <CardDescription>
          Últimos alertas de manutenção preventiva
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID do Veículo</TableHead>
              <TableHead>Componente</TableHead>
              <TableHead>Nível de Risco</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alertsData.map((alert) => (
              <TableRow key={alert.id}>
                <TableCell className="font-medium">{alert.id}</TableCell>
                <TableCell>{alert.component}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-normal",
                      alert.risk === "Alta" && "border-red-500 bg-red-50 text-red-700",
                      alert.risk === "Média" && "border-amber-500 bg-amber-50 text-amber-700",
                      alert.risk === "Baixa" && "border-green-500 bg-green-50 text-green-700"
                    )}
                  >
                    {alert.risk}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-normal",
                      alert.status === "Pendente" && "border-blue-500 bg-blue-50 text-blue-700",
                      alert.status === "Agendado" && "border-purple-500 bg-purple-50 text-purple-700",
                      alert.status === "Resolvido" && "border-green-500 bg-green-50 text-green-700"
                    )}
                  >
                    {alert.status}
                  </Badge>
                </TableCell>
                <TableCell>{alert.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
