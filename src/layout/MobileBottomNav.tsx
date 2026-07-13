"use client";

import React, { useState, useMemo } from "react";
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
  Wallet,
  GraduationCap,
  ClipboardCheck,
  CalendarDays,
  Plane,
  Building2,
  ShieldCheck,
  Fingerprint,
  ScrollText,
  FileSignature,
  Menu,
  ChevronDown,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuthStore } from "@/store/useAuthStore";

enum UserType {
  INTERNAL = "interno",
  EXTERNAL = "externo"
}

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string }[];
};

const allNavItems: NavItem[] = [
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
  { name: "Clientes (Admin)", icon: <Users size={22} />, path: "/client" },
  { name: "Financiador", icon: <Wallet size={22} />, path: "/process-organization/financiador" },
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
  { name: "Solic. Matrícula", icon: <ClipboardCheck size={22} />, path: "/solicitacao-matricula" },
  {
    name: "Solic. Agendamento",
    icon: <CalendarDays size={22} />,
    subItems: [
      { name: "Solicitações", path: "/solicitacao-agendamento" },
      { name: "Descrições", path: "/solicitacao-agendamento/descricao" },
    ],
  },
  {
    name: "Solic. Print Voo",
    icon: <Plane size={22} />,
    subItems: [
      { name: "Solicitações", path: "/solicitacao-print-voo" },
      { name: "Descrições", path: "/solicitacao-print-voo/descricao" },
    ],
  },
  {
    name: "Solic. Reserva Hotel",
    icon: <Building2 size={22} />,
    subItems: [
      { name: "Solicitações", path: "/solicitacao-reserva-hotel" },
      { name: "Descrições", path: "/solicitacao-reserva-hotel/descricao" },
    ],
  },
  {
    name: "Solic. Seguro Viagem",
    icon: <ShieldCheck size={22} />,
    subItems: [
      { name: "Solicitações", path: "/solicitacao-seguro-viagem" },
      { name: "Descrições", path: "/solicitacao-seguro-viagem/descricao" },
    ],
  },
  {
    name: "Reconh. Registo Criminal",
    icon: <Fingerprint size={22} />,
    subItems: [
      { name: "Solicitações", path: "/solicitacao-reconhecimento-registo-criminal" },
      { name: "Configuração", path: "/solicitacao-reconhecimento-registo-criminal/config" },
    ],
  },
  {
    name: "Reconh. Notário",
    icon: <ScrollText size={22} />,
    subItems: [
      { name: "Solicitações", path: "/solicitacao-reconhecimento-notario" },
      { name: "Configuração", path: "/solicitacao-reconhecimento-notario/config" },
    ],
  },
  {
    name: "Reconh. Consulado",
    icon: <FileSignature size={22} />,
    subItems: [
      { name: "Solicitações", path: "/solicitacao-reconhecimento-consulado" },
    ],
  },
  {
    name: "Formações",
    icon: <GraduationCap size={22} />,
    subItems: [
      { name: "Cursos", path: "/course" },
      { name: "Centros de Formações", path: "/centro-formacao" },
    ],
  },
  { name: "Utilizadores", icon: <Users size={22} />, path: "/user" },
  { name: "Op. Caixas", icon: <Settings size={22} />, path: "/operation" },
];

interface Category {
  label: string;
  items: NavItem[];
}

