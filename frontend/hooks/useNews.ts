"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type NewsArticle = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
  category: string;
};

export function useNews() {
  return useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const { data } = await api.get<{ articles: NewsArticle[] }>("/api/news");
      return data.articles;
    },
    refetchInterval: 10 * 60_000
  });
}

