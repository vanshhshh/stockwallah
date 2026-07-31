import { ExternalLink } from "lucide-react";
import type { NewsArticle } from "@/hooks/useNews";
import { timeAgo } from "@/lib/utils";

export function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <article className="card flex min-h-52 min-w-0 flex-col p-4 transition hover:border-gold-primary/45 hover:shadow-gold sm:min-h-56 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-xs text-white-muted">
        <span className="rounded bg-gold-muted px-2 py-1 text-gold-light">{article.category}</span>
        <span>{timeAgo(article.pubDate)}</span>
      </div>
      <h3 className="line-clamp-2 text-base font-semibold leading-6 text-white-primary sm:text-lg sm:leading-7">{article.title}</h3>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-white-secondary">{article.description}</p>
      <a
        href={article.link}
        target="_blank"
        rel="noreferrer"
        className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-gold-light hover:text-gold-primary"
      >
        Read on {article.source} <ExternalLink size={15} />
      </a>
    </article>
  );
}
