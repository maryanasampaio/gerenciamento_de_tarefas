import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Circle, Delete, Square, Trash } from "lucide-react";
import RoundCheckbox from "../components/CheckBox";
import { TarefaViewModel } from "../viewmodel/TarefaViewModel";
import { ModalCriacao } from "../components/ModalCriacao";

export const PaginaInicial = () => {

  const {
    isModalOpen,
    setIsModalOpen,
    tarefas,
    handleCriar,
    modoEdicao,
    setModoEdicao,
    tarefaSelecionada,
    setTarefaSelecionada,

  } = TarefaViewModel();



  return (
    <Card className="h-screen w-[800px] bg-white flex flex-col shadow-lg rounded-2xl overflow-hidden">
      <CardHeader className="flex flex-col m-3 gap-1">
        <h1 className="text-3xl font-bold ">Minhas Tarefas</h1>
        <CardDescription>
          Organize e acompanhe suas atividades diárias
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex bg-gray-200 p-4 justify-between rounded-lg">
            <div className="fex-col text-center p-2 ">
              <div className="text-lg text-gray-500 font-bold">Total</div>
              <div className="text-2xl font-bold">{tarefas.length}</div>
            </div>
            <div className="flex -flex-col items-center">
              <Circle></Circle>
            </div>
          </div>
          <div className="flex bg-gray-200 p-4 justify-between rounded-lg ">
            <div className="fex-col text-center p-2 ">
              <div className="text-lg text-gray-500 font-bold">Ativas</div>
              <div className="text-2xl font-bold"> {tarefas.filter((t) => t.ativo === 1).length
              }</div>
            </div>
            <div className="flex -flex-col items-center">
              <Circle></Circle>
            </div>
          </div>
          <div className="flex bg-gray-200 p-4 justify-between rounded-lg ">
            <div className="fex-col text-center p-2 ">
              <div className="text-lg text-gray-500 font-bold">Concluidas</div>
              <div className="text-2xl font-bold">{tarefas.filter((t) => t.status === "concluída").length}</div>
            </div>
            <div className="flex -flex-col items-center">
              <Circle></Circle>
            </div>
          </div>
        </div>

        <div className="flex h-[100px] overflow-hidden min-w-[750px] bg-gray-200 rounded-lg mt-5 items-center justify-center">
          <div className="flex  gap-3">
            <div>
              <Input
                placeholder="Adicionar uma nova tarefa..."
                className="bg-white w-[600px]"></Input>
            </div>
            <div>
              <Button onClick={() => setIsModalOpen(true)} className="bg-primary text-white">Adicionar</Button>
            </div>
          </div>
        </div>

        <div className="bg-white h-full mt-5 overflow-y-auto max-h-[450px]">
          {tarefas.length === 0 ? (
            <div className="text-center text-gray-500 p-4">
              Nenhuma tarefa cadastrada.
            </div>
          ) : (
            tarefas.map((tarefa) => (
              <div
                key={tarefa.id_tarefa}
                className="flex justify-between m-3 h-[80px] bg-gray-100 rounded-lg items-center px-3"
              >
                <div className="flex gap-2 items-center">
                  <RoundCheckbox />
                  <h2 className="text-lg font-semibold text-gray-700">
                    {tarefa.titulo}
                  </h2>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-sm font-medium capitalize">{tarefa.importancia}</span>
                  <Trash className="h-4 w-4 cursor-pointer" />
                </div>
              </div>
            ))
          )}
        </div>


        <ModalCriacao open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={(dados) =>
            handleCriar(dados.titulo, dados.importancia, dados.status, dados.ativo)
          }
        ></ModalCriacao>

      </CardContent>
    </Card>
  );
};
