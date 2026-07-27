// transactions.service.ts
import api from './axios';
import type {
  ApiResponse,
  Transaction,
  CreateTransactionDto,
  UpdateTransactionDto,
  TransactionFilters,
  Paginated,
} from '../types';

export const transactionsService = {
  async getAll(filters?: TransactionFilters): Promise<Paginated<Transaction>> {
    const res = await api.get<ApiResponse<Paginated<Transaction>>>('/transactions', { params: filters });
    return res.data.data ?? { items: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } };
  },
  async getSummary(params?: { dateFrom?: string; dateTo?: string }): Promise<unknown> {
    const res = await api.get<ApiResponse<unknown>>('/transactions/summary', { params });
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