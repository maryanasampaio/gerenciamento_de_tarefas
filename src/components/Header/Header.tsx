import { LoginViewModel } from "@/features/auth/viewmodel/AuthViewModel";
import { UserIcon } from "lucide-react";

export const Header = () => {


  const {
    handleLogout
  } = LoginViewModel();




  const handleMenu = () => {
    console.log('clicou!!!!!')
  }


  return (
    <>
      <header className="bg-white-600 text-white py-4 px-8 shadow-md">
        <div className="flex gap-3 justify-between" >
          <h2 className="text-black">Task</h2>
          <div className="flex gap-2 items-center">
            <UserIcon className="text-black h-6 w-6" onClick={handleLogout}></UserIcon>
            <div onClick={handleMenu}>
              <h2 className="text-black">nome do usuário</h2>

            </div>
          </div>

        </div>
      </header>
    </>

  );
}