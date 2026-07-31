import YahooFinance from "yahoo-finance2";
import { cacheGet, cacheSet } from "../lib/redis.js";
import { logger } from "../lib/logger.js";
import type { IndexQuote, MarketMover } from "../types/index.js";

const nseUrl = "https://www.nseindia.com/api/equity-stockIndices?index=SECURITIES%20IN%20F%26O";
const nseHome = "https://www.nseindia.com/";
const yahooFinance = new YahooFinance();

const niftySymbols = [
  "RELIANCE.NS",
  "TCS.NS",
  "HDFCBANK.NS",
  "ICICIBANK.NS",
  "INFY.NS",
  "SBIN.NS",
  "BHARTIARTL.NS",
  "ITC.NS",
  "LT.NS",
  "TATAMOTORS.NS",
  "AXISBANK.NS",
  "KOTAKBANK.NS",
  "SUNPHARMA.NS",
  "MARUTI.NS",
  "TITAN.NS",
  "ADANIENT.NS",
  "ONGC.NS",
  "NTPC.NS",
  "POWERGRID.NS",
  "HINDUNILVR.NS",
];

const fallbackMovers: MarketMover[] = [
  { symbol: "TATAMOTORS", companyName: "Tata Motors", lastPrice: 890.5, change: 36.2, pChange: 4.24 },
  { symbol: "SBIN", companyName: "State Bank of India", lastPrice: 812.1, change: 24.6, pChange: 3.12 },
  { symbol: "LT", companyName: "Larsen & Toubro", lastPrice: 3721.8, change: 94.2, pChange: 2.6 },
  { symbol: "MARUTI", companyName: "Maruti Suzuki", lastPrice: 12740.3, change: 285.7, pChange: 2.29 },
  { symbol: "ICICIBANK", companyName: "ICICI Bank", lastPrice: 1184.6, change: 23.1, pChange: 1.99 },
  { symbol: "INFY", companyName: "Infosys", lastPrice: 1420, change: -45.4, pChange: -3.1 },
  { symbol: "HDFCBANK", companyName: "HDFC Bank", lastPrice: 1514.5, change: -36.6, pChange: -2.36 },
  { symbol: "TCS", companyName: "Tata Consultancy Services", lastPrice: 3862.4, change: -72.8, pChange: -1.85 },
  { symbol: "ITC", companyName: "ITC", lastPrice: 426.2, change: -6.2, pChange: -1.43 },
  { symbol: "RELIANCE", companyName: "Reliance Industries", lastPrice: 2915.8, change: -33.6, pChange: -1.14 },
];

function headers(cookie?: string) {
  return {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36",
    Accept: "application/json,text/plain,*/*",
    "Accept-Language": "en-US,en;q=0.9",
    Referer: nseHome,
    Cookie: cookie || process.env.NSE_SESSION_COOKIE || "",
  };
}

async function fetchNseJson() {
  let cookie = process.env.NSE_SESSION_COOKIE;
  if (!cookie) {
    const warmup = await fetch(nseHome, { headers: headers() });
    cookie = warmup.headers.getSetCookie?.().join("; ") || warmup.headers.get("set-cookie") || "";
  }

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const response = await fetch(nseUrl, { headers: headers(cookie) });
    if (response.ok) {
      return response.json() as Promise<{ data: Array<Record<string, unknown>> }>;
    }
    await new Promise((resolve) => setTimeout(resolve, attempt * 350));
  }

  throw new Error("NSE unavailable after 3 attempts");
}

function normalizeNseRow(row: Record<string, unknown>): MarketMover {
  return {
    symbol: String(row.symbol || ""),
    companyName: String(row.meta && typeof row.meta === "object" && "companyName" in row.meta ? row.meta.companyName : row.symbol || ""),
    lastPrice: Number(row.lastPrice || 0),
    change: Number(row.change || 0),
    pChange: Number(row.pChange || 0),
  };
}

async function yahooFallbackMovers() {
  try {
    const quotes = (await yahooFinance.quote(niftySymbols)) as unknown as Array<Record<string, unknown>>;
    const movers = quotes.map((quote) => ({
      symbol: String(quote.symbol || "").replace(".NS", ""),
      companyName: String(quote.shortName || quote.longName || quote.symbol || ""),
      lastPrice: Number(quote.regularMarketPrice || 0),
      change: Number(quote.regularMarketChange || 0),
      pChange: Number(quote.regularMarketChangePercent || 0),
    }));
    return movers.filter((mover) => mover.symbol && Number.isFinite(mover.pChange));
  } catch (error) {
    logger.warn("Yahoo fallback failed", { error: error instanceof Error ? error.message : error });
    return fallbackMovers;
  }
}

export async function getGainersLosers() {
  const cached = await cacheGet<{ gainers: MarketMover[]; losers: MarketMover[]; timestamp: string }>("market:gainers-losers");
  if (cached) return cached;

  let movers: MarketMover[] = [];
  try {
    const payload = await fetchNseJson();
    movers = (payload.data || []).map(normalizeNseRow).filter((row) => row.symbol && row.lastPrice);
  } catch (error) {
    logger.warn("NSE movers failed; using Yahoo fallback", { error: error instanceof Error ? error.message : error });
    movers = await yahooFallbackMovers();
  }

  const result = {
    gainers: [...movers].sort((a, b) => b.pChange - a.pChange).slice(0, 10),
    losers: [...movers].sort((a, b) => a.pChange - b.pChange).slice(0, 10),
    timestamp: new Date().toISOString(),
  };

  await cacheSet("market:gainers-losers", result, 5 * 60);
  return result;
}

