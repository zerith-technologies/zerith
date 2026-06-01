import React from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

const registerSchema = z.object({
  name: z.string().min(3, { message: "Nome completo deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
  confirmPassword: z.string(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "Você precisa aceitar os termos de uso",
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não conferem",
  path: ["confirmPassword"],
});

type RegisterValues = z.infer<typeof registerSchema>;

const Register = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const navigate = useNavigate();

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
  });

  const onSubmit = async (data: RegisterValues) => {
    try {
      console.log("Registro com:", data);
      // Simulando cadastro bem-sucedido
      toast({
        title: "Conta criada com sucesso!",
        description: "Redirecionando para o login...",
      });
      // Redirecionamento após cadastro bem-sucedido
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      console.error("Erro ao fazer cadastro:", error);
      toast({
        title: "Erro no cadastro",
        description: "Ocorreu um problema ao criar sua conta. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <div className="w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-vehipredict-blue mb-2">Zehit AI</h1>
          <p className="text-gray-600">Plataforma de Manutenção Preditiva</p>
        </div>
        
        <Card className="border-vehipredict-lightgray shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Criar Conta</CardTitle>
            <CardDescription className="text-center">
              Preencha os campos abaixo para se cadastrar
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome completo</FormLabel>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <FormControl>
                          <Input 
                            placeholder="Seu nome completo" 
                            className="pl-10 placeholder:text-[#666] text-[#1A1333]" 
                            {...field} 
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <FormControl>
                          <Input 
                            placeholder="seu.email@exemplo.com" 
                            className="pl-10 placeholder:text-[#666] text-[#1A1333]" 
                            {...field} 
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"}
                            className="pl-10 pr-10"
                            {...field}
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar senha</FormLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <FormControl>
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            className="pl-10 pr-10"
                            {...field}
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="termsAccepted"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal">
                          Eu li e concordo com os{" "}
                          <a 
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault();
                              toast({
                                title: "Termos de Uso",
                                description: "Funcionalidade a ser implementada.",
                              });
                            }}
                            className="text-vehipredict-lightblue hover:underline"
                          >
                            Termos de Uso
                          </a>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Cadastrando..." : "Criar Conta"}
                </Button>
              </form>
            </Form>
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <div className="text-center text-sm">
              <span className="text-gray-600">Já tem uma conta? </span>
              <a 
                href="#" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  navigate("/login"); 
                }} 
                className="text-vehipredict-lightblue hover:underline"
              >
                Faça login
              </a>
            </div>
          </CardFooter>
        </Card>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>&copy; 2025 Velox Motors - Zehit AI</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
