// components/layout/AppLayout.tsx
"use client";

import { useState } from "react";
import DasboardHeader from "./header/DasboardHeader";
import { Sidebar } from "./sidebar/Sidebar";
import { SidebarFooter } from "./sidebar/SidebarFooter";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { ModuleRouteGuard } from "../modules/core/ModuleRouteGuard";

interface AppLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export function AppLayout({ children, showFooter = true }: AppLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex sticky top-0 h-screen overflow-hidden shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer */}
      <Drawer open={mobileOpen} onOpenChange={setMobileOpen} direction="left">
        <DrawerTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-50 h-9 w-9"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-full w-64 mt-0 rounded-none">
          <Sidebar onItemClick={() => setMobileOpen(false)} />
        </DrawerContent>
      </Drawer>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <DasboardHeader onMenuClick={() => setMobileOpen(true)} />

        <main className="flex-1 overflow-auto px-5 pt-4">
          <ModuleRouteGuard>
            {children}
          </ModuleRouteGuard>
        </main>

        {showFooter && <SidebarFooter />}
      </div>
    </div>
  );
}
