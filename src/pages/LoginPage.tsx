import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authService } from "../api/auth.service";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // authService.login() ya devuelve { token, user } directamente
      const { token, user } = await authService.login({ email, password });
      login(token, user); // guarda en localStorage
      navigate("/dashboard", { replace: true }); // replace evita loop de back
    } catch (err: unknown) {
      const e = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setError(
        e.response?.data?.message ?? e.message ?? "Error al iniciar sesión",
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
 bg-blue-600 rounded-xl mb-4"
          >
            <span className="text-white text-2xl">✓</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Iniciar sesión</h1>
          <p className="text-slate-500 text-sm mt-1">
            Accede a tu cuenta TaskFlow
          </p>
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
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5
 text-sm placeholder-slate-400
 focus:outline-none focus:ring-2 focus:ring-blue-500
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
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5
 text-sm placeholder-slate-400
 focus:outline-none focus:ring-2 focus:ring-blue-500
 focus:border-transparent transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60
 disabled:cursor-not-allowed text-white font-semibold
 py-2.5 rounded-lg transition text-sm"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
        <p className="text-center text-sm text-slate-500 mt-6">
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-medium
hover:underline"
          >
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
