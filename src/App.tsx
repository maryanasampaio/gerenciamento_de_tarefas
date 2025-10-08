import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginView } from "./features/auth/views/LoginView";
import { CadastroView } from "./features/cadastro/views/CadastroView";
import { PaginaInicial } from "./features/tarefas/views/PaginaInicial";
import { LayoutApp } from "./Layout/LayoutApp";




export default function App() {
  return (
    <BrowserRouter>
      <LayoutApp>
        <Routes>
          <Route path="/" element={<LoginView />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/cadastro" element={<CadastroView />} />
          <Route path="/pagina-inicial" element={<PaginaInicial />} />

        </Routes>

      </LayoutApp>
    </BrowserRouter>
  );
}



