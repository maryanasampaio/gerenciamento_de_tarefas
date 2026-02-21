import * as React from "react"
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react"

export interface ToastProps {
  id: string
  title?: string
  description?: string
  type?: "success" | "error" | "warning" | "info"
  duration?: number
  onClose: () => void
}

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const styles = {
  success: "bg-green-50 border-green-500 text-green-900",
  error: "bg-red-50 border-red-500 text-red-900",
  warning: "bg-yellow-50 border-yellow-500 text-yellow-900",
  info: "bg-blue-50 border-blue-500 text-blue-900",
}

const iconStyles = {
  success: "text-green-600",
  error: "text-red-600",
  warning: "text-yellow-600",
  info: "text-blue-600",
}

export function Toast({ id, title, description, type = "info", duration = 5000, onClose }: ToastProps) {
  const Icon = icons[type]

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div
      className={`
        pointer-events-auto relative flex w-full max-w-md overflow-hidden rounded-lg border-l-4 shadow-lg
        ${styles[type]} p-4 animate-in slide-in-from-top-full duration-300
      `}
    >
      <div className="flex items-start gap-3 flex-1">
        <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${iconStyles[type]}`} />
        <div className="flex-1 space-y-1">
          {title && <div className="font-semibold text-sm">{title}</div>}
          {description && <div className="text-sm opacity-90">{description}</div>}
        </div>
      </div>
      <button
        onClick={onClose}
        className="ml-2 flex-shrink-0 rounded-md p-1 hover:bg-black/5 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export function ToastContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-md w-full">
      {children}
    </div>
  )
}
