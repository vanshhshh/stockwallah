"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { todayIso } from "@/lib/utils";

export type TradingLevel = {
  id: number;
  date: string;
  symbol: string;
  levelPrice: number;
  levelType: "Support" | "Resistance" | "Strong Support" | "Strong Resistance" | "CPR";
  targetPrice: number | null;
  stoplossPrice: number | null;
  notes: string | null;
  isHit: boolean;
  hitType: "target" | "stoploss" | null;
  hitTime: string | null;
};

export function useLevels(symbol: string, date = todayIso()) {
  return useQuery({
    queryKey: ["levels", symbol, date],
    queryFn: async () => {
      const { data } = await api.get<{
        date: string;
        symbol: string;
        levels: TradingLevel[];
        summary: { total: number; targetsHit: number; stoplossHit: number; open: number; accuracy: number };
      }>("/api/levels", { params: { symbol, date } });
      return data;
    }
  });
}

export function useLevelsHistory() {
  return useQuery({
    queryKey: ["levels", "history"],
    queryFn: async () => {
      const { data } = await api.get<{
        levels: TradingLevel[];
        stats: { winRate: number; averageRR: number; totalMonthsTracked: number };
      }>("/api/levels/history");
      return data;
    }
  });
}

