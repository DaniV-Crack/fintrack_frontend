import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank as SavingsIcon,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  ChevronRight,
  AlertCircle,
  RotateCw,
  PiggyBank,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { dashboardService } from '../api/dashboard.service';
import { transactionsService } from '../api/transactions.service';
import type { DashboardSummary, Transaction } from '../types';
import { brand, categoryPalette } from '../lib/theme';
import { n, formatBs, formatDate, computeChange, getLastMonths, budgetStatus } from '../lib/format';

export default function DashboardPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [monthlySummaries, setMonthlySummaries] = useState<DashboardSummary[]>([]);
  const [trendLabels, setTrendLabels] = useState<string[]>([]);
  const [recentTx, setRecentTx] = useState<Transaction[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const months = getLastMonths(6);
      const [summaries, txPage] = await Promise.all([
        Promise.all(months.map((m) => dashboardService.getSummary(m.month, m.year))),
        transactionsService.getAll({ page: 1, limit: 5 }),
      ]);

      setMonthlySummaries(summaries);
      setTrendLabels(months.map((m) => m.label));

      const sorted = [...txPage.items].sort(
        (a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime(),
      );
      setRecentTx(sorted.slice(0, 5));
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setError(e.response?.data?.message ?? e.message ?? 'No se pudo cargar el dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const current = monthlySummaries[monthlySummaries.length - 1] ?? null;
  const previous = monthlySummaries[monthlySummaries.length - 2] ?? null;

  const income = n(current?.balance.income);
  const expense = n(current?.balance.expense);
  const total = n(current?.balance.total);
  const prevIncome = n(previous?.balance.income);
  const prevExpense = n(previous?.balance.expense);
  const prevTotal = n(previous?.balance.total);

  const savingsRate = income > 0 ? (total / income) * 100 : 0;
  const prevSavingsRate = prevIncome > 0 ? (prevTotal / prevIncome) * 100 : 0;

  const summaryCards = [
    {
      label: 'Balance total',
      value: formatBs(total),
      change: computeChange(total, prevTotal),
      goodWhenUp: true,
      icon: Wallet,
    },
    {
      label: 'Ingresos',
      value: formatBs(income),
      change: computeChange(income, prevIncome),
      goodWhenUp: true,
      icon: TrendingUp,
    },
    {
      label: 'Gastos',
      value: formatBs(expense),
      change: computeChange(expense, prevExpense),
      goodWhenUp: false,
      icon: TrendingDown,
    },
    {
      label: 'Tasa de ahorro',
      value: `${savingsRate.toFixed(0)}%`,
      change: computeChange(savingsRate, prevSavingsRate),
      goodWhenUp: true,
      icon: SavingsIcon,
    },
  ];

  const trendData = monthlySummaries.map((s, i) => ({
    month: trendLabels[i],
    ingresos: n(s.balance.income),
    gastos: n(s.balance.expense),
  }));

  const expenseDistribution = (current?.byCategory ?? [])
    .filter((c) => c.type === 'EXPENSE')
    .map((c, i) => ({
      name: c.categoryName,
      value: n(c.total),
      color: categoryPalette[i % categoryPalette.length],
    }));

  const budgetAlerts = current?.budgetAlerts ?? [];

  return (
    <>
      {error && (
        <div
          role="alert"
          className="flex items-center justify-between gap-4 rounded-lg px-4 py-3 text-sm"
          style={{ background: brand.errorBg, color: '#8a4a24' }}
        >
          <span className="flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </span>
          <button onClick={load} className="flex items-center gap-1.5 font-medium shrink-0">
            <RotateCw size={13} />
            Reintentar
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <span
            className="h-6 w-6 rounded-full border-2 animate-spin"
            style={{ borderColor: brand.border, borderTopColor: brand.accent }}
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {summaryCards.map((card) => {
              const Icon = card.icon;
              const isUp = card.change >= 0;
              const isGood = card.goodWhenUp ? isUp : !isUp;
              const changeColor = isGood ? brand.success : brand.danger;
              return (
                <div
                  key={card.label}
                  className="rounded-xl border p-5"
                  style={{ borderColor: brand.border, background: '#fff' }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium" style={{ color: brand.textSecondary }}>
                      {card.label}
                    </span>
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-lg"
                      style={{ background: 'rgba(245,166,35,0.1)' }}
                    >
                      <Icon size={15} style={{ color: brand.accent }} strokeWidth={1.75} />
                    </div>
                  </div>
                  <p
                    className="text-2xl tabular-nums mb-2"
                    style={{ fontFamily: "'JetBrains Mono', monospace", color: brand.text, fontWeight: 500 }}
                  >
                    {card.value}
                  </p>
                  <div className="flex items-center gap-1">
                    {isUp ? (
                      <TrendingUp size={12} style={{ color: changeColor }} strokeWidth={2} />
                    ) : (
                      <TrendingDown size={12} style={{ color: changeColor }} strokeWidth={2} />
                    )}
                    <span className="text-xs font-medium" style={{ color: changeColor }}>
                      {card.change >= 0 ? '+' : ''}
                      {card.change.toFixed(1)}%
                    </span>
                    <span className="text-xs" style={{ color: brand.textSecondary }}>
                      vs. mes anterior
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div
              className="xl:col-span-2 rounded-xl border p-5 sm:p-6"
              style={{ borderColor: brand.border, background: '#fff' }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-medium" style={{ color: brand.text }}>
                  Ingresos vs Gastos
                </h2>
                <span className="text-xs" style={{ color: brand.textSecondary }}>
                  Últimos 6 meses
                </span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="ingresosGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={brand.accent} stopOpacity={0.25} />
                        <stop offset="100%" stopColor={brand.accent} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gastosGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={brand.dark} stopOpacity={0.15} />
                        <stop offset="100%" stopColor={brand.dark} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={brand.border} vertical={false} />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12, fill: brand.textSecondary }}
                      axisLine={{ stroke: brand.border }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: brand.textSecondary }}
                      axisLine={false}
                      tickLine={false}
                      width={45}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: `1px solid ${brand.border}`,
                        fontSize: 12,
                        fontFamily: "'Inter', sans-serif",
                      }}
                      formatter={(value) => formatBs(Number(value ?? 0))}
                    />
                    <Area
                      type="monotone"
                      dataKey="ingresos"
                      name="Ingresos"
                      stroke={brand.accent}
                      strokeWidth={2}
                      fill="url(#ingresosGradient)"
                    />
                    <Area
                      type="monotone"
                      dataKey="gastos"
                      name="Gastos"
                      stroke={brand.dark}
                      strokeWidth={2}
                      fill="url(#gastosGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-5 mt-4">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: brand.accent }} />
                  <span className="text-xs" style={{ color: brand.textSecondary }}>Ingresos</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: brand.dark }} />
                  <span className="text-xs" style={{ color: brand.textSecondary }}>Gastos</span>
                </div>
              </div>
            </div>

            <div
              className="rounded-xl border p-5 sm:p-6"
              style={{ borderColor: brand.border, background: '#fff' }}
            >
              <h2 className="text-base font-medium mb-6" style={{ color: brand.text }}>
                Distribución de gastos
              </h2>
              {expenseDistribution.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <p className="text-sm" style={{ color: brand.textSecondary }}>
                    Todavía no registraste gastos categorizados este mes.
                  </p>
                </div>
              ) : (
                <>
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expenseDistribution}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={50}
                          outerRadius={72}
                          paddingAngle={2}
                          stroke="none"
                        >
                          {expenseDistribution.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatBs(Number(Array.isArray(value) ? value[0] ?? 0 : value ?? 0))} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 space-y-2">
                    {expenseDistribution.map((item) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full" style={{ background: item.color }} />
                          <span className="text-xs" style={{ color: brand.text }}>{item.name}</span>
                        </div>
                        <span
                          className="text-xs tabular-nums"
                          style={{ fontFamily: "'JetBrains Mono', monospace", color: brand.textSecondary }}
                        >
                          {formatBs(item.value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div
              className="xl:col-span-2 rounded-xl border p-5 sm:p-6"
              style={{ borderColor: brand.border, background: '#fff' }}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-medium" style={{ color: brand.text }}>
                  Transacciones recientes
                </h2>
                <button
                  onClick={() => navigate('/transactions')}
                  className="flex items-center gap-1 text-xs font-medium transition-colors"
                  style={{ color: brand.accent }}
                >
                  Ver todas
                  <ChevronRight size={14} />
                </button>
              </div>

              {recentTx.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <p className="text-sm mb-1" style={{ color: brand.text }}>
                    Todavía no tenés transacciones
                  </p>
                  <p className="text-xs" style={{ color: brand.textSecondary }}>
                    Registrá tu primer ingreso o gasto para verlo acá.
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {recentTx.map((t) => {
                    const isIncome = t.type === 'INCOME';
                    const amount = n(t.amount);
                    const signedAmount = isIncome ? amount : -amount;
                    return (
                      <div
                        key={t.id}
                        className="flex items-center justify-between py-3 border-b last:border-b-0"
                        style={{ borderColor: brand.border }}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                            style={{ background: isIncome ? 'rgba(46,189,115,0.12)' : 'rgba(242,115,79,0.12)' }}
                          >
                            {isIncome ? (
                              <ArrowDownLeft size={16} style={{ color: brand.success }} strokeWidth={1.75} />
                            ) : (
                              <ArrowUpRight size={16} style={{ color: brand.danger }} strokeWidth={1.75} />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate" style={{ color: brand.text }}>
                              {t.description || t.category?.name || (isIncome ? 'Ingreso' : 'Gasto')}
                            </p>
                            <p className="text-xs" style={{ color: brand.textSecondary }}>
                              {t.category?.name ?? 'Sin categoría'} &middot; {formatDate(t.transactionDate)}
                            </p>
                          </div>
                        </div>
                        <span
                          className="text-sm tabular-nums shrink-0 pl-3"
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            color: isIncome ? brand.success : brand.text,
                            fontWeight: 500,
                          }}
                        >
                          {isIncome ? '+' : ''}
                          {formatBs(signedAmount)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div
              className="rounded-xl border p-5 sm:p-6"
              style={{ borderColor: brand.border, background: '#fff' }}
            >
              <h2 className="text-base font-medium mb-5" style={{ color: brand.text }}>
                Presupuestos
              </h2>

              {budgetAlerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <p className="text-sm mb-3" style={{ color: brand.textSecondary }}>
                    No tenés presupuestos configurados para este mes.
                  </p>
                  <button
                    onClick={() => navigate('/budgets')}
                    className="text-xs font-medium"
                    style={{ color: brand.accent }}
                  >
                    Crear presupuesto
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {budgetAlerts.map((b) => {
                    const status = budgetStatus(n(b.percentageUsed));
                    return (
                      <div key={b.budgetId}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-medium" style={{ color: brand.text }}>
                            {b.categoryName}
                          </span>
                          <span className="text-xs" style={{ color: status.color }}>
                            {status.label}
                          </span>
                        </div>
                        <div
                          className="h-2 w-full rounded-full overflow-hidden mb-1.5"
                          style={{ background: brand.bg }}
                        >
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{ width: `${status.pct}%`, background: status.color }}
                          />
                        </div>
                        <span className="text-xs" style={{ color: brand.textSecondary }}>
                          {status.pct}% usado
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/transactions')}
              className="flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-medium transition-colors duration-150"
              style={{ background: brand.dark, color: brand.bg }}
              onMouseEnter={(e) => (e.currentTarget.style.background = brand.darkHover)}
              onMouseLeave={(e) => (e.currentTarget.style.background = brand.dark)}
            >
              <Plus size={16} strokeWidth={2} />
              Nueva transacción
            </button>
            <button
              onClick={() => navigate('/budgets')}
              className="flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-medium border transition-colors duration-150"
              style={{ borderColor: brand.accent, color: brand.accent, background: 'transparent' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(245,166,35,0.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <PiggyBank size={16} strokeWidth={2} />
              Crear presupuesto
            </button>
          </div>
        </>
      )}
    </>
  );
}
