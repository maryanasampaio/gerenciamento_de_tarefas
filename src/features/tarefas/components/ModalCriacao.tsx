import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";

interface ModalCriacaoProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (dados: {
    titulo: string;
    importancia: string;
    status: string;
    ativo: boolean;
  }) => void;
}

export const ModalCriacao = ({ open, onClose, onConfirm }: ModalCriacaoProps) => {
  const [titulo, setTitulo] = useState("");
  const [importancia, setImportancia] = useState("baixa");
  const [status, setStatus] = useState("pendente");
  const [ativo, setAtivo] = useState(true);

  // limpa o modal sempre que abrir/fechar
  useEffect(() => {
    if (!open) {
      setTitulo("");
      setImportancia("baixa");
      setStatus("pendente");
      setAtivo(true);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Criar nova tarefa</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              placeholder="Digite o título da tarefa"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>

          <div>
            <Label>Importância</Label>
            <Select value={importancia} onValueChange={setImportancia}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a importância" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baixa">Baixa</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="em_andamento">Em andamento</SelectItem>
                <SelectItem value="concluida">Concluída</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="ativo"
              type="checkbox"
              checked={ativo}
              onChange={(e) => setAtivo(e.target.checked)}
              className="h-4 w-4 border-gray-300"
            />
            <Label htmlFor="ativo">Tarefa ativa</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={() => onConfirm({ titulo, importancia, status, ativo })}
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