function useFilteredNavItems(isInternal: boolean) {
  return useMemo(() => {
    if (isInternal) {
      const restrictedPaths = [
        "/process-organization-pt",
        "/process-organization-br",
        "/process-organization/my-clients",
        "/process-organization/financiador",
      ];
      const restrictedSubPaths = [
        "/process-organization-pt",
        "/process-organization-br",
        "/process-organization/my-clients",
      ];
      return allNavItems
        .map((item) => {
          if (item.path && restrictedPaths.includes(item.path)) return null;
          if (item.subItems) {
            const filtered = item.subItems.filter(
              (sub) => !restrictedSubPaths.includes(sub.path)
            );
            if (filtered.length === 0) return null;
            return { ...item, subItems: filtered };
          }
          return item;
        })
        .filter((item): item is NavItem => item !== null);
    }

    const restrictedPaths = [
      "/client", "/contract", "/services-operation", "/pos",
      "/user", "/operation", "/term", "/course", "/centro-formacao",
      "/solicitacao-matricula", "/solicitacao-agendamento",
      "/solicitacao-agendamento/descricao", "/solicitacao-print-voo",
      "/solicitacao-print-voo/descricao", "/solicitacao-reserva-hotel",
      "/solicitacao-reserva-hotel/descricao", "/solicitacao-seguro-viagem",
      "/solicitacao-seguro-viagem/descricao", "/solicitacao-reconhecimento-consulado",
      "/solicitacao-reconhecimento-registo-criminal",
      "/solicitacao-reconhecimento-registo-criminal/config",
      "/solicitacao-reconhecimento-notario",
      "/solicitacao-reconhecimento-notario/config",
    ];
    const restrictedSubPaths = [
      "/contract/subcontas", "/service", "/service-type",
      "/contract", "/course", "/centro-formacao",
      "/solicitacao-agendamento", "/solicitacao-agendamento/descricao",
      "/solicitacao-print-voo", "/solicitacao-print-voo/descricao",
      "/solicitacao-reserva-hotel", "/solicitacao-reserva-hotel/descricao",
      "/solicitacao-seguro-viagem", "/solicitacao-seguro-viagem/descricao",
      "/solicitacao-reconhecimento-consulado",
      "/solicitacao-reconhecimento-registo-criminal",
      "/solicitacao-reconhecimento-registo-criminal/config",
      "/solicitacao-reconhecimento-notario",
      "/solicitacao-reconhecimento-notario/config",
    ];
    return allNavItems
      .map((item) => {
        if (item.path && restrictedPaths.includes(item.path)) return null;
        if (item.subItems) {
          const filtered = item.subItems.filter(
            (sub) => !restrictedSubPaths.includes(sub.path)
          );
          if (filtered.length === 0) return null;
          return { ...item, subItems: filtered };
        }
        return item;
      })
      .filter((item): item is NavItem => item !== null);
  }, [isInternal]);
}

function buildCategories(items: NavItem[]): Category[] {
  const categories: Category[] = [];

  const dashboard = items.find((i) => i.path === "/");
  if (dashboard) categories.push({ label: "Geral", items: [dashboard] });

  const processos = items.find((i) => i.name === "Org. de Processos");
  const clientes = items.filter((i) => i.name === "Clientes" || i.name === "Clientes (Admin)");
  const financiador = items.find((i) => i.name === "Financiador");
  const processItems = [
    ...(clientes.length > 0 ? clientes : []),
    ...(processos ? [processos] : []),
    ...(financiador ? [financiador] : []),
  ];
  if (processItems.length > 0) {
    categories.push({ label: "Processos", items: processItems });
  }

  const solicitacoes = items.filter((i) =>
    i.name.startsWith("Solic.") || i.name === "Solic. Matrícula"
  );
  if (solicitacoes.length > 0) {
    categories.push({ label: "Solicitações", items: solicitacoes });
  }

  const reconhecimentos = items.filter((i) =>
    i.name.startsWith("Reconh.")
  );
  if (reconhecimentos.length > 0) {
    categories.push({ label: "Reconhecimentos", items: reconhecimentos });
  }

  const servicos = items.find((i) => i.name === "Serviços");
  const contratos = items.find((i) => i.name === "Contratos");
  const formacoes = items.find((i) => i.name === "Formações");
  const adminItems = [servicos, contratos, formacoes].filter(Boolean) as NavItem[];
  if (adminItems.length > 0) {
    categories.push({ label: "Gestão", items: adminItems });
  }

  const others = items.filter((i) =>
    i.path !== "/" &&
    !i.name.startsWith("Org. de Processos") &&
    !i.name.startsWith("Clientes") &&
    i.name !== "Financiador" &&
    !i.name.startsWith("Solic.") &&
    !i.name.startsWith("Reconh.") &&
    i.name !== "Serviços" &&
    i.name !== "Contratos" &&
    i.name !== "Formações"
  );
  if (others.length > 0) {
    categories.push({ label: "Outros", items: others });
  }

  return categories;
}

