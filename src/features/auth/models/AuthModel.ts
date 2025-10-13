export interface Auth {
  status: number,
  mensagem: string,
  dados: {
    usuario: {
      usuario: string,
      nome_completo: string,
    }
    token: string
  }
  /*
{
    "status": "sucesso",
    "mensagem": "Login realizado com sucesso",
    "dados": {
        "usuario": {
            "nome": "admin",
            "usuario": "admin",
            "email": "admin@example.com"
        },
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2F1dGgvbG9naW4iLCJpYXQiOjE3NTkyNDEyMjQsImV4cCI6MTc1OTI0NDgyNCwibmJmIjoxNzU5MjQxMjI0LCJqdGkiOiJuVXVzcEwzSjBEVEpSekxxIiwic3ViIjoiMSIsInBydiI6IjU4NzA4NjNkNGE2MmQ3OTE0NDNmYWY5MzZmYzM2ODAzMWQxMTBjNGYifQ.fkdPLZh4oxwdrNch9LXJOv-4iGWLEIR5Qlmhdb3VOZg"
    }
}
  */

}