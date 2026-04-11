import { createContext, useContext, useState, useCallback, useRef, useMemo, ReactNode } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { CheckCircle, XCircle, AlertCircle, Info, Loader2 } from "lucide-react"

type ModalType = "success" | "error" | "warning" | "info" | "loading"

interface ModalOptions {
  title: string
  description?: string
  type?: ModalType
  duration?: number
  onClose?: () => void
}

interface ModalContextType {
  showModal: (options: ModalOptions) => void
  hideModal: () => void
  success: (title: string, description?: string, duration?: number) => void
  error: (title: string, description?: string, duration?: number) => void
  warning: (title: string, description?: string, duration?: number) => void
  info: (title: string, description?: string, duration?: number) => void
  loading: (title: string, description?: string) => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [modalData, setModalData] = useState<ModalOptions | null>(null)
  const modalDataRef = useRef<ModalOptions | null>(null)

  const showModal = useCallback((options: ModalOptions) => {
    modalDataRef.current = options
    setModalData(options)
    setIsOpen(true)

    if (options.duration && options.type !== "loading") {
      setTimeout(() => {
        setIsOpen(false)
        setTimeout(() => {
          options.onClose?.()
          modalDataRef.current = null
          setModalData(null)
        }, 200)
      }, options.duration)
    }
  }, [])

  const hideModal = useCallback(() => {
    setIsOpen(false)
    setTimeout(() => {
      modalDataRef.current?.onClose?.()
      modalDataRef.current = null
      setModalData(null)
    }, 200)
  }, [])

  const success = useCallback((title: string, description?: string, duration = 2000) => {
    showModal({ title, description, type: "success", duration })
  }, [showModal])

  const error = useCallback((title: string, description?: string, duration = 6000) => {
    showModal({ title, description, type: "error", duration })
  }, [showModal])

  const warning = useCallback((title: string, description?: string, duration = 5000) => {
    showModal({ title, description, type: "warning", duration })
  }, [showModal])

  const info = useCallback((title: string, description?: string, duration = 2500) => {
    showModal({ title, description, type: "info", duration })
  }, [showModal])

  const loading = useCallback((title: string, description?: string) => {
    showModal({ title, description, type: "loading" })
  }, [showModal])

  const getIconAndColors = () => {
    switch (modalData?.type) {
      case "success":
        return {
          icon: <CheckCircle className="h-14 w-14" strokeWidth={2} />,
          bgGradient: "from-emerald-500/20 to-teal-500/20",
          iconBg: "bg-emerald-500",
          textColor: "text-emerald-700 dark:text-emerald-400"
        }
      case "error":
        return {
          icon: <XCircle className="h-14 w-14" strokeWidth={2} />,
          bgGradient: "from-rose-500/20 to-red-500/20",
          iconBg: "bg-rose-500",
          textColor: "text-rose-700 dark:text-rose-400"
        }
      case "warning":
        return {
          icon: <AlertCircle className="h-14 w-14" strokeWidth={2} />,
          bgGradient: "from-amber-500/20 to-orange-500/20",
          iconBg: "bg-amber-500",
          textColor: "text-amber-700 dark:text-amber-400"
        }
      case "loading":
        return {
          icon: <Loader2 className="h-14 w-14 animate-spin" strokeWidth={2} />,
          bgGradient: "from-blue-500/20 to-indigo-500/20",
          iconBg: "bg-blue-500",
          textColor: "text-blue-700 dark:text-blue-400"
        }
      default: // info
        return {
          icon: <Info className="h-14 w-14" strokeWidth={2} />,
          bgGradient: "from-blue-500/20 to-cyan-500/20",
          iconBg: "bg-blue-500",
          textColor: "text-blue-700 dark:text-blue-400"
        }
    }
  }

  const { icon, bgGradient, iconBg, textColor } = getIconAndColors()

  const contextValue = useMemo(() => ({ showModal, hideModal, success, error, warning, info, loading }), [showModal, hideModal, success, error, warning, info, loading])

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      
      <Dialog open={isOpen} onOpenChange={(open) => !open && modalData?.type !== "loading" && hideModal()}>
        <DialogContent className="sm:max-w-md border-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg shadow-2xl overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-60`}></div>
          <DialogHeader className="relative items-center text-center space-y-5 pt-8 pb-8 px-6">
            <div className={`mx-auto w-20 h-20 ${iconBg} rounded-2xl flex items-center justify-center shadow-lg animate-in zoom-in duration-500 rotate-3 hover:rotate-0 transition-transform`}>
              <div className="text-white">
                {icon}
              </div>
            </div>
            <div className="space-y-2">
              <DialogTitle className={`text-2xl font-bold ${textColor}`}>
                {modalData?.title}
              </DialogTitle>
              {modalData?.description && (
                <DialogDescription className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                  {modalData.description}
                </DialogDescription>
              )}
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </ModalContext.Provider>
  )
}

export function useModal() {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider")
  }
  return context
}
