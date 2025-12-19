import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UsuarioViewModel } from "../viewmodel/UsuarioViewModel";

export const ConfigUsuarioView = () => {
  const {
    nome,
    setNome,
    usuario,
    setUsuario,
    email,
    setEmail,
    senha,
    setSenha,
    loading,
    handleAtualizarUsuario,
    handleCancelAtualizacao,
  } = UsuarioViewModel();

  if (loading) {
    return <div className="text-center mt-10 text-gray-500">Carregando...</div>;
  }

  return (
       <Card className="w-full max-w-xl p-6 shadow-lg rounded-2xl">
        <CardHeader>
          <h1 className="text-3xl font-bold text-center text-foreground">Configurações do Usuário</h1>
          <p className="text-sm text-muted-foreground text-center mt-1">
            Atualize suas informações pessoais
          </p>
        </CardHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAtualizarUsuario();
          }}
        >
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome completo</Label>
              <Input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="usuario">Usuário</Label>
              <Input
                id="usuario"
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha">Nova senha</Label>
              <Input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-4 mt-4">
            <Button type="button" variant="ghost" onClick={handleCancelAtualizacao}>
              Cancelar
            </Button>
            <Button type="submit" variant="default">
              Salvar Alterações
            </Button>
          </CardFooter>
        </form>
      </Card>
   );
};
