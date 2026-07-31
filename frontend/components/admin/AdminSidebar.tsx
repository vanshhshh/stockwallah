"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, CandlestickChart, Images, LayoutDashboard, LogOut, Mail, Settings, Users, UserCheck, MessageSquare } from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/common/LogoMark";

const nav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/levels", label: "Daily Levels", icon: CandlestickChart },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/enrollments", label: "Enrollments", icon: UserCheck },
  { href: "/admin/contacts", label: "Contacts", icon: MessageSquare },
  { href: "/admin/gallery", label: "Gallery & Banners", icon: Images },
  { href: "/admin/settings", label: "Settings", icon: Settings }
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await api.post("/api/admin/auth/logout");
    router.push("/admin/login");
  }

  return (
    <aside className="sticky top-0 z-20 h-fit border-b border-black-border bg-black-surface p-4 lg:h-screen lg:border-b-0 lg:border-r">
      <div className="mb-6">
        <LogoMark />
        <div className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-white-muted">Admin</div>
      </div>
      <nav className="flex gap-2 overflow-x-auto pb-1 lg:grid lg:overflow-visible">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "premium-focus inline-flex min-h-11 shrink-0 items-center gap-3 rounded px-3 text-sm font-semibold transition",
              pathname === href ? "bg-gold-muted text-gold-light" : "text-white-secondary hover:bg-black-elevated hover:text-white-primary"
            )}
          >
            <Icon size={18} /> {label}
          </Link>
        ))}
      </nav>
      <button onClick={logout} className="premium-focus mt-6 inline-flex min-h-11 items-center gap-3 rounded px-3 text-sm font-semibold text-white-secondary hover:bg-black-elevated hover:text-white-primary">
        <LogOut size={18} /> Logout
      </button>
      <a href="mailto:stockwallahtradingacademy@gmail.com" className="mt-6 hidden items-center gap-2 rounded border border-black-border bg-black-primary p-3 text-sm text-white-muted lg:flex">
        <Mail size={16} className="text-gold-primary" /> stockwallahtradingacademy@gmail.com
      </a>
    </aside>
  );
}
