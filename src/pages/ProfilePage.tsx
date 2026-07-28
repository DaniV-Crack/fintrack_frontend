import { useState, type FormEvent } from 'react';
import { User, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../api/user.service';
import { brand } from '../lib/theme';

export default function ProfilePage() {
  const { user, token, login } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setFieldErrors({});
    setSaving(true);
    try {
      const updatedUser = await userService.update(user!.id, {
        name: name !== user?.name ? name : undefined,
        email: email !== user?.email ? email : undefined,
        password: password || undefined,
      });
      login(token!, updatedUser);
      setSuccess('Perfil actualizado correctamente.');
      setPassword('');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { data?: { fields?: Record<string, string> }; message?: string } } };
      if (e.response?.data?.data?.fields) {
        setFieldErrors(e.response.data.data.fields);
      } else {
        const msg = (e as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message
          ?? (e as { message?: string }).message
          ?? 'Error al actualizar el perfil';
        setError(msg);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-medium" style={{ color: brand.text, fontFamily: "'Space Grotesk', sans-serif" }}>
          Perfil
        </h2>
        <p className="text-sm" style={{ color: brand.textSecondary }}>
          Actualizá tus datos personales.
        </p>
      </div>

      <div
        className="rounded-xl border p-6 max-w-lg"
        style={{ borderColor: brand.border, background: '#fff' }}
      >
        <div className="flex items-center gap-4 mb-6 pb-5 border-b" style={{ borderColor: brand.border }}>
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-semibold"
            style={{ background: brand.dark, color: brand.bg }}
          >
            {user?.name?.charAt(0).toUpperCase() ?? '?'}
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: brand.text }}>{user?.name}</p>
            <p className="text-xs" style={{ color: brand.textSecondary }}>{user?.email}</p>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-lg px-4 py-3 text-sm" style={{ background: brand.errorBg, color: '#8a4a24' }}>
            {error}
          </div>
        )}
        {success && (
          <div className="mb-5 rounded-lg px-4 py-3 text-sm" style={{ background: 'rgba(46,189,115,0.12)', color: brand.success }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: brand.text }}>
              Nombre completo
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg px-4 py-2.5 text-sm outline-none"
              style={{
                border: `1px solid ${fieldErrors?.name ? brand.danger : brand.border}`,
                color: brand.text,
                background: '#fff',
              }}
              onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 3px rgba(245,166,35,0.18)`)}
            />
            {fieldErrors?.name && (
              <p className="mt-1 text-xs" style={{ color: brand.danger }}>{fieldErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: brand.text }}>
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg px-4 py-2.5 text-sm outline-none"
              style={{
                border: `1px solid ${fieldErrors?.email ? brand.danger : brand.border}`,
                color: brand.text,
                background: '#fff',
              }}
              onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 3px rgba(245,166,35,0.18)`)}
            />
            {fieldErrors?.email && (
              <p className="mt-1 text-xs" style={{ color: brand.danger }}>{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: brand.text }}>
              Nueva contraseña (dejar vacío si no querés cambiarla)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg px-4 py-2.5 text-sm outline-none"
              style={{
                border: `1px solid ${fieldErrors?.password ? brand.danger : brand.border}`,
                color: brand.text,
                background: '#fff',
              }}
              onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 3px rgba(245,166,35,0.18)`)}
              placeholder="Mínimo 6 caracteres"
            />
            {fieldErrors?.password && (
              <p className="mt-1 text-xs" style={{ color: brand.danger }}>{fieldErrors.password}</p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors duration-150 disabled:opacity-60"
              style={{ background: brand.dark, color: brand.bg }}
              onMouseEnter={(e) => {
                if (!saving) e.currentTarget.style.background = brand.darkHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = brand.dark;
              }}
            >
              <Save size={15} strokeWidth={1.75} />
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-5 border-t" style={{ borderColor: brand.border }}>
          <p className="text-xs" style={{ color: brand.textSecondary }}>
            <User size={12} style={{ display: 'inline', marginRight: 4 }} strokeWidth={1.5} />
            ID de usuario: {user?.id}
          </p>
        </div>
      </div>
    </>
  );
}