function MobileNavItem({
  item,
  isActive,
  onNavigate,
  pathname: currentPath,
}: {
  item: NavItem;
  isActive: boolean;
  onNavigate: () => void;
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const hasSubItems = !!item.subItems;

  if (!hasSubItems && item.path) {
    return (
      <Link
        href={item.path}
        onClick={onNavigate}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
          isActive
            ? "bg-primary/10 text-primary font-medium"
            : "text-foreground/80 hover:bg-muted"
        }`}
      >
        <span className="shrink-0">{item.icon}</span>
        <span>{item.name}</span>
      </Link>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-colors ${
          isActive
            ? "bg-primary/10 text-primary font-medium"
            : "text-foreground/80 hover:bg-muted"
        }`}
      >
        <span className="shrink-0">{item.icon}</span>
        <span className="flex-1 text-left">{item.name}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && item.subItems && (
        <div className="ml-9 mt-1 space-y-1">
          {item.subItems.map((sub) => (
            <Link
              key={sub.name}
              href={sub.path}
              onClick={onNavigate}
              className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                currentPath === sub.path
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {sub.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [sheetOpen, setSheetOpen] = useState(false);

  const userType = user?.type || UserType.EXTERNAL;
  const isInternal = userType === UserType.INTERNAL;

  const filteredItems = useFilteredNavItems(isInternal);

  const categories = useMemo(() => buildCategories(filteredItems), [filteredItems]);

  const isItemActive = (item: NavItem): boolean =>
    item.path === pathname ||
    (item.subItems?.some((sub) => sub.path === pathname) ?? false);

  const clientePath = isInternal
    ? "/client"
    : "/process-organization/my-clients";

  const quickLinks = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={22} />,
      path: "/",
    },
    {
      name: "Clientes",
      icon: <Users size={22} />,
      path: clientePath,
    },
    {
      name: "Processos",
      icon: <TicketsPlaneIcon size={22} />,
      path: "/process-organization-pt",
    },
  ];

  const closeSheet = () => setSheetOpen(false);

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-md flex justify-around items-center h-[60px] lg:hidden px-2">
        {quickLinks.map((link) => {
          const active = pathname === link.path;
          return (
            <Link
              key={link.name}
              href={link.path}
              className={`flex flex-col items-center justify-center text-xs transition-colors min-w-0 flex-1 ${
                active
                  ? "text-orange-500 dark:text-orange-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-orange-500"
              }`}
            >
              {link.icon}
              <span className="mt-1 truncate max-w-full">{link.name}</span>
            </Link>
          );
        })}

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <button
              className={`flex flex-col items-center justify-center text-xs transition-colors min-w-0 flex-1 text-gray-500 dark:text-gray-400 hover:text-orange-500`}
            >
              <Menu size={22} />
              <span className="mt-1">Mais</span>
            </button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="h-[85vh] rounded-t-2xl p-0"
          >
            <SheetHeader className="sticky top-0 z-10 bg-background border-b px-4 py-3">
              <SheetTitle className="text-lg">Menu</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto h-full pb-8 px-4 pt-4">
              {categories.map((cat) => (
                <div key={cat.label} className="mb-5">
                  <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2 px-1">
                    {cat.label}
                  </h3>
                  <div className="space-y-0.5">
                    {cat.items.map((item) => (
                      <MobileNavItem
                        key={item.name}
                        item={item}
                        isActive={isItemActive(item)}
                        onNavigate={closeSheet}
                        pathname={pathname}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </>
  );
}
