import { Auth } from "../models/AuthModel";
import { Repository } from "../repository/AuthRepository";

export class AuthUseCase {
  private repository: Repository;

  constructor() {
    this.repository = new Repository();
  }


  async execute(usuario: string, senha: string): Promise<Auth | null> { //--> recebe os dados e aloca na interface
    if (!usuario || !senha) {  //--> validação de campos preenchidos

      throw new Error("Usuário e senha são obrigatórios");
    }

    if (usuario === "admin.teste" && senha === "123456") { //--> validação de credenciais especificas
      return { usuario, senha }
    }

    const auth = await this.repository.login(usuario, senha); //--> chamada do repository

    if (!auth) { //--> validação de credenciais válidas
      throw new Error("Usuário ou senha inválidos");
    }
    return auth; // se tudo certo --> retorna o payload da interface com os dados da view como resposta
  }

}