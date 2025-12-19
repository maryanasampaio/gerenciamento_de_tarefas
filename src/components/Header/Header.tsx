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
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export const Header = () => {
  const { user, logout } = useAuth();



 return (
    <header className="border-b border-border bg-card ">
      <div className="">
        <div className="flex items-center justify-between mx-auto max-w-full px-10 py-4">
          <Link to="/pagina-inicial">
                    <h1 className="text-2xl font-bold text-foreground">TaskFlow</h1>

          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium">{user}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <Link to={"/config-usuario"}>
                  <DropdownMenuItem >
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </DropdownMenuItem></Link>
          
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}