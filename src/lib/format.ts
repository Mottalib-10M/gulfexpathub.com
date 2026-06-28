export function formatCurrency(amount: number, currency: string): string {
  return `${currency} ${amount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function formatCurrencyDetailed(amount: number, currency: string): string {
  return `${currency} ${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatUSD(amount: number): string {
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

const eurRates: Record<string, number> = { AED: 0.25, QAR: 0.25, SAR: 0.24 };

export function toEUR(amount: number, currency: string): number {
  return Math.round(amount * (eurRates[currency] ?? 0.25));
}

export function formatWithEUR(amount: number, currency: string): string {
  return `${formatCurrency(amount, currency)} (~€${toEUR(amount, currency).toLocaleString("en-US")})`;
}

export function formatDetailedWithEUR(amount: number, currency: string): string {
  return `${formatCurrencyDetailed(amount, currency)} (~€${toEUR(amount, currency).toLocaleString("en-US")})`;
}

export function formatPercent(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function deslugify(slug: string): string {
  return slug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
