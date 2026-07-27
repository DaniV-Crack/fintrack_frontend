import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Tags,
  PiggyBank,
  BarChart3,
  Settings,
  User,
  LogOut,
  Bell,
  Menu,
  X,
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank as SavingsIcon,
  Plus,
  ShoppingCart,
  Home,
  Utensils,
  Briefcase,
  ChevronRight,
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
import { useAuth } from '../context/AuthContext';

const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');";

const brand = {
  bg: '#FAF9F6',
  dark: '#12181F',
  darkHover: '#2A3644',
  text: '#12181F',
  textSecondary: '#6B7280',
  border: '#E4E2DC',
  accent: '#F5A623',
  success: '#2EBD73',
  danger: '#F2734F',
  errorBg: '#FBEAE0',
};

// ---------------------------------------------------------------------------
// Mock data — reemplazar por llamadas reales cuando existan los endpoints.
// ---------------------------------------------------------------------------
const monthlyData = [
  { month: 'Feb', ingresos: 7200, gastos: 4100 },
  { month: 'Mar', ingresos: 7600, gastos: 4600 },
  { month: 'Abr', ingresos: 7400, gastos: 3900 },
  { month: 'May', ingresos: 8100, gastos: 4300 },
  { month: 'Jun', ingresos: 7900, gastos: 5100 },
  { month: 'Jul', ingresos: 8500, gastos: 3250 },
];

const expenseDistribution = [
  { name: 'Alimentación', value: 850, color: brand.accent },
  { name: 'Vivienda', value: 1500, color: brand.dark },
  { name: 'Transporte', value: 420, color: brand.success },
  { name: 'Entretenimiento', value: 350, color: brand.danger },
  { name: 'Salud', value: 210, color: '#8B9AAE' },
  { name: 'Otros', value: 180, color: '#D8D3C7' },
];

const recentTransactions = [
  { id: 1, label: 'Salario', category: 'Ingreso', date: '26 Jul 2026', amount: 8500, icon: Briefcase },
  { id: 2, label: 'Supermercado', category: 'Alimentación', date: '25 Jul 2026', amount: -250, icon: ShoppingCart },
  { id: 3, label: 'Alquiler', category: 'Vivienda', date: '01 Jul 2026', amount: -1500, icon: Home },
  { id: 4, label: 'Restaurante', category: 'Alimentación', date: '20 Jul 2026', amount: -85, icon: Utensils },
];

const budgets = [
  { label: 'Alimentación', spent: 850, total: 1200 },
  { label: 'Vivienda', spent: 1500, total: 1500 },
  { label: 'Entretenimiento', spent: 350, total: 500 },
];

const summaryCards = [
  { label: 'Balance total', value: 12450, change: '+4.2%', positive: true, icon: Wallet },
  { label: 'Ingresos', value: 8500, change: '+6.1%', positive: true, icon: TrendingUp },
  { label: 'Gastos', value: 3250, change: '-11.4%', positive: true, icon: TrendingDown },
  { label: 'Ahorro', value: 5250, change: '+18.9%', positive: true, icon: SavingsIcon },
];

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Transacciones', icon: ArrowLeftRight, path: '/transactions' },
  { label: 'Categorías', icon: Tags, path: '/categories' },
  { label: 'Presupuestos', icon: PiggyBank, path: '/budgets' },
  { label: 'Reportes', icon: BarChart3, path: '/reports' },
];

