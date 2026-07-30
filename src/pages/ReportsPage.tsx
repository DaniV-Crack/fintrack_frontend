import { useCallback, useEffect, useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import type { TransactionSummary } from '../types';
import { transactionsService } from '../api/transactions.service';
import { brand } from '../lib/theme';
import { formatBs } from '../lib/format';

const PRESETS = [
  { label: 'Este mes', days: 0 },
  { label: 'Mes pasado', days: -1 },
  { label: 'Este año', days: -365 },
] as const;

function getDateRange(days: number) {
  const now = new Date();
  if (days === 0) {
    const from = new Date(now.getFullYear(), now.getMonth(), 1);
    return { dateFrom: from.toISOString().split('T')[0] ?? '', dateTo: now.toISOString().split('T')[0] ?? '' };
  }
  if (days === -365) {
    const from = new Date(now.getFullYear(), 0, 1);
    return { dateFrom: from.toISOString().split('T')[0] ?? '', dateTo: now.toISOString().split('T')[0] ?? '' };
  }
  const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const to = new Date(now.getFullYear(), now.getMonth(), 0);
  return { dateFrom: from.toISOString().split('T')[0] ?? '', dateTo: to.toISOString().split('T')[0] ?? '' };
}

export default function ReportsPage() {
  const [summary, setSummary] = useState<TransactionSummary | null>(null);
  const [dateFrom, setDateFrom] = useState(getDateRange(0).dateFrom);
  const [dateTo, setDateTo] = useState(getDateRange(0).dateTo);
  const [loading, setLoading] = useState(true);
  const [activePreset, setActivePreset] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await transactionsService.getSummary({ dateFrom, dateTo });
      setSummary(result);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [dateFrom, dateTo]);

  useEffect(() => {
    load();
  }, [load]);

  const applyPreset = (idx: number) => {
    const preset = PRESETS[idx];
    if (!preset) return;
    const { dateFrom: from, dateTo: to } = getDateRange(preset.days);
    setDateFrom(from);
    setDateTo(to);
    setActivePreset(idx);
  };

  const maxCategoryTotal = Math.max(...(summary?.byCategory?.map((c) => Math.abs(c.total)) ?? [0]), 1);

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-medium" style={{ color: brand.text, fontFamily: "'Space Grotesk', sans-serif" }}>
          Reportes
        </h2>
        <p className="text-sm" style={{ color: brand.textSecondary }}>
          Resumen de ingresos y gastos por período.
        </p>
      </div>

      {/* Rango de fechas */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex gap-1">
          {PRESETS.map((preset, i) => (
            <button
              key={preset.label}
              onClick={() => applyPreset(i)}
              className="rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors duration-150"
              style={{
                background: activePreset === i ? brand.dark : brand.bg,
                color: activePreset === i ? brand.bg : brand.textSecondary,
                border: `1px solid ${activePreset === i ? brand.dark : brand.border}`,
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => { setDateFrom(e.target.value); setActivePreset(-1); }}
          className="rounded-lg px-3 py-1.5 text-xs outline-none"
          style={{ border: `1px solid ${brand.border}`, color: brand.text, background: '#fff' }}
        />
        <span className="text-xs" style={{ color: brand.textSecondary }}>a</span>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => { setDateTo(e.target.value); setActivePreset(-1); }}
          className="rounded-lg px-3 py-1.5 text-xs outline-none"
          style={{ border: `1px solid ${brand.border}`, color: brand.text, background: '#fff' }}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <span className="h-6 w-6 rounded-full border-2 animate-spin" style={{ borderColor: brand.border, borderTopColor: brand.accent }} />
        </div>
      ) : !summary ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <BarChart3 size={40} style={{ color: brand.border }} strokeWidth={1} />
          <p className="mt-4 text-sm font-medium" style={{ color: brand.text }}>
            No se pudieron cargar los reportes
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Totales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              className="rounded-xl border p-5"
              style={{ borderColor: brand.border, background: '#fff' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={16} style={{ color: brand.success }} strokeWidth={1.75} />
                <span className="text-xs font-medium" style={{ color: brand.textSecondary }}>Ingresos</span>
              </div>
              <p
                className="text-2xl tabular-nums"
                style={{ fontFamily: "'JetBrains Mono', monospace", color: brand.success, fontWeight: 500 }}
              >
                {formatBs(summary.income)}
              </p>
            </div>
            <div
              className="rounded-xl border p-5"
              style={{ borderColor: brand.border, background: '#fff' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown size={16} style={{ color: brand.danger }} strokeWidth={1.75} />
                <span className="text-xs font-medium" style={{ color: brand.textSecondary }}>Gastos</span>
              </div>
              <p
                className="text-2xl tabular-nums"
                style={{ fontFamily: "'JetBrains Mono', monospace", color: brand.text, fontWeight: 500 }}
              >
                {formatBs(summary.expense)}
              </p>
            </div>
          </div>

          {/* Desglose por categoría */}
          <div
            className="rounded-xl border p-5 sm:p-6"
            style={{ borderColor: brand.border, background: '#fff' }}
          >
            <h3 className="text-base font-medium mb-5" style={{ color: brand.text }}>
              Desglose por categoría
            </h3>
            {(summary.byCategory?.length ?? 0) === 0 ? (
              <p className="text-sm" style={{ color: brand.textSecondary }}>
                No hay movimientos en este período.
              </p>
            ) : (
              <div className="space-y-4">
                {summary.byCategory?.map((item) => {
                  const isIncome = item.type === 'INCOME';
                  const pct = (item.total / maxCategoryTotal) * 100;
                  return (
                    <div key={item.categoryId}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm" style={{ color: brand.text }}>{item.categoryName}</span>
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{
                              background: isIncome ? 'rgba(46,189,115,0.12)' : 'rgba(242,115,79,0.12)',
                              color: isIncome ? brand.success : brand.danger,
                            }}
                          >
                            {isIncome ? 'Ingreso' : 'Gasto'}
                          </span>
                        </div>
                        <span
                          className="text-sm tabular-nums"
                          style={{ fontFamily: "'JetBrains Mono', monospace", color: brand.text, fontWeight: 500 }}
                        >
                          {formatBs(item.total)}
                        </span>
                      </div>
                      <div
                        className="h-2 w-full rounded-full overflow-hidden"
                        style={{ background: brand.bg }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${pct}%`,
                            background: isIncome ? brand.success : brand.danger,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
