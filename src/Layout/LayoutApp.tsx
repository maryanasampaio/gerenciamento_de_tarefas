// src/components/Layout.tsx
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { LoginViewModel } from "@/features/auth/viewmodel/AuthViewModel";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export const LayoutApp = ({ children }: LayoutProps) => {

  const { isAuthenticated, loading } = LoginViewModel();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {isAuthenticated && <Header />}

      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>

      {isAuthenticated && <Footer />}
    </div>
  );
};
