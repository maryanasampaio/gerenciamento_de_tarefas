import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { UsuarioViewModel } from "../viewmodel/UsuarioViewModel"
import { Link, Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"

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
    handleCancelCadastro } = UsuarioViewModel()


  {
    loading && (
      <div className="flex justify-center items-center mt-10">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    )
  }

 return (
       <Card className="w-full max-w-[500px] p-8 space-y-9 shadow-lg rounded-2xl max-h-[700px]">
        <CardContent className="p-8 space-y-3">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">TaskFlow</h1>
            <p className="text-muted-foreground">Crie sua conta</p>
          </div>

             <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome"
                value={nome}
                 onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Usuário</Label>
              <Input
                id="name"
                type="text"
                placeholder="Usuário"
                value={usuario}
                 onChange={(e) => setUsuario(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full mt-8" size="lg" onClick={handleCadastro}>
              Cadastrar
            </Button>
 
          <div className="flex mt-6 text-center justify-center items-center">
            <p className="text-sm text-muted-foreground">
              Já tem uma conta?
           
            </p>
            <Button variant="ghost" onClick={handleCancelCadastro}>Voltar</Button>
          </div>
        </CardContent>
      </Card>
   );
}