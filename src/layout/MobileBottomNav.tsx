"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Briefcase,
  Printer,
  ArrowLeftRight,
  ChevronUp,
  Settings,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", icon: <LayoutDashboard size={22} />, path: "/" },
  { name: "Clientes", icon: <Users size={22} />, path: "/client" },
  {
    name: "Contratos",
    icon: <FileText size={22} />,
    subItems: [
      { name: "Contratos", path: "/contract" },
      { name: "Subcontas", path: "/contract/subcontas" },
    ],
  },
  { name: "POS", icon: <Printer size={22} />, path: "/pos" },
  {
    name: "Serviços",
    icon: <Briefcase size={22} />,
    subItems: [
      { name: "Serviços", path: "/service" },
      { name: "Categoria", path: "/service-type" },
    ],
  },
  { name: "Movimentos", icon: <ArrowLeftRight size={22} />, path: "/services-operation" },
  { name: "Op. Caixas", icon: <Settings size={22} />, path: "/operation" },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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
                    {/* <ChevronUp
                      size={14}
                      className={`transition-transform ${
                        openMenu === item.name ? "rotate-180" : ""
                      }`}
                    /> */}
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
