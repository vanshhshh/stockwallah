"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type IndexQuote = {
  symbol: string;
  label: string;
  price: number;
  change: number;
  pChange: number;
  high: number;
  low: number;
  previousClose?: number;
  sparkline?: number[];
  marketTime?: string | null;
};

export type Candle = { time: number; open: number; high: number; low: number; close: number };

export type IntradayChart = {
  symbol: string;
  label: string;
  proxy: boolean;
  interval: string;
  gmtOffset: number;
  price: number;
  previousClose: number;
  change: number;
  pChange: number;
  high: number;
  low: number;
  candles: Candle[];
  marketTime: string | null;
  marketStatus: { isOpen: boolean; timestamp: string };
  timestamp: string;
};

export type SectorPerformance = { name: string; price: number; change: number };

export const LIVE_REFRESH_MS = 30_000;

export function useIntradayChart(symbol: string, interval = "5m") {
  return useQuery({
    queryKey: ["market", "chart", symbol, interval],
    queryFn: async () => {
      const { data } = await api.get<IntradayChart>("/api/market/chart", { params: { symbol, interval } });
      return data;
    },
    refetchInterval: LIVE_REFRESH_MS,
    placeholderData: (previous) => (previous?.symbol === symbol ? previous : undefined)
  });
}

export function useSectorPerformance() {
  return useQuery({
    queryKey: ["market", "sectors"],
    queryFn: async () => {
      const { data } = await api.get<{ sectors: SectorPerformance[]; timestamp: string }>("/api/market/sectors");
      return data;
    },
    refetchInterval: 60_000
  });
}

export type MarketMover = {
  symbol: string;
  companyName: string;
  lastPrice: number;
  change: number;
  pChange: number;
};

export function useMarketOverview() {
  return useQuery({
    queryKey: ["market", "overview"],
    queryFn: async () => {
      const { data } = await api.get<{
        indices: IndexQuote[];
        timestamp: string;
        marketStatus: { isOpen: boolean; timestamp: string };
        source?: "live" | "fallback";
      }>("/api/market/overview");
      return data;
    },
    refetchInterval: LIVE_REFRESH_MS
  });
}

export function useGainersLosers() {
  return useQuery({
    queryKey: ["market", "gainers-losers"],
    queryFn: async () => {
      const { data } = await api.get<{ gainers: MarketMover[]; losers: MarketMover[]; timestamp: string; source?: string }>("/api/market/gainers-losers");
      return data;
    },
    refetchInterval: LIVE_REFRESH_MS * 2
  });
}
