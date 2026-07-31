"use client";

import { useNews } from "@/hooks/useNews";

export function NewsTicker() {
  const { data } = useNews();
  const articles = data?.slice(0, 8) || [
    { title: "Nifty and Bank Nifty levels updating from MoneyControl RSS", link: "#", description: "", pubDate: "", source: "", category: "" }
  ];
  const items = [...articles, ...articles];

  return (
    <div className="overflow-hidden border-y border-black-border bg-black-surface py-3">
      <div className="flex w-max animate-marquee gap-8 whitespace-nowrap text-sm text-white-secondary">
        {items.map((article, index) => (
          <a key={`${article.title}-${index}`} href={article.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 hover:text-gold-light">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-primary" />
            {article.title}
          </a>
        ))}
      </div>
    </div>
  );
}

