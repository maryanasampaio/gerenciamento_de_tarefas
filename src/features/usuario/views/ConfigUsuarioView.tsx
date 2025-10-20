import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
    handleCancelAtualizacao
  } = UsuarioViewModel();

  if (loading) {
    return <div className="text-center mt-10 text-gray-500">Carregando...</div>;
  }

  return (
    <Card className="items-center justify-center h-[550px] w-[600px] mx-auto mt-10 shadow-lg">
      <CardHeader>
        <h1 className="text-3xl font-bold text-center mt-6">Configurações do Usuário</h1>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 m-[20px] mt-10 items-center">
        <Input
          type="text"
          placeholder="Nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Usuário"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />
        <Input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Nova senha "
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
      </CardContent>

      <CardFooter className="flex justify-end gap-3 w-full px-8">
        <Button variant="ghost" onClick={handleCancelAtualizacao}>
          Cancelar
        </Button>
        <Button variant="default" onClick={handleAtualizarUsuario}>
          Atualizar
        </Button>
      </CardFooter>
    </Card>
  );
};
