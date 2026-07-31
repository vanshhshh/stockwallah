import { parseStringPromise } from "xml2js";
import { cacheGet, cacheSet } from "../lib/redis.js";
import { logger } from "../lib/logger.js";
import type { NewsArticle } from "../types/index.js";

const feeds = [
  { url: "https://news.google.com/rss/search?q=Indian%20stock%20market%20when:1d&hl=en-IN&gl=IN&ceid=IN:en", category: "Markets", source: "Google News" },
  { url: "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms", category: "Markets", source: "Economic Times" },
  { url: "https://www.livemint.com/rss/markets", category: "Markets", source: "Mint" },
  { url: "https://www.moneycontrol.com/rss/latestnews.xml", category: "Markets" },
  { url: "https://www.moneycontrol.com/rss/marketreports.xml", category: "Stocks" },
];

function stripHtml(input = "") {
  return input
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function readRssSource(item: Record<string, unknown>, fallback: string) {
  const source = item.source;
  if (!Array.isArray(source) || !source[0]) return fallback;
  const first = source[0];
  if (typeof first === "string") return first;
  if (typeof first === "object" && first && "_" in first) return String(first._ || fallback);
  return fallback;
}

function readFirstString(value: unknown, fallback = "") {
  if (!Array.isArray(value) || value.length === 0) return fallback;
  return typeof value[0] === "string" ? value[0] : fallback;
}

async function fetchFeed(url: string, category: string, source = "MoneyControl"): Promise<NewsArticle[]> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 StockWallah News Reader",
      Accept: "application/rss+xml, application/xml, text/xml",
    },
  });

  if (!response.ok) {
    throw new Error(`${source} RSS failed with ${response.status}`);
  }

  const xml = await response.text();
  const parsed = await parseStringPromise(xml, { trim: true });
  const items = parsed?.rss?.channel?.[0]?.item ?? [];

  return items.map((item: Record<string, unknown>) => ({
    title: stripHtml(readFirstString(item.title)),
    link: readFirstString(item.link, "https://www.moneycontrol.com"),
    description: stripHtml(readFirstString(item.description)),
    pubDate: readFirstString(item.pubDate, new Date().toISOString()),
    source: readRssSource(item, source),
    category,
  }));
}

export async function getNews() {
  const cached = await cacheGet<NewsArticle[]>("news:moneycontrol");
  if (cached) return cached;

  try {
    const results = await Promise.allSettled(feeds.map((feed) => fetchFeed(feed.url, feed.category, feed.source)));
    const allArticles = results
      .flatMap((result) => (result.status === "fulfilled" ? result.value : []))
      .flat()
      .filter((article) => article.title)
      .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
      .filter((article, index, list) => list.findIndex((item) => item.link === article.link || item.title === article.title) === index);

    const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;
    const freshArticles = allArticles.filter((article) => new Date(article.pubDate).getTime() >= threeDaysAgo);
    const articles = (freshArticles.length >= 6 ? freshArticles : allArticles).slice(0, 20);

    if (!articles.length) {
      throw new Error("No current RSS articles available");
    }

    await cacheSet("news:moneycontrol", articles, 15 * 60);
    return articles;
  } catch (error) {
    logger.warn("MoneyControl fetch failed; serving curated fallback", {
      error: error instanceof Error ? error.message : error,
    });
    const fallback: NewsArticle[] = [
      {
        title: "Nifty traders watch key support as volatility cools",
        link: "https://www.moneycontrol.com/news/business/markets/",
        description: "Market participants are tracking index support and resistance zones while stock-specific action remains active.",
        pubDate: new Date().toISOString(),
        source: "MoneyControl",
        category: "Markets",
      },
      {
        title: "Banking and auto counters lead intraday participation",
        link: "https://www.moneycontrol.com/news/business/stocks/",
        description: "Rate-sensitive sectors remain in focus as traders evaluate earnings momentum and liquidity conditions.",
        pubDate: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        source: "MoneyControl",
        category: "Stocks",
      },
    ];
    await cacheSet("news:moneycontrol", fallback, 5 * 60);
    return fallback;
  }
}
