"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "./AdminSidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="min-h-screen bg-black-primary text-white-primary lg:grid lg:grid-cols-[280px_1fr]">
      <AdminSidebar />
      <main className="min-w-0 px-4 py-6 lg:px-8">{children}</main>
    </div>
  );
}

