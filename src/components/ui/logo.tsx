interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
}

const sizes = {
  sm: "h-8",
  md: "h-12",
  lg: "h-16",
  xl: "h-24",
}

export function Logo({ className = "", size = "md" }: LogoProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src="/logo.svg" 
        alt="TaskFlow" 
        className={`${sizes[size]} w-auto`}
      />
    </div>
  )
}
