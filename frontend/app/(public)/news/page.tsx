"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { NewsCard } from "@/components/news/NewsCard";
import { NewsTicker } from "@/components/news/NewsTicker";
import { useNews } from "@/hooks/useNews";
import { cn } from "@/lib/utils";

const categories = ["All", "Markets", "Stocks", "Economy", "Global", "IPO"];

export default function NewsPage() {
  const { data, isLoading, isError } = useNews();
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const articles = useMemo(() => {
    return (data || []).filter((article) => {
      const matchesCategory = category === "All" || article.category === category;
      const matchesSearch = `${article.title} ${article.description}`.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [category, data, search]);

  return (
    <>
      <NewsTicker />
      <section className="mx-auto max-w-7xl px-4 py-10 sm:py-12">
        <div className="mb-8 max-w-3xl">
          <h1 className="font-display text-3xl font-bold text-white-primary sm:text-5xl">Market News Desk</h1>
          <p className="mt-4 text-sm leading-6 text-white-secondary sm:text-lg sm:leading-8">MoneyControl RSS-powered Indian market news with search, category filters, and auto-refresh every 10 minutes.</p>
        </div>
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            {categories.map((item) => (
              <button
                key={item}
                className={cn(
                  "premium-focus min-h-11 rounded border px-4 text-sm font-semibold transition",
                  category === item ? "border-gold-primary bg-gold-muted text-gold-light" : "border-black-border bg-black-surface text-white-secondary hover:border-gold-primary/60"
                )}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <label className="relative block w-full lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white-muted" size={18} />
            <input
              className="premium-focus min-h-11 w-full rounded border border-black-border bg-black-surface pl-10 pr-4 text-white-primary placeholder:text-white-muted"
              placeholder="Search market news"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
        </div>
        {isLoading ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="card h-56 animate-pulse bg-black-elevated" />
            ))}
          </div>
        ) : isError ? (
          <div className="card p-6 text-white-secondary">News is temporarily unavailable.</div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <NewsCard key={article.link} article={article} />
            ))}
          </div>
        )}
        <a
          href="https://www.moneycontrol.com"
          target="_blank"
          rel="noreferrer"
          className="gold-gradient-bg mt-10 block rounded-sw px-6 py-5 text-center font-semibold text-black-primary transition hover:shadow-gold"
        >
          View on MoneyControl
        </a>
      </section>
    </>
  );
}
