export interface UsuarioModel {
  status: number,
  mensagem: string
  dados: {
    id_usuario: number | null
    nome_completo: string,
    usuario: string,
    email: string,
  }
}

