"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Power, User } from "lucide-react";

export default function TopBar() {
  return (
    <nav className="xl:hidden w-screen bg-background border-b border-border py-4 px-6">
      <div className="flex items-center justify-between">
        {/* Log Out Button - Left */}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="group flex items-center justify-center p-2 rounded-lg hover:bg-error/10 transition-all duration-200"
        >
          <Power
            size={20}
            className="text-error/80 group-hover:text-error group-hover:scale-110 transition-all duration-200"
          />
        </button>

        {/* Logo - Center */}
        <Link
          href="/analytics"
          className="text-xl font-extrabold font-molgan text-hover hover:text-hover/80 transition-colors duration-200"
        >
          WorkHub
        </Link>

        {/* Profile Button - Right */}
        <Link
          href="/dashboard"
          className="group flex items-center justify-center p-2 rounded-lg hover:bg-accent/10 transition-all duration-200"
        >
          <User
            size={20}
            className="text-accent/65 group-hover:text-accent group-hover:scale-110 transition-all duration-200"
          />
        </Link>
      </div>
    </nav>
  );
}
