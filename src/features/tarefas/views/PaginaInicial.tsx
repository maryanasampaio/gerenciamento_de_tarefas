import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Circle, Loader2, Trash, SquarePen } from "lucide-react";
import RoundCheckbox from "../components/CheckBox";
import { TarefaViewModel } from "../viewmodel/TarefaViewModel";
import { Modal } from "../components/Modal";

export const PaginaInicial = () => {
  const {
    tarefas,
    loading,
    isModalOpen,
    setIsModalOpen,
    modoEdicao,
    tarefaSelecionada,
    handleCriarOuAtualizar,
    abrirModalCriacao,
    abrirModalEdicao,
    handleCancel
  } = TarefaViewModel();

  return (
    <Card className="h-screen w-[800px] bg-white flex flex-col shadow-lg rounded-2xl overflow-hidden">
      <CardHeader className="flex flex-col m-3 gap-1">
        <h1 className="text-3xl font-bold">Minhas Tarefas</h1>
        <CardDescription>Organize e acompanhe suas atividades diárias</CardDescription>
      </CardHeader>

      <CardContent>
        {/* Loader */}
        {loading && (
          <div className="flex justify-center items-center mt-10">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          </div>
        )}

        {/* Cards de resumo */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex bg-gray-200 p-4 justify-between rounded-lg">
            <div className="flex-col text-center p-2">
              <div className="text-lg text-gray-500 font-bold">Total</div>
              <div className="text-2xl font-bold">{tarefas.length}</div>
            </div>
            <div className="flex items-center">
              <Circle />
            </div>
          </div>

          <div className="flex bg-gray-200 p-4 justify-between rounded-lg">
            <div className="flex-col text-center p-2">
              <div className="text-lg text-gray-500 font-bold">Ativas</div>
              <div className="text-2xl font-bold">{tarefas.filter((t) => t.ativo === 1).length}</div>
            </div>
            <div className="flex items-center">
              <Circle />
            </div>
          </div>

          <div className="flex bg-gray-200 p-4 justify-between rounded-lg">
            <div className="flex-col text-center p-2">
              <div className="text-lg text-gray-500 font-bold">Concluídas</div>
              <div className="text-2xl font-bold">{tarefas.filter((t) => t.status === "concluida").length}</div>
            </div>
            <div className="flex items-center">
              <Circle />
            </div>
          </div>
        </div>

        {/* Campo e botão de nova tarefa */}
        <div className="flex h-[100px] overflow-hidden min-w-[750px] bg-gray-200 rounded-lg mt-5 items-center justify-center">
          <div className="flex gap-3">
            <Input placeholder="Adicionar uma nova tarefa..." className="bg-white w-[600px]" />
            <Button onClick={abrirModalCriacao} className="bg-primary text-white">
              Adicionar
            </Button>
          </div>
        </div>

        {/* Lista de tarefas */}
        <div className="bg-white h-full mt-5 overflow-y-auto max-h-[450px]">
          {tarefas.length === 0 ? (
            <div className="text-center text-gray-500 p-4">Nenhuma tarefa cadastrada.</div>
          ) : (
            tarefas.map((tarefa) => (
              <div
                key={tarefa.id_tarefa}
                className="flex justify-between m-3 h-[80px] bg-gray-100 rounded-lg items-center px-3"
              >
                <div className="flex gap-2 items-center">
                  <RoundCheckbox />
                  <h2 className="text-lg font-semibold text-gray-700">{tarefa.titulo}</h2>
                </div>
                <div className="flex gap-3 items-center">
                  <span className="text-sm font-medium capitalize">{tarefa.importancia}</span>

                  <SquarePen
                    className="h-4 w-4 cursor-pointer text-blue-500 hover:text-blue-700 transition"
                    onClick={() => abrirModalEdicao(tarefa)}
                  />

                  <Trash
                    className="h-4 w-4 cursor-pointer text-red-500 hover:text-red-700 transition"
                    onClick={() => handleCancel(tarefa.id_tarefa)}

                  />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal de criação/edição */}
        <Modal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={(dados) =>
            handleCriarOuAtualizar(dados.titulo, dados.importancia, dados.status, dados.ativo)
          }
          modoEdicao={modoEdicao}
          tarefa={tarefaSelecionada}
        />
      </CardContent>
    </Card>
  );
};
