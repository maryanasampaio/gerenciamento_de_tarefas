import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  CalendarDays,
  Calendar,
  CalendarRange,
  HelpCircle
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
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
    {
      icon: HelpCircle,
      label: "Como Usar",
      path: "/como-usar",
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
