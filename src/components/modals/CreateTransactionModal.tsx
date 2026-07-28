import { useState, type FormEvent } from 'react';
import type { Category, CreateTransactionDto, TransactionType } from '../../types';
import { brand } from '../../lib/theme';

interface CreateTransactionModalProps {
  categories: Category[];
  onSave: (data: CreateTransactionDto) => Promise<void>;
  onClose: () => void;
  saving?: boolean;
  fieldErrors?: Record<string, string>;
}

export default function CreateTransactionModal({
  categories,
  onSave,
  onClose,
  saving,
  fieldErrors,
}: CreateTransactionModalProps) {
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0] ?? '');

  const filteredCategories = categories.filter((c) => c.type === type);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSave({
      categoryId,
      amount: parseFloat(amount) || 0,
      type,
      description: description || undefined,
      transactionDate: new Date(transactionDate ?? new Date().toISOString().split('T')[0]).toISOString(),
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
          Nueva transacción
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: brand.text }}>
              Tipo
            </label>
            <div className="flex gap-2">
              {(['EXPENSE', 'INCOME'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => { setType(t); setCategoryId(''); }}
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
              {filteredCategories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {fieldErrors?.categoryId && (
              <p className="mt-1 text-xs" style={{ color: brand.danger }}>{fieldErrors.categoryId}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: brand.text }}>
              Monto
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
              placeholder="150.00"
              required
            />
            {fieldErrors?.amount && (
              <p className="mt-1 text-xs" style={{ color: brand.danger }}>{fieldErrors.amount}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: brand.text }}>
              Descripción (opcional)
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg px-4 py-2.5 text-sm outline-none"
              style={{ border: `1px solid ${brand.border}`, color: brand.text, background: '#fff' }}
              onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 3px rgba(245,166,35,0.18)`)}
              placeholder="Supermercado mensual"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: brand.text }}>
              Fecha
            </label>
            <input
              type="date"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              className="w-full rounded-lg px-4 py-2.5 text-sm outline-none"
              style={{
                border: `1px solid ${fieldErrors?.transactionDate ? brand.danger : brand.border}`,
                color: brand.text,
                background: '#fff',
              }}
              required
            />
            {fieldErrors?.transactionDate && (
              <p className="mt-1 text-xs" style={{ color: brand.danger }}>{fieldErrors.transactionDate}</p>
            )}
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
