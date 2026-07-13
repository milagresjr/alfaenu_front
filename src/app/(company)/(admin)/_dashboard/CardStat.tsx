import { ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface CardStatProps {
  title: string;
  value: number;
  isLoading?: boolean;
  icon?: ReactNode;
  accentColor?: string;
}

const accentMap: Record<string, { bg: string; iconBg: string; ring: string }> = {
  blue: {
    bg: "from-blue-500/10 via-blue-500/5 to-transparent",
    iconBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
    ring: "ring-blue-500/20",
  },
  emerald: {
    bg: "from-emerald-500/10 via-emerald-500/5 to-transparent",
    iconBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    ring: "ring-emerald-500/20",
  },
  violet: {
    bg: "from-violet-500/10 via-violet-500/5 to-transparent",
    iconBg: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
    ring: "ring-violet-500/20",
  },
  amber: {
    bg: "from-amber-500/10 via-amber-500/5 to-transparent",
    iconBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    ring: "ring-amber-500/20",
  },
};

export function CardStat({ title, value, isLoading = false, icon, accentColor = "blue" }: CardStatProps) {
  const a = accentMap[accentColor] ?? accentMap.blue;

  return (
    <div className={`relative flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md dark:border-white/[0.08] dark:bg-gray-900 ${a.ring} ring-1`}>
      <div className={`pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b ${a.bg}`} />

      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
          {title}
        </span>
        {icon && (
          <div className={`flex items-center justify-center rounded-lg p-2 ${a.iconBg}`}>
            {icon}
          </div>
        )}
      </div>

      <div className="relative">
        {isLoading ? (
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        ) : (
          <span className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {value.toLocaleString("pt-PT")}
          </span>
        )}
      </div>
    </div>
  );
}
