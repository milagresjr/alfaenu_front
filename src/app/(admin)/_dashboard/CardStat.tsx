import { Loader2 } from "lucide-react";


interface CardStatProps {
  // Define any props if needed
  title: string;
  value: number;
  isLoading?: boolean;
}
export function CardStat({ title, value, isLoading }: CardStatProps) {
  return (

    // !isLoading ? (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">{title}</h2>
      <p className="text-2xl text-gray-700 dark:text-gray-200">{!isLoading ? value : (<Loader2 className="animate-spin" />)}</p>
    </div>
    // ) : (
    //   <></>
    // )

  );
}