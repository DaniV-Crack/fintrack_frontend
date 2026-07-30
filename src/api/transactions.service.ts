// transactions.service.ts
import api from './axios';
import type {
  ApiResponse,
  Transaction,
  CreateTransactionDto,
  UpdateTransactionDto,
  TransactionFilters,
  TransactionSummary,
  Paginated,
} from '../types';

export const transactionsService = {
  async getAll(filters?: TransactionFilters): Promise<Paginated<Transaction>> {
    const res = await api.get<ApiResponse<{ transactions: Transaction[]; pagination: Paginated<Transaction>['pagination'] }>>('/transactions', { params: filters });
    const d = res.data.data;
    return { items: d.transactions ?? [], pagination: d.pagination ?? { page: 1, limit: 20, total: 0, totalPages: 0 } };
  },
  async getSummary(params?: { dateFrom?: string; dateTo?: string }): Promise<TransactionSummary> {
    const res = await api.get<ApiResponse<TransactionSummary>>('/transactions/summary', { params });
    return res.data.data;
  },
  async getById(id: string): Promise<Transaction> {
    const res = await api.get<ApiResponse<Transaction>>(`/transactions/${id}`);
    return res.data.data;
  },
  async create(data: CreateTransactionDto): Promise<Transaction> {
    const res = await api.post<ApiResponse<Transaction>>('/transactions', data);
    return res.data.data;
  },
  async update(id: string, data: UpdateTransactionDto): Promise<Transaction> {
    const res = await api.put<ApiResponse<Transaction>>(`/transactions/${id}`, data);
    return res.data.data;
  },
  async remove(id: string): Promise<void> {
    await api.delete(`/transactions/${id}`);
  },
};