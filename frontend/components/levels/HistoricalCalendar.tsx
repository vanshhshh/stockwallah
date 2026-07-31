"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useLevelsHistory } from "@/hooks/useLevels";

export function HistoricalCalendar({ selectedDate, onDateChange }: { selectedDate: string; onDateChange: (date: string) => void }) {
  const { data } = useLevelsHistory();
  const chartData = (data?.levels || []).slice(0, 14).reverse().map((level, index) => ({
    day: new Date(level.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
    accuracy: level.hitType === "target" ? 100 : level.hitType === "stoploss" ? 0 : 50,
    index
  }));

  return (
    <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
      <div className="card p-4 sm:p-5">
        <h2 className="text-lg font-semibold text-white-primary">Historical Archive</h2>
        <label className="mt-5 block text-sm text-white-secondary">
          Calendar Picker
          <input
            type="date"
            className="premium-focus mt-2 min-h-11 w-full rounded border border-black-border bg-black-primary px-3 text-white-primary"
            value={selectedDate}
            onChange={(event) => onDateChange(event.target.value)}
          />
        </label>
        <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs sm:gap-3 sm:text-sm">
          <div className="rounded bg-black-primary p-2 sm:p-3">
            <div className="text-lg font-bold text-profit sm:text-xl">{data?.stats.winRate || 0}%</div>
            <div className="text-white-muted">Win rate</div>
          </div>
          <div className="rounded bg-black-primary p-2 sm:p-3">
            <div className="text-lg font-bold text-gold-light sm:text-xl">{data?.stats.averageRR || 0}</div>
            <div className="text-white-muted">Avg R:R</div>
          </div>
          <div className="rounded bg-black-primary p-2 sm:p-3">
            <div className="text-lg font-bold text-white-primary sm:text-xl">{data?.stats.totalMonthsTracked || 0}</div>
            <div className="text-white-muted">Months</div>
          </div>
        </div>
      </div>
      <div className="card p-4 sm:p-5">
        <h2 className="text-lg font-semibold text-white-primary">Accuracy Trend</h2>
        <div className="mt-5 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="day" stroke="#6B6B6B" tickLine={false} axisLine={false} />
              <YAxis stroke="#6B6B6B" tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: "#111111", border: "1px solid #2A2A2A", color: "#FAFAFA" }} />
              <Line type="monotone" dataKey="accuracy" stroke="#C9A84C" strokeWidth={3} dot={{ r: 3, fill: "#E8C97A" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
