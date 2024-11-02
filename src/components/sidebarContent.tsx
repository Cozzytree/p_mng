"use client";

import { usePathname } from "next/navigation";
import { SidebarContent, SidebarHeader, useSidebar } from "./ui/sidebar";
import Link from "next/link";
import { Button } from "./ui/button";
import React from "react";

interface pathProps {
  href: string;
  label: string;
  icon: React.ReactNode;
}

type props = {
  paths: pathProps[];
};

export default function SidebarContentStyle({ paths }: props) {
  const pathname = usePathname();
  const { open, isMobile } = useSidebar();

  return (
    <>
      <SidebarHeader className={`${isMobile && "z-20"} py-6 px-3`}>
        P_MNG
      </SidebarHeader>
      <SidebarContent className="flex flex-col gap-0">
        {paths.map((r) => (
          <Link key={r.href} href={r.href}>
            <Button
              className={`w-full flex justify-start pl-4 ${pathname === r.href && "bg-foreground/5"}`}
              size={"sm"}
              variant={"ghost"}
            >
              <span>{r.icon}</span> {r.label}
            </Button>
          </Link>
        ))}
      </SidebarContent>
    </>
  );
}
