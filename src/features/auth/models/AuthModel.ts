export interface Auth {
  message: string;
  usuario: {
    usuario: string;
    nome: string;
    email?: string;
  };
  access_token: string;
}

export interface AuthResponse {
  usuario: {
    usuario: string;
    nome: string;
    email?: string;
  };
  access_token: string;
}
