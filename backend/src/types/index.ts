export type MarketMover = {
  symbol: string;
  companyName: string;
  lastPrice: number;
  change: number;
  pChange: number;
};

export type IndexQuote = {
  symbol: string;
  label: string;
  price: number;
  change: number;
  pChange: number;
  high: number;
  low: number;
};

export type NewsArticle = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
  category: string;
};

