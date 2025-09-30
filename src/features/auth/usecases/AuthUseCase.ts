import { Auth } from "../models/AuthModel";
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

    if (response.status !== "sucesso") {
      throw new Error(response.mensagem || "Erro no login");
    }

    localStorage.setItem("token", response.dados.token);

    return response.dados.usuario;

  }
}
