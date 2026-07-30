// Wrapper de TODAS las respuestas del backend
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}
// Payload real dentro de data para login/register
export interface AuthPayload {
  token: string;
  user: User;
}
export interface User {
  id: string;
  name: string;
  email: string;
}
export interface LoginCredentials {
  email: string;
  password: string;
}
export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// ---------------------------------------------------------------------------
// Agregar a src/types/index.ts (junto a lo que ya tenés: ApiResponse, User,
// AuthPayload, LoginCredentials, RegisterData). No reemplaza nada existente.
// ---------------------------------------------------------------------------

export type TransactionType = 'INCOME' | 'EXPENSE';

// ── Transacciones ────────────────────────────────────────────────────────

export interface Category {
  id: string;
  userId: string;
  name: string;
  type: TransactionType;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  categoryId: string;
  amount: number; // ver nota: normalizar Number(amount) en el service si Prisma lo serializa como string
  type: TransactionType;
  description?: string | null;
  transactionDate: string; // ISO 8601
  createdAt: string;
  category?: Pick<Category, 'id' | 'name' | 'type'>;
}

export interface CreateTransactionDto {
  categoryId: string;
  amount: number;
  type: TransactionType;
  description?: string;
  transactionDate: string;
}

export type UpdateTransactionDto = Partial<CreateTransactionDto>;

export interface TransactionFilters {
  categoryId?: string;
  type?: TransactionType;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface Paginated<T> {
  items: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

// ── Dashboard — forma real confirmada por /api/dashboard ──────────────────

export interface DashboardBalance {
  income: number;
  expense: number;
  total: number;
}

export interface DashboardCategoryTotal {
  categoryId: string;
  categoryName: string;
  type: TransactionType;
  total: number;
}

export interface DashboardBudgetAlert {
  budgetId: string;
  categoryName: string;
  percentageUsed: number;
}

export interface DashboardSummary {
  balance: DashboardBalance;
  byCategory: DashboardCategoryTotal[];
  budgetAlerts: DashboardBudgetAlert[];
}

// ── Categorías ────────────────────────────────────────────────────────────

export interface CreateCategoryDto {
  name: string;
  type: TransactionType;
}

export type UpdateCategoryDto = Partial<CreateCategoryDto>;

// ── Presupuestos ──────────────────────────────────────────────────────────

export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  month: number;
  year: number;
  createdAt: string;
  category?: Pick<Category, 'id' | 'name' | 'type'>;
}

export interface CreateBudgetDto {
  categoryId: string;
  amount: number;
  month: number;
  year: number;
}

export type UpdateBudgetDto = Partial<Pick<CreateBudgetDto, 'amount'>>;

export interface BudgetProgress {
  budgetId: string;
  categoryName: string;
  budgeted: number;
  spent: number;
  remaining: number;
  percentage: number;
}

// ── Errores de validación ─────────────────────────────────────────────────

export interface ValidationErrorData {
  fields: Record<string, string>;
}

// ── Reports (asumido de GET /api/transactions/summary) ────────────────────

export interface TransactionSummaryItem {
  categoryId: string;
  categoryName: string;
  type: TransactionType;
  total: number;
  count: number;
}

export interface TransactionSummary {
  dateFrom: string;
  dateTo: string;
  income: number;
  expense: number;
  byCategory: TransactionSummaryItem[];
}