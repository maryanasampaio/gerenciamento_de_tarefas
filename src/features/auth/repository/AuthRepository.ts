import { api } from "@/services/api";
import { Auth } from "../models/AuthModel";

export class Repository {
  async login(usuario: string, senha: string): Promise<Auth> {
    try {
      const response = await api.post<Auth>("/auth/login", { usuario, senha });

      return response.data;
    } catch (error: any) {
      console.error("Erro ao fazer login:", error.response?.data || error.message);

      const message = error.response?.data?.error || "Erro ao conectar com API";
      throw new Error(message);
    }
  }

  async logout(): Promise<Auth> {
    const response = await api.post('/auth/logout');
    return response.data;
  }
}
