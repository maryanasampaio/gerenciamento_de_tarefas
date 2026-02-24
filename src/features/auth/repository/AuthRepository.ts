import { api } from "@/services/api";
import { Auth, AuthResponse } from "../models/AuthModel";

export class Repository {
  async login(usuario: string, senha: string): Promise<AuthResponse> {
    try {
      const response = await api.post<Auth>("/auth/login", { usuario, senha });
      const { access_token, refresh_token, usuario: userData } = response.data as any;
      
      localStorage.setItem("access_token", access_token);
      if (refresh_token) {
        localStorage.setItem("refresh_token", refresh_token);
      }
      localStorage.setItem("user", JSON.stringify(userData));

      return { usuario: userData, access_token };
    } catch (error: any) {
      console.error("Erro detalhado ao fazer login:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });

      // Extrai a mensagem de erro mais específica possível
      let message = 
        error.response?.data?.mensagem || 
        error.response?.data?.message || 
        error.response?.data?.error || 
        error.response?.data?.detail;
      
      if (!message) {
        const status = error.response?.status;
        if (status === 404) {
          message = "Usuário não encontrado";
        } else if (status === 401) {
          message = "Usuário ou senha inválidos";
        } else if (status === 500) {
          message = "Erro no servidor. Tente novamente.";
        } else if (status) {
          message = `Erro ${status}: ${error.response.statusText || 'Erro desconhecido'}`;
        } else {
          message = error.message || "Erro ao conectar com a API. Verifique sua conexão.";
        }
      }
      
      throw new Error(message);
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
    }
  }
}
