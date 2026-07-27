import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../api/auth.service';

// ---------------------------------------------------------------------------
// FinTrack — paleta y tipografía de marca (inyectadas localmente, sin tocar
// archivos globales). Reutiliza estas constantes también en Register/Dashboard.
// ---------------------------------------------------------------------------
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

const ledgerRows = [
  { label: 'Salario', amount: '+3.200,00', positive: true },
  { label: 'Supermercado', amount: '-85,00', positive: false },
  { label: 'Renta', amount: '-650,00', positive: false },
];

function LedgerPreview() {
  return (
    <div
      className="rounded-xl border p-5 backdrop-blur-sm"
      style={{ borderColor: 'rgba(245,166,35,0.25)', background: 'rgba(255,255,255,0.03)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <span
          className="text-[11px] uppercase tracking-[0.14em]"
          style={{ color: 'rgba(250,249,246,0.45)', fontFamily: "'Inter', sans-serif" }}
        >
          Resumen de julio
        </span>
        <Wallet size={14} style={{ color: brand.accent }} strokeWidth={1.75} />
      </div>
      <div className="space-y-3">
        {ledgerRows.map((row, i) => (
          <div key={row.label}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {row.positive ? (
                  <TrendingUp size={13} style={{ color: brand.success }} strokeWidth={2} />
                ) : (
                  <TrendingDown size={13} style={{ color: 'rgba(250,249,246,0.4)' }} strokeWidth={2} />
                )}
                <span
                  className="text-sm"
                  style={{ color: 'rgba(250,249,246,0.85)', fontFamily: "'Inter', sans-serif" }}
                >
                  {row.label}
                </span>
              </div>
              <span
                className="text-sm tabular-nums"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color: row.positive ? brand.success : 'rgba(250,249,246,0.75)',
                }}
              >
                {row.amount}
              </span>
            </div>
            {i < ledgerRows.length - 1 && (
              <div className="mt-3 h-px" style={{ background: 'rgba(250,249,246,0.08)' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordValid = password.length >= 1;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // authService.login() ya devuelve { token, user } directamente
      const { token, user } = await authService.login({ email, password });
      login(token, user); // guarda en localStorage
      navigate('/dashboard', { replace: true }); // replace evita loop de back
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setError(e.response?.data?.message ?? e.message ?? 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex" style={{ background: brand.bg, fontFamily: "'Inter', sans-serif" }}>
      <style>{FONT_IMPORT}</style>

      {/* Panel izquierdo — oculto en mobile */}
      <div
        className="hidden lg:flex lg:w-[40%] relative flex-col justify-between p-12 overflow-hidden"
        style={{ background: brand.dark }}
      >
        {/* watermark decorativo sutil */}
        <div
          aria-hidden
          className="absolute -right-16 -bottom-16 select-none pointer-events-none"
          style={{ color: 'rgba(245,166,35,0.06)' }}
        >
          <Wallet size={320} strokeWidth={0.5} />
        </div>

        <div className="relative z-10">
          <span
            className="text-2xl tracking-tight"
            style={{ color: brand.bg, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }}
          >
            FinTrack
          </span>
        </div>

        <div className="relative z-10 space-y-10">
          <h1
            className="text-[2.35rem] leading-[1.15]"
            style={{ color: brand.bg, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 400 }}
          >
            Cada peso, registrado.
            <br />
            Cada mes, claro.
          </h1>
          <LedgerPreview />
        </div>

        <div className="relative z-10">
          <p className="text-xs" style={{ color: 'rgba(250,249,246,0.35)' }}>
            &copy; {new Date().getFullYear()} FinTrack. Tus finanzas, en orden.
          </p>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-[400px]">
          {/* Wordmark visible solo en mobile */}
          <div className="lg:hidden mb-10">
            <span
              className="text-xl"
              style={{ color: brand.text, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }}
            >
              FinTrack
            </span>
          </div>

          <h2
            className="text-[1.9rem] mb-2"
            style={{ color: brand.text, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }}
          >
            Bienvenido de vuelta
          </h2>
          <p className="text-sm mb-8" style={{ color: brand.textSecondary }}>
            Ingresa para ver el estado de tus finanzas.
          </p>

          {error && (
            <div
              role="alert"
              className="mb-6 rounded-lg px-4 py-3 text-sm animate-[fadeIn_0.2s_ease-out]"
              style={{ background: brand.errorBg, color: '#8a4a24' }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium mb-1.5"
                style={{ color: brand.text }}
              >
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                placeholder="tu@email.com"
                className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-all duration-150"
                style={{
                  border: `1px solid ${
                    touched.email && !emailValid ? brand.danger : brand.border
                  }`,
                  color: brand.text,
                  background: '#fff',
                }}
                onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 3px rgba(245,166,35,0.18)`)}
                required
              />
              {touched.email && !emailValid && (
                <p className="mt-1.5 text-xs" style={{ color: brand.danger }}>
                  Ingresa un correo válido.
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-medium" style={{ color: brand.text }}>
                  Contraseña
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  placeholder="••••••••"
                  className="w-full rounded-lg px-4 py-2.5 pr-11 text-sm outline-none transition-all duration-150"
                  style={{
                    border: `1px solid ${
                      touched.password && !passwordValid ? brand.danger : brand.border
                    }`,
                    color: brand.text,
                    background: '#fff',
                  }}
                  onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 3px rgba(245,166,35,0.18)`)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: brand.textSecondary }}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={17} strokeWidth={1.75} /> : <Eye size={17} strokeWidth={1.75} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: brand.dark, color: brand.bg }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.background = brand.darkHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = brand.dark;
              }}
            >
              {loading ? (
                <>
                  <span
                    className="h-3.5 w-3.5 rounded-full border-2 animate-spin"
                    style={{ borderColor: 'rgba(250,249,246,0.3)', borderTopColor: brand.bg }}
                  />
                  Ingresando...
                </>
              ) : (
                <>
                  Ingresar
                  <ArrowRight size={16} strokeWidth={2} />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm" style={{ color: brand.textSecondary }}>
            ¿No tienes cuenta?{' '}
            <Link
              to="/register"
              className="font-medium transition-colors"
              style={{ color: brand.accent }}
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}