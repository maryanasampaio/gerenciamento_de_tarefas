import { useEffect, useState } from "react";
import { TarefaUseCase } from "../usecases/TarefaUseCase";

export function TarefaViewModel() {
  const [titulo, setTitulo] = useState("");
  const [importancia, setImportancia] = useState("");
  const [status, setStatus] = useState("");
  const [dataCriacao, setDataCriacao] = useState("");
  const [tarefas, setTarefas] = useState<any[]>([]);
  const [error, setError] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);






  const tarefaUseCase = new TarefaUseCase();

  async function handleCriar() {
    try {
      const request = await tarefaUseCase.criar(titulo, importancia, status, dataCriacao);

      if (request) {
        alert("Tarefa criada com sucesso!");
        setError(false);
        setLoading(true);
      } else {
        alert("Erro ao criar tarefa");
        setError(true);
        setLoading(false);
      }
    } catch (error: any) {
      alert("erro: " + error.message);
      setError(true);
      setLoading(false);

    }
  }


  async function handleListar() {
    try {
      setLoading(true);
      const lista = await tarefaUseCase.listar();
      setTarefas(lista);
      setLoading(false);

      if (lista.length === 0) {
        console.log('lista vazia');
        setError(true);
        setLoading(false);
      }

    } catch (error: any) {
      setError(true);
      setLoading(false);
    }
  }

  useEffect(() => {
    handleListar();
  }, []);



  return {
    titulo,
    setTitulo,
    importancia,
    setImportancia,
    status,
    setStatus,
    dataCriacao,
    setDataCriacao,
    error,
    loading,
    handleCriar,
    handleListar,
    tarefas
  }

} 