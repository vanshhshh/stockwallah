"use client";

import { ArrowRight } from "lucide-react";
import { useNews } from "@/hooks/useNews";
import { NewsCard } from "@/components/news/NewsCard";
import { GoldButton } from "@/components/common/GoldButton";

export function NewsSection() {
  const { data, isLoading, isError } = useNews();
  const articles = data || [];

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:py-14 lg:py-16">
      <div className="mb-7 flex flex-col gap-5 sm:mb-9 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-primary sm:text-sm sm:tracking-[0.18em]">Live Market Feed</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-white-primary sm:text-4xl">Latest Market News</h2>
        </div>
        <GoldButton href="/news" variant="outline" className="w-full sm:w-auto">
          Full News Desk <ArrowRight size={18} />
        </GoldButton>
      </div>
      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="card h-48 animate-pulse bg-black-elevated" />
          ))}
        </div>
      ) : isError ? (
        <div className="card p-6 text-white-secondary">News feed is temporarily unavailable.</div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.slice(0, 6).map((article) => (
            <NewsCard key={article.link} article={article} />
          ))}
        </div>
      )}
    </section>
  );
}
