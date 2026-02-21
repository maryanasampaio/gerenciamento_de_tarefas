import { createContext, useContext, useState, useCallback } from "react"
import { Toast, ToastContainer, ToastProps } from "@/components/ui/toast"

type ToastType = "success" | "error" | "warning" | "info"

interface ToastContextType {
  showToast: (title: string, description?: string, type?: ToastType, duration?: number) => void
  success: (title: string, description?: string) => void
  error: (title: string, description?: string) => void
  warning: (title: string, description?: string) => void
  info: (title: string, description?: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const showToast = useCallback(
    (title: string, description?: string, type: ToastType = "info", duration = 5000) => {
      const id = Math.random().toString(36).substr(2, 9)
      const newToast: ToastProps = {
        id,
        title,
        description,
        type,
        duration,
        onClose: () => removeToast(id),
      }
      setToasts((prev) => [...prev, newToast])
    },
    []
  )

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const success = useCallback((title: string, description?: string) => {
    showToast(title, description, "success")
  }, [showToast])

  const error = useCallback((title: string, description?: string) => {
    showToast(title, description, "error")
  }, [showToast])

  const warning = useCallback((title: string, description?: string) => {
    showToast(title, description, "warning")
  }, [showToast])

  const info = useCallback((title: string, description?: string) => {
    showToast(title, description, "info")
  }, [showToast])

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      <ToastContainer>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
