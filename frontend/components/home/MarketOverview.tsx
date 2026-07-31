"use client";

import { IndexCard } from "@/components/market/IndexCard";
import { useMarketOverview } from "@/hooks/useMarketData";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export function MarketOverview() {
  const { data, isLoading, isError } = useMarketOverview();

  if (isLoading) return <LoadingSpinner />;
  if (isError || !data) {
    return <div className="card p-6 text-white-secondary">Market overview is temporarily unavailable. Please refresh in a moment.</div>;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-primary">Today&apos;s Market Overview</p>
          <h2 className="mt-3 font-display text-4xl font-bold text-white-primary">Index Pulse</h2>
        </div>
        <p className="text-sm text-white-muted">As of {new Date(data.timestamp).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" })} IST</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {data.indices.map((index) => (
          <IndexCard key={index.symbol} quote={index} />
        ))}
      </div>
    </section>
  );
}

