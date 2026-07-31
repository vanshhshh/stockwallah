"use client";

import { ArrowRight } from "lucide-react";
import { useLevels } from "@/hooks/useLevels";
import { todayIso } from "@/lib/utils";
import { LevelCard } from "@/components/levels/LevelCard";
import { GoldButton } from "@/components/common/GoldButton";

export function LevelsTeaser() {
  const { data, isLoading } = useLevels("NIFTY", todayIso());
  const levels = data?.levels.slice(0, 3) || [];

  return (
    <section className="border-y border-black-border bg-black-surface/45 py-10 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-7 flex flex-col gap-5 sm:mb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-primary sm:text-sm sm:tracking-[0.18em]">8:30 AM Trading Setup</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-white-primary sm:text-4xl">Latest Daily Levels</h2>
          </div>
          <GoldButton href="/levels" variant="outline" className="w-full sm:w-auto">
            Open Levels Tracker <ArrowRight size={18} />
          </GoldButton>
        </div>
        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="card h-56 animate-pulse bg-black-elevated" />
            ))}
          </div>
        ) : levels.length ? (
          <div className="grid gap-5 lg:grid-cols-3">
            {levels.map((level) => (
              <LevelCard key={level.id} level={level} symbol="NIFTY" />
            ))}
          </div>
        ) : (
          <div className="card p-6 text-white-secondary">Today&apos;s levels are being prepared by the admin desk.</div>
        )}
      </div>
    </section>
  );
}
