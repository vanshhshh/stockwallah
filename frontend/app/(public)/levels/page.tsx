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
    <section className="mx-auto max-w-7xl px-4 py-10 sm:py-12">
      <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-3xl font-bold leading-tight text-white-primary sm:text-5xl">Today&apos;s Levels - {symbol === "NIFTY" ? "NIFTY 50" : "BANKNIFTY"}</h1>
          <p className="mt-3 text-sm leading-6 text-white-secondary sm:text-base">Marked at 8:30 AM IST with live PnL simulation and historical accuracy tracking.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          {symbols.map((item) => (
            <button
              key={item}
              onClick={() => setSymbol(item)}
              className={cn(
                "premium-focus min-h-11 rounded border px-3 text-sm font-semibold transition sm:px-4",
                symbol === item ? "border-gold-primary bg-gold-muted text-gold-light" : "border-black-border bg-black-surface text-white-secondary hover:border-gold-primary/60"
              )}
            >
              {item}
            </button>
          ))}
          <button
            className="premium-focus col-span-2 inline-flex min-h-11 items-center justify-center gap-2 rounded border border-black-border bg-black-surface px-4 text-sm text-white-secondary hover:border-gold-primary/60 sm:col-span-1"
            onClick={() => refetch()}
          >
            <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} /> Refresh
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="card h-[420px] animate-pulse bg-black-elevated sm:h-[580px]" />
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
