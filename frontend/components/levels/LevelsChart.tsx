"use client";

import { useEffect, useMemo, useRef } from "react";
import { ColorType, createChart, LineStyle, type IChartApi, type ISeriesApi, type UTCTimestamp } from "lightweight-charts";
import type { TradingLevel } from "@/hooks/useLevels";

const colors: Record<TradingLevel["levelType"], { color: string; style: LineStyle }> = {
  "Strong Resistance": { color: "#FF4444", style: LineStyle.Dashed },
  Resistance: { color: "#FF8888", style: LineStyle.Solid },
  Support: { color: "#00AA55", style: LineStyle.Solid },
  "Strong Support": { color: "#00D084", style: LineStyle.Dashed },
  CPR: { color: "#C9A84C", style: LineStyle.Solid }
};

function generateOhlc(symbol: string) {
  const baseBySymbol: Record<string, number> = {
    NIFTY: 24200,
    NIFTYFUT: 24260,
    BANKNIFTY: 52200
  };
  const base = baseBySymbol[symbol] || baseBySymbol.NIFTY;
  const isBankNifty = symbol === "BANKNIFTY";
  const today = new Date();
  today.setHours(9, 15, 0, 0);
  return Array.from({ length: 76 }).map((_, index) => {
    const time = new Date(today.getTime() + index * 5 * 60 * 1000);
    const wave = Math.sin(index / 5) * (isBankNifty ? 95 : 35);
    const trend = index * (isBankNifty ? 3.8 : 1.3);
    const open = base + wave + trend + Math.cos(index) * 12;
    const close = open + Math.sin(index * 1.7) * (isBankNifty ? 34 : 12);
    return {
      time: Math.floor(time.getTime() / 1000) as UTCTimestamp,
      open,
      high: Math.max(open, close) + (isBankNifty ? 48 : 18),
      low: Math.min(open, close) - (isBankNifty ? 42 : 15),
      close
    };
  });
}

export function LevelsChart({ levels, symbol }: { levels: TradingLevel[]; symbol: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const data = useMemo(() => generateOhlc(symbol), [symbol]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chart = createChart(container, {
      height: 500,
      width: container.clientWidth,
      layout: {
        background: { type: ColorType.Solid, color: "#0A0A0A" },
        textColor: "#B0B0B0"
      },
      grid: {
        vertLines: { color: "#1A1A1A" },
        horzLines: { color: "#1A1A1A" }
      },
      rightPriceScale: { borderColor: "#2A2A2A" },
      timeScale: { borderColor: "#2A2A2A", timeVisible: true, secondsVisible: false },
      crosshair: { mode: 1 }
    });

    const series = chart.addCandlestickSeries({
      upColor: "#00D084",
      downColor: "#FF4444",
      borderVisible: false,
      wickUpColor: "#00D084",
      wickDownColor: "#FF4444"
    });
    series.setData(data);
    chart.timeScale().fitContent();
    chartRef.current = chart;
    seriesRef.current = series;

    const observer = new ResizeObserver(() => {
      chart.applyOptions({ width: container.clientWidth });
    });
    observer.observe(container);

    return () => {
      observer.disconnect();
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, [data]);

  useEffect(() => {
    const series = seriesRef.current;
    if (!series) return;
    levels.forEach((level) => {
      const config = colors[level.levelType];
      series.createPriceLine({
        price: level.levelPrice,
        color: config.color,
        lineWidth: 2,
        lineStyle: config.style,
        axisLabelVisible: true,
        title: `${level.levelPrice.toLocaleString("en-IN")} ${level.levelType}`
      });
    });
  }, [levels]);

  return (
    <div className="overflow-x-auto rounded-sw border border-black-border bg-black-primary scrollbar-thin">
      <div ref={containerRef} className="min-w-[720px]" />
    </div>
  );
}
