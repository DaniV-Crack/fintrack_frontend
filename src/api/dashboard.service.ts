import api from './axios';
import type { ApiResponse, DashboardSummary } from '../types';

export const dashboardService = {
  async getSummary(month?: number, year?: number): Promise<DashboardSummary> {
    const res = await api.get<ApiResponse<DashboardSummary>>('/dashboard', { params: { month, year } });
    return res.data.data;
  },
};
