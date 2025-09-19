import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoginViewModel } from "../viewmodel/AuthViewModel";


export const LoginView = () => {
  const {
    usuario,
    setUsuario,
    senha,
    setSenha,
    loading,
    error,
    isAuthenticated,
    handleLogin,
  } = LoginViewModel();



  if (isAuthenticated) {
    alert('Seja bem-vindo(a)!')
  }

  if (error) {
    alert("erro:" + error)
  }


  return <>
    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <Card className="w-[600px] h-[450px] justify-center mx-auto items-center" >
        <CardHeader>
          <h1 className="text-3xl font-bold text-center mt-10">Login</h1>
        </CardHeader>
        <CardContent className="gap-3 flex flex-col mt-10 m-[20px]">
          <Input
            type="text"
            placeholder="Usuário"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          ></Input>
          <Input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          ></Input>
        </CardContent>
        <CardFooter className="flex justify-center mt-5">

          <Button variant={'default'} onClick={handleLogin}>Entrar</Button>


        </CardFooter>


      </Card>

    </div>
  </>
}