import { Search } from "lucide-react";
import { TarefaViewModel } from "../viewmodel/TarefaViewModel";

  
  
  export const PesquisaTarefa = () => {

const {
  termo,
      setTermo,
      handlePesquisar,
} = TarefaViewModel();



    return (
     <div className="flex-1 relative">
    <input
      type="text"
      placeholder="Pesquisar tarefas..."
      value={termo}
      onChange={(e) => setTermo(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handlePesquisar();
      }}
      className="w-full pl-4 pr-10 py-2 border border-border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
    />
    <Search
      onClick={handlePesquisar}
      className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground cursor-pointer hover:text-primary transition-colors"
    />
  </div>

    );
  }
  
  