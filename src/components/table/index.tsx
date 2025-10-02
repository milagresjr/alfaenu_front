import React from "react";

type Column<T> = {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
  width?: string; // 👈 nova prop
};

type TableProps<T> = {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
};

export function TableMain<T>({
  data,
  columns,
  isLoading = false,
  emptyMessage = "Nenhum dado encontrado.",
}: TableProps<T>) {
  const showEmpty = !isLoading && data.length === 0;

  return (
    <div className="w-full">
      {/* scroll só no mobile */}
      <div className="overflow-x-auto md:overflow-x-visible">
        <table className="w-full md:table-fixed border-collapse">
          <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  style={col.width ? { width: col.width } : undefined} // 👈 aplica width
                  className={`px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-normal break-words ${col.className || ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400">
                    <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" />
                      <path className="opacity-75" strokeLinecap="round" strokeLinejoin="round" d="M12 2a10 10 0 000 20V2z" />
                    </svg>
                    <span>Carregando...</span>
                  </div>
                </td>
              </tr>
            ) : showEmpty ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-10 text-sm text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" />
                    </svg>
                    {emptyMessage}
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`transition-colors ${rowIndex % 2 === 0
                    ? "bg-white dark:bg-gray-900"
                    : "bg-gray-50 dark:bg-gray-800"
                    } hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer`}
                >
                  {columns.map((col, colIndex) => {
                    const value =
                      typeof col.accessor === "function"
                        ? col.accessor(item)
                        : item[col.accessor];

                    return (
                      <td
                        key={colIndex}
                        style={col.width ? { width: col.width } : undefined} // 👈 aplica width
                        className={`px-4 py-3 text-sm text-gray-800 dark:text-gray-200 whitespace-normal break-words ${col.className || ""}`}
                      >
                        {value as React.ReactNode}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
