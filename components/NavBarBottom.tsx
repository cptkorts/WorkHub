"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardPen,
  FileText,
  Users,
  ChartNoAxesCombined,
} from "lucide-react";

export default function NavBarBottom() {
  const pathname = usePathname();
  const navLinks = [
    { href: "/analytics", label: "Analytics", icon: ChartNoAxesCombined },
    { href: "/clients", label: "Clients", icon: Users },
    { href: "/appointments", label: "Appointments", icon: ClipboardPen },
    { href: "/invoices", label: "Invoices", icon: FileText },
  ];

  return (
    <nav className="xl:hidden fixed bottom-0 left-0 right-0 h-16 w-screen overflow-hidden bg-background border-t border-border flex items-center justify-around z-50">
      {navLinks.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center justify-center gap-1 px-3 py-2 flex-1 group ${
              pathname === link.href ? "bg-success/20" : ""
            } transition-colors duration-200`}
          >
            <Icon
              size={22}
              className={`transition-colors duration-200 ${
                pathname === link.href
                  ? "text-success"
                  : "text-text-muted group-hover:text-success"
              }`}
            />
            <span
              className={`text-xs font-medium transition-colors duration-200 ${
                pathname === link.href
                  ? "text-success"
                  : "text-text-muted group-hover:text-success"
              }`}
            >
              {link.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
