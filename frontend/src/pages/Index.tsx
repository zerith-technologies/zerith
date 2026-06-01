
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { TemperatureChart } from "@/components/dashboard/temperature-chart";
import { AlertsTable } from "@/components/dashboard/alerts-table";
import { Car, Bell, TrendingUp, Clock } from "lucide-react";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="Veículos Monitorados"
            value={48}
            icon={<Car size={20} />}
            description="Última semana"
            trend={{ value: 12, isPositive: true }}
          />

          <SummaryCard
            title="Alertas Ativos"
            value={7}
            icon={<Bell size={20} />}
            description="2 críticos"
            trend={{ value: 5, isPositive: false }}
          />

          <SummaryCard
            title="Veículos em Condição Crítica"
            value="15%"
            icon={<TrendingUp size={20} />}
            description="7 veículos"
            trend={{ value: 3, isPositive: false }}
          />

          <SummaryCard
            title="Última Atualização"
            value="Hoje, 12:45"
            icon={<Clock size={20} />}
            description="Atualização automática"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-6">
          <TemperatureChart />
          <div className="lg:col-span-6">
            <AlertsTable />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Index;
