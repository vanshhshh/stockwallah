import { Activity, CheckCircle2, CircleDot, XCircle } from "lucide-react";
import type { TradingLevel } from "@/hooks/useLevels";
import { cn, formatInr } from "@/lib/utils";
import { calculateLevelPnl } from "./LevelCard";

export function DailySummary({ levels, symbol }: { levels: TradingLevel[]; symbol: string }) {
  const targetsHit = levels.filter((level) => level.hitType === "target").length;
  const stoplossHit = levels.filter((level) => level.hitType === "stoploss").length;
  const open = levels.filter((level) => !level.hitType).length;
  const net = levels.reduce((sum, level) => sum + calculateLevelPnl(level, symbol).amount, 0);
  const accuracy = targetsHit + stoplossHit ? Math.round((targetsHit / (targetsHit + stoplossHit)) * 100) : 0;

  const stats = [
    { label: "Total levels", value: levels.length, icon: Activity, color: "text-white-primary" },
    { label: "Targets hit", value: targetsHit, icon: CheckCircle2, color: "text-profit" },
    { label: "SL hit", value: stoplossHit, icon: XCircle, color: "text-loss" },
    { label: "Open", value: open, icon: CircleDot, color: "text-white-secondary" }
  ];

  return (
    <div className="card p-5">
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded bg-black-primary p-4">
            <Icon size={20} className={color} />
            <div className="mt-3 text-2xl font-bold text-white-primary">{value}</div>
            <div className="text-sm text-white-muted">{label}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-col gap-3 rounded bg-black-primary p-4 md:flex-row md:items-center md:justify-between">
        <div className={cn("text-2xl font-bold", net >= 0 ? "text-profit" : "text-loss")}>Net PnL (1 lot): {formatInr(net)}</div>
        <div className="text-lg font-semibold text-gold-light">Accuracy: {accuracy}%</div>
      </div>
    </div>
  );
}

