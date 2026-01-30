import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { useState, useEffect } from "react";
import {
  Calendar,
  Plus,
  CheckCircle2,
  Circle,
  Target,
  TrendingUp,
  Clock,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export const MetasMensais: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mesSelecionado, setMesSelecionado] = useState(new Date());

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const mesAtual = mesSelecionado.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric'
  });

  const mesAnterior = () => {
    const novaData = new Date(mesSelecionado);
    novaData.setMonth(novaData.getMonth() - 1);
    setMesSelecionado(novaData);
  };

  const mesPosterior = () => {
    const novaData = new Date(mesSelecionado);
    novaData.setMonth(novaData.getMonth() + 1);
    setMesSelecionado(novaData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900 relative overflow-hidden">
      {/* Background com ícones animados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div 
          className="absolute text-cyan-300/30 dark:text-cyan-600/20"
          style={{
            left: `${mousePos.x * 0.02}px`,
            top: `${mousePos.y * 0.02}px`,
            transform: 'translate(-50%, -50%)',
            transition: 'all 0.3s ease-out'
          }}
        >
          <Calendar className="h-32 w-32" strokeWidth={1} />
        </div>
        <div 
          className="absolute text-blue-300/30 dark:text-blue-600/20"
          style={{
            right: `${mousePos.x * 0.01}px`,
            top: `${mousePos.y * 0.03}px`,
            transform: 'translate(50%, -50%)',
            transition: 'all 0.4s ease-out'
          }}
        >
          <Target className="h-40 w-40" strokeWidth={1} />
        </div>
        <div 
          className="absolute text-indigo-300/30 dark:text-indigo-600/20"
          style={{
            left: `${mousePos.x * 0.015}px`,
            bottom: `${mousePos.y * 0.02}px`,
            transform: 'translate(-50%, 50%)',
            transition: 'all 0.35s ease-out'
          }}
        >
          <TrendingUp className="h-36 w-36" strokeWidth={1} />
        </div>
      </div>

      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main
        className={`transition-all duration-300 ease-in-out ${
          sidebarOpen ? "ml-64" : "ml-20"
        } p-6 md:p-8 relative z-10`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                Metas Mensais
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                {mesAtual}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={mesAnterior}
                className="h-9 w-9"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={mesPosterior}
                className="h-9 w-9"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/30 transition-all duration-300 h-11 px-6">
            <Plus className="mr-2 h-5 w-5" />
            Nova Meta
          </Button>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Total no Mês
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  0
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-l-4 border-l-emerald-500 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Concluídas
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  0
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-l-4 border-l-amber-500 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Em Progresso
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  0
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Lista de Metas */}
        <Card className="p-12 text-center bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center">
            <Calendar className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Nenhuma meta mensal criada
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Comece definindo suas metas para este mês
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
};
