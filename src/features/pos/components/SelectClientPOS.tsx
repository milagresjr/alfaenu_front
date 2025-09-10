"use client";

import { ChevronDown, Plus, Search } from "lucide-react";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useRef, useState } from "react";
import { ClienteType } from "@/features/client/types";
import { useClientes } from "@/features/client/hooks/useClientsQuery";

interface Props {
    selectedCliente: ClienteType | null;
    onSelectCliente: (fornecedor: ClienteType | null) => void;
    error?: boolean;
}

export function SelectClientPOS({
    selectedCliente,
    onSelectCliente,
}: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);

    const debouncedSearch = useDebounce(search, 500);

    const { data, isLoading } = useClientes(page, perPage, debouncedSearch);

    const dropdownRef = useRef<HTMLDivElement>(null);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (dropdownRef.current && !dropdownRef.current.contains(target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    // 🔥 foca quando o dropdown abrir
    useEffect(() => {
        if (!isOpen) return;
        const id = requestAnimationFrame(() => {
            inputRef.current?.focus();
        });
        return () => cancelAnimationFrame(id);
    }, [isOpen]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };
    // border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800
    return (
        <div className="w-full" ref={dropdownRef}>
            <div className="relative flex flex-col gap-1 pb-2">
                <label htmlFor="fornecedor" className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Cliente<span className="text-red-600">*</span>
                </label>
                <div
                    className={`relative h-11 w-full flex items-center text-sm pl-4 pr-8 rounded-lg shadow-theme-xs dark:text-white/90 dark:bg-gray-900 border border-gray-300 dark:border-gray-600
                        `}
                    onClick={() => setIsOpen((item) => (!item))}
                >
                    {selectedCliente?.nome}

                    {/* Ícone da seta */}
                    <ChevronDown
                        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400"
                        size={18}
                    />
                </div>


                {isOpen && (
                    <div className="absolute z-50 top-[5rem] bg-white dark:bg-gray-800 w-full border mt-1 shadow-lg rounded p-3">
                        {/* Header de busca e botão */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-1 w-auto px-2 py-1 border rounded transition-all duration-200 ease-in-out focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
                                <Search className="dark:text-gray-300" />
                                <input
                                    type="text"
                                    className="border-none outline-none ring-0 font-normal focus:ring-0 text-gray-600 focus:outline-none w-full bg-transparent dark:text-gray-300 dark:placeholder:text-gray-300"
                                    placeholder="Pesquisar cliente..."
                                    value={search}
                                    onChange={handleSearch}
                                    ref={inputRef}
                                />
                            </div>
                        </div>

                        {/* Loading spinner durante busca */}
                        {isLoading ? (
                            <div className="py-8 text-center text-gray-500 text-sm">Carregando...</div>
                        ) : (
                            <>
                                {/* Lista de clientes */}
                                <ul className="max-h-48 overflow-y-auto">
                                    {(data?.data.length ?? 0) > 0 ? (
                                        data?.data.map((cliente, idx) => (
                                            <li
                                                key={idx}
                                                className="px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded"
                                                onClick={() => {
                                                    onSelectCliente(cliente);
                                                    setIsOpen(false);
                                                }}
                                            >
                                                <strong className="text-gray-700 dark:text-gray-300 font-normal">{cliente.nome || ''}</strong>
                                                <div className="text-xs text-gray-400">{cliente.n_bi || ''}</div>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-sm text-gray-400 px-2">
                                            Nenhum cliente encontrado
                                        </li>
                                    )}
                                </ul>

                                {/* Paginação simples */}
                                {/* <div
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <SimplePagination
                                        currentPage={data?.current_page}
                                        lastPage={data?.last_page}
                                        totalItens={data?.total}
                                        isLoading={isLoading}
                                        tipoPaginacao="Clientees"
                                        onPageChange={(page) => {
                                            setPage(page);
                                            setIsOpen(true);
                                        }}
                                    />
                                </div> */}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
