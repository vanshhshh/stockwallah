import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { IndexQuote } from "@/hooks/useMarketData";
import { cn, formatNumber } from "@/lib/utils";

export function IndexCard({ quote }: { quote: IndexQuote }) {
  const positive = quote.change >= 0;
  return (
    <div className="card min-w-0 p-4 transition hover:border-gold-primary/45 hover:shadow-gold sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-white-muted">{quote.symbol}</p>
          <h3 className="mt-1 text-lg font-semibold text-white-primary">{quote.label}</h3>
        </div>
        <div className={cn("rounded p-2", positive ? "bg-profit/10 text-profit" : "bg-loss/10 text-loss")}>
          {positive ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
        </div>
      </div>
      <div className="mt-6 text-2xl font-bold text-white-primary sm:text-3xl">{formatNumber(quote.price)}</div>
      <div className={cn("mt-2 text-sm font-semibold", positive ? "text-profit" : "text-loss")}>
        {positive ? "+" : ""}
        {formatNumber(quote.change)} ({positive ? "+" : ""}
        {formatNumber(quote.pChange)}%)
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2 text-xs text-white-muted sm:gap-3">
        <div className="rounded bg-black-primary p-2 sm:p-3">High: {formatNumber(quote.high)}</div>
        <div className="rounded bg-black-primary p-2 sm:p-3">Low: {formatNumber(quote.low)}</div>
      </div>
    </div>
  );
}
