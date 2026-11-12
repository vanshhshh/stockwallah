"use client";

import { useEffect, useRef } from "react";
import { ColorType, createChart, LineStyle, type IChartApi, type IPriceLine, type ISeriesApi, type UTCTimestamp } from "lightweight-charts";
import type { Candle } from "@/hooks/useMarketData";

export type ChartPriceLine = {
  price: number;
  color: string;
  title: string;
  style?: LineStyle;
  width?: 1 | 2 | 3 | 4;
};

type Props = {
  candles: Candle[];
  /** Seconds to add to each UTC timestamp so the time axis reads in exchange time (IST). */
  gmtOffset?: number;
  priceLines?: ChartPriceLine[];
  height?: number;
};

export function CandleChart({ candles, gmtOffset = 19800, priceLines = [], height = 500 }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const linesRef = useRef<IPriceLine[]>([]);
  const fittedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chart = createChart(container, {
      height,
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

    seriesRef.current = chart.addCandlestickSeries({
      upColor: "#00D084",
      downColor: "#FF4444",
      borderVisible: false,
      wickUpColor: "#00D084",
      wickDownColor: "#FF4444"
    });
    chartRef.current = chart;

    const observer = new ResizeObserver(() => chart.applyOptions({ width: container.clientWidth }));
    observer.observe(container);

    return () => {
      observer.disconnect();
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
      linesRef.current = [];
      fittedRef.current = false;
    };
  }, [height]);

  useEffect(() => {
    const series = seriesRef.current;
    if (!series) return;
    series.setData(
      candles.map((candle) => ({
        time: (candle.time + gmtOffset) as UTCTimestamp,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close
      }))
    );
    // Fit once so a refresh doesn't reset the user's zoom/scroll position.
    if (!fittedRef.current && candles.length) {
      chartRef.current?.timeScale().fitContent();
      fittedRef.current = true;
    }
  }, [candles, gmtOffset]);

  useEffect(() => {
    const series = seriesRef.current;
    if (!series) return;
    linesRef.current.forEach((line) => series.removePriceLine(line));
    linesRef.current = priceLines.map((line) =>
      series.createPriceLine({
        price: line.price,
        color: line.color,
        lineWidth: line.width ?? 2,
        lineStyle: line.style ?? LineStyle.Solid,
        axisLabelVisible: true,
        title: line.title
      })
    );
  }, [priceLines]);

  return (
    <div className="relative">
      <div ref={containerRef} className="min-w-[640px]" />
      {!candles.length ? (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-white-muted">No intraday candles available yet.</div>
      ) : null}
    </div>
  );
}
