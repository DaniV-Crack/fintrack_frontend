// dashboard.service.ts
import api from "./axios";
import type { ApiResponse } from "../types";

export const dashboardService = {
  async getSummary(month?: number, year?: number): Promise<unknown> {
    const res = await api.get<ApiResponse<unknown>>("/dashboard", {
      params: { month, year },
    });
    return res.data.data;
  },
};
