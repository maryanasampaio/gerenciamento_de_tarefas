import { LoginViewModel } from "@/features/auth/viewmodel/AuthViewModel";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User, UserIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Logo } from "../ui/logo";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ConfirmDialog } from "../ui/confirm-dialog";
import { useState } from "react";

export const Header = () => {
  const { user, logout } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);



 return (
    <>
      <ConfirmDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        title="Sair da conta"
        description="Tem certeza que deseja sair da sua conta? Você precisará fazer login novamente."
        onConfirm={logout}
        confirmText="Sim, sair"
        cancelText="Cancelar"
        variant="destructive"
      />
      
      <header className="border-b border-border bg-card shadow-sm">
        <div className="">
          <div className="flex items-center justify-between mx-auto max-w-full px-3 sm:px-6 py-2 sm:py-3">
            <Link to="/pagina-inicial" className="transition-transform hover:scale-105">
              <Logo size="md" />
            </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="font-medium hidden sm:inline">{user}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <Link to={"/config-usuario"}>
                  <DropdownMenuItem >
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </DropdownMenuItem></Link>
          
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowLogoutDialog(true)} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
    </>
  );
}