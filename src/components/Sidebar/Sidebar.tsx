import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { useAuth } from "@/context/AuthContext";
import { usePastas } from "@/context/PastaContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  CalendarDays,
  Calendar,
  CalendarRange,
  Plus,
  Check,
  X
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const { logout, user } = useAuth();
  const { pastas, criarPasta } = usePastas();
  const navigate = useNavigate();
  const location = useLocation();
  const [criandoPasta, setCriandoPasta] = useState(false);
  const [tituloPasta, setTituloPasta] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleCriarPasta = () => {
    if (tituloPasta.trim()) {
      const novaPasta = criarPasta(tituloPasta.trim());
      setTituloPasta('');
      setCriandoPasta(false);
      navigate(`/pasta/${novaPasta.id}`);
    }
  };

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/pagina-inicial",
    },
    {
      icon: CalendarDays,
      label: "Metas Diárias",
      path: "/metas-diarias",
    },
    {
      icon: Calendar,
      label: "Metas Mensais",
      path: "/metas-mensais",
    },
    {
      icon: CalendarRange,
      label: "Metas Anuais",
      path: "/metas-anuais",
    },
    {
      icon: Settings,
      label: "Configurações",
      path: "/config-usuario",
    },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-gray-700 shadow-lg transition-all duration-300 ease-in-out z-40 ${
          isOpen ? "w-64" : "w-0 lg:w-20 overflow-hidden"
        }`}
      >
        {/* Header da Sidebar */}
        <div className={`flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 ${
          !isOpen && "lg:flex hidden"
        }`}>
          {isOpen ? (
            <Logo size="sm" />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-teal-600 rounded-lg items-center justify-center hidden lg:flex">
              <span className="text-white font-bold text-lg">T</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {isOpen ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Menu Items */}
        <nav className={`flex flex-col gap-2 p-4 ${
          !isOpen && "lg:flex hidden"
        }`}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Button
                key={item.path}
                variant="ghost"
                className={`justify-start gap-3 transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700"
                    : "hover:bg-cyan-50 hover:text-cyan-700 dark:hover:bg-cyan-950 dark:hover:text-cyan-400"
                } ${!isOpen && "justify-center"}`}
                onClick={() => navigate(item.path)}
              >
                <Icon className="h-5 w-5" />
                {isOpen && <span>{item.label}</span>}
              </Button>
            );
          })}
        </nav>

        {/* Seção de Pastas Personalizadas */}
        {isOpen && (
          <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4 mb-20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Minhas Pastas
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setCriandoPasta(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Input para criar nova pasta */}
            {criandoPasta && (
              <div className="mb-2 flex items-center gap-1 bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
                <Input
                  value={tituloPasta}
                  onChange={(e) => setTituloPasta(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCriarPasta();
                    if (e.key === 'Escape') {
                      setTituloPasta('');
                      setCriandoPasta(false);
                    }
                  }}
                  placeholder="Nome da pasta..."
                  className="h-8 text-sm"
                  autoFocus
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleCriarPasta}
                  className="h-8 w-8 text-green-600 hover:text-green-700"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setTituloPasta('');
                    setCriandoPasta(false);
                  }}
                  className="h-8 w-8 text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Lista de Pastas */}
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {pastas.length === 0 && !criandoPasta ? (
                <div className="text-xs text-gray-400 text-center py-4">
                  Nenhuma pasta criada
                </div>
              ) : (
                pastas.map((pasta) => {
                  const isActive = location.pathname === `/pasta/${pasta.id}`;
                  return (
                    <Button
                      key={pasta.id}
                      variant="ghost"
                      className={`w-full justify-start gap-2 text-sm h-9 ${
                        isActive
                          ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700"
                          : "hover:bg-cyan-50 hover:text-cyan-700 dark:hover:bg-cyan-950 dark:hover:text-cyan-400"
                      }`}
                      onClick={() => navigate(`/pasta/${pasta.id}`)}
                    >
                      <span className="text-base">{pasta.icone}</span>
                      <span className="truncate flex-1 text-left">{pasta.titulo}</span>
                      {pasta.isEstudo && (
                        <span className="text-xs">📚</span>
                      )}
                    </Button>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Footer da Sidebar */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-700">
          {/* Perfil do Usuário */}
          {isOpen ? (
            <div className="p-3 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center ring-2 ring-cyan-200 dark:ring-cyan-800">
                  <span className="text-white font-bold text-sm">
                    {(user?.nome || user?.usuario || "U").charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {user?.nome || "Usuário"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    @{user?.usuario || "usuario"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 flex justify-center border-b border-gray-200 dark:border-gray-700">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center ring-2 ring-cyan-200 dark:ring-cyan-800">
                <span className="text-white font-bold text-sm">
                  {(user?.nombre || user?.usuario || "U").charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          )}
          
          <div className="p-4">
          <Button
            variant="ghost"
            className={`w-full justify-start gap-3 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400 ${
              !isOpen && "justify-center"
            }`}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            {isOpen && <span>Sair</span>}
          </Button>
          </div>
        </div>
      </aside>

      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
};
