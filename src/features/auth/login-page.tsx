import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";

import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { loginMock } from "@/mocks/api";
import { useSessionStore } from "@/stores/session-store";

import { type LoginSchema, loginSchema } from "./schemas";

export function LoginPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: loginMock,
    onSuccess: () => {
      toast({
        title: "Acesso liberado",
        description: "Sess\u00e3o iniciada com sucesso.",
        variant: "success",
      });
      navigate("/dashboard", { replace: true });
    },
    onError: (error) => {
      toast({
        title: "Falha no login",
        description: error instanceof Error ? error.message : "N\u00e3o foi poss\u00edvel autenticar.",
        variant: "destructive",
      });
    },
  });

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(420px,0.92fr)] lg:items-center lg:gap-10 lg:px-8">
      <section className="mx-auto flex w-full max-w-2xl lg:max-w-none">
        <div className="flex w-full flex-col justify-between rounded-[2rem] border border-white/70 bg-white/88 p-7 shadow-fintech backdrop-blur sm:p-10 lg:min-h-[620px] lg:p-12">
          <div className="space-y-7 sm:space-y-8">
            <Logo />
            <div className="max-w-xl space-y-5">
              <span className="inline-flex rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">
                {"Desafio t\u00e9cnico \u2022 Fintech experience"}
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
                {"Gest\u00e3o banc\u00e1ria simples, clara e pronta para produ\u00e7\u00e3o."}
              </h1>
              <p className="text-lg leading-8 text-slate-600">
                {"Onda Finance simula uma experi\u00eancia de conta digital com autentica\u00e7\u00e3o mockada, dashboard transacional,"}
                {" transfer\u00eancia validada e arquitetura orientada por dom\u00ednio."}
              </p>
            </div>
          </div>
          <div className="mt-8 w-full max-w-xl lg:mt-12">
            <div className="w-full rounded-3xl bg-slate-950 p-5 text-white shadow-fintech">
              <ShieldCheck className="h-8 w-8 text-sky-300" />
              <p className="mt-4 text-lg font-bold">Fluxo protegido</p>
              <p className="mt-2 text-sm text-slate-300">
                {"Rotas autenticadas, persist\u00eancia de sess\u00e3o e feedback visual em tempo real."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Card className="mx-auto w-full max-w-2xl border-white/80 bg-white/90 lg:max-w-none lg:min-h-[620px]">
        <CardHeader className="px-7 pt-7 sm:px-10 sm:pt-10 lg:px-12 lg:pt-12">
          <CardTitle className="text-[2rem] sm:text-4xl lg:text-[2.5rem]">Entrar</CardTitle>
          <CardDescription>
            {"Acesse a conta mockada para visualizar saldo e realizar transfer\u00eancias."}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-7 pb-7 sm:px-10 sm:pb-10 lg:flex lg:min-h-[440px] lg:px-12 lg:pb-12">
          <div className="w-full lg:my-auto lg:max-w-md">
            <Form {...form}>
              <form
                autoComplete="off"
                className="space-y-5 sm:space-y-6"
                onSubmit={form.handleSubmit((values) => loginMutation.mutate(values))}
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2.5">
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input placeholder="seuemail@empresa.com" autoComplete="off" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-2.5">
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Digite sua senha" autoComplete="off" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="mt-2 h-12 w-full rounded-xl" type="submit" disabled={loginMutation.isPending}>
                  {loginMutation.isPending ? "Entrando..." : "Acessar dashboard"}
                </Button>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
