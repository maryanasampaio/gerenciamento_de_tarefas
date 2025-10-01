import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginView } from "./features/auth/views/LoginView";
import { CadastroView } from "./features/cadastro/views/CadastroView";




export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginView />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/cadastro" element={<CadastroView />} />

      </Routes>


    </BrowserRouter>
  );
}



