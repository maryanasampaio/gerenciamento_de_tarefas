 import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Circle, CheckCircle2, Trash, SquarePen } from "lucide-react";
import { ImportanciaBadge } from "./ImportanciaBadge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useState } from "react";

interface TarefasCardProps {
  id: number;
  titulo: string;
  importancia: "baixa" | "media" | "alta";
  status: string;
  onConcluir: (id: number, status: string) => void;
  onEditar: () => void;
  onExcluir: () => void;
}

export const TarefasCard : React.FC<TarefasCardProps> = ({
  id,
  titulo,
  importancia,
  status,
  onConcluir,
  onEditar,
  onExcluir,
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  return (
    <>
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Excluir tarefa"
        description={`Tem certeza que deseja excluir a tarefa "${titulo}"? Esta ação não pode ser desfeita.`}
        onConfirm={onExcluir}
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        variant="destructive"
      />
      
      <Card
        className="p-3 hover:shadow-lg transition-all duration-300 overflow-hidden 
                   flex items-center gap-3 h-[70px] mb-3 border-l-4 border-l-transparent hover:border-l-primary 
                   bg-white hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-transparent hover:-translate-y-0.5"
      >
      {/* Ícone de conclusão */}
      <button onClick={() => onConcluir(id, status)} className="flex-shrink-0 transition-transform hover:scale-110">
        {status === "concluida" ? (
          <CheckCircle2 className="h-5 w-5 text-chart-2" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />
        )}
      </button>

      {/* Título */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-base font-medium truncate ${
            status === "concluida"
              ? "line-through text-muted-foreground"
              : "text-foreground"
          }`}
        >
          {titulo}
        </p>
      </div>

      {/* Importância + Ações */}
      <div className="flex items-center gap-2">
        <ImportanciaBadge nivel={importancia} />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowDeleteDialog(true)}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
        >
          <Trash className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onEditar}
          className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
        >
          <SquarePen className="h-4 w-4" />
        </Button>
      </div>
    </Card>
    </>
  );
};
