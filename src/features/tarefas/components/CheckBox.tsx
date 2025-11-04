interface RoundCheckboxProps {
  checked: boolean;
  onChange: () => void;
  className?: string;
  children?: React.ReactNode;
}

export default function RoundCheckbox({ checked, onChange, className = "", children }: RoundCheckboxProps) {
  return (
    <div
      onClick={onChange}
      className={`h-5 w-5 rounded-full border flex items-center justify-center cursor-pointer 
        transition-colors duration-200 
        ${checked ? "bg-green-500 border-green-500" : "bg-white border-gray-400"} 
        ${className}
      `}
    >
      {children ?? (checked && <span className="text-white text-sm font-bold">✓</span>)}
    </div>
  );
}
