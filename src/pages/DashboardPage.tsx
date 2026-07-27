import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };
  return (
    <div className="min-h-screen bg-slate-100">
      <header
        className="bg-white border-b border-slate-200 px-6 py-4
 flex items-center justify-between"
      >
        <h1 className="text-xl font-bold text-slate-800">TaskFlow</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600">
            Hola, <strong>{user?.name}</strong>
          </span>
          <button
            onClick={handleLogout}
            className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700
 px-3 py-1.5 rounded-lg transition"
          >
            Cerrar sesión
          </button>
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p6">
          <h2 className="text-lg font-semibold text-slate-800 mb-2">
            ¡Bienvenido, {user?.name}! 🎉
          </h2>
          <p className="text-slate-500 text-sm mb-4">
            Sesión activa como <strong>{user?.email}</strong>
          </p>
          <div
            className="bg-emerald-50 border border-emerald-200 rounded-lg p-4
 text-emerald-800 text-sm"
          >
            ✅ Token guardado en localStorage. Recarga la página — la sesión
            persiste.
          </div>
        </div>
      </main>
    </div>
  );
}
