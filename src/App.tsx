import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { PaginaInicial } from "./features/tarefas/views/PaginaInicial";
import { LayoutApp } from "./Layout/LayoutApp";
import { RouteGuard } from "./components/RouteGuard/RouteGuard";
import { CadastroView } from "./features/usuario/views/CadastroView";
import { ConfigUsuarioView } from "./features/usuario/views/ConfigUsuarioView";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { ModalProvider } from "./context/ModalContext";
import LoginView from "./features/auth/views/LoginView";
import { LandingPage } from "./features/landing/LandingPage";
import { MetasDiarias } from "./features/metas/views/MetasDiarias";
import { MetasMensais } from "./features/metas/views/MetasMensais";
import { MetasAnuais } from "./features/metas/views/MetasAnuais";
import { MetaDetalhes } from "./features/metas/views/MetaDetalhes";
import { ComoUsar } from "./features/ajuda/ComoUsar";
import { GerenciarTarefas } from "./features/tarefas/views/GerenciarTarefas";

function AppRoutes() {
  const location = useLocation();
  
  return (
    <LayoutApp currentPath={location.pathname}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/cadastro" element={<CadastroView />} />

        <Route path="/pagina-inicial"
          element={
            <RouteGuard>
              <PaginaInicial />
            </RouteGuard>

          } />

        <Route
          path="/tarefas"
          element={
            <RouteGuard>
              <GerenciarTarefas />
            </RouteGuard>
          }
        />

        <Route
          path="/como-usar"
          element={
            <RouteGuard>
              <ComoUsar />
            </RouteGuard>
          }
        />

        <Route
          path="/metas-diarias"
          element={
            <RouteGuard>
              <MetasDiarias />
            </RouteGuard>
          }
        />

        <Route
          path="/metas-mensais"
          element={
            <RouteGuard>
              <MetasMensais />
            </RouteGuard>
          }
        />

        <Route
          path="/metas-anuais"
          element={
            <RouteGuard>
              <MetasAnuais />
            </RouteGuard>
          }
        />

        <Route
          path="/metas/:id"
          element={
            <RouteGuard>
              <MetaDetalhes />
            </RouteGuard>
          }
        />

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
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <ModalProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ModalProvider>
      </ToastProvider>
    </AuthProvider>
  );
}



