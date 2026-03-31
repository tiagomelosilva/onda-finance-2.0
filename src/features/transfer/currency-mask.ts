const MAX_TRANSFER_AMOUNT = 1_000_000_000;
const MAX_TRANSFER_CENTS = MAX_TRANSFER_AMOUNT * 100;

function clampDigits(rawDigits: string) {
  const normalized = rawDigits.replace(/\D/g, "").replace(/^0+(?=\d)/, "");

  if (!normalized) {
    return "";
  }

  const cents = Math.min(Number(normalized), MAX_TRANSFER_CENTS);
  return String(cents);
}

export function formatCurrencyInput(rawDigits: string) {
  const normalized = clampDigits(rawDigits);
  const amount = normalized ? Number(normalized) / 100 : 0;

  return {
    digits: normalized,
    amount,
    displayValue: new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount),
  };
}
