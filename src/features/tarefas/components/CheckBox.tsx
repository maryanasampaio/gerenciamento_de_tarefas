
interface RoundCheckboxProps {
  checked: boolean;
  onChange: () => void;
}

export default function RoundCheckbox({ checked, onChange }: RoundCheckboxProps) {
  return (
    <div
      onClick={onChange}
      className={`h-5 w-5 rounded-full border flex items-center justify-center cursor-pointer 
        transition-colors duration-200 
        ${checked ? "bg-green-500 border-green-500" : "bg-white border-gray-400"}
      `}
    >
      {checked && <span className="text-white text-sm font-bold">✓</span>}
    </div>
  );
}
