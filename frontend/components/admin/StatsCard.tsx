import type { LucideIcon } from "lucide-react";

export function StatsCard({ label, value, icon: Icon }: { label: string; value: string | number; icon: LucideIcon }) {
  return (
    <div className="card p-5">
      <Icon className="text-gold-primary" />
      <div className="mt-4 text-3xl font-bold text-white-primary">{value}</div>
      <div className="mt-1 text-sm text-white-muted">{label}</div>
    </div>
  );
}

