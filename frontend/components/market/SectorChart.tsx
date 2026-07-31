import { sectors } from "@/lib/content";
import { cn } from "@/lib/utils";

export function SectorChart() {
  const max = Math.max(...sectors.map((sector) => Math.abs(sector.change)));
  return (
    <div className="card p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-white-primary">Sector Performance</h2>
      <div className="mt-6 grid gap-4">
        {sectors.map((sector) => {
          const width = `${Math.max((Math.abs(sector.change) / max) * 100, 8)}%`;
          const positive = sector.change >= 0;
          return (
            <div key={sector.name} className="grid gap-2 md:grid-cols-[120px_1fr_70px] md:items-center">
              <div className="text-sm text-white-secondary">{sector.name}</div>
              <div className="h-3 overflow-hidden rounded bg-black-primary">
                <div className={cn("h-full rounded", positive ? "bg-profit" : "bg-loss")} style={{ width }} />
              </div>
              <div className={cn("text-sm font-semibold", positive ? "text-profit" : "text-loss")}>
                {positive ? "+" : ""}
                {sector.change.toFixed(1)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
