"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { motion, AnimatePresence } from "framer-motion";
import {
    AlignJustify,
    LayoutDashboard,
    Users,
    FileText,
    Printer,
    Briefcase,
    ArrowLeftRight,
    X,
    ChevronDown,
    ChevronUp,
    Settings,
} from "lucide-react";
import path from "path";

export function InfoHeader() {
    const { user } = useAuthStore();
    const nomeUtilizador = user?.nome;

    const [open, setOpen] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const toggleMenu = () => setOpen((prev) => !prev);

    // Fecha o menu ao clicar fora
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
                setOpenSubmenu(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const navItems = [
        { name: "Dashboard", path: "/", icon: <LayoutDashboard size={18} /> },
        { name: "Clientes", path: "/client", icon: <Users size={18} /> },
        {
            name: "Contratos",
            icon: <FileText size={18} />,
            children: [
                { name: "Contratos", path: "/contract" },
                { name: "Subcontas", path: "/contract/subcontas" },
            ]
        },
        { name: "POS", path: "/pos", icon: <Printer size={18} /> },
        {
            name: "Serviços",
            icon: <Briefcase size={18} />,
            children: [
                { name: "Lista de Serviços", path: "/service" },
                { name: "Categorias", path: "/service-type" },
            ],
        },
        {
            name: "Operações e Movimentos",
            icon: <ArrowLeftRight size={18} />,
            path: "/services-operation",
        },
        { icon: <FileText />, name: "Termos", path: "/term" },
        { icon: <Settings />, name: "Operações e Caixa", path: "/operation" },
        { icon: <Users />, name: "Utilizadores", path: "/user" },
    ];

    const handleSubmenuToggle = (name: string) => {
        setOpenSubmenu((prev) => (prev === name ? null : name));
    };

    return (
        <div className="relative">
            <div className="flex flex-col items-start md:flex-row md:items-center justify-between px-4 pt-2">
                {/* Botão de menu */}
                <button
                    onClick={toggleMenu}
                    className="text-gray-700 dark:text-gray-300 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                    {open ? <X size={20} /> : <AlignJustify size={20} />}
                </button>

                {/* Título */}
                <h1 className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300 font-semibold">
                    Alfaenu
                </h1>

                {/* Info do utilizador */}
                <div className="flex items-center gap-4">
                    <div className="text-gray-600 dark:text-gray-300 font-medium">
                        Utilizador: {nomeUtilizador}
                    </div>
                    <div className="h-5 w-px bg-gray-300 dark:bg-gray-600" />
                    <div className="text-gray-600 dark:text-gray-300 font-medium">
                        {new Date().toLocaleDateString()}
                    </div>
                </div>
            </div>

            {/* Menu flutuante */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        ref={menuRef}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-14 left-4 z-50 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-2"
                    >
                        {navItems.map((item: any) => {
                            const hasChildren = !!item.children;

                            return (
                                <div key={item.name}>
                                    {
                                        item && hasChildren ? (
                                            <button
                                                onClick={() => handleSubmenuToggle(item.name)}
                                                className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
                                            >
                                                <div className="flex items-center gap-2">
                                                    {item.icon}
                                                    <span>{item.name}</span>
                                                </div>
                                                {openSubmenu === item.name ? (
                                                    <ChevronUp size={16} />
                                                ) : (
                                                    <ChevronDown size={16} />
                                                )}
                                            </button>
                                        ) : (
                                            <Link
                                                href={item.path ?? "#"}
                                                className="flex-1 text-left"
                                                onClick={() => setOpen(false)}
                                            >
                                                <button
                                                    onClick={() =>
                                                        hasChildren
                                                            ? handleSubmenuToggle(item.name)
                                                            : setOpen(false)
                                                    }
                                                    className="w-full flex items-center justify-between gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {item.icon}
                                                        {hasChildren ? (
                                                            <span className="text-left">{item.name}</span>
                                                        ) : (

                                                            <span>
                                                                {item.name}
                                                            </span>

                                                        )}
                                                    </div>
                                                    {hasChildren &&
                                                        (openSubmenu === item.name ? (
                                                            <ChevronUp size={16} />
                                                        ) : (
                                                            <ChevronDown size={16} />
                                                        ))}
                                                </button>
                                            </Link>
                                        )
                                    }

                                    {/* Subitens */}
                                    <AnimatePresence>
                                        {openSubmenu === item.name && hasChildren && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="pl-10 pr-4 pb-2 flex flex-col gap-1"
                                            >
                                                {item.children.map((child: any) => (
                                                    <Link
                                                        key={child.name}
                                                        href={child.path}
                                                        onClick={() => setOpen(false)}
                                                        className="text-gray-600 dark:text-gray-400 text-sm py-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                    >
                                                        {child.name}
                                                    </Link>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
