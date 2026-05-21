"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleDollarSign, FolderKanban, Handshake, LayoutDashboard, TicketCheck, TimerReset, UsersRound } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/tickets", label: "Tickets", icon: TicketCheck },
  { href: "/time", label: "Time", icon: TimerReset },
  { href: "/reports", label: "Reports", icon: CircleDollarSign },
  { href: "/customers", label: "Customers", icon: Handshake },
  { href: "/team", label: "Team", icon: UsersRound },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="grid gap-2">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition ${
              active
                ? "bg-[#17201b] text-white shadow-[0_14px_30px_rgba(23,32,27,0.16)]"
                : "text-[#546159] hover:bg-white hover:text-[#17201b]"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
