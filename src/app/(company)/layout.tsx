"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import MobileBottomNav from "@/layout/MobileBottomNav";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Ajusta o margin-left do conteúdo conforme o sidebar
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar */}
      <div className="hidden lg:flex">
        <AppSidebar />
      </div>

      {/* Fundo do menu mobile */}
      <Backdrop />

      {/* Área principal */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin} pb-[60px]`}
      >
        {/* Header */}
        <AppHeader />

        {/* Conteúdo principal */}
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          {children}
        </div>
      </div>

      {/* Menu inferior mobile */}
      <MobileBottomNav />
    </div>
  );
}
