import { useState, type FormEvent, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Check, PiggyBank } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../api/auth.service';

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

const benefits = [
  'Registra ingresos y gastos en segundos',
  'Organiza todo por categoría',
  'Define presupuestos y recibe alertas',
];

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (password.length === 0) return { score: 0, label: '', color: brand.border };
  if (score <= 1) return { score: 1, label: 'Débil', color: brand.danger };
  if (score <= 3) return { score: 2, label: 'Aceptable', color: brand.accent };
  return { score: 3, label: 'Fuerte', color: brand.success };
}

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<{ name?: boolean; email?: boolean; password?: boolean }>({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const requirements = [
    { label: 'Al menos 6 caracteres', met: password.length >= 6 },
    { label: 'Una letra mayúscula', met: /[A-Z]/.test(password) },
    { label: 'Un número', met: /[0-9]/.test(password) },
  ];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { token, user } = await authService.register({ name, email, password });
      login(token, user); // autentica inmediatamente
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setError(e.response?.data?.message ?? e.message ?? 'Error al registrarse');
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
        <div
          aria-hidden
          className="absolute -left-20 -top-20 select-none pointer-events-none"
          style={{ color: 'rgba(245,166,35,0.06)' }}
        >
          <PiggyBank size={300} strokeWidth={0.5} />
        </div>

        <div className="relative z-10">
          <span
            className="text-2xl tracking-tight"
            style={{ color: brand.bg, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }}
          >
            FinTrack
          </span>
        </div>

        <div className="relative z-10 space-y-9">
          <h1
            className="text-[2.35rem] leading-[1.15]"
            style={{ color: brand.bg, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 400 }}
          >
            Empieza tu libro
            <br />
            mayor personal.
          </h1>

          <ul className="space-y-4">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                  style={{ background: 'rgba(245,166,35,0.15)' }}
                >
                  <Check size={12} style={{ color: brand.accent }} strokeWidth={2.5} />
                </span>
                <span className="text-sm" style={{ color: 'rgba(250,249,246,0.85)' }}>
                  {b}
                </span>
              </li>
            ))}
          </ul>
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
            Crea tu cuenta
          </h2>
          <p className="text-sm mb-8" style={{ color: brand.textSecondary }}>
            Toma un minuto, y ya puedes registrar tu primer gasto.
          </p>

          {error && (
            <div
              role="alert"
              className="mb-6 rounded-lg px-4 py-3 text-sm"
              style={{ background: brand.errorBg, color: '#8a4a24' }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="name" className="block text-xs font-medium mb-1.5" style={{ color: brand.text }}>
                Nombre completo
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                placeholder="Juan Pérez"
                className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-all duration-150"
                style={{ border: `1px solid ${brand.border}`, color: brand.text, background: '#fff' }}
                onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 3px rgba(245,166,35,0.18)`)}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-medium mb-1.5" style={{ color: brand.text }}>
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
                  border: `1px solid ${touched.email && !emailValid ? brand.danger : brand.border}`,
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
              <label htmlFor="password" className="block text-xs font-medium mb-1.5" style={{ color: brand.text }}>
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full rounded-lg px-4 py-2.5 pr-11 text-sm outline-none transition-all duration-150"
                  style={{
                    border: `1px solid ${
                      touched.password && password.length < 6 ? brand.danger : brand.border
                    }`,
                    color: brand.text,
                    background: '#fff',
                  }}
                  onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 3px rgba(245,166,35,0.18)`)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: brand.textSecondary }}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={17} strokeWidth={1.75} /> : <Eye size={17} strokeWidth={1.75} />}
                </button>
              </div>

              {/* Indicador de fortaleza */}
              {password.length > 0 && (
                <div className="mt-2.5">
                  <div className="flex gap-1.5 mb-1.5">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-colors duration-200"
                        style={{ background: i < strength.score ? strength.color : brand.border }}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-medium" style={{ color: strength.color }}>
                    {strength.label}
                  </span>
                </div>
              )}

              {/* Requisitos */}
              <ul className="mt-3 space-y-1.5">
                {requirements.map((r) => (
                  <li key={r.label} className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full transition-colors duration-150"
                      style={{ background: r.met ? 'rgba(46,189,115,0.18)' : brand.border }}
                    >
                      {r.met && <Check size={9} style={{ color: brand.success }} strokeWidth={3} />}
                    </span>
                    <span style={{ color: r.met ? brand.text : brand.textSecondary }}>{r.label}</span>
                  </li>
                ))}
              </ul>
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
                  Creando cuenta...
                </>
              ) : (
                <>
                  Crear cuenta
                  <ArrowRight size={16} strokeWidth={2} />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm" style={{ color: brand.textSecondary }}>
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-medium" style={{ color: brand.accent }}>
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}