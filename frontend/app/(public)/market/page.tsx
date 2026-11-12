"use client";

import { useEffect, useMemo, useState } from "react";
import { LineStyle } from "lightweight-charts";
import { RefreshCw } from "lucide-react";
import { CandleChart, type ChartPriceLine } from "@/components/market/CandleChart";
import { GainersLosersTable } from "@/components/market/GainersLosersTable";
import { IndexCard } from "@/components/market/IndexCard";
import { SectorChart } from "@/components/market/SectorChart";
import { LIVE_REFRESH_MS, useGainersLosers, useIntradayChart, useMarketOverview, useSectorPerformance } from "@/hooks/useMarketData";
import { cn, formatNumber } from "@/lib/utils";

const chartSymbols = [
  { value: "NIFTY", label: "Nifty 50" },
  { value: "BANKNIFTY", label: "Bank Nifty" },
  { value: "SENSEX", label: "Sensex" },
  { value: "INDIAVIX", label: "India VIX" }
];

const intervals = ["1m", "5m", "15m"];

export default function MarketPage() {
  const overview = useMarketOverview();
  const movers = useGainersLosers();
  const sectors = useSectorPerformance();
  const [chartSymbol, setChartSymbol] = useState("NIFTY");
  const [chartInterval, setChartInterval] = useState("5m");
  const chart = useIntradayChart(chartSymbol, chartInterval);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const countdown = overview.dataUpdatedAt ? Math.max(Math.ceil((overview.dataUpdatedAt + LIVE_REFRESH_MS - now) / 1000), 0) : 0;

  async function refresh() {
    await Promise.all([overview.refetch(), movers.refetch(), chart.refetch(), sectors.refetch()]);
  }

  const isOpen = overview.data?.marketStatus.isOpen;
  const chartData = chart.data?.symbol === chartSymbol ? chart.data : undefined;
  const chartPositive = (chartData?.change ?? 0) >= 0;
  const priceLines = useMemo<ChartPriceLine[]>(
    () => (chartData ? [{ price: chartData.previousClose, color: "#6B6B6B", style: LineStyle.Dashed, width: 1, title: "Prev close" }] : []),
    [chartData?.previousClose] // eslint-disable-line react-hooks/exhaustive-deps
  );

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
          <span>Auto-refresh in: 0:{String(countdown).padStart(2, "0")}</span>
          <button onClick={refresh} className="premium-focus inline-flex min-h-10 w-full items-center justify-center gap-2 rounded border border-black-border px-3 py-2 hover:border-gold-primary/60 sm:w-auto">
            <RefreshCw size={15} className={overview.isFetching || movers.isFetching || chart.isFetching ? "animate-spin" : ""} /> Refresh Now
          </button>
        </div>
      </div>

      <div className="mb-6 text-sm text-white-muted">
        As of{" "}
        {overview.data?.timestamp || movers.data?.timestamp
          ? new Date(overview.data?.timestamp || movers.data?.timestamp || "").toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" })
          : "--"}{" "}
        IST{movers.data?.source ? ` · Movers source: ${movers.data.source}` : ""}
        {overview.data?.source === "fallback" ? <span className="ml-2 text-loss">· Live index feed unavailable, showing placeholder values</span> : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {(overview.data?.indices || []).map((index) => (
          <IndexCard key={index.symbol} quote={index} />
        ))}
      </div>

      <div className="mt-8 overflow-hidden rounded-sw border border-black-border bg-black-primary">
        <div className="flex flex-col gap-3 border-b border-black-border px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 className="text-lg font-semibold text-white-primary">{chartData?.label || "Intraday chart"}</h2>
            {chartData ? (
              <>
                <span className="text-xl font-bold text-white-primary">{formatNumber(chartData.price)}</span>
                <span className={cn("text-sm font-semibold", chartPositive ? "text-profit" : "text-loss")}>
                  {chartPositive ? "+" : ""}
                  {formatNumber(chartData.change)} ({chartPositive ? "+" : ""}
                  {formatNumber(chartData.pChange)}%)
                </span>
              </>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            {chartSymbols.map((item) => (
              <button
                key={item.value}
                onClick={() => setChartSymbol(item.value)}
                className={cn(
                  "premium-focus min-h-9 rounded border px-3 text-xs font-semibold transition sm:text-sm",
                  chartSymbol === item.value ? "border-gold-primary bg-gold-muted text-gold-light" : "border-black-border bg-black-surface text-white-secondary hover:border-gold-primary/60"
                )}
              >
                {item.label}
              </button>
            ))}
            <span className="mx-1 hidden w-px bg-black-border sm:block" />
            {intervals.map((item) => (
              <button
                key={item}
                onClick={() => setChartInterval(item)}
                className={cn(
                  "premium-focus min-h-9 rounded border px-3 text-xs font-semibold transition sm:text-sm",
                  chartInterval === item ? "border-gold-primary bg-gold-muted text-gold-light" : "border-black-border bg-black-surface text-white-secondary hover:border-gold-primary/60"
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto scrollbar-thin">
          {chart.isLoading && !chartData ? (
            <div className="h-[420px] animate-pulse bg-black-elevated" />
          ) : chart.isError && !chartData ? (
            <div className="flex h-[300px] items-center justify-center p-6 text-sm text-white-secondary">Live chart is unavailable right now. Retrying automatically…</div>
          ) : (
            <CandleChart key={`${chartSymbol}-${chartInterval}`} candles={chartData?.candles || []} gmtOffset={chartData?.gmtOffset} priceLines={priceLines} height={420} />
          )}
        </div>
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
