import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CadastroViewModel } from "../viewmodel/CadastroViewModel"
import { Loader2 } from "lucide-react"

export const CadastroView = () => {
  const {
    nome,
    setNome,
    usuario,
    setUsuario,
    email,
    setEmail,
    senha,
    setSenha,
    error,
    loading,
    handleCadastro,
    handleCancel
  } = CadastroViewModel()


  {
    loading && (
      <div className="flex justify-center items-center mt-10">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="items-center justify-center h-[550px] w-[600px]">
          <CardHeader>
            <h1 className="text-3xl font-bold text-center mt-10">Cadastro</h1>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 m-[20px] mt-10 items-center">
            <Input
              type="text"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            ></Input>
            <Input
              type="text"
              placeholder="Usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            >
            </Input>
            <Input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Input>
            <Input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            >
            </Input>
          </CardContent>
          <CardFooter className="flex justify-end m-[25px]">
            <Button variant={"ghost"} onClick={handleCancel}>Cancelar</Button>
            <Button onClick={handleCadastro}>Cadastrar</Button>
          </CardFooter>
        </Card>
      </div>

    </>
  )
}