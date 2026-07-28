import { useState, type FormEvent } from 'react';
import type { Category, CreateBudgetDto } from '../../types';
import { brand } from '../../lib/theme';

interface CreateBudgetModalProps {
  categories: Category[];
  onSave: (data: CreateBudgetDto) => Promise<void>;
  onClose: () => void;
  saving?: boolean;
  fieldErrors?: Record<string, string>;
}

export default function CreateBudgetModal({
  categories,
  onSave,
  onClose,
  saving,
  fieldErrors,
}: CreateBudgetModalProps) {
  const now = new Date();
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const expenseCategories = categories.filter((c) => c.type === 'EXPENSE');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSave({
      categoryId,
      amount: parseFloat(amount) || 0,
      month,
      year,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className="relative rounded-xl border p-6 w-full max-w-md mx-4 shadow-xl"
        style={{ background: '#fff', borderColor: brand.border }}
      >
        <h3 className="text-lg font-medium mb-5" style={{ color: brand.text }}>
          Nuevo presupuesto
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: brand.text }}>
              Categoría
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-lg px-4 py-2.5 text-sm outline-none"
              style={{
                border: `1px solid ${fieldErrors?.categoryId ? brand.danger : brand.border}`,
                color: brand.text,
                background: '#fff',
              }}
              required
            >
              <option value="">Seleccionar categoría</option>
              {expenseCategories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {fieldErrors?.categoryId && (
              <p className="mt-1 text-xs" style={{ color: brand.danger }}>{fieldErrors.categoryId}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: brand.text }}>
              Monto límite
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-lg px-4 py-2.5 text-sm outline-none"
              style={{
                border: `1px solid ${fieldErrors?.amount ? brand.danger : brand.border}`,
                color: brand.text,
                background: '#fff',
                fontFamily: "'JetBrains Mono', monospace",
              }}
              onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 3px rgba(245,166,35,0.18)`)}
              placeholder="500.00"
              required
            />
            {fieldErrors?.amount && (
              <p className="mt-1 text-xs" style={{ color: brand.danger }}>{fieldErrors.amount}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: brand.text }}>
                Mes
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-full rounded-lg px-4 py-2.5 text-sm outline-none"
                style={{ border: `1px solid ${brand.border}`, color: brand.text, background: '#fff' }}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dec'][m - 1]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: brand.text }}>
                Año
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full rounded-lg px-4 py-2.5 text-sm outline-none"
                style={{ border: `1px solid ${brand.border}`, color: brand.text, background: '#fff' }}
                min={2024}
                max={2035}
              />
            </div>
          </div>

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
              disabled={saving || !amount || !categoryId}
              className="rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150 disabled:opacity-60"
              style={{ background: brand.dark, color: brand.bg }}
              onMouseEnter={(e) => {
                if (!saving) e.currentTarget.style.background = brand.darkHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = brand.dark;
              }}
            >
              {saving ? 'Guardando...' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
