import { UsuarioModel } from "../models/UsuarioModel";
import { api } from "@/services/api";

export class Repository {

  async getUsuarioAutenticado() {
    try {
      const response = await api.get('/auth/usuario');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response.mensagem || error.message);
    }
  }


  async criarUsuario(nome: string, usuario: string, email: string, senha: string): Promise<UsuarioModel> {
    try {
      const response = await api.post<UsuarioModel>('/usuarios/criar', { "nome_completo": nome, usuario, email, senha });

      return response.data;

    } catch (error: any) {
      console.error("🔴 [UsuarioRepository] Erro detalhado ao criar usuário:");
      console.error("  → Status HTTP:", error.response?.status);
      console.error("  → Status Text:", error.response?.statusText);
      console.error("  → Data completa:", error.response?.data);
      console.error("  → Mensagem:", error.message);
      console.error("  → Erro completo:", error);

      // Extrai mensagem específica do backend
      let message = 
        error.response?.data?.mensagem || 
        error.response?.data?.message || 
        error.response?.data?.error || 
        error.response?.data?.detail ||
        error.response?.data?.msg ||
        error.response?.data?.erro;
      
      console.log("  → Mensagem extraída dos dados:", message);
      
      if (!message) {
        const status = error.response?.status;
        console.log("  → Usando mensagem baseada no status:", status);
        if (status === 409) {
          message = "Este usuário ou e-mail já está em uso";
        } else if (status === 400) {
          message = "Dados inválidos. Verifique os campos.";
        } else if (status === 500) {
          message = "Erro no servidor. Tente novamente.";
        } else {
          message = error.message || "Erro ao criar usuário";
        }
      }
      
      console.log("  → Mensagem final que será lançada:", message);
      throw new Error(message);
    }

  }

  async atualizarUsuario(id_usuario: number, dados: Partial<{
    nome_completo: string;
    usuario: string;
    email: string;
    senha: string;
  }>) {
    const response = await api.put(`/usuarios/atualizar/${id_usuario}`, dados);
    return response.data;
  }
}

