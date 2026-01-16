import { Outlet } from "@tanstack/react-router";
import { MenuIcon } from "lucide-react";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Button } from "@/components/ui/button";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export function AdminLayout() {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-glass-border border-b bg-background/80 px-4 backdrop-blur-xl md:px-6">
          <SidebarTrigger className="md:hidden">
            <Button size="icon-sm" variant="ghost">
              <MenuIcon className="size-5" />
            </Button>
          </SidebarTrigger>
          <div className="flex-1" />
          <SidebarTrigger className="hidden md:flex" />
        </header>
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
