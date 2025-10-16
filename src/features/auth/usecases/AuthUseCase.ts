import { Navigate } from "react-router-dom";
import { Repository } from "../repository/AuthRepository";

export class AuthUseCase {
  private repository: Repository;

  constructor() {
    this.repository = new Repository();
  }


  async execute(usuario: string, senha: string) {

    if (!usuario || !senha) {
      throw new Error("Usuário e senha são obrigatórios");
    }

    const response = await this.repository.login(usuario, senha);

    if (response.status >= 400) {
      throw new Error(response.mensagem || "Erro no login");
    }
    if (response.dados?.token) {
      localStorage.setItem("token", response.dados.token);

    } return response.dados?.usuario;

  }

  async logout() {
    try {
      const response = await this.repository.logout();

      if (response.status !== 200) {
        throw new Error(response.mensagem || "Erro ao fazer logout");
      }

      localStorage.removeItem("token");
      return true;

    } catch (error: any) {
      throw new Error(error.response.mensagem || "Erro ao fazer logout");
    }

  }
}
