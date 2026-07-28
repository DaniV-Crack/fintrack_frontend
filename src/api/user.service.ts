import api from './axios';
import type { ApiResponse, User } from '../types';

export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
}

export const userService = {
  async getById(id: string): Promise<User> {
    const res = await api.get<ApiResponse<User>>(`/users/${id}`);
    return res.data.data;
  },

  async update(id: string, data: UpdateUserDto): Promise<User> {
    const res = await api.put<ApiResponse<User>>(`/users/${id}`, data);
    return res.data.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};
