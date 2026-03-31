import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeftRight, SendHorizontal } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrency } from "@/lib/formatters";
import { createTransferMock } from "@/mocks/api";
import { useAccountStore } from "@/stores/account-store";

import { formatCurrencyInput } from "./currency-mask";
import { type TransferSchema, transferSchema } from "./schema";

export function TransferPage() {
  const balance = useAccountStore((state) => state.balance);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [amountDigits, setAmountDigits] = React.useState("");

  const form = useForm<TransferSchema>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      recipientName: "",
      email: "",
      amount: 0,
      description: "",
    },
  });

  const transferMutation = useMutation({
    mutationFn: createTransferMock,
    onSuccess: () => {
      toast({
        title: "Transferência concluída",
        description: "A transação foi adicionada ao histórico com sucesso.",
        variant: "success",
      });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      form.reset({
        recipientName: "",
        email: "",
        amount: 0,
        description: "",
      });
      setAmountDigits("");
    },
    onError: (error) => {
      toast({
        title: "Não foi possível transferir",
        description: error instanceof Error ? error.message : "Tente novamente em instantes.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: TransferSchema) {
    if (transferMutation.isPending) {
      return;
    }

    if (values.amount > balance) {
      form.setError("amount", {
        message: "O valor não pode ser maior que o saldo disponível.",
      });
      return;
    }

    transferMutation.mutate({
      ...values,
      description: values.description || undefined,
    });
  }

  const amountField = formatCurrencyInput(amountDigits);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr,1.05fr]">
      <Card className="border-white/80 bg-slate-950 text-white">
        <CardHeader>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
            <ArrowLeftRight className="h-6 w-6 text-sky-300" />
          </div>
          <CardTitle className="mt-4 text-3xl">Nova transferência</CardTitle>
          <CardDescription className="text-slate-300">
            Preencha os dados do favorecido e valide o valor contra o saldo disponível em conta.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl bg-white/10 p-5">
            <p className="text-sm text-slate-300">Saldo atual</p>
            <p className="mt-2 text-3xl font-bold">{formatCurrency(balance)}</p>
          </div>
          <div className="rounded-2xl border border-white/10 p-5">
            <p className="text-sm font-semibold text-white">Regras aplicadas</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li>Valor obrigatório e maior que zero.</li>
              <li>Transferência bloqueada quando excede o saldo.</li>
              <li>Atualização instantânea do saldo e do extrato ao concluir.</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/80 bg-white/90">
        <CardHeader>
          <CardTitle>Dados da transferência</CardTitle>
          <CardDescription>Os campos são validados com Zod e integrados ao React Hook Form.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="recipientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do destinatário</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex.: Mariana Costa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input placeholder="destinatario@email.com" autoComplete="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={() => (
                  <FormItem>
                    <FormLabel>Valor</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        placeholder="R$ 0,00"
                        value={amountField.displayValue}
                        onChange={(event) => {
                          const nextValue = formatCurrencyInput(event.target.value);
                          setAmountDigits(nextValue.digits);
                          form.setValue("amount", nextValue.amount, {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                        }}
                        onBlur={() => {
                          form.trigger("amount");
                        }}
                      />
                    </FormControl>
                    <FormDescription>Saldo disponível: {formatCurrency(balance)}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input placeholder="Opcional" maxLength={120} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit" disabled={transferMutation.isPending}>
                <SendHorizontal className="h-4 w-4" />
                {transferMutation.isPending ? "Processando..." : "Confirmar transferência"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
