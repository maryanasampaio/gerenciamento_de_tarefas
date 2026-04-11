import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { PaginaInicial } from "./features/tarefas/views/PaginaInicial";
import { LayoutApp } from "./Layout/LayoutApp";
import { RouteGuard } from "./components/RouteGuard/RouteGuard";
import { PublicRoute } from "./components/RouteGuard/PublicRoute";
import { CadastroView } from "./features/usuario/views/CadastroView";
import { ConfigUsuarioView } from "./features/usuario/views/ConfigUsuarioView";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { ModalProvider } from "./context/ModalContext";
import { PastaProvider } from "./context/PastaContext";
import LoginView from "./features/auth/views/LoginView";
import { LandingPage } from "./features/landing/LandingPage";
import { MetasDiarias } from "./features/metas/views/MetasDiarias";
import { MetasMensais } from "./features/metas/views/MetasMensais";
import { MetasAnuais } from "./features/metas/views/MetasAnuais";
import { MetaDetalhes } from "./features/metas/views/MetaDetalhes";
import { PastaDetalhes } from "./features/pastas/views/PastaDetalhes";
import { ComoUsar } from "./features/ajuda/ComoUsar";
import { GerenciarTarefas } from "./features/tarefas/views/GerenciarTarefas";

function AppRoutes() {
  const location = useLocation();
  
  return (
    <LayoutApp currentPath={location.pathname}>
      <Routes>
        <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
        <Route path="/home" element={<PublicRoute><LandingPage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><LoginView /></PublicRoute>} />
        <Route path="/cadastro" element={<PublicRoute><CadastroView /></PublicRoute>} />

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
          path="/pasta/:id"
          element={
            <RouteGuard>
              <PastaDetalhes />
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
          <PastaProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </PastaProvider>
        </ModalProvider>
      </ToastProvider>
    </AuthProvider>
  );
}



