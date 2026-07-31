"use client";

import { cn } from "@/lib/utils";

export const filters = ["All", "Online", "Offline"];

export function CourseFilters({ value, onChange }: { value: string; onChange: (filter: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter}
          type="button"
          onClick={() => onChange(filter)}
          className={cn(
            "premium-focus min-h-11 rounded border px-4 text-sm font-semibold transition",
            value === filter ? "border-gold-primary bg-gold-muted text-gold-light" : "border-black-border bg-black-surface text-white-secondary hover:border-gold-primary/60 hover:text-gold-light"
          )}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