function formatBs(value: number) {
  const abs = Math.abs(value).toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${value < 0 ? '-' : ''}Bs ${abs}`;
}

function budgetStatus(spent: number, total: number) {
  const pct = Math.min(100, Math.round((spent / total) * 100));
  if (pct >= 100) return { pct, color: brand.danger, label: 'Excedido' };
  if (pct >= 85) return { pct, color: brand.accent, label: 'Cerca del límite' };
  return { pct, color: brand.success, label: 'Saludable' };
}

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------
function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const go = (path: string) => {
    navigate(path);
    onNavigate?.();
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        <div className="px-6 py-7">
          <span
            className="text-xl tracking-tight"
            style={{ color: brand.bg, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }}
          >
            FinTrack
          </span>
        </div>
        <nav className="px-3 space-y-1">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => go(item.path)}
                className="w-full flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm transition-colors duration-150"
                style={{
                  background: active ? 'rgba(245,166,35,0.14)' : 'transparent',
                  color: active ? brand.accent : 'rgba(250,249,246,0.65)',
                  fontWeight: active ? 600 : 400,
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.background = 'rgba(250,249,246,0.05)';
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.background = 'transparent';
                }}
              >
                <Icon size={17} strokeWidth={1.75} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="px-3 pb-6 space-y-1 border-t" style={{ borderColor: 'rgba(250,249,246,0.08)' }}>
        <div className="pt-4" />
        <button
          onClick={() => go('/settings')}
          className="w-full flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm transition-colors duration-150"
          style={{ color: 'rgba(250,249,246,0.65)' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(250,249,246,0.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <Settings size={17} strokeWidth={1.75} />
          Configuración
        </button>
        <button
          onClick={() => go('/profile')}
          className="w-full flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm transition-colors duration-150"
          style={{ color: 'rgba(250,249,246,0.65)' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(250,249,246,0.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <User size={17} strokeWidth={1.75} />
          Perfil
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm transition-colors duration-150"
          style={{ color: brand.danger }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(242,115,79,0.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <LogOut size={17} strokeWidth={1.75} />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const firstName = user?.name?.split(' ')[0] ?? 'Daniel';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <div className="min-h-screen flex" style={{ background: brand.bg, fontFamily: "'Inter', sans-serif" }}>
      <style>{FONT_IMPORT}</style>

      {/* Sidebar — desktop */}
      <aside className="hidden lg:block w-64 shrink-0" style={{ background: brand.dark }}>
        <div className="sticky top-0 h-screen">
          <SidebarContent />
        </div>
      </aside>

      {/* Drawer — mobile */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 transition-opacity duration-200"
            onClick={() => setDrawerOpen(false)}
          />
          <div
            className="absolute left-0 top-0 h-full w-64 transition-transform duration-200 ease-out"
            style={{ background: brand.dark }}
          >
            <button
              onClick={() => setDrawerOpen(false)}
              className="absolute right-4 top-6 z-10"
              style={{ color: 'rgba(250,249,246,0.6)' }}
              aria-label="Cerrar menú"
            >
              <X size={20} />
            </button>
            <SidebarContent onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <header
          className="flex items-center justify-between border-b px-5 py-4 sm:px-8"
          style={{ borderColor: brand.border, background: brand.bg }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden -ml-1 p-1.5"
              style={{ color: brand.text }}
              aria-label="Abrir menú"
            >
              <Menu size={22} strokeWidth={1.75} />
            </button>
            <div>
              <h1
                className="text-lg sm:text-xl"
                style={{ color: brand.text, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }}
              >
                {greeting}, {firstName}
              </h1>
              <p className="text-xs sm:text-sm hidden sm:block" style={{ color: brand.textSecondary }}>
                Este es el resumen de tus finanzas.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              className="relative p-2 rounded-full transition-colors duration-150"
              style={{ color: brand.textSecondary }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(18,24,31,0.04)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              aria-label="Notificaciones"
            >
              <Bell size={19} strokeWidth={1.75} />
              <span
                className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full"
                style={{ background: brand.accent }}
              />
            </button>
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold"
                style={{ background: brand.dark, color: brand.bg }}
              >
                {firstName.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:block text-sm font-medium" style={{ color: brand.text }}>
                {user?.name ?? 'Daniel'}
              </span>
            </div>
          </div>
        </header>

        <main className="px-5 py-6 sm:px-8 sm:py-8 space-y-8">
          {/* Cards financieras */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {summaryCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className="rounded-xl border p-5 transition-shadow duration-150"
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
                    {formatBs(card.value)}
                  </p>
                  <div className="flex items-center gap-1">
                    {card.positive ? (
                      <TrendingUp size={12} style={{ color: brand.success }} strokeWidth={2} />
                    ) : (
                      <TrendingDown size={12} style={{ color: brand.danger }} strokeWidth={2} />
                    )}
                    <span
                      className="text-xs font-medium"
                      style={{ color: card.positive ? brand.success : brand.danger }}
                    >
                      {card.change}
                    </span>
                    <span className="text-xs" style={{ color: brand.textSecondary }}>
                      vs. mes anterior
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Gráfico principal + Donut */}
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
                  <AreaChart data={monthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
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
                      formatter={(value: number) => formatBs(value)}
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
                  <span className="text-xs" style={{ color: brand.textSecondary }}>
                    Ingresos
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: brand.dark }} />
                  <span className="text-xs" style={{ color: brand.textSecondary }}>
                    Gastos
                  </span>
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
                    <Tooltip formatter={(value: number) => formatBs(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {expenseDistribution.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ background: item.color }} />
                      <span className="text-xs" style={{ color: brand.text }}>
                        {item.name}
                      </span>
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
            </div>
          </div>

          {/* Transacciones recientes + Presupuestos */}
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
                  className="flex items-center gap-1 text-xs font-medium transition-colors"
                  style={{ color: brand.accent }}
                >
                  Ver todas
                  <ChevronRight size={14} />
                </button>
              </div>
              <div className="space-y-1">
                {recentTransactions.map((t) => {
                  const Icon = t.icon;
                  const positive = t.amount > 0;
                  return (
                    <div
                      key={t.id}
                      className="flex items-center justify-between py-3 border-b last:border-b-0"
                      style={{ borderColor: brand.border }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                          style={{ background: brand.bg }}
                        >
                          <Icon size={16} style={{ color: brand.text }} strokeWidth={1.75} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate" style={{ color: brand.text }}>
                            {t.label}
                          </p>
                          <p className="text-xs" style={{ color: brand.textSecondary }}>
                            {t.category} &middot; {t.date}
                          </p>
                        </div>
                      </div>
                      <span
                        className="text-sm tabular-nums shrink-0 pl-3"
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          color: positive ? brand.success : brand.text,
                          fontWeight: 500,
                        }}
                      >
                        {positive ? '+' : ''}
                        {formatBs(t.amount)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div
              className="rounded-xl border p-5 sm:p-6"
              style={{ borderColor: brand.border, background: '#fff' }}
            >
              <h2 className="text-base font-medium mb-5" style={{ color: brand.text }}>
                Presupuestos
              </h2>
              <div className="space-y-5">
                {budgets.map((b) => {
                  const status = budgetStatus(b.spent, b.total);
                  return (
                    <div key={b.label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium" style={{ color: brand.text }}>
                          {b.label}
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
                      <div className="flex items-center justify-between">
                        <span
                          className="text-xs tabular-nums"
                          style={{ fontFamily: "'JetBrains Mono', monospace", color: brand.textSecondary }}
                        >
                          {formatBs(b.spent)} / {formatBs(b.total)}
                        </span>
                        <span className="text-xs" style={{ color: brand.textSecondary }}>
                          {status.pct}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              className="flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-medium transition-colors duration-150"
              style={{ background: brand.dark, color: brand.bg }}
              onMouseEnter={(e) => (e.currentTarget.style.background = brand.darkHover)}
              onMouseLeave={(e) => (e.currentTarget.style.background = brand.dark)}
            >
              <Plus size={16} strokeWidth={2} />
              Nueva transacción
            </button>
            <button
              className="flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-medium border transition-colors duration-150"
              style={{ borderColor: brand.accent, color: brand.accent, background: 'transparent' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(245,166,35,0.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <PiggyBank size={16} strokeWidth={2} />
              Crear presupuesto
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}