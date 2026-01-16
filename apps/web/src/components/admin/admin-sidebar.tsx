import { Link, useLocation } from "@tanstack/react-router";
import {
  Gamepad2Icon,
  HomeIcon,
  type LucideIcon,
  PackageIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/ytta",
    icon: HomeIcon,
  },
];

const productNavItems: NavItem[] = [
  {
    title: "Games",
    href: "/ytta/game",
    icon: Gamepad2Icon,
  },
];

export function AdminSidebar() {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/ytta") {
      return location.pathname === "/ytta" || location.pathname === "/ytta/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="border-sidebar-border border-b">
        <Link className="flex items-center gap-3 px-2 py-1" to="/ytta">
          <div className="relative">
            <div className="absolute inset-0 rounded-lg bg-gaming-primary/30 blur-md" />
            <div className="relative rounded-lg bg-gradient-to-br from-gaming-primary to-gaming-secondary p-2">
              <Gamepad2Icon className="size-5 text-white" />
            </div>
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-bold text-sm">
              <span className="text-gradient-gaming">Game</span>
              <span className="text-sidebar-foreground">Top</span>
            </span>
            <span className="text-muted-foreground text-xs">Admin Panel</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={isActive(item.href)}
                    render={
                      <Link
                        className={cn(
                          isActive(item.href) && "text-gaming-primary"
                        )}
                        to={item.href}
                      />
                    }
                    tooltip={item.title}
                  >
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                    {item.badge && (
                      <span className="ml-auto rounded-full bg-gaming-primary/20 px-2 py-0.5 text-gaming-primary text-xs">
                        {item.badge}
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Products Section */}
        <SidebarGroup>
          <SidebarGroupLabel>
            <PackageIcon className="mr-2 size-4" />
            Products
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {productNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={isActive(item.href)}
                    render={
                      <Link
                        className={cn(
                          isActive(item.href) && "text-gaming-primary"
                        )}
                        to={item.href}
                      />
                    }
                    tooltip={item.title}
                  >
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-sidebar-border border-t">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="flex size-8 items-center justify-center rounded-full bg-gaming-primary/20">
            <span className="font-medium text-gaming-primary text-sm">A</span>
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-medium text-sm">Admin</span>
            <span className="text-muted-foreground text-xs">Administrator</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
