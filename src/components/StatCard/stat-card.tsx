import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  change,
  icon,
  isActive = false,
  onClick,
}: StatCardProps) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-xl border p-4 shadow-sm transition 
        ${
          isActive
            ? "border-primary/20 bg-primary/10 dark:bg-primary/20"
            : "border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.05]"
        }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex items-center justify-center rounded-lg w-12 h-12 ${
            isActive
              ? "bg-gray-300 dark:bg-gray-400 text-white"
              : "bg-gray-100 dark:bg-white/[0.08] text-primary"
          }`}
        >
          {icon}
        </div>
        <div className="flex flex-col gap-1 items-start justify-center ">
          <p className="text-xl font-semibold text-gray-900 dark:text-white">
            {value}
          </p>
          <p className="text-left text-sm text-gray-500 dark:text-gray-400">{title}</p>
        </div>
      </div>
      <span
        className={`text-sm font-medium ${
          change.startsWith("+")
            ? "text-green-600 dark:text-green-400"
            : "text-red-600 dark:text-red-400"
        }`}
      >
        {change}
      </span>
    </button>
  );
}
