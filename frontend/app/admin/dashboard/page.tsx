"use client";

import Link from "next/link";
import { Activity, CalendarCheck, Radio, Users, UserCheck, MessageSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { StatsCard } from "@/components/admin/StatsCard";
import { api } from "@/lib/api";

type Dashboard = {
  stats: {
    leadsToday: number;
    leadsWeek: number;
    leadsMonth: number;
    enrollments: number;
    levelsStatus: string;
    contactsUnread: number;
    liveStatus: string;
  };
  recentLeads: Array<{ id: number; name: string; phone: string; email: string; createdAt: string }>;
};

export default function AdminDashboardPage() {
  const { data } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => (await api.get<Dashboard>("/api/admin/dashboard")).data
  });

  const stats = data?.stats;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-white-primary">Dashboard</h1>
        <p className="mt-2 text-white-secondary">Operational command center for StockWallah Academy leads, enrollments, levels, and sessions.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Leads Today" value={stats?.leadsToday ?? "—"} icon={Users} />
        <StatsCard label="Leads This Week" value={stats?.leadsWeek ?? "—"} icon={Activity} />
        <StatsCard label="Total Enrollments" value={stats?.enrollments ?? "—"} icon={UserCheck} />
        <StatsCard label="Unread Contacts" value={stats?.contactsUnread ?? "—"} icon={MessageSquare} />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="card p-5">
          <h2 className="text-xl font-semibold text-white-primary">Recent Leads</h2>
          <div className="mt-4 grid gap-3">
            {(data?.recentLeads || []).map((lead) => (
              <div key={lead.id} className="flex flex-col gap-1 rounded bg-black-primary p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-semibold text-white-primary">{lead.name}</div>
                  <div className="text-sm text-white-muted">{lead.phone} • {lead.email}</div>
                </div>
                <div className="text-sm text-white-muted">{new Date(lead.createdAt).toLocaleString("en-IN")}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-4">
          <div className="card p-5">
            <CalendarCheck className="text-gold-primary" />
            <h2 className="mt-4 text-xl font-semibold text-white-primary">Today&apos;s Levels</h2>
            <p className="mt-2 text-white-secondary">Status: {stats?.levelsStatus || "—"}</p>
            <Link href="/admin/levels" className="mt-4 inline-block text-sm font-semibold text-gold-light">
              Manage levels
            </Link>
          </div>
          <div className="card p-5">
            <Radio className="text-gold-primary" />
            <h2 className="mt-4 text-xl font-semibold text-white-primary">Live Stream</h2>
            <p className="mt-2 text-white-secondary">Status: {stats?.liveStatus || "—"}</p>
            <Link href="/admin/settings" className="mt-4 inline-block text-sm font-semibold text-gold-light">
              Update schedule
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

