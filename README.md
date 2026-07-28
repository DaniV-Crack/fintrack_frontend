# FinTrack

**SPA de finanzas personales** — Registrá, categorizá y analizá tus ingresos y gastos con una interfaz moderna y responsiva.

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | React 19 |
| Lenguaje | TypeScript 6 (`strict: true`) |
| Bundler | Vite 8 |
| Estilos | Tailwind CSS 4 |
| Routing | React Router 7 (Data Router API) |
| HTTP | Axios con interceptores |
| Charts | Recharts |
| Íconos | Lucide React |

## Requisitos

- Node.js 20+
- npm 10+

## Setup

```bash
# Clonar e instalar
npm install

# Variables de entorno (opcional, por defecto apunta a localhost:3000)
cp .env.example .env
```

### Backend mock (json-server)

```bash
# Instalar globalmente
npm install -g json-server

# Crear db.json con la estructura esperada (ver sección API)
json-server --watch db.json --port 3001
```

Actualizar `VITE_API_URL` en `.env`:

```
VITE_API_URL=http://localhost:3001
```

### Desarrollo

```bash
npm run dev
# → http://localhost:5173
```

### Producción

```bash
npm run build
npm run preview
```

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo (puerto 5173 estricto) |
| `npm run build` | `tsc -b && vite build` |
| `npm run lint` | ESLint 10 flat config |
| `npm run preview` | Preview del build de producción |

## Arquitectura

```
src/
├── api/            # Servicios HTTP (axios instance, auth, transactions, etc.)
├── components/     # UI: layouts, modals, badges
├── context/        # AuthContext (login/logout, persistencia localStorage)
├── hooks/          # useAsyncState (genérico para async calls)
├── lib/            # formateo de moneda/fecha, paleta de colores
├── pages/          # Login, Register, Dashboard, Transactions, Categories, Budgets, Reports, Profile, Settings, 404
├── types/          # Interfaces TypeScript compartidas
├── router.tsx      # Configuración de rutas (createBrowserRouter)
└── main.tsx        # Entrypoint
```

### Enrutamiento

| Ruta | Acceso | Descripción |
|---|---|---|
| `/login` | Público | Inicio de sesión |
| `/register` | Público | Registro de usuario |
| `/dashboard` | Protegido | Resumen con gráficos y cards |
| `/transactions` | Protegido | CRUD completo con filtros y paginación |
| `/categories` | Protegido | CRUD de categorías (ingreso/gasto) |
| `/budgets` | Protegido | Presupuestos mensuales por categoría |
| `/reports` | Protegido | Reportes por período con desglose |
| `/settings` | Protegido | Configuración (placeholder) |
| `/profile` | Protegido | Edición de perfil |
| `*` | — | Página 404 |

### API (contrato esperado)

Todas las respuestas siguen el wrapper `ApiResponse<T>`:

```ts
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
```

**Endpoints requeridos:**

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/login` | Iniciar sesión → `AuthPayload` |
| POST | `/api/auth/register` | Registrarse → `AuthPayload` |
| GET | `/api/transactions` | Lista paginada de transacciones |
| POST | `/api/transactions` | Crear transacción |
| PUT | `/api/transactions/:id` | Actualizar transacción |
| DELETE | `/api/transactions/:id` | Eliminar transacción |
| GET | `/api/transactions/summary` | Resumen por período |
| GET | `/api/categories` | Lista de categorías |
| POST | `/api/categories` | Crear categoría |
| PUT | `/api/categories/:id` | Actualizar categoría |
| DELETE | `/api/categories/:id` | Eliminar categoría |
| GET | `/api/budgets` | Lista de presupuestos |
| POST | `/api/budgets` | Crear presupuesto |
| PUT | `/api/budgets/:id` | Actualizar presupuesto |
| DELETE | `/api/budgets/:id` | Eliminar presupuesto |
| GET | `/api/budgets/:id/progress` | Progreso de presupuesto |
| GET | `/api/dashboard` | Resumen para dashboard |
| GET | `/api/users/:id` | Obtener usuario |
| PUT | `/api/users/:id` | Actualizar usuario |

### Persistencia de sesión

El token JWT y datos del usuario se guardan en `localStorage` bajo las claves `fintrack_token` / `fintrack_user`. Al iniciar la app, se rehidrata la sesión y se valida la expiración del token antes de darlo por válido.

### Manejo de errores

El interceptor de Axios normaliza todos los errores a:

```ts
interface NormalizedError {
  message: string;
  status: number | null;
  code: 'UNAUTHORIZED' | 'SERVER_ERROR' | 'API_ERROR' | 'NETWORK_ERROR' | 'UNKNOWN';
}
```

- **401** → Limpia sesión y redirige a `/login`
- **500+** → Mensaje genérico de servidor
- **Errores de red** → Mensaje de conexión
- **401 en cualquier endpoint** → Logout automático + redirect

## Docker

```bash
docker build -t fintrack-front .
docker run -p 8080:80 fintrack-front
```

## Deploy

Preconfigurado para Vercel (`vercel.json` con SPA rewrite) y Docker + Nginx.
