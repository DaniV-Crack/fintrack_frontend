import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Tags } from 'lucide-react';
import type { Category, TransactionType } from '../types';
import { categoriesService } from '../api/categories.service';
import { brand } from '../lib/theme';
import { CategoryBadge } from '../components/ui/CategoryBadge';
import CreateCategoryModal from '../components/modals/CreateCategoryModal';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterType, setFilterType] = useState<'ALL' | TransactionType>('ALL');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState<'create' | 'edit' | null>(null);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    try {
      const data = await categoriesService.getAll();
      setCategories(data);
    } catch {
      // error handled silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = filterType === 'ALL' ? categories : categories.filter((c) => c.type === filterType);

  const handleSave = async (data: { name: string; type: TransactionType }) => {
    setSaving(true);
    setFieldErrors({});
    try {
      if (modalOpen === 'create') {
        await categoriesService.create(data);
      } else if (editing) {
        await categoriesService.update(editing.id, data);
      }
      setModalOpen(null);
      setEditing(null);
      await load();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { data?: { fields?: Record<string, string> }; message?: string } } };
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
      await categoriesService.remove(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } catch {
      // error handled silently
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium" style={{ color: brand.text, fontFamily: "'Space Grotesk', sans-serif" }}>
            Categorías
          </h2>
          <p className="text-sm" style={{ color: brand.textSecondary }}>
            Administrá las categorías de ingresos y gastos.
          </p>
        </div>
        <button
          onClick={() => { setEditing(null); setModalOpen('create'); setFieldErrors({}); }}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150"
          style={{ background: brand.dark, color: brand.bg }}
          onMouseEnter={(e) => (e.currentTarget.style.background = brand.darkHover)}
          onMouseLeave={(e) => (e.currentTarget.style.background = brand.dark)}
        >
          <Plus size={16} />
          Nueva categoría
        </button>
      </div>

      <div className="flex gap-2 mb-5">
        {(['ALL', 'INCOME', 'EXPENSE'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilterType(f)}
            className="rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors duration-150"
            style={{
              background: filterType === f ? brand.dark : brand.bg,
              color: filterType === f ? brand.bg : brand.textSecondary,
              border: `1px solid ${filterType === f ? brand.dark : brand.border}`,
            }}
          >
            {f === 'ALL' ? 'Todas' : f === 'INCOME' ? 'Ingresos' : 'Gastos'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <span className="h-6 w-6 rounded-full border-2 animate-spin" style={{ borderColor: brand.border, borderTopColor: brand.accent }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Tags size={40} style={{ color: brand.border }} strokeWidth={1} />
          <p className="mt-4 text-sm font-medium" style={{ color: brand.text }}>
            {filterType === 'ALL' ? 'No hay categorías todavía' : 'No hay categorías de este tipo'}
          </p>
          <p className="text-xs mt-1" style={{ color: brand.textSecondary }}>
            Creá una para empezar a organizar tus transacciones.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: brand.border }}>
          <table className="w-full" style={{ background: '#fff' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${brand.border}` }}>
                <th className="text-left px-5 py-3.5 text-xs font-medium uppercase tracking-wider" style={{ color: brand.textSecondary }}>
                  Nombre
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-medium uppercase tracking-wider" style={{ color: brand.textSecondary }}>
                  Tipo
                </th>
                <th className="text-right px-5 py-3.5 text-xs font-medium uppercase tracking-wider" style={{ color: brand.textSecondary }}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((cat) => (
                <tr key={cat.id} style={{ borderBottom: `1px solid ${brand.border}` }}>
                  <td className="px-5 py-4 text-sm font-medium" style={{ color: brand.text }}>
                    {cat.name}
                  </td>
                  <td className="px-5 py-4">
                    <CategoryBadge type={cat.type} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => { setEditing(cat); setModalOpen('edit'); setFieldErrors({}); }}
                        className="p-1.5 rounded-lg transition-colors duration-150"
                        style={{ color: brand.textSecondary }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = brand.bg)}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        aria-label="Editar"
                      >
                        <Pencil size={15} strokeWidth={1.75} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(cat)}
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
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <CreateCategoryModal
          mode={modalOpen}
          initialValues={editing ?? undefined}
          onSave={handleSave}
          onClose={() => { setModalOpen(null); setEditing(null); setFieldErrors({}); }}
          saving={saving}
          fieldErrors={fieldErrors}
        />
      )}

      {deleteTarget && (
        <ConfirmDeleteModal
          title="Eliminar categoría"
          message={`¿Estás seguro de eliminar "${deleteTarget.name}"? Las transacciones asociadas podrían verse afectadas.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </>
  );
}
