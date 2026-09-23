const brlCurrencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function formatCurrencyValue(value) {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (!digits) return '';

  return brlCurrencyFormatter.format(Number(digits) / 100);
}
