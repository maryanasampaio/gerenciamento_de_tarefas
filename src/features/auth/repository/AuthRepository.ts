import { api } from "@/services/api";
import { Auth, AuthResponse } from "../models/AuthModel";

export class Repository {
  async login(usuario: string, senha: string): Promise<AuthResponse> {
    try {
      const response = await api.post<Auth>("/auth/login", { usuario, senha });
      const { access_token, usuario: userData } = response.data;
      
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("user", JSON.stringify(userData));

      return { usuario: userData, access_token };
    } catch (error: any) {
      console.error("Erro ao fazer login:", error.response?.data || error.message);

      const message = error.response?.data?.message || error.response?.data?.error || "Erro ao conectar com API";
      throw new Error(message);
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
    }
  }
}
