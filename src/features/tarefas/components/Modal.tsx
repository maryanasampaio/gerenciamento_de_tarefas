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
  const [importancia, setImportancia] = useState("");
  const [status, setStatus] = useState("");
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

  const handleConfirm = () => {
    if (!titulo || !importancia || !status) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    onConfirm({ titulo, importancia, status, ativo });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {modoEdicao ? "Editar Tarefa" : "Nova Tarefa"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-muted-foreground">
              Título
            </label>
            <Input
              placeholder="Digite o título da tarefa"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-muted-foreground">
              Importância
            </label>
            <select
              value={importancia}
              onChange={(e) => setImportancia(e.target.value)}
              className="border p-2 rounded focus:ring-2 focus:ring-primary/40 focus:outline-none"
            >
              <option value="">Selecione...</option>
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-muted-foreground">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border p-2 rounded focus:ring-2 focus:ring-primary/40 focus:outline-none"
            >
              <option value="">Selecione...</option>
              <option value="pendente">Pendente</option>
              <option value="em_andamento">Em andamento</option>
              <option value="concluida">Concluída</option>
            </select>
          </div>
        </div>

        <DialogFooter className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-primary text-white"
          >
            {modoEdicao ? "Salvar alterações" : "Criar tarefa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
