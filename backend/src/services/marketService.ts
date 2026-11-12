import YahooFinance from "yahoo-finance2";
import { cacheGet, cacheSet } from "../lib/redis.js";
import { logger } from "../lib/logger.js";
import type { IndexQuote, MarketMover } from "../types/index.js";

const nseUrl = "https://www.nseindia.com/api/equity-stockIndices?index=SECURITIES%20IN%20F%26O";
const nseMoversUrl = "https://www.nseindia.com/api/live-analysis-variations";
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

async function fetchNseJson(url = nseUrl) {
  let cookie = process.env.NSE_SESSION_COOKIE;
  if (!cookie) {
    const warmup = await fetch(nseHome, { headers: headers() });
    cookie = warmup.headers.getSetCookie?.().join("; ") || warmup.headers.get("set-cookie") || "";
  }

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const response = await fetch(url, { headers: headers(cookie) });
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

function normalizeNseMover(row: Record<string, unknown>): MarketMover {
  const previousPrice = Number(row.prev_price || 0);
  const lastPrice = Number(row.ltp || row.lastPrice || 0);
  const pChange = Number(row.perChange ?? row.net_price ?? row.pChange ?? 0);
  return {
    symbol: String(row.symbol || ""),
    companyName: String(row.symbol || ""),
    lastPrice,
    change: previousPrice ? lastPrice - previousPrice : Number(row.change || 0),
    pChange,
  };
}

async function fetchNseMovers(type: "gainers" | "loosers") {
  const payload = (await fetchNseJson(`${nseMoversUrl}?index=${type}`)) as Record<string, { data?: Array<Record<string, unknown>> }>;
  const rows = payload.FOSec?.data || payload.NIFTY?.data || payload.allSec?.data || [];
  return rows.map(normalizeNseMover).filter((row) => row.symbol && row.lastPrice && Number.isFinite(row.pChange));
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
  const cached = await cacheGet<{ gainers: MarketMover[]; losers: MarketMover[]; timestamp: string; source?: string }>("market:gainers-losers");
  if (cached) return cached;

  try {
    const [gainers, losers] = await Promise.all([fetchNseMovers("gainers"), fetchNseMovers("loosers")]);
    if (gainers.length && losers.length) {
      const result = {
        gainers: gainers.sort((a, b) => b.pChange - a.pChange).slice(0, 10),
        losers: losers.sort((a, b) => a.pChange - b.pChange).slice(0, 10),
        timestamp: new Date().toISOString(),
        source: "NSE live-analysis-variations",
      };
      await cacheSet("market:gainers-losers", result, 60);
      return result;
    }
    throw new Error("NSE mover endpoint returned incomplete data");
  } catch (error) {
    logger.warn("NSE live movers failed; deriving movers from NSE F&O table", { error: error instanceof Error ? error.message : error });
  }

  let movers: MarketMover[] = [];
  try {
    const payload = await fetchNseJson();
    movers = (payload.data || []).map(normalizeNseRow).filter((row) => row.symbol && row.lastPrice);
  } catch (error) {
    logger.warn("NSE F&O movers failed; using Yahoo fallback", { error: error instanceof Error ? error.message : error });
    movers = await yahooFallbackMovers();
  }
  const result = {
    gainers: [...movers].sort((a, b) => b.pChange - a.pChange).slice(0, 10),
    losers: [...movers].sort((a, b) => a.pChange - b.pChange).slice(0, 10),
    timestamp: new Date().toISOString(),
    source: movers === fallbackMovers ? "Emergency fallback" : "Derived market quotes",
  };

  await cacheSet("market:gainers-losers", result, 60);
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

type YahooChartPayload = {
  chart?: {
    result?: Array<{
      meta?: Record<string, unknown>;
      timestamp?: number[];
      indicators?: {
        quote?: Array<{ open?: Array<number | null>; high?: Array<number | null>; low?: Array<number | null>; close?: Array<number | null> }>;
      };
    }>;
  };
};

export type Candle = { time: number; open: number; high: number; low: number; close: number };

async function fetchYahooChart(yahooSymbol: string, range = "1d", interval = "1m") {
  const response = await fetch(
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?range=${range}&interval=${interval}`,
    { headers: { "User-Agent": "Mozilla/5.0 StockWallah Market Reader" } },
  );
  if (!response.ok) throw new Error(`Yahoo chart failed for ${yahooSymbol} (${response.status})`);
  const payload = (await response.json()) as YahooChartPayload;
  const result = payload.chart?.result?.[0];
  if (!result) throw new Error(`Yahoo chart returned no result for ${yahooSymbol}`);

  const meta = result.meta || {};
  const quote = result.indicators?.quote?.[0] || {};
  const candles: Candle[] = [];
  (result.timestamp || []).forEach((time, index) => {
    const open = quote.open?.[index];
    const high = quote.high?.[index];
    const low = quote.low?.[index];
    const close = quote.close?.[index];
    if (typeof open === "number" && typeof high === "number" && typeof low === "number" && typeof close === "number") {
      candles.push({ time, open, high, low, close });
    }
  });

  const price = Number(meta.regularMarketPrice || candles.at(-1)?.close || 0);
  const previousClose = Number(meta.chartPreviousClose || meta.previousClose || price);
  return {
    candles,
    price,
    previousClose,
    gmtOffset: Number(meta.gmtoffset ?? 19800),
    dayHigh: candles.length ? Math.max(...candles.map((candle) => candle.high)) : Number(meta.regularMarketDayHigh || price),
    dayLow: candles.length ? Math.min(...candles.map((candle) => candle.low)) : Number(meta.regularMarketDayLow || price),
    marketTime: meta.regularMarketTime ? new Date(Number(meta.regularMarketTime) * 1000).toISOString() : null,
  };
}

function sparklineFrom(candles: Candle[], points = 60) {
  if (candles.length <= points) return candles.map((candle) => candle.close);
  const step = candles.length / points;
  const sampled = Array.from({ length: points }, (_, index) => candles[Math.floor(index * step)].close);
  sampled[sampled.length - 1] = candles[candles.length - 1].close;
  return sampled;
}

type OverviewResult = { indices: IndexQuote[]; timestamp: string; marketStatus: ReturnType<typeof getMarketStatus>; source: "live" | "fallback" };

export async function getMarketOverview() {
  const cached = await cacheGet<OverviewResult>("market:overview");
  if (cached) return cached;

  try {
    const chartResults = await Promise.all(
      yahooChartSymbols.map(async (item): Promise<IndexQuote> => {
        const chart = await fetchYahooChart(item.yahoo, "1d", "1m");
        const change = chart.price - chart.previousClose;
        return {
          symbol: item.symbol,
          label: item.label,
          price: chart.price,
          change,
          pChange: chart.previousClose ? (change / chart.previousClose) * 100 : 0,
          high: chart.dayHigh,
          low: chart.dayLow,
          previousClose: chart.previousClose,
          sparkline: sparklineFrom(chart.candles),
          marketTime: chart.marketTime,
        };
      }),
    );

    const indices = chartResults.filter((quote) => quote.price > 0);
    if (indices.length < 3) {
      throw new Error("Yahoo chart returned incomplete index data");
    }

    const result: OverviewResult = { indices, timestamp: new Date().toISOString(), marketStatus: getMarketStatus(), source: "live" };
    await cacheSet("market:overview", result, 20);
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

    const result: OverviewResult = { indices, timestamp: new Date().toISOString(), marketStatus: getMarketStatus(), source: "live" };
    await cacheSet("market:overview", result, 30);
    return result;
  } catch (error) {
    logger.warn("Market overview failed; using fallback", { error: error instanceof Error ? error.message : error });
    const result: OverviewResult = { indices: fallbackOverview, timestamp: new Date().toISOString(), marketStatus: getMarketStatus(), source: "fallback" };
    await cacheSet("market:overview", result, 30);
    return result;
  }
}

// Yahoo has no free intraday feed for Nifty futures, so the futures chart plots the Nifty 50 spot series.
const chartSymbolMap: Record<string, { yahoo: string; label: string; proxy?: boolean }> = {
  NIFTY: { yahoo: "^NSEI", label: "Nifty 50" },
  NIFTYFUT: { yahoo: "^NSEI", label: "Nifty 50 (spot)", proxy: true },
  BANKNIFTY: { yahoo: "^NSEBANK", label: "Bank Nifty" },
  SENSEX: { yahoo: "^BSESN", label: "Sensex" },
  INDIAVIX: { yahoo: "^INDIAVIX", label: "India VIX" },
};

const allowedIntervals = new Set(["1m", "5m", "15m"]);

function sessionDate(time: number, gmtOffset: number) {
  return new Date((time + gmtOffset) * 1000).toISOString().slice(0, 10);
}

export async function getIntradayChart(symbol: string, interval = "5m") {
  const key = symbol.toUpperCase();
  const config = chartSymbolMap[key];
  if (!config) throw Object.assign(new Error(`Unsupported chart symbol: ${symbol}`), { status: 400 });
  const safeInterval = allowedIntervals.has(interval) ? interval : "5m";
  const cacheKey = `market:chart:${key}:${safeInterval}`;
  const cached = await cacheGet<Record<string, unknown>>(cacheKey);
  if (cached) return cached;

  let chart = await fetchYahooChart(config.yahoo, "1d", safeInterval);
  if (!chart.candles.length) {
    // Before the open or on holidays the 1d range can be empty; show the most recent session instead.
    chart = await fetchYahooChart(config.yahoo, "5d", safeInterval);
    const last = chart.candles.at(-1);
    if (last) {
      const lastDay = sessionDate(last.time, chart.gmtOffset);
      chart.candles = chart.candles.filter((candle) => sessionDate(candle.time, chart.gmtOffset) === lastDay);
    }
  }

  const change = chart.price - chart.previousClose;
  const result = {
    symbol: key,
    label: config.label,
    proxy: Boolean(config.proxy),
    interval: safeInterval,
    gmtOffset: chart.gmtOffset,
    price: chart.price,
    previousClose: chart.previousClose,
    change,
    pChange: chart.previousClose ? (change / chart.previousClose) * 100 : 0,
    high: chart.dayHigh,
    low: chart.dayLow,
    candles: chart.candles,
    marketTime: chart.marketTime,
    marketStatus: getMarketStatus(),
    timestamp: new Date().toISOString(),
  };
  await cacheSet(cacheKey, result, 20);
  return result;
}

const sectorSymbols = [
  { yahoo: "^NSEBANK", name: "Bank" },
  { yahoo: "^CNXIT", name: "IT" },
  { yahoo: "^CNXAUTO", name: "Auto" },
  { yahoo: "^CNXPHARMA", name: "Pharma" },
  { yahoo: "^CNXFMCG", name: "FMCG" },
  { yahoo: "^CNXMETAL", name: "Metal" },
  { yahoo: "^CNXENERGY", name: "Energy" },
  { yahoo: "^CNXREALTY", name: "Realty" },
  { yahoo: "^CNXPSUBANK", name: "PSU Bank" },
  { yahoo: "^CNXMEDIA", name: "Media" },
  { yahoo: "^CNXINFRA", name: "Infra" },
  { yahoo: "NIFTY_FIN_SERVICE.NS", name: "Fin Services" },
];

type SectorResult = { sectors: Array<{ name: string; price: number; change: number }>; timestamp: string };

export async function getSectorPerformance() {
  const cached = await cacheGet<SectorResult>("market:sectors");
  if (cached) return cached;

  const settled = await Promise.allSettled(
    sectorSymbols.map(async (item) => {
      const chart = await fetchYahooChart(item.yahoo, "1d", "15m");
      return {
        name: item.name,
        price: chart.price,
        change: chart.previousClose ? ((chart.price - chart.previousClose) / chart.previousClose) * 100 : 0,
      };
    }),
  );
  const sectors = settled
    .flatMap((entry) => (entry.status === "fulfilled" && entry.value.price > 0 ? [entry.value] : []))
    .sort((a, b) => b.change - a.change);
  if (!sectors.length) throw new Error("Sector data unavailable");

  const result: SectorResult = { sectors, timestamp: new Date().toISOString() };
  await cacheSet("market:sectors", result, 60);
  return result;
}
