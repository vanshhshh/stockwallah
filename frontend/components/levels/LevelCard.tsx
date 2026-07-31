import { Clock, Target } from "lucide-react";
import type { TradingLevel } from "@/hooks/useLevels";
import { cn, formatInr, formatNumber } from "@/lib/utils";

const lotSize: Record<string, number> = { NIFTY: 50, BANKNIFTY: 15 };

export function calculateLevelPnl(level: TradingLevel, symbol: string) {
  const lot = lotSize[symbol] || 1;
  if (!level.targetPrice || !level.stoplossPrice) {
    return { amount: 0, status: "OPEN", rr: 0 };
  }
  const reward = Math.abs(level.targetPrice - level.levelPrice);
  const risk = Math.abs(level.levelPrice - level.stoplossPrice);
  const rr = risk ? reward / risk : 0;
  if (level.hitType === "target") return { amount: reward * lot, status: "TARGET HIT", rr };
  if (level.hitType === "stoploss") return { amount: -risk * lot, status: "SL HIT", rr };
  return { amount: 0, status: "OPEN", rr };
}

export function LevelCard({ level, symbol }: { level: TradingLevel; symbol: string }) {
  const pnl = calculateLevelPnl(level, symbol);
  const positive = pnl.amount >= 0;

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white-primary">
            {symbol} {level.levelType} @ {formatNumber(level.levelPrice)}
          </h3>
          <p className="mt-2 text-sm text-white-secondary">{level.notes || "Admin marked market reaction level"}</p>
        </div>
        <span className="rounded bg-gold-muted px-2 py-1 text-xs font-semibold text-gold-light">{level.levelType}</span>
      </div>
      <div className="mt-5 grid gap-3 text-sm md:grid-cols-2">
        <div className="rounded bg-black-primary p-3 text-white-secondary">Target: {level.targetPrice ? formatNumber(level.targetPrice) : "—"}</div>
        <div className="rounded bg-black-primary p-3 text-white-secondary">SL: {level.stoplossPrice ? formatNumber(level.stoplossPrice) : "—"}</div>
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-black-border pt-4">
        <div className={cn("inline-flex items-center gap-2 rounded px-3 py-2 text-sm font-semibold", pnl.status === "OPEN" ? "bg-black-elevated text-white-secondary" : positive ? "bg-profit/10 text-profit" : "bg-loss/10 text-loss")}>
          <Target size={16} /> {pnl.status} {pnl.status !== "OPEN" ? `(${formatInr(pnl.amount)} / lot)` : ""}
        </div>
        {level.hitTime ? (
          <div className="inline-flex items-center gap-2 text-sm text-white-muted">
            <Clock size={15} /> {new Date(level.hitTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" })}
          </div>
        ) : (
          <div className="text-sm text-white-muted">R:R {pnl.rr.toFixed(2)}</div>
        )}
      </div>
    </div>
  );
}

