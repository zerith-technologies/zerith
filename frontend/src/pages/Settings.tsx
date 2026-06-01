import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Settings = () => {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState({
    name: user?.name || "Eng. Rafael Lima",
    email: user?.email || "rafael@velox.com",
    company: user?.company || "Velox Motors",
    role: user?.role || "Engenheiro Chefe",
    phone: "(11) 98765-4321",
  });
  
  const [notifications, setNotifications] = useState({
    email: true,
    app: true,
    criticalOnly: false,
  });
  
  const [theme, setTheme] = useState("light");
  const [dataRefresh, setDataRefresh] = useState("5");
  
  const initials = userInfo.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
    
  const handleProfileSave = () => {
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram atualizadas com sucesso.",
    });
  };
  
  const handleNotificationsSave = () => {
    toast({
      title: "Configurações de notificações salvas",
      description: "Suas preferências de notificação foram atualizadas.",
    });
  };
  
  const handleSystemSave = () => {
    toast({
      title: "Configurações do sistema salvas",
      description: "As configurações do sistema foram atualizadas.",
    });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <h2 className="text-2xl font-bold" style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>Configurações</h2>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-auto">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="system">Sistema</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>Informações de Perfil</CardTitle>
                <CardDescription style={{ color: '#1A1333', textShadow: '0 2px 8px #F5F5F599' }}>
                  Gerencie suas informações pessoais e conta.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-24 w-24 bg-vehipredict-blue text-primary-foreground text-xl">
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">Alterar foto</Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      JPG, PNG ou GIF. Tamanho máximo de 3MB.
                    </p>
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input 
                      id="name" 
                      value={userInfo.name} 
                      onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={userInfo.email} 
                      onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="company">Empresa</Label>
                    <Input 
                      id="company" 
                      value={userInfo.company} 
                      onChange={(e) => setUserInfo({...userInfo, company: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Cargo</Label>
                    <Input 
                      id="role" 
                      value={userInfo.role} 
                      onChange={(e) => setUserInfo({...userInfo, role: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input 
                    id="phone" 
                    value={userInfo.phone} 
                    onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleProfileSave}>Salvar alterações</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Preferências de Notificação</CardTitle>
                <CardDescription>
                  Gerencie como e quando você deseja receber alertas.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Notificações por Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba alertas por email quando eventos importantes ocorrerem.
                    </p>
                  </div>
                  <Switch 
                    id="email-notifications" 
                    checked={notifications.email} 
                    onCheckedChange={(checked) => setNotifications({...notifications, email: checked})} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="app-notifications">Notificações no Aplicativo</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba alertas em tempo real enquanto estiver usando o sistema.
                    </p>
                  </div>
                  <Switch 
                    id="app-notifications" 
                    checked={notifications.app} 
                    onCheckedChange={(checked) => setNotifications({...notifications, app: checked})} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="critical-notifications">Apenas Alertas Críticos</Label>
                    <p className="text-sm text-muted-foreground">
                      Limite notificações apenas para eventos de alto risco.
                    </p>
                  </div>
                  <Switch 
                    id="critical-notifications" 
                    checked={notifications.criticalOnly} 
                    onCheckedChange={(checked) => setNotifications({...notifications, criticalOnly: checked})} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Frequência de Resumos</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione a frequência" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Tempo real</SelectItem>
                      <SelectItem value="hourly">A cada hora</SelectItem>
                      <SelectItem value="daily">Diário</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleNotificationsSave}>Salvar preferências</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Sistema</CardTitle>
                <CardDescription>
                  Ajuste preferências gerais do sistema Zehit AI.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Tema da Interface</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o tema" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Claro</SelectItem>
                      <SelectItem value="dark">Escuro</SelectItem>
                      <SelectItem value="system">Sistema (automático)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Intervalo de Atualização de Dados</Label>
                  <Select value={dataRefresh} onValueChange={setDataRefresh}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o intervalo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 minuto</SelectItem>
                      <SelectItem value="5">5 minutos</SelectItem>
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="60">1 hora</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-refresh">Atualização Automática</Label>
                    <p className="text-sm text-muted-foreground">
                      Atualizar dados automaticamente no intervalo definido.
                    </p>
                  </div>
                  <Switch id="auto-refresh" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="diagnostic-data">Compartilhar Dados de Diagnóstico</Label>
                    <p className="text-sm text-muted-foreground">
                      Ajude a melhorar o Zehit compartilhando dados de uso anônimos.
                    </p>
                  </div>
                  <Switch id="diagnostic-data" defaultChecked />
                </div>
                
                <div className="pt-4">
                  <Label className="text-md font-medium">Limpar Dados</Label>
                  <div className="grid gap-4 mt-2">
                    <Button variant="outline">Limpar cache de leituras</Button>
                    <Button variant="outline">Redefinir preferências</Button>
                    <Button variant="destructive">Redefinir para configurações padrão</Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSystemSave}>Salvar configurações</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
