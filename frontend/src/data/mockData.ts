
// Dados simulados para a aplicação VehiPredict AI

// Veículos
export const vehicles = [
  {
    id: "V001",
    placa: "ABC-1234",
    modelo: "Tesla Model S",
    status: "normal",
    ultimaAnalise: "2025-05-12T14:30:00Z",
    tipo: "Carro",
    ano: 2023,
    km: 25438,
    motorista: "Italo Antonio Costa",
    ultimaManutencao: "2025-03-15T09:20:00Z"
  },
  {
    id: "V002",
    placa: "DEF-5678",
    modelo: "BYD Dolphin",
    status: "alerta",
    ultimaAnalise: "2025-05-14T10:15:00Z",
    tipo: "Carro",
    ano: 2022,
    km: 78350,
    motorista: "Jeferson Silva Lima",
    ultimaManutencao: "2025-02-20T11:45:00Z"
  },
  {
    id: "V003",
    placa: "GHI-9012",
    modelo: "BYD Dolphin",
    status: "critico",
    ultimaAnalise: "2025-05-15T08:45:00Z",
    tipo: "Carro",
    ano: 2024,
    km: 12750,
    motorista: "Pedro Almeida",
    ultimaManutencao: "2025-04-10T13:30:00Z"
  },
  {
    id: "V004",
    placa: "JKL-3456",
    modelo: "BYD Yuan Plus",
    status: "normal",
    ultimaAnalise: "2025-05-13T16:20:00Z",
    tipo: "Carro",
    ano: 2023,
    km: 45680,
    motorista: "Joao Vitor Pereira da SIlva",
    ultimaManutencao: "2025-03-25T10:00:00Z"
  },
  {
    id: "V005",
    placa: "MNO-7890",
    modelo: "Renault Kangoo E-Tech",
    status: "alerta",
    ultimaAnalise: "2025-05-14T12:40:00Z",
    tipo: "Carro",
    ano: 2022,
    km: 62100,
    motorista: "Ricardo Ferreira",
    ultimaManutencao: "2025-02-05T14:20:00Z"
  },
  {
    id: "V006",
    placa: "PQR-1234",
    modelo: "GWM Ora 03",
    status: "normal",
    ultimaAnalise: "2025-05-15T09:10:00Z",
    tipo: "Carro",
    ano: 2024,
    km: 8930,
    motorista: "Juliana Santos",
    ultimaManutencao: "2025-04-28T15:45:00Z"
  }
];

// Alertas
export const alerts = [
  {
    id: "A001",
    vehicleId: "V003",
    component: "Motor",
    riskLevel: "alto",
    status: "pendente",
    date: "2025-05-15T08:45:00Z",
    description: "Temperatura do motor acima do limite crítico (110°C)",
    recommendation: "Verificar sistema de refrigeração imediatamente"
  },
  {
    id: "A002",
    vehicleId: "V002",
    component: "Bateria",
    riskLevel: "medio",
    status: "agendado",
    date: "2025-05-14T10:15:00Z",
    description: "Tensão da bateria abaixo do ideal (11.2V)",
    recommendation: "Programar substituição da bateria nos próximos 7 dias"
  },
  {
    id: "A003",
    vehicleId: "V005",
    component: "Alternador",
    riskLevel: "medio",
    status: "pendente",
    date: "2025-05-14T12:40:00Z",
    description: "Eficiência do alternador em declínio (82%)",
    recommendation: "Verificar conexões elétricas e correia"
  },
  {
    id: "A004",
    vehicleId: "V001",
    component: "Freios",
    riskLevel: "baixo",
    status: "resolvido",
    date: "2025-05-10T09:20:00Z",
    description: "Desgaste nas pastilhas de freio traseiras",
    recommendation: "Substituir pastilhas de freio no próximo serviço"
  },
  {
    id: "A005",
    vehicleId: "V004",
    component: "Sistema de Injeção",
    riskLevel: "baixo",
    status: "resolvido",
    date: "2025-05-09T14:10:00Z",
    description: "Variação na pressão de combustível",
    recommendation: "Limpar filtro de combustível e verificar bomba"
  },
  {
    id: "A006",
    vehicleId: "V003",
    component: "Transmissão",
    riskLevel: "alto",
    status: "agendado",
    date: "2025-05-14T16:30:00Z",
    description: "Vibração anormal na transmissão",
    recommendation: "Inspeção completa do sistema de transmissão"
  },
  {
    id: "A007",
    vehicleId: "V002",
    component: "Sistema de Arrefecimento",
    riskLevel: "medio",
    status: "pendente",
    date: "2025-05-13T11:25:00Z",
    description: "Nível de líquido refrigerante em queda",
    recommendation: "Verificar vazamentos no sistema de refrigeração"
  }
];

