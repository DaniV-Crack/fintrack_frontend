import { Settings } from 'lucide-react';
import { brand } from '../lib/theme';

export default function SettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <Settings size={48} style={{ color: brand.border }} strokeWidth={1} />
      <h2 className="mt-5 text-lg font-medium" style={{ color: brand.text, fontFamily: "'Space Grotesk', sans-serif" }}>
        Configuración
      </h2>
      <p className="mt-2 text-sm" style={{ color: brand.textSecondary }}>
        Esta sección estará disponible próximamente.
      </p>
    </div>
  );
}
