"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { GainersLosersTable } from "@/components/market/GainersLosersTable";
import { IndexCard } from "@/components/market/IndexCard";
import { SectorChart } from "@/components/market/SectorChart";
import { useGainersLosers, useMarketOverview } from "@/hooks/useMarketData";
import { cn } from "@/lib/utils";

export default function MarketPage() {
  const overview = useMarketOverview();
  const movers = useGainersLosers();
  const [countdown, setCountdown] = useState(120);

  useEffect(() => {
    const timer = setInterval(() => setCountdown((value) => (value <= 1 ? 120 : value - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  async function refresh() {
    setCountdown(120);
    await Promise.all([overview.refetch(), movers.refetch()]);
  }

  const isOpen = overview.data?.marketStatus.isOpen;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:py-12">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white-primary sm:text-5xl">Market Overview</h1>
          <p className="mt-3 text-sm leading-6 text-white-secondary sm:text-base">Nifty, Bank Nifty, Sensex, India VIX, top F&O movers, and sector performance.</p>
        </div>
        <div className="card flex w-full flex-wrap items-center gap-3 px-4 py-3 text-sm text-white-secondary lg:w-auto">
          <span className="inline-flex items-center gap-2">
            <span className={cn("h-2.5 w-2.5 rounded-full", isOpen ? "animate-pulse bg-profit" : "bg-white-muted")} />
            MARKET STATUS: {isOpen ? "OPEN" : "CLOSED"}
          </span>
          <span>Auto-refresh in: {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, "0")}</span>
          <button onClick={refresh} className="premium-focus inline-flex min-h-10 w-full items-center justify-center gap-2 rounded border border-black-border px-3 py-2 hover:border-gold-primary/60 sm:w-auto">
            <RefreshCw size={15} className={overview.isFetching || movers.isFetching ? "animate-spin" : ""} /> Refresh Now
          </button>
        </div>
      </div>

      <div className="mb-6 text-sm text-white-muted">
        As of{" "}
        {movers.data?.timestamp || overview.data?.timestamp
          ? new Date(movers.data?.timestamp || overview.data?.timestamp || "").toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" })
          : "--"}{" "}
        IST{movers.data?.source ? ` · Movers source: ${movers.data.source}` : ""}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {(overview.data?.indices || []).map((index) => (
          <IndexCard key={index.symbol} quote={index} />
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <GainersLosersTable title="Top 10 Gainers" rows={movers.data?.gainers || []} type="gainer" />
        <GainersLosersTable title="Top 10 Losers" rows={movers.data?.losers || []} type="loser" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <SectorChart />
        <a
          href="https://www.tradingview.com/heatmap/stock/#%7B%22dataSource%22%3A%22NSE%22%7D"
          target="_blank"
          rel="noreferrer"
          className="card flex min-h-64 flex-col justify-end overflow-hidden p-4 transition hover:border-gold-primary/45 hover:shadow-gold sm:min-h-72 sm:p-6"
        >
          <div className="absolute" />
          <div className="mb-6 grid grid-cols-5 gap-2">
            {Array.from({ length: 25 }).map((_, index) => (
              <span key={index} className={cn("h-10 rounded", index % 3 === 0 ? "bg-profit/30" : index % 4 === 0 ? "bg-loss/30" : "bg-gold-muted")} />
            ))}
          </div>
          <h2 className="text-xl font-semibold text-white-primary">Heat Map</h2>
          <p className="mt-2 text-sm text-white-secondary">Open a full NSE heat map on TradingView for deeper sector breadth analysis.</p>
        </a>
      </div>
    </section>
  );
}
