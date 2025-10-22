import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginView } from "./features/auth/views/LoginView";
import { PaginaInicial } from "./features/tarefas/views/PaginaInicial";
import { LayoutApp } from "./Layout/LayoutApp";
import { RouteGuard } from "./components/RouteGuard/RouteGuard";
import { CadastroView } from "./features/usuario/views/CadastroView";
import { ConfigUsuarioView } from "./features/usuario/views/ConfigUsuarioView";
import { AuthProvider } from "./context/AuthContext";



export default function App() {
  return (
    <AuthProvider>

      <BrowserRouter>
        <LayoutApp>
          <Routes>
            <Route path="/" element={<LoginView />} />
            <Route path="/login" element={<LoginView />} />
            <Route path="/cadastro" element={<CadastroView />} />

            <Route path="/pagina-inicial"
              element={
                <RouteGuard>
                  <PaginaInicial />
                </RouteGuard>

              } />

            <Route
              path="/config-usuario"
              element={
                <RouteGuard>
                  <ConfigUsuarioView />
                </RouteGuard>
              }
            />
          </Routes>
        </LayoutApp>
      </BrowserRouter>
    </AuthProvider>
  );
}



