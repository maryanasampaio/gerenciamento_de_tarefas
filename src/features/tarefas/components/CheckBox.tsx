import { Check } from "lucide-react";
import { useState } from "react";

export default function RoundCheckbox() {
  const [checked, setChecked] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setChecked(!checked)}
      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
        ${checked ? "bg-blue-500 border-blue-500" : "bg-white border-gray-400"}`}
    >
      {checked && <Check className="w-6 h-6 text-white" />}
    </button>
  );
}
