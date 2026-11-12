"use client";

import { useSectorPerformance } from "@/hooks/useMarketData";
import { cn } from "@/lib/utils";

export function SectorChart() {
  const { data, isLoading, isError } = useSectorPerformance();
  const sectors = data?.sectors || [];
  const max = Math.max(...sectors.map((sector) => Math.abs(sector.change)), 0.01);

  return (
    <div className="card p-4 sm:p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-semibold text-white-primary">Sector Performance</h2>
        {data?.timestamp ? (
          <span className="text-xs text-white-muted">
            {new Date(data.timestamp).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" })} IST
          </span>
        ) : null}
      </div>
      {isLoading ? (
        <div className="mt-6 grid gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-5 animate-pulse rounded bg-black-elevated" />
          ))}
        </div>
      ) : isError || !sectors.length ? (
        <p className="mt-6 text-sm text-white-secondary">Sector data is unavailable right now. Retrying automatically…</p>
      ) : (
        <div className="mt-6 grid gap-4">
          {sectors.map((sector) => {
            const width = `${Math.max((Math.abs(sector.change) / max) * 100, 4)}%`;
            const positive = sector.change >= 0;
            return (
              <div key={sector.name} className="grid gap-2 md:grid-cols-[120px_1fr_70px] md:items-center">
                <div className="text-sm text-white-secondary">{sector.name}</div>
                <div className="h-3 overflow-hidden rounded bg-black-primary">
                  <div className={cn("h-full rounded transition-all", positive ? "bg-profit" : "bg-loss")} style={{ width }} />
                </div>
                <div className={cn("text-sm font-semibold", positive ? "text-profit" : "text-loss")}>
                  {positive ? "+" : ""}
                  {sector.change.toFixed(2)}%
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
