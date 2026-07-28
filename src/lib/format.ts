export const MONTH_LABELS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dec'];

export function n(value: number | string | null | undefined): number {
  if (value === null || value === undefined) return 0;
  return typeof value === 'string' ? parseFloat(value) || 0 : value;
}

export function formatBs(value: number) {
  const abs = Math.abs(value).toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${value < 0 ? '-' : ''}Bs ${abs}`;
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat('es-BO', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso));
}

export function computeChange(curr: number, prev: number): number {
  if (prev === 0 && curr === 0) return 0;
  if (prev === 0) return curr > 0 ? 100 : -100;
  return ((curr - prev) / Math.abs(prev)) * 100;
}

export function getLastMonths(count: number) {
  const months: { month: number; year: number; label: string }[] = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ month: d.getMonth() + 1, year: d.getFullYear(), label: MONTH_LABELS[d.getMonth()] ?? '' });
  }
  return months;
}

export function budgetStatus(pct: number) {
  const clamped = Math.min(100, Math.round(pct));
  if (pct >= 100) return { pct: clamped, color: '#F2734F', label: 'Excedido' };
  if (pct >= 85) return { pct: clamped, color: '#F5A623', label: 'Cerca del límite' };
  return { pct: clamped, color: '#2EBD73', label: 'Saludable' };
}
