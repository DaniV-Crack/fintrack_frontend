import { useState, type FormEvent } from 'react';
import type { Category, Transaction, UpdateTransactionDto } from '../../types';
import { brand } from '../../lib/theme';

interface EditTransactionModalProps {
  transaction: Transaction;
  categories: Category[];
  onSave: (data: UpdateTransactionDto) => Promise<void>;
  onClose: () => void;
  saving?: boolean;
  fieldErrors?: Record<string, string>;
}

export default function EditTransactionModal({
  transaction,
  categories,
  onSave,
  onClose,
  saving,
  fieldErrors,
}: EditTransactionModalProps) {
  const [categoryId, setCategoryId] = useState(transaction.categoryId);
  const [amount, setAmount] = useState(String(transaction.amount));
  const [description, setDescription] = useState(transaction.description ?? '');
  const [transactionDate, setTransactionDate] = useState(transaction.transactionDate.split('T')[0] ?? '');

  const filteredCategories = categories.filter((c) => c.type === transaction.type);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSave({
      categoryId: categoryId || undefined,
      amount: parseFloat(amount) || undefined,
      description: description || undefined,
      transactionDate: transactionDate ? new Date(transactionDate).toISOString() : undefined,
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
          Editar transacción
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
            >
              <option value="">Sin cambios</option>
              {filteredCategories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
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
              disabled={saving}
              className="rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150 disabled:opacity-60"
              style={{ background: brand.dark, color: brand.bg }}
              onMouseEnter={(e) => {
                if (!saving) e.currentTarget.style.background = brand.darkHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = brand.dark;
              }}
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
