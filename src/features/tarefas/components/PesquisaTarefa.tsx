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
      className="w-full h-12 pl-5 pr-12 border-2 border-border rounded-xl bg-card text-foreground text-base placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-sm"
    />
    <Search
      onClick={handlePesquisar}
      className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground cursor-pointer hover:text-primary transition-colors"
    />
  </div>

    );
  }
  
  