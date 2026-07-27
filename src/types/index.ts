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
