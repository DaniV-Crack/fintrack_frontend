import { useCallback, useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, PiggyBank, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Budget, BudgetProgress, Category, CreateBudgetDto } from '../types';
import { budgetsService } from '../api/budgets.service';
import { categoriesService } from '../api/categories.service';
import { brand } from '../lib/theme';
import { formatBs } from '../lib/format';
import { ProgressBar } from '../components/ui/ProgressBar';
import CreateBudgetModal from '../components/modals/CreateBudgetModal';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';

export default function BudgetsPage() {
  const now = new Date();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, BudgetProgress>>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [loading, setLoading] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Budget | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const loadCategories = useCallback(async () => {
    try {
      setCategories(await categoriesService.getAll());
    } catch {
      // ignore
    }
  }, []);

  const loadBudgets = useCallback(async () => {
    setLoading(true);
    try {
      const data = await budgetsService.getAll(month, year);
      setBudgets(data);

      const progress: Record<string, BudgetProgress> = {};
      if (data.length > 0) {
        const results = await Promise.allSettled(data.map((b) => budgetsService.getProgress(b.id)));
        results.forEach((r, i) => {
          const budget = data[i];
          if (r.status === 'fulfilled' && budget) {
            progress[budget.id] = r.value;
          }
        });
      }
      setProgressMap(progress);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadBudgets();
  }, [loadBudgets]);

  const handleCreate = async (dto: CreateBudgetDto) => {
    setSaving(true);
    setFieldErrors({});
    try {
      await budgetsService.create(dto);
      setShowCreate(false);
      await loadBudgets();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { data?: { fields?: Record<string, string> } } } };
      if (e.response?.data?.data?.fields) {
        setFieldErrors(e.response.data.data.fields);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingBudget) return;
    setSaving(true);
    setFieldErrors({});
    try {
      await budgetsService.update(editingBudget.id, { amount: parseFloat(editAmount) });
      setEditingBudget(null);
      await loadBudgets();
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
      await budgetsService.remove(deleteTarget.id);
      setDeleteTarget(null);
      await loadBudgets();
    } catch {
      // ignore
    } finally {
      setDeleting(false);
    }
  };

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(year - 1); }
    else { setMonth(month - 1); }
  };

  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(year + 1); }
    else { setMonth(month + 1); }
  };

  const monthLabel = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dec'][month - 1];

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium" style={{ color: brand.text, fontFamily: "'Space Grotesk', sans-serif" }}>
            Presupuestos
          </h2>
          <p className="text-sm" style={{ color: brand.textSecondary }}>
            Definí límites de gasto mensuales por categoría.
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
          Nuevo presupuesto
        </button>
      </div>

      {/* Selector de mes/año */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={prevMonth}
          className="p-1.5 rounded-lg transition-colors duration-150"
          style={{ color: brand.textSecondary }}
          onMouseEnter={(e) => (e.currentTarget.style.background = brand.bg)}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-base font-medium min-w-[120px] text-center" style={{ color: brand.text, fontFamily: "'Space Grotesk', sans-serif" }}>
          {monthLabel} {year}
        </span>
        <button
          onClick={nextMonth}
          className="p-1.5 rounded-lg transition-colors duration-150"
          style={{ color: brand.textSecondary }}
          onMouseEnter={(e) => (e.currentTarget.style.background = brand.bg)}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <span className="h-6 w-6 rounded-full border-2 animate-spin" style={{ borderColor: brand.border, borderTopColor: brand.accent }} />
        </div>
      ) : budgets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <PiggyBank size={40} style={{ color: brand.border }} strokeWidth={1} />
          <p className="mt-4 text-sm font-medium" style={{ color: brand.text }}>
            No hay presupuestos para {monthLabel} {year}
          </p>
          <p className="text-xs mt-1" style={{ color: brand.textSecondary }}>
            Creá uno para controlar tus gastos del mes.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {budgets.map((budget) => {
            const prog = progressMap[budget.id];
            const percentage = prog?.percentage ?? 0;
            const spent = prog?.spent ?? 0;
            const remaining = prog?.remaining ?? 0;
            const isExceeded = percentage >= 100;

            return (
              <div
                key={budget.id}
                className="rounded-xl border p-5"
                style={{ borderColor: brand.border, background: '#fff' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-sm font-medium" style={{ color: brand.text }}>
                      {budget.category?.name ?? 'Sin categoría'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { setEditingBudget(budget); setEditAmount(String(budget.amount)); setFieldErrors({}); }}
                      className="p-1.5 rounded-lg transition-colors duration-150"
                      style={{ color: brand.textSecondary }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = brand.bg)}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      aria-label="Editar"
                    >
                      <Pencil size={14} strokeWidth={1.75} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(budget)}
                      className="p-1.5 rounded-lg transition-colors duration-150"
                      style={{ color: brand.danger }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = brand.errorBg)}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      aria-label="Eliminar"
                    >
                      <Trash2 size={14} strokeWidth={1.75} />
                    </button>
                  </div>
                </div>

                <div className="flex items-end justify-between mb-3">
                  <span
                    className="text-lg tabular-nums"
                    style={{ fontFamily: "'JetBrains Mono', monospace", color: brand.text, fontWeight: 500 }}
                  >
                    {formatBs(budget.amount)}
                  </span>
                  <span className="text-xs" style={{ color: isExceeded ? brand.danger : brand.textSecondary }}>
                    {percentage.toFixed(0)}% usado
                  </span>
                </div>

                <ProgressBar percentage={percentage} height={8} />

                <div className="flex justify-between mt-2">
                  <span className="text-xs" style={{ color: brand.textSecondary }}>
                    Gastado: {formatBs(spent)}
                  </span>
                  <span className="text-xs" style={{ color: isExceeded ? brand.danger : brand.success }}>
                    {isExceeded ? `Exceso: ${formatBs(-remaining)}` : `Restan: ${formatBs(remaining)}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal editar monto inline */}
      {editingBudget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setEditingBudget(null)} />
          <div
            className="relative rounded-xl border p-6 w-full max-w-sm mx-4 shadow-xl"
            style={{ background: '#fff', borderColor: brand.border }}
          >
            <h3 className="text-lg font-medium mb-5" style={{ color: brand.text }}>
              Editar presupuesto
            </h3>
            <p className="text-xs mb-4" style={{ color: brand.textSecondary }}>
              {editingBudget.category?.name} &middot; {monthLabel} {year}
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: brand.text }}>
                  Nuevo monto límite
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="w-full rounded-lg px-4 py-2.5 text-sm outline-none"
                  style={{
                    border: `1px solid ${fieldErrors?.amount ? brand.danger : brand.border}`,
                    color: brand.text,
                    background: '#fff',
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                  onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 3px rgba(245,166,35,0.18)`)}
                  autoFocus
                />
                {fieldErrors?.amount && (
                  <p className="mt-1 text-xs" style={{ color: brand.danger }}>{fieldErrors.amount}</p>
                )}
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setEditingBudget(null)}
                  disabled={saving}
                  className="rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150"
                  style={{ color: brand.textSecondary, background: brand.bg }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = brand.border)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = brand.bg)}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={saving || !editAmount}
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
            </div>
          </div>
        </div>
      )}

      {showCreate && (
        <CreateBudgetModal
          categories={categories}
          onSave={handleCreate}
          onClose={() => setShowCreate(false)}
          saving={saving}
          fieldErrors={fieldErrors}
        />
      )}

      {deleteTarget && (
        <ConfirmDeleteModal
          title="Eliminar presupuesto"
          message={`¿Estás seguro de eliminar el presupuesto de "${deleteTarget.category?.name}" para ${monthLabel} ${year}?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </>
  );
}
