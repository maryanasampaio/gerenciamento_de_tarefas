import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Circle,
  Loader2,
  Trash,
  CheckCircle2,
  Plus,
  SquarePen,
  Search
} from "lucide-react";
import { Modal } from "../components/Modal";
import { TarefaViewModel } from "../viewmodel/TarefaViewModel";
import RoundCheckbox from "../components/CheckBox";
import { ResultCards } from "../components/ResultCards";
import { PesquisaTarefa } from "../components/PesquisaTarefa";
import { ImportanciaBadge } from "../components/ImportanciaBadge";
import { TarefasCard } from "../components/TarefasCard";

export const PaginaInicial: React.FC = () => {
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
    handleCancel,
    handleConcluirTarefa,
    
  } = TarefaViewModel();

  return (
    <Card className="h-screen w-[800px] bg-white flex flex-col shadow-lg rounded-2xl overflow-hidden p-6">
      <main className="flex-1">
        <div className="mx-auto w-full">
           <section className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Minhas Tarefas</h1>
            <p className="text-muted-foreground">Organize e acompanhe suas atividades diárias</p>
          </section>

           <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <ResultCards label="Total" icon={<Circle className="h-6 w-6 text-primary" />} iconBg="bg-primary/10" value={tarefas.length} />
            <ResultCards label="Ativas" icon={<Circle className="h-6 w-6 text-chart-4" />} iconBg="bg-chart-4/10" value={tarefas.filter(t => t.ativo === 1).length} />
            <ResultCards label="Concluídas" icon={<CheckCircle2 className="h-6 w-6 text-chart-2" />} iconBg="bg-chart-2/10" value={tarefas.filter(t => t.status === "concluida").length} />
          </section>

  <div className="flex flex-col md:flex-row gap-3 mb-6">
<PesquisaTarefa></PesquisaTarefa>
  <Button onClick={abrirModalCriacao} size="lg">
    <Plus className="h-5 w-5 mr-2" />
    Adicionar Tarefa
  </Button>
</div>

           {loading ? (
            <div className="flex justify-center items-center mt-10">
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            </div>
          ) : (
   <div className="bg-white h-full mt-15 overflow-y-auto max-h-[480px] rounded-lg pr-2">
  {tarefas.length === 0 ? (
    <Card className="p-12 text-center overflow-hidden">
      <p className="text-muted-foreground truncate">Nenhuma tarefa encontrada</p>
    </Card>
  ) : (
    tarefas.map((tarefa) => (
      
      <TarefasCard
        key={tarefa.id_tarefa}
        id={tarefa.id_tarefa}
        titulo={tarefa.titulo}
        importancia={tarefa.importancia as "baixa" | "media" | "alta"}
        status={tarefa.status}
        onConcluir={handleConcluirTarefa}
        onEditar={() => abrirModalEdicao(tarefa)}
        onExcluir={() => handleCancel(tarefa.id_tarefa)}
      />
    ))
  )}
</div>

          )}
        </div>
      </main>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={(dados) =>
          handleCriarOuAtualizar(dados.titulo, dados.importancia, dados.status, dados.ativo)
        }
        modoEdicao={modoEdicao}
        tarefa={tarefaSelecionada}
      />
    </Card>
  );
};

 
