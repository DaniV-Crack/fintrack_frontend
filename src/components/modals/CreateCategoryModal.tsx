import { useState, type FormEvent } from 'react';
import type { Category, TransactionType } from '../../types';
import { brand } from '../../lib/theme';

interface CreateCategoryModalProps {
  mode: 'create' | 'edit';
  initialValues?: Category;
  onSave: (data: { name: string; type: TransactionType }) => Promise<void>;
  onClose: () => void;
  saving?: boolean;
  fieldErrors?: Record<string, string>;
}

export default function CreateCategoryModal({
  mode,
  initialValues,
  onSave,
  onClose,
  saving,
  fieldErrors,
}: CreateCategoryModalProps) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [type, setType] = useState<TransactionType>(initialValues?.type ?? 'EXPENSE');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSave({ name, type });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className="relative rounded-xl border p-6 w-full max-w-md mx-4 shadow-xl"
        style={{ background: '#fff', borderColor: brand.border }}
      >
        <h3 className="text-lg font-medium mb-5" style={{ color: brand.text }}>
          {mode === 'create' ? 'Nueva categoría' : 'Editar categoría'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: brand.text }}>
              Nombre
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
              placeholder="Ej: Comida, Salario..."
              required
            />
            {fieldErrors?.name && (
              <p className="mt-1 text-xs" style={{ color: brand.danger }}>{fieldErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: brand.text }}>
              Tipo
            </label>
            <div className="flex gap-2">
              {(['EXPENSE', 'INCOME'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className="flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-150"
                  style={{
                    background: type === t ? brand.dark : brand.bg,
                    color: type === t ? brand.bg : brand.textSecondary,
                    border: `1px solid ${type === t ? brand.dark : brand.border}`,
                  }}
                >
                  {t === 'INCOME' ? 'Ingreso' : 'Gasto'}
                </button>
              ))}
            </div>
          </div>

          {fieldErrors?.type && (
            <p className="text-xs" style={{ color: brand.danger }}>{fieldErrors.type}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150"
              style={{ color: brand.textSecondary, background: brand.bg }}
              onMouseEnter={(e) => (e.currentTarget.style.background = brand.border)}
              onMouseLeave={(e) => (e.currentTarget.style.background = brand.bg)}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150 disabled:opacity-60"
              style={{ background: brand.dark, color: brand.bg }}
              onMouseEnter={(e) => {
                if (!saving) e.currentTarget.style.background = brand.darkHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = brand.dark;
              }}
            >
              {saving ? 'Guardando...' : mode === 'create' ? 'Crear' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
