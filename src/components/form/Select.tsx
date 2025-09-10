import React from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
  value?: string;
  disabled?: boolean;
  name: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder,
  onChange,
  className = "",
  value = "",
  name,
  disabled = false,
}) => {
  return (
    <div className="relative w-full">
      <select
        className={`h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-10 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
          disabled ? "bg-gray-200 dark:bg-gray-800" : ""
        } ${className}`}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        name={name}
        disabled={disabled}
      >
        {placeholder && (
          <option
            value=""
            disabled
            className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
          >
            {placeholder}
          </option>
        )}
        {options.map((option, index) => (
          <option
            key={index}
            value={option.value}
            className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
          >
            {option.label}
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

export default Select;
