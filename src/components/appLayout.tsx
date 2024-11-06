import React from "react";
import { Sidebar, SidebarTrigger } from "./ui/sidebar";
import SidebarContentStyle from "./sidebarContent";
import { DashboardIcon } from "@radix-ui/react-icons";
import { Users } from "lucide-react";

type props = {
  children: React.ReactNode;
};

const route = [
  { label: "Dashboard", href: "/dashboard", icon: <DashboardIcon /> },
  { label: "Organizations", href: "/organization", icon: <Users /> },
];

export default function AppLayout({ children }: props) {
  return (
    <>
      <Sidebar
        variant="floating"
        collapsible="offcanvas"
        className="min-w-8 transition-none duration-0"
      >
        <SidebarContentStyle paths={route} />
      </Sidebar>
      <main className="w-full px-4 h-screen sm:px-10 relative overflow-y-auto">
        <SidebarTrigger className="absolute top-3 left-1" />
        {children}
      </main>
    </>
  );
}
