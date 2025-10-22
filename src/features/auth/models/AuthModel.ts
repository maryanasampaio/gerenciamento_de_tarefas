export interface Auth {
  status: number;
  mensagem: string;
  dados: {
    usuario: {
      usuario: string;
      nome_completo: string;
      email?: string;
    };
  } | null;
}
