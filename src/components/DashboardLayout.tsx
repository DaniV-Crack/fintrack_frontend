import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
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
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { FONT_IMPORT, brand } from '../lib/theme';

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Transacciones', icon: ArrowLeftRight, path: '/transactions' },
  { label: 'Categorías', icon: Tags, path: '/categories' },
  { label: 'Presupuestos', icon: PiggyBank, path: '/budgets' },
  { label: 'Reportes', icon: BarChart3, path: '/reports' },
];

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

export default function DashboardLayout() {
  const { user } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const firstName = user?.name?.split(' ')[0] ?? 'ahí';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <div className="min-h-screen flex" style={{ background: brand.bg, fontFamily: "'Inter', sans-serif" }}>
      <style>{FONT_IMPORT}</style>

      <aside className="hidden lg:block w-64 shrink-0" style={{ background: brand.dark }}>
        <div className="sticky top-0 h-screen">
          <SidebarContent />
        </div>
      </aside>

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

      <div className="flex-1 min-w-0">
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
            </button>
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold"
                style={{ background: brand.dark, color: brand.bg }}
              >
                {firstName.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:block text-sm font-medium" style={{ color: brand.text }}>
                {user?.name ?? 'Mi cuenta'}
              </span>
            </div>
          </div>
        </header>

        <main className="px-5 py-6 sm:px-8 sm:py-8 space-y-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
