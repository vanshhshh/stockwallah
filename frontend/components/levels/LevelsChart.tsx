"use client";

import { useMemo } from "react";
import { LineStyle } from "lightweight-charts";
import { CandleChart, type ChartPriceLine } from "@/components/market/CandleChart";
import type { TradingLevel } from "@/hooks/useLevels";
import type { IntradayChart } from "@/hooks/useMarketData";
import { cn, formatNumber } from "@/lib/utils";

const colors: Record<TradingLevel["levelType"], { color: string; style: LineStyle }> = {
  "Strong Resistance": { color: "#FF4444", style: LineStyle.Dashed },
  Resistance: { color: "#FF8888", style: LineStyle.Solid },
  Support: { color: "#00AA55", style: LineStyle.Solid },
  "Strong Support": { color: "#00D084", style: LineStyle.Dashed },
  CPR: { color: "#C9A84C", style: LineStyle.Solid }
};

type Props = {
  levels: TradingLevel[];
  chart?: IntradayChart;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
};

export function LevelsChart({ levels, chart, isLoading, isError, isFetching }: Props) {
  const priceLines = useMemo<ChartPriceLine[]>(
    () =>
      levels.map((level) => ({
        price: level.levelPrice,
        color: colors[level.levelType]?.color || "#C9A84C",
        style: colors[level.levelType]?.style,
        title: `${level.levelPrice.toLocaleString("en-IN")} ${level.levelType}`
      })),
    [levels]
  );

  const positive = (chart?.change ?? 0) >= 0;
  const isOpen = chart?.marketStatus.isOpen;

  return (
    <div className="overflow-hidden rounded-sw border border-black-border bg-black-primary">
      <div className="flex flex-col gap-3 border-b border-black-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-sm text-white-muted">{chart?.label || "Live price"}</span>
          <span className="text-2xl font-bold text-white-primary">{chart ? formatNumber(chart.price) : "--"}</span>
          {chart ? (
            <span className={cn("text-sm font-semibold", positive ? "text-profit" : "text-loss")}>
              {positive ? "+" : ""}
              {formatNumber(chart.change)} ({positive ? "+" : ""}
              {formatNumber(chart.pChange)}%)
            </span>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-white-muted">
          <span className="inline-flex items-center gap-2">
            <span className={cn("h-2 w-2 rounded-full", isOpen ? "animate-pulse bg-profit" : "bg-white-muted")} />
            {isOpen ? "LIVE" : "MARKET CLOSED"}
          </span>
          {chart ? <span>H {formatNumber(chart.high)} · L {formatNumber(chart.low)}</span> : null}
          {chart?.marketTime ? (
            <span>
              Last tick {new Date(chart.marketTime).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" })} IST
              {isFetching ? " · updating…" : ""}
            </span>
          ) : null}
        </div>
      </div>
      {chart?.proxy ? (
        <div className="border-b border-black-border bg-gold-muted px-4 py-2 text-xs text-gold-light">
          Candles show Nifty 50 spot; futures levels may sit above spot by the futures premium.
        </div>
      ) : null}
      <div className="overflow-x-auto scrollbar-thin">
        {isLoading ? (
          <div className="h-[500px] animate-pulse bg-black-elevated" />
        ) : isError && !chart ? (
          <div className="flex h-[300px] items-center justify-center p-6 text-sm text-white-secondary">Live chart is unavailable right now. Retrying automatically…</div>
        ) : (
          <CandleChart candles={chart?.candles || []} gmtOffset={chart?.gmtOffset} priceLines={priceLines} />
        )}
      </div>
    </div>
  );
}