// Histórico de manutenções
export const maintenanceHistory = [
  {
    id: "M001",
    vehicleId: "V001",
    date: "2025-03-15T09:20:00Z",
    technician: "José Santos",
    type: "Preventiva",
    components: ["Óleo do motor", "Filtro de óleo", "Filtro de ar"],
    description: "Troca de óleo e filtros conforme cronograma",
    cost: 850.00,
    observations: "Veículo em excelente estado"
  },
  {
    id: "M002",
    vehicleId: "V004",
    date: "2025-03-25T10:00:00Z",
    technician: "Paulo Mendes",
    type: "Preventiva",
    components: ["Fluido de freio", "Pastilhas de freio dianteiras"],
    description: "Substituição de componentes do sistema de freios",
    cost: 1200.00,
    observations: "Recomendada revisão do sistema de direção em 15.000 km"
  },
  {
    id: "M003",
    vehicleId: "V002",
    date: "2025-02-20T11:45:00Z",
    technician: "Amanda Oliveira",
    type: "Corretiva",
    components: ["Alternador", "Correia do alternador"],
    description: "Substituição do alternador e correia",
    cost: 2340.00,
    observations: "Problema identificado pelo sistema Zehit Ai"
  },
  {
    id: "M004",
    vehicleId: "V003",
    date: "2025-04-10T13:30:00Z",
    technician: "Roberto Almeida",
    type: "Preventiva",
    components: ["Óleo do motor", "Filtro de óleo", "Filtro de combustível"],
    description: "Manutenção periódica programada",
    cost: 920.00,
    observations: "Veículo operando conforme esperado"
  },
  {
    id: "M005",
    vehicleId: "V005",
    date: "2025-02-05T14:20:00Z",
    technician: "Carla Souza",
    type: "Corretiva",
    components: ["Bomba d'água", "Mangueiras do radiador"],
    description: "Substituição de componentes do sistema de arrefecimento",
    cost: 1780.00,
    observations: "Sistema de refrigeração normalizado após reparo"
  },
  {
    id: "M006",
    vehicleId: "V006",
    date: "2025-04-28T15:45:00Z",
    technician: "Fernando Costa",
    type: "Preventiva",
    components: ["Filtro de ar", "Correias", "Velas de ignição"],
    description: "Revisão geral preventiva",
    cost: 1450.00,
    observations: "Veículo novo, primeira revisão realizada"
  }
];

// Dados do sensor para cada veículo (últimas 7 leituras)
export const sensorData = {
  "V001": [
    { date: "2025-05-09", temperature: 82, vibration: 2.3, voltage: 13.8 },
    { date: "2025-05-10", temperature: 85, vibration: 2.1, voltage: 13.7 },
    { date: "2025-05-11", temperature: 83, vibration: 2.4, voltage: 13.9 },
    { date: "2025-05-12", temperature: 84, vibration: 2.2, voltage: 13.8 },
    { date: "2025-05-13", temperature: 86, vibration: 2.5, voltage: 13.6 },
    { date: "2025-05-14", temperature: 85, vibration: 2.3, voltage: 13.7 },
    { date: "2025-05-15", temperature: 84, vibration: 2.2, voltage: 13.8 }
  ],
  "V002": [
    { date: "2025-05-09", temperature: 87, vibration: 2.4, voltage: 12.8 },
    { date: "2025-05-10", temperature: 88, vibration: 2.5, voltage: 12.4 },
    { date: "2025-05-11", temperature: 90, vibration: 2.7, voltage: 12.0 },
    { date: "2025-05-12", temperature: 93, vibration: 2.9, voltage: 11.8 },
    { date: "2025-05-13", temperature: 95, vibration: 3.1, voltage: 11.5 },
    { date: "2025-05-14", temperature: 97, vibration: 3.2, voltage: 11.2 },
    { date: "2025-05-15", temperature: 96, vibration: 3.0, voltage: 11.3 }
  ],
  "V003": [
    { date: "2025-05-09", temperature: 89, vibration: 2.8, voltage: 13.5 },
    { date: "2025-05-10", temperature: 92, vibration: 3.0, voltage: 13.4 },
    { date: "2025-05-11", temperature: 95, vibration: 3.4, voltage: 13.2 },
    { date: "2025-05-12", temperature: 98, vibration: 3.8, voltage: 13.1 },
    { date: "2025-05-13", temperature: 102, vibration: 4.2, voltage: 12.9 },
    { date: "2025-05-14", temperature: 106, vibration: 4.8, voltage: 12.7 },
    { date: "2025-05-15", temperature: 110, vibration: 5.3, voltage: 12.5 }
  ],
  "V004": [
    { date: "2025-05-09", temperature: 84, vibration: 2.2, voltage: 13.9 },
    { date: "2025-05-10", temperature: 83, vibration: 2.1, voltage: 14.0 },
    { date: "2025-05-11", temperature: 84, vibration: 2.0, voltage: 13.9 },
    { date: "2025-05-12", temperature: 85, vibration: 2.1, voltage: 13.8 },
    { date: "2025-05-13", temperature: 84, vibration: 2.2, voltage: 13.9 },
    { date: "2025-05-14", temperature: 83, vibration: 2.1, voltage: 14.0 },
    { date: "2025-05-15", temperature: 85, vibration: 2.2, voltage: 13.8 }
  ],
  "V005": [
    { date: "2025-05-09", temperature: 86, vibration: 2.4, voltage: 13.5 },
    { date: "2025-05-10", temperature: 87, vibration: 2.6, voltage: 13.3 },
    { date: "2025-05-11", temperature: 89, vibration: 2.8, voltage: 13.1 },
    { date: "2025-05-12", temperature: 92, vibration: 3.0, voltage: 12.9 },
    { date: "2025-05-13", temperature: 94, vibration: 3.3, voltage: 12.7 },
    { date: "2025-05-14", temperature: 97, vibration: 3.5, voltage: 12.5 },
    { date: "2025-05-15", temperature: 95, vibration: 3.4, voltage: 12.6 }
  ],
  "V006": [
    { date: "2025-05-09", temperature: 80, vibration: 1.8, voltage: 14.0 },
    { date: "2025-05-10", temperature: 81, vibration: 1.7, voltage: 14.1 },
    { date: "2025-05-11", temperature: 82, vibration: 1.9, voltage: 14.0 },
    { date: "2025-05-12", temperature: 80, vibration: 1.8, voltage: 14.1 },
    { date: "2025-05-13", temperature: 81, vibration: 1.7, voltage: 14.0 },
    { date: "2025-05-14", temperature: 82, vibration: 1.8, voltage: 13.9 },
    { date: "2025-05-15", temperature: 81, vibration: 1.7, voltage: 14.0 }
  ]
};