const fallbackOverview: IndexQuote[] = [
  { symbol: "NIFTY", label: "Nifty 50", price: 24280.15, change: 145.3, pChange: 0.6, high: 24320.7, low: 24110.8 },
  { symbol: "BANKNIFTY", label: "Bank Nifty", price: 52340.55, change: -220.1, pChange: -0.42, high: 52620.2, low: 52102.4 },
  { symbol: "SENSEX", label: "Sensex", price: 79802.3, change: 305.2, pChange: 0.38, high: 79940.1, low: 79488.3 },
  { symbol: "INDIAVIX", label: "India VIX", price: 13.45, change: 0.8, pChange: 6.1, high: 13.72, low: 12.91 },
];

const yahooChartSymbols = [
  { yahoo: "^NSEI", symbol: "NIFTY", label: "Nifty 50" },
  { yahoo: "^NSEBANK", symbol: "BANKNIFTY", label: "Bank Nifty" },
  { yahoo: "^BSESN", symbol: "SENSEX", label: "Sensex" },
  { yahoo: "^INDIAVIX", symbol: "INDIAVIX", label: "India VIX" },
];

export function getMarketStatus() {
  const now = new Date();
  const ist = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const day = ist.getDay();
  const minutes = ist.getHours() * 60 + ist.getMinutes();
  const isWeekday = day >= 1 && day <= 5;
  const isOpen = isWeekday && minutes >= 9 * 60 + 15 && minutes <= 15 * 60 + 30;
  return { isOpen, timestamp: now.toISOString() };
}

export async function getMarketOverview() {
  const cached = await cacheGet<{ indices: IndexQuote[]; timestamp: string; marketStatus: ReturnType<typeof getMarketStatus> }>("market:overview");
  if (cached) return cached;

  try {
    const chartResults = await Promise.all(
      yahooChartSymbols.map(async (item) => {
        const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(item.yahoo)}?range=1d&interval=1m`, {
          headers: { "User-Agent": "Mozilla/5.0 StockWallah Market Reader" },
        });
        if (!response.ok) throw new Error(`Yahoo chart failed for ${item.symbol}`);
        const payload = (await response.json()) as {
          chart?: {
            result?: Array<{
              meta?: Record<string, unknown>;
              indicators?: { quote?: Array<{ high?: number[]; low?: number[] }> };
            }>;
          };
        };
        const result = payload.chart?.result?.[0];
        const meta = result?.meta || {};
        const highs = result?.indicators?.quote?.[0]?.high?.filter((value) => Number.isFinite(value)) || [];
        const lows = result?.indicators?.quote?.[0]?.low?.filter((value) => Number.isFinite(value)) || [];
        const price = Number(meta.regularMarketPrice || 0);
        const previousClose = Number(meta.chartPreviousClose || meta.previousClose || price);
        const change = price - previousClose;
        const pChange = previousClose ? (change / previousClose) * 100 : 0;

        return {
          symbol: item.symbol,
          label: item.label,
          price,
          change,
          pChange,
          high: highs.length ? Math.max(...highs) : Number(meta.regularMarketDayHigh || price),
          low: lows.length ? Math.min(...lows) : Number(meta.regularMarketDayLow || price),
        };
      }),
    );

    const indices = chartResults.filter((quote) => quote.price > 0);
    if (indices.length < 3) {
      throw new Error("Yahoo chart returned incomplete index data");
    }

    const result = { indices, timestamp: new Date().toISOString(), marketStatus: getMarketStatus() };
    await cacheSet("market:overview", result, 60);
    return result;
  } catch (chartError) {
    logger.warn("Yahoo chart overview failed; trying yahoo-finance2", { error: chartError instanceof Error ? chartError.message : chartError });
  }

  try {
    const quotes = (await yahooFinance.quote(yahooChartSymbols.map((item) => item.yahoo))) as unknown as Array<Record<string, unknown>>;
    const labels = Object.fromEntries(yahooChartSymbols.map((item) => [item.yahoo, { symbol: item.symbol, label: item.label }]));
    const indices = quotes.map((quote) => {
      const meta = labels[String(quote.symbol)] || { symbol: String(quote.symbol), label: String(quote.shortName || quote.symbol) };
      return {
        ...meta,
        price: Number(quote.regularMarketPrice || 0),
        change: Number(quote.regularMarketChange || 0),
        pChange: Number(quote.regularMarketChangePercent || 0),
        high: Number(quote.regularMarketDayHigh || 0),
        low: Number(quote.regularMarketDayLow || 0),
      };
    });

    const result = { indices, timestamp: new Date().toISOString(), marketStatus: getMarketStatus() };
    await cacheSet("market:overview", result, 2 * 60);
    return result;
  } catch (error) {
    logger.warn("Market overview failed; using fallback", { error: error instanceof Error ? error.message : error });
    const result = { indices: fallbackOverview, timestamp: new Date().toISOString(), marketStatus: getMarketStatus() };
    await cacheSet("market:overview", result, 60);
    return result;
  }
}
