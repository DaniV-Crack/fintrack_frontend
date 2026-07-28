import { brand } from '../../lib/theme';

interface ConfirmDeleteModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmDeleteModal({ title, message, onConfirm, onCancel, loading }: ConfirmDeleteModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div
        className="relative rounded-xl border p-6 w-full max-w-md mx-4 shadow-xl"
        style={{ background: '#fff', borderColor: brand.border }}
      >
        <h3 className="text-lg font-medium mb-2" style={{ color: brand.text }}>
          {title}
        </h3>
        <p className="text-sm mb-6" style={{ color: brand.textSecondary }}>
          {message}
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150"
            style={{ color: brand.textSecondary, background: brand.bg }}
            onMouseEnter={(e) => (e.currentTarget.style.background = brand.border)}
            onMouseLeave={(e) => (e.currentTarget.style.background = brand.bg)}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150 disabled:opacity-60"
            style={{ background: brand.danger, color: '#fff' }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.background = '#d95a3a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = brand.danger;
            }}
          >
            {loading ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}
