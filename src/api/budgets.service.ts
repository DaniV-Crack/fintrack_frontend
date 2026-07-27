// budgets.service.ts
import api from './axios';
import type { ApiResponse, Budget, CreateBudgetDto, UpdateBudgetDto, BudgetProgress } from '../types';

export const budgetsService = {
  async getAll(month?: number, year?: number): Promise<Budget[]> {
    const res = await api.get<ApiResponse<Budget[]>>('/budgets', { params: { month, year } });
    return res.data.data ?? [];
  },
  async getById(id: string): Promise<Budget> {
    const res = await api.get<ApiResponse<Budget>>(`/budgets/${id}`);
    return res.data.data;
  },
  async getProgress(id: string): Promise<BudgetProgress> {
    const res = await api.get<ApiResponse<BudgetProgress>>(`/budgets/${id}/progress`);
    return res.data.data;
  },
  async create(data: CreateBudgetDto): Promise<Budget> {
    const res = await api.post<ApiResponse<Budget>>('/budgets', data);
    return res.data.data;
  },
  async update(id: string, data: UpdateBudgetDto): Promise<Budget> {
    const res = await api.put<ApiResponse<Budget>>(`/budgets/${id}`, data);
    return res.data.data;
  },
  async remove(id: string): Promise<void> {
    await api.delete(`/budgets/${id}`);
  },
};