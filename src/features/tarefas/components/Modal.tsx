import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (dados: any) => void;
  modoEdicao?: boolean;
  tarefa?: any;
}

export function Modal({
  open,
  onClose,
  onConfirm,
  modoEdicao,
  tarefa,
}: ModalProps) {
  const [titulo, setTitulo] = useState("");
  const [importancia, setImportancia] = useState("Baixa");
  const [status, setStatus] = useState("Pendente");
  const [ativo, setAtivo] = useState(true);

  useEffect(() => {
    if (modoEdicao && tarefa) {
      setTitulo(tarefa.titulo);
      setImportancia(tarefa.importancia);
      setStatus(tarefa.status);
      setAtivo(tarefa.ativo);
    } else if (!modoEdicao) {
      setTitulo("");
      setImportancia("");
      setStatus("");
      setAtivo(true);
    }
  }, [modoEdicao, tarefa, open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{modoEdicao ? "Editar Tarefa" : "Nova Tarefa"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-3">
          <Input
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
          <select
            value={importancia}
            onChange={(e) => setImportancia(e.target.value)}
            className="border p-2 rounded"

          >

            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="pendente">Pendente</option>
            <option value="em_andamento">Em andamento</option>
            <option value="concluida">Concluída</option>
          </select>
        </div>

        <DialogFooter className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={() => onConfirm({ titulo, importancia, status, ativo })}
            className="bg-primary text-white"
          >
            {modoEdicao ? "Salvar alterações" : "Criar tarefa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
