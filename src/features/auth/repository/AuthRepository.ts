import { Auth } from "../models/AuthModel";

export class Repository {


  async login(usuario: string, senha: string): Promise<Auth> {
    const response: Auth = {
      usuario: usuario,
      senha: senha
    }

    return response;
  }

}