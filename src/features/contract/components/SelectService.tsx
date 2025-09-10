import React from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  value: string | number;
  label: string;
}

interface SelectServicesProps {
  value: string | number;
  onChange: (value: string) => void;
  opcoesServicos: Option[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const SelectServices: React.FC<SelectServicesProps> = ({
  value,
  onChange,
  opcoesServicos,
  placeholder = "Selecione um serviço",
  className = "",
  disabled = false,
}) => {
  return (
    <div className="relative w-full">
      <select
        className={`h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-10 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
          disabled ? "bg-gray-200 dark:bg-gray-800 cursor-not-allowed" : ""
        } ${className}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {opcoesServicos?.map((op) => (
          <option
            key={op.value}
            value={op.value}
            className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
          >
            {op.label}
          </option>
        ))}
      </select>

      {/* Ícone da seta */}
      <ChevronDown
        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400"
        size={18}
      />
    </div>
  );
};

export default SelectServices;
