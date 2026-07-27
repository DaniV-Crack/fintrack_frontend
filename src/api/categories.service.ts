// categories.service.ts
import api from './axios';
import type { ApiResponse, Category, CreateCategoryDto, UpdateCategoryDto } from '../types';

export const categoriesService = {
  async getAll(type?: 'INCOME' | 'EXPENSE'): Promise<Category[]> {
    const res = await api.get<ApiResponse<Category[]>>('/categories', { params: { type } });
    return res.data.data ?? [];
  },
  async getById(id: string): Promise<Category> {
    const res = await api.get<ApiResponse<Category>>(`/categories/${id}`);
    return res.data.data;
  },
  async create(data: CreateCategoryDto): Promise<Category> {
    const res = await api.post<ApiResponse<Category>>('/categories', data);
    return res.data.data;
  },
  async update(id: string, data: UpdateCategoryDto): Promise<Category> {
    const res = await api.put<ApiResponse<Category>>(`/categories/${id}`, data);
    return res.data.data;
  },
  async remove(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};