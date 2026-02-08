// src/Layout/LayoutApp.tsx
import { Footer } from "@/components/Footer/Footer";
import { useAuth } from "@/context/AuthContext";
import { ReactNode, useState, useEffect } from "react";
import { TaskAnimation } from "@/components/TaskAnimation/TaskAnimation";
import { FloatingCard } from "@/components/BackgroundAnimations/FloatingCard";
import { ProgressCircle } from "@/components/BackgroundAnimations/ProgressCircle";
import { TagCloud } from "@/components/BackgroundAnimations/TagCloud";
import { NotificationPop } from "@/components/BackgroundAnimations/NotificationPop";

interface LayoutProps {
  children: ReactNode;
  currentPath?: string;
}

export const LayoutApp = ({ children, currentPath = '' }: LayoutProps) => {
  const { isAuthenticated } = useAuth();
  
  // Usar posição diferente para a notificação na landing page (antes de logar)
  const isLandingPage = currentPath === '/' || currentPath === '/home';
  const isAuthPage = currentPath === '/login' || currentPath === '/cadastro';
  const isDashboardPage = currentPath === '/pagina-inicial';
  const isMetasPage = currentPath === '/metas-diarias' || currentPath === '/metas-mensais' || currentPath === '/metas-anuais';
  const isComoUsarPage = currentPath === '/como-usar';
  const isConfigPage = currentPath === '/config-usuario';
  const hideHeaderFooter = isDashboardPage || isMetasPage || isComoUsarPage || isConfigPage || isAuthPage;
  const notificationPosition = isLandingPage ? 'top-center' : 'top-center';

  // Estado para posição do cursor
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 relative overflow-hidden">
      {/* Bolinha que segue o cursor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-[400px] h-[400px] bg-gradient-to-br from-cyan-300/20 via-blue-300/20 to-indigo-300/20 dark:from-cyan-400/10 dark:via-blue-400/10 dark:to-indigo-400/10 rounded-full blur-3xl transition-all duration-300 ease-out"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        ></div>
      </div>

      {/* Animações de produtividade - bem espalhadas */}
      
      {/* CANTO SUPERIOR ESQUERDO */}
      <TaskAnimation 
        position="top-left"
        tasks={["Planejar o dia", "Organizar agenda", "Definir prioridades"]}
        delay={0}
      />
      
      {/* CANTO SUPERIOR DIREITO */}
      <TaskAnimation 
        position="top-right"
        tasks={["Fazer backup", "Verificar e-mails", "Atualizar sistemas"]}
        delay={1500}
      />
      
      {/* CENTRO-TOPO - Notificação (muda de posição na página inicial) */}
      <NotificationPop position={notificationPosition} delay={2500} />
      
      {/* MEIO ESQUERDO */}
      <ProgressCircle position="left-top" targetProgress={85} delay={4000} />
      
      {/* CENTRO-ESQUERDA - Card */}
      <FloatingCard position="left" delay={5500} />
      
      {/* MEIO DIREITO */}
      <TagCloud position="right" delay={3500} />
      
      {/* CANTO INFERIOR ESQUERDO */}
      <TaskAnimation 
        position="bottom-left"
        tasks={["Fazer exercícios", "Beber água", "Alongar-se"]}
        delay={2000}
      />
      
      {/* CANTO INFERIOR DIREITO */}
      <ProgressCircle position="bottom-right" targetProgress={60} delay={1500} />

      <div className="relative z-10 flex flex-col min-h-screen">
        <main className={`flex-1 ${hideHeaderFooter ? '' : 'p-4'}`}>
          {hideHeaderFooter ? (
            children
          ) : (
            <div className="mx-auto w-full max-w-5xl">
              {children}
            </div>
          )}
        </main>

        {isAuthenticated && !hideHeaderFooter && <Footer />}
      </div>
    </div>
  );
};
