"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSupabase } from "@/components/supabase-provider";
import { LogOut } from "lucide-react";

export function DashboardNav() {
  const pathname = usePathname();
  const { signOut } = useSupabase();

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-2xl font-bold">
            Portfolio Manager
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/dashboard"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/dashboard"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/profile"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/dashboard/profile"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              Profile
            </Link>
            <Link
              href="/dashboard/projects"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/dashboard/projects"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              Projects
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={signOut}>
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Sign out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
