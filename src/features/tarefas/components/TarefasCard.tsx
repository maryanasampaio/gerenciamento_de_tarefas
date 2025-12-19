import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Circle, CheckCircle2, Trash, SquarePen } from "lucide-react";
import { ImportanciaBadge } from "./ImportanciaBadge";

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
  return (
    <Card
      className="p-5 hover:shadow-lg transition-all duration-200 overflow-hidden 
                 flex items-center gap-4 h-[90px] mb-4 "
    >
      {/* Ícone de conclusão */}
      <button onClick={() => onConcluir(id, status)} className="flex-shrink-0">
        {status === "concluida" ? (
          <CheckCircle2 className="h-6 w-6 text-chart-2" />
        ) : (
          <Circle className="h-6 w-6 text-muted-foreground" />
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
      <div className="flex items-center gap-3">
        <ImportanciaBadge nivel={importancia} />

        <Button
          variant="ghost"
          size="icon"
          onClick={onExcluir}
          className="text-muted-foreground text-destructive"
        >
          <Trash className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onEditar}
          className="text-muted-foreground text-primary"
        >
          <SquarePen className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};
