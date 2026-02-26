import { api } from "@/services/api";
import { Auth, AuthResponse } from "../models/AuthModel";

export class Repository {
  async login(usuario: string, senha: string): Promise<AuthResponse> {
    try {
      const response = await api.post<Auth>("/auth/login", { usuario, senha });
      
      console.log("✅ [AuthRepository] Login bem-sucedido, dados recebidos:", response.data);
      
      const { 
        access_token, 
        refresh_token, 
        expires_in,
        refresh_expires_in,
        usuario: userData 
      } = response.data as any;
      
      // Salva os tokens no localStorage
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      
      // Calcula e salva as datas de expiração apenas se os valores existirem
      try {
        if (expires_in && typeof expires_in === 'number') {
          const expiresAt = new Date(Date.now() + expires_in * 60 * 1000).toISOString();
          localStorage.setItem("expires_at", expiresAt);
          console.log("  → expires_at calculado:", expiresAt);
        } else {
          console.warn("  → expires_in não recebido ou inválido:", expires_in);
        }
        
        if (refresh_expires_in && typeof refresh_expires_in === 'number') {
          const refreshExpiresAt = new Date(Date.now() + refresh_expires_in * 60 * 1000).toISOString();
          localStorage.setItem("refresh_expires_at", refreshExpiresAt);
          console.log("  → refresh_expires_at calculado:", refreshExpiresAt);
        } else {
          console.warn("  → refresh_expires_in não recebido ou inválido:", refresh_expires_in);
        }
      } catch (dateError) {
        console.error("  → Erro ao calcular datas de expiração:", dateError);
        // Continua o login mesmo se houver erro nas datas
      }
      
      if (userData) {
        localStorage.setItem("user", JSON.stringify(userData));
      }

      return { usuario: userData, access_token };
    } catch (error: any) {
      // Extrai a mensagem de erro do backend
      let message = 
        error.response?.data?.mensagem || 
        error.response?.data?.message || 
        error.response?.data?.error || 
        error.response?.data?.detail ||
        error.response?.data?.msg ||
        error.response?.data?.erro;
      
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
      localStorage.removeItem("expires_at");
      localStorage.removeItem("refresh_expires_at");
      localStorage.removeItem("user");
    }
  }
}