// Dados resumidos para o dashboard
export const dashboardData = {
  totalVehicles: vehicles.length,
  activeAlerts: alerts.filter(alert => alert.status !== "resolvido").length,
  criticalVehicles: vehicles.filter(vehicle => vehicle.status === "critico").length,
  lastUpdate: "2025-05-15T09:30:00Z",
  aiEfficiency: 92.7, // percentual fictício de eficácia da IA
  temperatureData: [
    { date: "09/05", value: 84.7 },
    { date: "10/05", value: 86.0 },
    { date: "11/05", value: 87.2 },
    { date: "12/05", value: 88.7 },
    { date: "13/05", value: 90.3 },
    { date: "14/05", value: 91.3 },
    { date: "15/05", value: 91.8 }
  ]
};

// Função utilitária para obter veículo pelo ID
export const getVehicleById = (id: string) => {
  return vehicles.find(vehicle => vehicle.id === id);
};

// Função utilitária para obter alertas por veículo
export const getAlertsByVehicleId = (vehicleId: string) => {
  return alerts.filter(alert => alert.vehicleId === vehicleId);
};

// Função utilitária para obter histórico de manutenção por veículo
export const getMaintenanceHistoryByVehicleId = (vehicleId: string) => {
  return maintenanceHistory.filter(record => record.vehicleId === vehicleId);
};

// Função para simular uma nova leitura de sensor
export const simulateNewReading = (vehicleId: string) => {
  const currentData = sensorData[vehicleId as keyof typeof sensorData];
  if (!currentData) return null;
  
  const lastReading = currentData[currentData.length - 1];
  const today = new Date().toISOString().split('T')[0];
  
  // Gera uma nova leitura baseada na última com variação aleatória
  const randomVariation = (base: number, variationPercent: number) => {
    const variation = base * (variationPercent / 100) * (Math.random() > 0.5 ? 1 : -1);
    return Math.round((base + variation) * 10) / 10;
  };
  
  return {
    date: today,
    temperature: randomVariation(lastReading.temperature, 5),
    vibration: randomVariation(lastReading.vibration, 10),
    voltage: randomVariation(lastReading.voltage, 3)
  };
};

// Função para simular uma falha
export const simulateFailure = (vehicleId: string, component: string) => {
  const vehicle = getVehicleById(vehicleId);
  if (!vehicle) return null;
  
  const riskLevels = ["baixo", "medio", "alto"];
  const randomRisk = riskLevels[Math.floor(Math.random() * riskLevels.length)];
  
  const newAlert = {
    id: `A${(alerts.length + 1).toString().padStart(3, '0')}`,
    vehicleId,
    component,
    riskLevel: randomRisk,
    status: "pendente",
    date: new Date().toISOString(),
    description: `Simulação de falha no componente: ${component}`,
    recommendation: "Verificar o componente na próxima manutenção"
  };
  
  // Em uma aplicação real, você adicionaria isso a um estado global ou banco de dados
  // Aqui apenas retornamos o objeto simulado
  return newAlert;
};

// Formatar data para exibição
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Cores por nível de risco
export const riskColors = {
  baixo: "bg-yellow-100 text-yellow-800",
  medio: "bg-orange-100 text-orange-800",
  alto: "bg-red-100 text-red-800"
};

// Cores por status
export const statusColors = {
  normal: "bg-green-100 text-green-800",
  alerta: "bg-yellow-100 text-yellow-800",
  critico: "bg-red-100 text-red-800"
};

// Cores por status de alerta
export const alertStatusColors = {
  pendente: "bg-red-100 text-red-800",
  agendado: "bg-blue-100 text-blue-800",
  resolvido: "bg-green-100 text-green-800"
};
