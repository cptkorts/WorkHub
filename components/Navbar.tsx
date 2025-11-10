"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { ClipboardPen, FileText, Power, User, Users } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const navLinks = [
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
      <div className="flex-1 py-6 px-4 space-y-2">
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 font-medium transition-all duration-200 ${
                pathname === link.href
                  ? "text-default border-l-4 border-default font-semibold"
                  : "text-light hover:text-hover"
              }`}
            >
              <Icon size={20} />
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* User Section */}
      <div className="border-t border-gray-200 p-4 space-y-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-accent/80 hover:text-accent font-medium transition-colors duration-200"
        >
          <User size={20} />
          {session?.user?.name}
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-default hover:text-error cursor-pointer font-medium transition-colors duration-200"
        >
          <Power size={20} />
          Sign Out
        </button>
      </div>
    </nav>
  );
}
