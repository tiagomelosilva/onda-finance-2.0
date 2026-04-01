import { z } from "zod";

export const transferSchema = z.object({
  recipientName: z.string().min(3, "Informe o nome do destinatário."),
  email: z.string().min(1, "Informe o e-mail.").email("Digite um e-mail válido."),
  amount: z.coerce.number().positive("O valor precisa ser maior que zero."),
  sourceCurrency: z.enum(["BRL", "USD", "EUR"]),
  destinationCurrency: z.enum(["BRL", "USD", "EUR"]),
  settlementType: z.enum(["fiat", "crypto"]),
  description: z.string().max(120, "A descrição deve ter no máximo 120 caracteres.").optional().or(z.literal("")),
});

export type TransferSchema = z.infer<typeof transferSchema>;
