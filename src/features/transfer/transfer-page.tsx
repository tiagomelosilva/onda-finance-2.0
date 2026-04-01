import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeftRight, SendHorizontal } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { getCurrencyLabel, getTransferQuote } from "@/lib/exchange";
import { formatCurrency, formatExchangeRate, formatPercentage } from "@/lib/formatters";
import { createTransferMock } from "@/mocks/api";
import { useAccountStore } from "@/stores/account-store";
import type { CurrencyCode, TransferSettlementType } from "@/types/currency";

import { formatCurrencyInput } from "./currency-mask";
import { type TransferSchema, transferSchema } from "./schema";

const currencies: CurrencyCode[] = ["BRL", "USD", "EUR"];

export function TransferPage() {
  const balances = useAccountStore((state) => state.balances);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [amountDigits, setAmountDigits] = React.useState("");

  const form = useForm<TransferSchema>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      recipientName: "",
      email: "",
      amount: 0,
      sourceCurrency: "BRL",
      destinationCurrency: "BRL",
      settlementType: "fiat",
      description: "",
    },
  });

  const amount = form.watch("amount");
  const sourceCurrency = form.watch("sourceCurrency");
  const destinationCurrency = form.watch("destinationCurrency");
  const settlementType = form.watch("settlementType");

  const quote =
    amount > 0
      ? getTransferQuote({
          amount,
          sourceCurrency,
          destinationCurrency,
          settlementType,
        })
      : null;

  const transferMutation = useMutation({
    mutationFn: createTransferMock,
    onSuccess: (_, variables) => {
      toast({
        title: variables.settlementType === "crypto" ? "Transferência enviada para a rede" : "Transferência concluída",
        description:
          variables.settlementType === "crypto"
            ? "A transação foi registrada com status de processamento."
            : "A transação foi adicionada ao histórico com sucesso.",
        variant: "success",
      });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      form.reset({
        recipientName: "",
        email: "",
        amount: 0,
        sourceCurrency: "BRL",
        destinationCurrency: "BRL",
        settlementType: "fiat",
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

    if (values.amount > balances[values.sourceCurrency]) {
      form.setError("amount", {
        message: "O valor não pode ser maior que o saldo disponível na moeda de origem.",
      });
      return;
    }

    transferMutation.mutate({
      ...values,
      description: values.description || undefined,
    });
  }

  const amountField = formatCurrencyInput(amountDigits);
  const currentSourceBalance = balances[sourceCurrency];

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr,1.05fr]">
      <Card className="border-white/80 bg-slate-950 text-white">
        <CardHeader>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
            <ArrowLeftRight className="h-6 w-6 text-sky-300" />
          </div>
          <CardTitle className="mt-4 text-3xl">Nova transferência</CardTitle>
          <CardDescription className="text-slate-300">
            O fluxo original segue disponível e agora suporta moedas fiduciárias e simulação via crypto.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl bg-white/10 p-5">
            <p className="text-sm text-slate-300">Saldo na moeda de origem</p>
            <p className="mt-2 text-3xl font-bold">{formatCurrency(currentSourceBalance, sourceCurrency)}</p>
            <p className="mt-2 text-sm text-slate-300">{getCurrencyLabel(sourceCurrency)}</p>
          </div>
          <div className="rounded-2xl border border-white/10 p-5">
            <p className="text-sm font-semibold text-white">Regras aplicadas</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li>Transferência local mantém BRL → BRL por padrão.</li>
              <li>Transferência internacional aplica taxa de câmbio simulada.</li>
              <li>Crypto mode altera taxa operacional e tempo de processamento.</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/80 bg-white/90">
        <CardHeader>
          <CardTitle>Dados da transferência</CardTitle>
          <CardDescription>O mesmo fluxo atual foi enriquecido com origem, destino, câmbio e modo de liquidação.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-5 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="sourceCurrency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Moeda de origem</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="flex h-11 w-full rounded-xl border border-input bg-white px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {currencies.map((currency) => (
                            <option key={currency} value={currency}>
                              {currency}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="destinationCurrency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Moeda de destino</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="flex h-11 w-full rounded-xl border border-input bg-white px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {currencies.map((currency) => (
                            <option key={currency} value={currency}>
                              {currency}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="settlementType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modo de liquidação</FormLabel>
                    <FormControl>
                      <div className="flex flex-wrap gap-2">
                        {([
                          { value: "fiat", label: "Fiat" },
                          { value: "crypto", label: "Crypto mode" },
                        ] as Array<{ value: TransferSettlementType; label: string }>).map((option) => (
                          <Button
                            key={option.value}
                            type="button"
                            variant={field.value === option.value ? "default" : "outline"}
                            onClick={() => field.onChange(option.value)}
                          >
                            {option.label}
                          </Button>
                        ))}
                      </div>
                    </FormControl>
                    <FormDescription>
                      {settlementType === "crypto"
                        ? "Usa taxa operacional reduzida e status de processamento em rede."
                        : "Liquidação fiduciária com câmbio simulado para corredores internacionais."}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                    <FormDescription>
                      Saldo disponível em {sourceCurrency}: {formatCurrency(currentSourceBalance, sourceCurrency)}
                    </FormDescription>
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

              {quote ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900">Resumo da conversão</p>
                    <Badge variant={quote.scope === "crypto" ? "warning" : quote.scope === "international" ? "default" : "success"}>
                      {quote.scope === "crypto" ? "Crypto" : quote.scope === "international" ? "Internacional" : "Local"}
                    </Badge>
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <SummaryItem label="Origem" value={formatCurrency(amount, sourceCurrency)} />
                    <SummaryItem label="Destino bruto" value={formatCurrency(quote.grossDestinationAmount, destinationCurrency)} />
                    <SummaryItem label="Taxa cambial" value={formatExchangeRate(sourceCurrency, destinationCurrency, quote.exchangeRate)} />
                    <SummaryItem label="Taxa operacional" value={`${formatPercentage(quote.feePercentage)} (${formatCurrency(quote.feeAmount, destinationCurrency)})`} />
                  </div>
                  <div className="mt-4 rounded-2xl bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Valor final recebido</p>
                    <p className="mt-2 text-2xl font-bold text-slate-950">{formatCurrency(quote.receivedAmount, destinationCurrency)}</p>
                    <p className="mt-2 text-sm text-slate-600">{quote.processingLabel}</p>
                  </div>
                </div>
              ) : null}

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

interface SummaryItemProps {
  label: string;
  value: string;
}

function SummaryItem({ label, value }: SummaryItemProps) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}
