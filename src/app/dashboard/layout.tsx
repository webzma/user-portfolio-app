import type React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/signin");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardNav />
      <div className="flex-1 container py-8">{children}</div>
    </div>
  );
}
