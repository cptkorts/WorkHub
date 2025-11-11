"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  ClipboardPen,
  FileText,
  Power,
  User,
  Users,
  ChartNoAxesCombined,
} from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const navLinks = [
    { href: "/analytics", label: "Analytics", icon: ChartNoAxesCombined },
    { href: "/clients", label: "Clients", icon: Users },
    { href: "/appointments", label: "Appointments", icon: ClipboardPen },
    { href: "/invoices", label: "Invoices", icon: FileText },
  ];

  return (
    <nav className="fixed left-0 top-0 h-screen w-60 bg-background border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link
          href="/analytics"
          className="text-2xl font-extrabold font-molgan text-hover hover:text-hover/80 transition-colors duration-200"
        >
          WorkHub
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6">
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="relative block px-6 py-3.5 overflow-hidden group"
            >
              <span
                className={`absolute inset-0 bg-success/75 transition-transform duration-400 ease-out ${
                  pathname === link.href
                    ? "translate-x-0"
                    : "-translate-x-full group-hover:translate-x-0"
                }`}
              ></span>
              <span
                className={`flex items-center gap-3 relative z-10 font-semibold transition-colors duration-400 ${
                  pathname === link.href
                    ? "text-white"
                    : "text-success group-hover:text-white"
                }`}
              >
                <Icon size={20} />
                {link.label}
              </span>
              {pathname === link.href && (
                <span className="absolute left-0 top-0 bottom-0 w-1 z-20"></span>
              )}
            </Link>
          );
        })}
      </div>

      {/* User Section */}
      <div className="border-t border-gray-200 p-4 space-y-2 flex flex-col items-start">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-accent/80 hover:text-accent font-semibold transition-colors duration-200"
        >
          <User size={20} />
          {session?.user?.name}
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="group flex items-center px-3 py-2 aspect-square border-2 hover:border-error rounded-full cursor-pointer text-transparent font-semibold transition-colors duration-200"
        >
          <Power
            size={20}
            className="group-hover:scale-115 text-error/80 group-hover:text-error transition-all duration-200"
          />
        </button>
      </div>
    </nav>
  );
}
