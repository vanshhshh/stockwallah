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
};

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
      }>("/api/market/overview");
      return data;
    },
    refetchInterval: 2 * 60_000
  });
}

export function useGainersLosers() {
  return useQuery({
    queryKey: ["market", "gainers-losers"],
    queryFn: async () => {
      const { data } = await api.get<{ gainers: MarketMover[]; losers: MarketMover[]; timestamp: string }>("/api/market/gainers-losers");
      return data;
    },
    refetchInterval: 2 * 60_000
  });
}

