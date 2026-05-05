"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Briefcase,
  Printer,
  ArrowLeftRight,
  Settings,
  TicketsPlaneIcon,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

// Definição dos tipos de usuário (mesmo do sidebar)
enum UserType {
  INTERNAL = "interno",
  EXTERNAL = "externo"
}

// Todos os itens do menu (completos)
const allNavItems = [
  { name: "Dashboard", icon: <LayoutDashboard size={22} />, path: "/" },
  {
    name: "Org. de Processos",
    icon: <TicketsPlaneIcon size={22} />,
    subItems: [
      { name: "Portugal", path: "/process-organization-pt" },
      { name: "Brasil", path: "/process-organization-br" },
    ],
  },
  { name: "Clientes", icon: <Users size={22} />, path: "/process-organization/my-clients" },
  { name: "Clientes", icon: <Users size={22} />, path: "/client" },
  {
    name: "Contratos",
    icon: <FileText size={22} />,
    subItems: [
      { name: "Contratos", path: "/contract" },
      { name: "Subcontas", path: "/contract/subcontas" },
    ],
  },
  { name: "Movimentos", icon: <ArrowLeftRight size={22} />, path: "/services-operation" },
  { name: "POS", icon: <Printer size={22} />, path: "/pos" },
  {
    name: "Serviços",
    icon: <Briefcase size={22} />,
    subItems: [
      { name: "Serviços", path: "/service" },
      { name: "Categoria", path: "/service-type" },
    ],
  },
  { name: "Termos", icon: <FileText size={22} />, path: "/term" },
  { name: "Utilizadores", icon: <Users size={22} />, path: "/user" },
  { name: "Op. Caixas", icon: <Settings size={22} />, path: "/operation" },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Pega o tipo do usuário
  const userType = user?.type || UserType.EXTERNAL;
  const isInternal = userType === UserType.INTERNAL;

  // Filtra os menus baseado no tipo de usuário
  const navItems = useMemo(() => {
    // Se for interno, mostra todos
    if (isInternal) {
      return allNavItems;
    }

    // Para externos, filtra
    const filterExternalItems = (items: typeof allNavItems) => {
      return items
        .map((item) => {
          // Paths restritos para externos
          const restrictedPaths = [
            "/client",
            "/contract",
            "/services-operation",
            "/pos",
            "/user",
            "/operation",
            "/term",
          ];

          // Se o item principal é restrito, não mostra
          if (item.path && restrictedPaths.includes(item.path)) {
            return null;
          }

          // Se tem subitems, filtra os subitems restritos
          if (item.subItems) {
            const restrictedSubPaths = [
              "/contract/subcontas",
              "/service",
              "/service-type",
              "/contract",
            ];

            const filteredSubItems = item.subItems.filter(
              (subItem) => !restrictedSubPaths.includes(subItem.path)
            );

            // Se não restou nenhum subitem, não mostra o item principal
            if (filteredSubItems.length === 0) {
              return null;
            }

            // Retorna o item com os subitems filtrados
            return {
              ...item,
              subItems: filteredSubItems,
            };
          }

          return item;
        })
        .filter((item): item is typeof allNavItems[0] => item !== null);
    };

    return filterExternalItems(allNavItems);
  }, [isInternal]);

  // Fecha submenu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      ref={menuRef}
      className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-md flex justify-around items-center h-[60px] lg:hidden"
    >
      {navItems.map((item) => {
        const isActive =
          item.path === pathname ||
          item.subItems?.some((sub) => sub.path === pathname);

        const hasSubItems = !!item.subItems;

        return (
          <div key={item.name} className="relative">
            {!hasSubItems ? (
              <Link
                href={item.path || "#"}
                className={`flex flex-col items-center justify-center text-xs transition-colors ${
                  isActive
                    ? "text-orange-500 dark:text-orange-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-orange-500"
                }`}
              >
                {item.icon}
                <span className="mt-1">{item.name}</span>
              </Link>
            ) : (
              <>
                <button
                  onClick={() =>
                    setOpenMenu(openMenu === item.name ? null : item.name)
                  }
                  className={`flex flex-col items-center justify-center text-xs transition-colors ${
                    isActive
                      ? "text-orange-500 dark:text-orange-400"
                      : "text-gray-500 dark:text-gray-400 hover:text-orange-500"
                  }`}
                >
                  {item.icon}
                  <span className="mt-1 flex items-center gap-1">
                    {item.name}
                  </span>
                </button>

                {/* Submenu flutuante */}
                {openMenu === item.name && (
                  <div className="absolute bottom-[60px] left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 w-44 py-2">
                    {item.subItems?.map((sub) => (
                      <Link
                        key={sub.name}
                        href={sub.path}
                        onClick={() => setOpenMenu(null)}
                        className={`block px-4 py-2 text-sm text-center ${
                          pathname === sub.path
                            ? "bg-orange-100 dark:bg-gray-700 text-orange-600 dark:text-orange-400"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
    </nav>
  );
}