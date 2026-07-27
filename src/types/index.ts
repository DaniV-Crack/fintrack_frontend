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

// ── Nuevo ───────────────────────────────────────────────────
export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Category {
  id: string;
  userId: string;
  name: string;
  type: TransactionType;
  createdAt: string;
}

export interface CreateCategoryDto {
  name: string;
  type: TransactionType;
}

export type UpdateCategoryDto = Partial<CreateCategoryDto>;

export interface Transaction {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;               // ver nota en sección 3 sobre Decimal
  type: TransactionType;
  description?: string | null;
  transactionDate: string;      // ISO 8601
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

export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  month: number; // 1-12
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
  budget: Budget;
  spent: number;
  remaining: number;
  percentage: number; // 0-100 (o más si está excedido)
}

export interface ValidationErrorData {
  fields: Record<string, string>;
}

export interface DashboardBalance {
  income: number;
  expense: number;
  total: number;
}

export interface DashboardCategoryBreakdown {
  categoryId: string;
  categoryName: string;
  type: TransactionType; // 'INCOME' | 'EXPENSE'
  total: number;
}

export interface DashboardBudgetAlert {
  budgetId: string;
  categoryName: string;
  percentageUsed: number;
}

export interface DashboardSummary {
  balance: DashboardBalance;
  byCategory: DashboardCategoryBreakdown[];
  budgetAlerts: DashboardBudgetAlert[];
}