import { useCallback, useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight, ArrowLeftRight } from 'lucide-react';
import type { Transaction, TransactionFilters, Category, CreateTransactionDto, UpdateTransactionDto } from '../types';
import { transactionsService } from '../api/transactions.service';
import { categoriesService } from '../api/categories.service';
import { brand } from '../lib/theme';
import { formatBs, formatDate } from '../lib/format';
import { CategoryBadge } from '../components/ui/CategoryBadge';
import CreateTransactionModal from '../components/modals/CreateTransactionModal';
import EditTransactionModal from '../components/modals/EditTransactionModal';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';

export default function TransactionsPage() {
  const [data, setData] = useState<{
    items: Transaction[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }>({ items: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } });
  const [filters, setFilters] = useState<TransactionFilters>({ page: 1, limit: 20 });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const loadCategories = useCallback(async () => {
    try {
      const cats = await categoriesService.getAll();
      setCategories(cats);
    } catch {
      // ignore
    }
  }, []);

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const result = await transactionsService.getAll(filters);
      setData(result);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const updateFilter = (patch: Partial<TransactionFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch, page: 'page' in patch ? prev.page : 1 }));
  };

  const handleCreate = async (dto: CreateTransactionDto) => {
    setSaving(true);
    setFieldErrors({});
    try {
      await transactionsService.create(dto);
      setShowCreate(false);
      await loadTransactions();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { data?: { fields?: Record<string, string> } } } };
      if (e.response?.data?.data?.fields) {
        setFieldErrors(e.response.data.data.fields);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (dto: UpdateTransactionDto) => {
    if (!editingTx) return;
    setSaving(true);
    setFieldErrors({});
    try {
      await transactionsService.update(editingTx.id, dto);
      setEditingTx(null);
      await loadTransactions();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { data?: { fields?: Record<string, string> } } } };
      if (e.response?.data?.data?.fields) {
        setFieldErrors(e.response.data.data.fields);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await transactionsService.remove(deleteTarget.id);
      setDeleteTarget(null);
      await loadTransactions();
    } catch {
      // ignore
    } finally {
      setDeleting(false);
    }
  };

  const { items, pagination } = data;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium" style={{ color: brand.text, fontFamily: "'Space Grotesk', sans-serif" }}>
            Transacciones
          </h2>
          <p className="text-sm" style={{ color: brand.textSecondary }}>
            Registrá y administrá tus movimientos financieros.
          </p>
        </div>
        <button
          onClick={() => { setShowCreate(true); setFieldErrors({}); }}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150"
          style={{ background: brand.dark, color: brand.bg }}
          onMouseEnter={(e) => (e.currentTarget.style.background = brand.darkHover)}
          onMouseLeave={(e) => (e.currentTarget.style.background = brand.dark)}
        >
          <Plus size={16} />
          Nueva transacción
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex gap-1">
          {(['ALL', 'INCOME', 'EXPENSE'] as const).map((f) => (
            <button
              key={f}
              onClick={() => updateFilter({ type: f === 'ALL' ? undefined : f })}
              className="rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors duration-150"
              style={{
                background: (f === 'ALL' ? !filters.type : filters.type === f) ? brand.dark : brand.bg,
                color: (f === 'ALL' ? !filters.type : filters.type === f) ? brand.bg : brand.textSecondary,
                border: `1px solid ${(f === 'ALL' ? !filters.type : filters.type === f) ? brand.dark : brand.border}`,
              }}
            >
              {f === 'ALL' ? 'Todas' : f === 'INCOME' ? 'Ingresos' : 'Gastos'}
            </button>
          ))}
        </div>

        <select
          value={filters.categoryId ?? ''}
          onChange={(e) => updateFilter({ categoryId: e.target.value || undefined })}
          className="rounded-lg px-3 py-1.5 text-xs outline-none"
          style={{ border: `1px solid ${brand.border}`, color: brand.text, background: '#fff' }}
        >
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <input
          type="date"
          value={filters.dateFrom ?? ''}
          onChange={(e) => updateFilter({ dateFrom: e.target.value || undefined })}
          className="rounded-lg px-3 py-1.5 text-xs outline-none"
          style={{ border: `1px solid ${brand.border}`, color: brand.text, background: '#fff' }}
          placeholder="Desde"
        />

        <input
          type="date"
          value={filters.dateTo ?? ''}
          onChange={(e) => updateFilter({ dateTo: e.target.value || undefined })}
          className="rounded-lg px-3 py-1.5 text-xs outline-none"
          style={{ border: `1px solid ${brand.border}`, color: brand.text, background: '#fff' }}
          placeholder="Hasta"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <span className="h-6 w-6 rounded-full border-2 animate-spin" style={{ borderColor: brand.border, borderTopColor: brand.accent }} />
        </div>
      ) : (items?.length ?? 0) === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <ArrowLeftRight size={40} style={{ color: brand.border }} strokeWidth={1} />
          <p className="mt-4 text-sm font-medium" style={{ color: brand.text }}>
            No hay transacciones
          </p>
          <p className="text-xs mt-1" style={{ color: brand.textSecondary }}>
            {Object.values(filters).some(Boolean) ? 'Probá ajustando los filtros.' : 'Registrá tu primer movimiento.'}
          </p>
        </div>
      ) : (
        <>
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: brand.border }}>
            <table className="w-full" style={{ background: '#fff' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${brand.border}` }}>
                  <th className="text-left px-5 py-3.5 text-xs font-medium uppercase tracking-wider" style={{ color: brand.textSecondary }}>Fecha</th>
                  <th className="text-left px-5 py-3.5 text-xs font-medium uppercase tracking-wider" style={{ color: brand.textSecondary }}>Categoría</th>
                  <th className="text-left px-5 py-3.5 text-xs font-medium uppercase tracking-wider" style={{ color: brand.textSecondary }}>Tipo</th>
                  <th className="text-left px-5 py-3.5 text-xs font-medium uppercase tracking-wider" style={{ color: brand.textSecondary }}>Descripción</th>
                  <th className="text-right px-5 py-3.5 text-xs font-medium uppercase tracking-wider" style={{ color: brand.textSecondary }}>Monto</th>
                  <th className="text-right px-5 py-3.5 text-xs font-medium uppercase tracking-wider" style={{ color: brand.textSecondary }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items?.map((tx) => {
                  const isIncome = tx.type === 'INCOME';
                  return (
                    <tr key={tx.id} style={{ borderBottom: `1px solid ${brand.border}` }}>
                      <td className="px-5 py-4 text-sm" style={{ color: brand.text }}>
                        {formatDate(tx.transactionDate)}
                      </td>
                      <td className="px-5 py-4 text-sm" style={{ color: brand.text }}>
                        {tx.category?.name ?? '—'}
                      </td>
                      <td className="px-5 py-4">
                        <CategoryBadge type={tx.type} />
                      </td>
                      <td className="px-5 py-4 text-sm" style={{ color: brand.textSecondary }}>
                        {tx.description || '—'}
                      </td>
                      <td className="px-5 py-4 text-sm tabular-nums text-right" style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        color: isIncome ? brand.success : brand.text,
                        fontWeight: 500,
                      }}>
                        {isIncome ? '+' : ''}{formatBs(tx.amount)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => { setEditingTx(tx); setFieldErrors({}); }}
                            className="p-1.5 rounded-lg transition-colors duration-150"
                            style={{ color: brand.textSecondary }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = brand.bg)}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                            aria-label="Editar"
                          >
                            <Pencil size={15} strokeWidth={1.75} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(tx)}
                            className="p-1.5 rounded-lg transition-colors duration-150"
                            style={{ color: brand.danger }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = brand.errorBg)}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                            aria-label="Eliminar"
                          >
                            <Trash2 size={15} strokeWidth={1.75} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {(pagination?.totalPages ?? 0) > 1 && (
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs" style={{ color: brand.textSecondary }}>
                Página {pagination.page} de {pagination.totalPages} ({pagination.total} transacciones)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFilters((p) => ({ ...p, page: Math.max(1, p.page! - 1) }))}
                  disabled={pagination.page <= 1}
                  className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-150 disabled:opacity-40"
                  style={{ border: `1px solid ${brand.border}`, color: brand.text }}
                >
                  <ChevronLeft size={14} />
                  Anterior
                </button>
                <button
                  onClick={() => setFilters((p) => ({ ...p, page: Math.min(pagination.totalPages, p.page! + 1) }))}
                  disabled={pagination.page >= pagination.totalPages}
                  className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-150 disabled:opacity-40"
                  style={{ border: `1px solid ${brand.border}`, color: brand.text }}
                >
                  Siguiente
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {showCreate && (
        <CreateTransactionModal
          categories={categories}
          onSave={handleCreate}
          onClose={() => setShowCreate(false)}
          saving={saving}
          fieldErrors={fieldErrors}
        />
      )}

      {editingTx && (
        <EditTransactionModal
          transaction={editingTx}
          categories={categories}
          onSave={handleUpdate}
          onClose={() => setEditingTx(null)}
          saving={saving}
          fieldErrors={fieldErrors}
        />
      )}

      {deleteTarget && (
        <ConfirmDeleteModal
          title="Eliminar transacción"
          message={`¿Estás seguro de eliminar esta transacción de ${formatBs(deleteTarget.amount)}?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </>
  );
}
