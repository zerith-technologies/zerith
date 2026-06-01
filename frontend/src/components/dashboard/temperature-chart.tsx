
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Mock data for the temperature chart
const temperatureData = [
  { day: "Seg", temp: 72.4 },
  { day: "Ter", temp: 73.2 },
  { day: "Qua", temp: 69.8 },
  { day: "Qui", temp: 74.5 },
  { day: "Sex", temp: 78.2 },
  { day: "Sab", temp: 75.6 },
  { day: "Dom", temp: 73.1 },
];

export function TemperatureChart() {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Temperatura Média dos Veículos</CardTitle>
        <CardDescription>
          Leituras diárias dos últimos 7 dias (°C)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={temperatureData}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                dataKey="day"
                tick={{ fill: "#64748b" }}
                tickLine={{ stroke: "#64748b" }}
                axisLine={{ stroke: "#cbd5e1" }}
              />
              <YAxis
                tick={{ fill: "#64748b" }}
                tickLine={{ stroke: "#64748b" }}
                axisLine={{ stroke: "#cbd5e1" }}
                domain={[65, 80]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                }}
                labelStyle={{ fontWeight: "bold", color: "#1e293b" }}
              />
              <Line
                type="monotone"
                dataKey="temp"
                name="Temperatura Média"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ stroke: "#3B82F6", strokeWidth: 2, fill: "#ffffff", r: 4 }}
                activeDot={{ r: 6, stroke: "#2563EB", fill: "#3B82F6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
