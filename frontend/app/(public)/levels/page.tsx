"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { DailySummary } from "@/components/levels/DailySummary";
import { HistoricalCalendar } from "@/components/levels/HistoricalCalendar";
import { LevelCard } from "@/components/levels/LevelCard";
import { LevelsChart } from "@/components/levels/LevelsChart";
import { useLevels } from "@/hooks/useLevels";
import { cn, todayIso } from "@/lib/utils";

const symbols = ["NIFTY", "BANKNIFTY"];

export default function LevelsPage() {
  const [symbol, setSymbol] = useState("NIFTY");
  const [date, setDate] = useState(todayIso());
  const { data, isLoading, isError, refetch, isFetching } = useLevels(symbol, date);
  const levels = data?.levels || [];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-display text-5xl font-bold text-white-primary">Today&apos;s Levels — {symbol === "NIFTY" ? "NIFTY 50" : "BANKNIFTY"}</h1>
          <p className="mt-3 text-white-secondary">Marked at 8:30 AM IST with live PnL simulation and historical accuracy tracking.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {symbols.map((item) => (
            <button
              key={item}
              onClick={() => setSymbol(item)}
              className={cn(
                "premium-focus min-h-11 rounded border px-4 text-sm font-semibold transition",
                symbol === item ? "border-gold-primary bg-gold-muted text-gold-light" : "border-black-border bg-black-surface text-white-secondary hover:border-gold-primary/60"
              )}
            >
              {item}
            </button>
          ))}
          <button
            className="premium-focus inline-flex min-h-11 items-center gap-2 rounded border border-black-border bg-black-surface px-4 text-sm text-white-secondary hover:border-gold-primary/60"
            onClick={() => refetch()}
          >
            <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} /> Refresh
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="card h-[580px] animate-pulse bg-black-elevated" />
      ) : isError ? (
        <div className="card p-6 text-white-secondary">Levels are unavailable right now. Please try again shortly.</div>
      ) : (
        <div className="grid gap-6">
          <DailySummary levels={levels} symbol={symbol} />
          <LevelsChart levels={levels} symbol={symbol} />
          <div className="grid gap-5 lg:grid-cols-2">
            {levels.map((level) => (
              <LevelCard key={level.id} level={level} symbol={symbol} />
            ))}
          </div>
          <HistoricalCalendar selectedDate={date} onDateChange={setDate} />
        </div>
      )}
    </section>
  );
}

