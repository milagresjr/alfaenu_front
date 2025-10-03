"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  ChevronDownIcon,
  HorizontaLDots,
} from "../icons/index";

import {
  LayoutDashboard,
  Users,
  FileText,
  Printer,
  Briefcase,
  ArrowLeftRight,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  { icon: <LayoutDashboard />, name: "Dashboard", path: "/" },
  { icon: <Users />, name: "Clientes", path: "/client" },
  {
    icon: <FileText />,
    name: "Contratos",
    subItems: [
      { name: "Contratos", path: "/contract" },
      { name: "Subcontas", path: "/contract/subcontas" },
    ],
  },
  { icon: <ArrowLeftRight />, name: "Operações e Movimentos", path: "/services-operation" },
  { icon: <Printer />, name: "Gerar Documento (POS)", path: "/pos" },
  {
    name: "Serviços",
    icon: <Briefcase />,
    subItems: [
      { name: "Serviços", path: "/service" },
      { name: "Categoria", path: "/service-type" },
    ],
  },
  { icon: <FileText />, name: "Termos", path: "/term" },
  { icon: <Users />, name: "Utilizadores", path: "/user" },
];

const othersItems: NavItem[] = [];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const [openSubmenu, setOpenSubmenu] = useState<{ type: "main" | "others"; index: number } | null>(null);
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prev) =>
      prev && prev.type === menuType && prev.index === index ? null : { type: menuType, index }
    );
  };

  // Abre submenu automaticamente se o path estiver ativo
  useEffect(() => {
    let matched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems?.some((sub) => isActive(sub.path))) {
          setOpenSubmenu({ type: menuType as "main" | "others", index });
          matched = true;
        }
      });
    });
    if (!matched) setOpenSubmenu(null);
  }, [pathname, isActive]);

  // Define altura animada dos submenus
  useEffect(() => {
    if (openSubmenu) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" | "others"
  ) => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => {
        const hasSubItems = !!nav.subItems;

        return (
          <li key={nav.name} className="relative">
            {!hasSubItems ? (
              // ITEM SIMPLES (com tooltip se sidebar fechada)
              nav.path && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={nav.path}
                      className={`menu-item group ${isActive(nav.path)
                        ? "menu-item-active"
                        : "menu-item-inactive"
                        } ${!isExpanded && !isMobileOpen ? "lg:justify-center" : "lg:justify-start"}`}
                    >
                      <span
                        className={`${isActive(nav.path)
                          ? "menu-item-icon-active"
                          : "menu-item-icon-inactive"
                          }`}
                      >
                        {nav.icon}
                      </span>
                      {(isExpanded || isMobileOpen) && (
                        <span className="menu-item-text">{nav.name}</span>
                      )}
                    </Link>
                  </TooltipTrigger>
                  {!isExpanded && !isMobileOpen && (
                    <TooltipContent side="right">{nav.name}</TooltipContent>
                  )}
                </Tooltip>
              )
            ) : (
              // ITEM COM SUBITENS
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() =>
                        isExpanded || isMobileOpen
                          ? handleSubmenuToggle(index, menuType)
                          : null
                      }
                      className={`menu-item group ${openSubmenu?.type === menuType && openSubmenu?.index === index
                        ? "menu-item-active"
                        : "menu-item-inactive"
                        } ${!isExpanded && !isMobileOpen ? "lg:justify-center" : "lg:justify-start"}`}
                    >
                      <span
                        className={`${openSubmenu?.type === menuType &&
                          openSubmenu?.index === index
                          ? "menu-item-icon-active"
                          : "menu-item-icon-inactive"
                          }`}
                      >
                        {nav.icon}
                      </span>
                      {(isExpanded || isMobileOpen) && (
                        <span className="menu-item-text">{nav.name}</span>
                      )}
                      {(isExpanded || isMobileOpen) && (
                        <ChevronDownIcon
                          className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.type === menuType &&
                            openSubmenu?.index === index
                            ? "rotate-180 text-orange-500"
                            : ""
                            }`}
                        />
                      )}
                    </button>
                  </TooltipTrigger>
                  {/* Tooltip como "menu flutuante" quando sidebar fechada */}
                  {!isExpanded && !isMobileOpen && (
                    <TooltipContent side="right" className="p-2">
                      <ul className="flex flex-col gap-1">
                        {nav.subItems?.map((subItem) => (
                          <li key={subItem.name}>
                            <Link
                              href={subItem.path}
                              className={`block px-3 py-1 rounded-md text-sm hover:bg-gray-700 dark:hover:bg-gray-300 ${isActive(subItem.path)
                                  ? "bg-gray-700 dark:bg-gray-300 font-semibold"
                                  : ""
                                }`}
                            >
                              {subItem.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </TooltipContent>
                  )}
                </Tooltip>
                {/* Submenu expandido quando sidebar aberta */}
                {isExpanded || isMobileOpen ? (
                  <div
                    ref={(el) => {
                      subMenuRefs.current[`${menuType}-${index}`] = el;
                    }}
                    className="overflow-hidden transition-all duration-300"
                    style={{
                      height:
                        openSubmenu?.type === menuType &&
                          openSubmenu?.index === index
                          ? `${subMenuHeight[`${menuType}-${index}`]}px`
                          : "0px",
                    }}
                  >
                    <ul className="mt-2 space-y-1 ml-9">
                      {nav.subItems?.map((subItem) => (
                        <li key={subItem.name}>
                          <Link
                            href={subItem.path}
                            className={`menu-dropdown-item ${isActive(subItem.path)
                                ? "menu-dropdown-item-active"
                                : "menu-dropdown-item-inactive"
                              }`}
                          >
                            {subItem.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </>
            )}
          </li>
        );
      })}
    </ul>
  );


  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-99 border-r border-gray-200 
    ${isExpanded || isMobileOpen ? "w-[290px]" : "w-[90px]"}
    ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0`}
    >
      <div
        className={`w-full py-0 flex ${!isExpanded ? "lg:justify-center py-6" : "justify-center"}`}
      >
        <Link href="/">
          {isExpanded || isMobileOpen ? (
            <>
              <Image
                className="dark:hidden"
                src="/images/logo/alfaenu-logo-preto.png"
                alt="Logo"
                width={150}
                height={40}
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/alfaenu-logo.png"
                alt="Logo"
                width={150}
                height={10}
              />
            </>
          ) : (
            <Image
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded ? "lg:justify-center" : "justify-start"
                  }`}
              >
                {isExpanded || isMobileOpen ? "Menu" : <HorizontaLDots />}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>

            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded ? "lg:justify-center" : "justify-start"
                  }`}
              >
                {isExpanded || isMobileOpen ? "" : <HorizontaLDots />}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
      </div>
    </aside>

  );
};

export default AppSidebar;
