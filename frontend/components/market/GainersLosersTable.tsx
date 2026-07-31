import type { MarketMover } from "@/hooks/useMarketData";
import { cn, formatNumber } from "@/lib/utils";

export function GainersLosersTable({ title, rows, type }: { title: string; rows: MarketMover[]; type: "gainer" | "loser" }) {
  const positive = type === "gainer";
  return (
    <div className="card overflow-hidden">
      <div className="border-b border-black-border px-5 py-4">
        <h2 className="text-lg font-semibold text-white-primary">{title}</h2>
      </div>
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full min-w-[480px] text-sm">
          <thead className="bg-black-primary text-left text-xs uppercase tracking-[0.14em] text-white-muted">
            <tr>
              <th className="px-5 py-3">#</th>
              <th className="px-5 py-3">Symbol</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">%Chg</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.symbol} className="animate-flashGreen border-t border-black-border/70">
                <td className="px-5 py-4 text-white-muted">{index + 1}</td>
                <td className="px-5 py-4">
                  <div className="font-semibold text-white-primary">{row.symbol}</div>
                  <div className="max-w-[180px] truncate text-xs text-white-muted">{row.companyName}</div>
                </td>
                <td className="px-5 py-4 text-white-secondary">{formatNumber(row.lastPrice)}</td>
                <td className={cn("px-5 py-4 font-semibold", positive ? "text-profit" : "text-loss")}>
                  {row.pChange > 0 ? "+" : ""}
                  {formatNumber(row.pChange)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

