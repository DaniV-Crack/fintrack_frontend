import { Link } from 'react-router-dom';
import { House, Wallet } from 'lucide-react';
import { brand, FONT_IMPORT } from '../lib/theme';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: brand.bg, fontFamily: "'Inter', sans-serif" }}>
      <style>{FONT_IMPORT}</style>

      <div
        className="rounded-full p-6 mb-6"
        style={{ background: brand.bg }}
      >
        <Wallet size={48} style={{ color: brand.border }} strokeWidth={1} />
      </div>

      <h1
        className="text-7xl font-light mb-2"
        style={{ color: brand.text, fontFamily: "'Space Grotesk', sans-serif" }}
      >
        404
      </h1>

      <p className="text-sm mb-8" style={{ color: brand.textSecondary }}>
        Esta página no existe.
      </p>

      <Link
        to="/dashboard"
        className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors duration-150"
        style={{ background: brand.dark, color: brand.bg }}
        onMouseEnter={(e) => (e.currentTarget.style.background = brand.darkHover)}
        onMouseLeave={(e) => (e.currentTarget.style.background = brand.dark)}
      >
        <House size={16} />
        Volver al inicio
      </Link>
    </div>
  );
}
