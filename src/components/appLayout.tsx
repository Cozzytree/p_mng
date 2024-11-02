import React from "react";
import { Sidebar, SidebarTrigger } from "./ui/sidebar";
import SidebarContentStyle from "./sidebarContent";
import { DashboardIcon } from "@radix-ui/react-icons";
import { Settings, Users } from "lucide-react";

type props = {
  children: React.ReactNode;
};

const route = [
  { label: "Dashboard", href: "/dashboard", icon: <DashboardIcon /> },
  { label: "Organizations", href: "/organization", icon: <Users /> },
  { label: "Settings", href: "/settings", icon: <Settings /> },
];

export default function AppLayout({ children }: props) {
  return (
    <>
      <Sidebar variant="sidebar" collapsible="offcanvas" className="min-w-8">
        <SidebarContentStyle paths={route} />
      </Sidebar>
      <main className="w-full px-4 sm:px-10 relative py-2">
        <SidebarTrigger className="absolute top-1 left-1" />
        {children}
      </main>
    </>
  );
}
