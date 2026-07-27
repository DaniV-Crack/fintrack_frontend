import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authService } from "../api/auth.service";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { token, user } = await authService.register({
        name,
        email,
        password,
      });
      login(token, user); // autentica inmediatamente
      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      const e = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setError(
        e.response?.data?.message ?? e.message ?? "Error al registrarse",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className="min-h-screen bg-slate-50 flex items-center justify-center
px-4"
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-14 h-14
 bg-emerald-600 rounded-xl mb-4"
          >
            <span className="text-white text-2xl">+</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Crear cuenta</h1>
          <p className="text-slate-500 text-sm mt-1">Únete a TaskFlow hoy</p>
        </div>
        {error && (
          <div
            className="bg-red-50 border border-red-200 text-red-700
 text-sm rounded-lg p-3 mb-5"
          >
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Nombre completo
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Juan Pérez"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5
 text-sm placeholder-slate-400
 focus:outline-none focus:ring-2 focus:ring-emerald-500
 focus:border-transparent transition"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5
 text-sm placeholder-slate-400
 focus:outline-none focus:ring-2 focus:ring-emerald-500
 focus:border-transparent transition"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5
 text-sm placeholder-slate-400
 focus:outline-none focus:ring-2 focus:ring-emerald-500
 focus:border-transparent transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700
disabled:opacity-60
 disabled:cursor-not-allowed text-white font-semibold
 py-2.5 rounded-lg transition text-sm"
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>
        <p className="text-center text-sm text-slate-500 mt-6">
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/login"
            className="text-emerald-600 font-medium
hover:underline"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
