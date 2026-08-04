"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/admin/DataTable";
import { api } from "@/lib/api";
import { todayIso } from "@/lib/utils";
import type { TradingLevel } from "@/hooks/useLevels";

const levelTypes = ["Support", "Resistance", "Strong Support", "Strong Resistance", "CPR"];
const symbols = [
  { value: "NIFTY", label: "NIFTY 50" },
  { value: "NIFTYFUT", label: "NIFTY Futures" },
  { value: "BANKNIFTY", label: "BANKNIFTY" }
];

export default function AdminLevelsPage() {
  const [date, setDate] = useState(todayIso());
  const [symbol, setSymbol] = useState("NIFTY");
  const [form, setForm] = useState({ levelPrice: "", levelType: "Support", targetPrice: "", stoplossPrice: "", notes: "" });
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["admin", "levels", date, symbol],
    queryFn: async () => (await api.get<{ levels: TradingLevel[] }>("/api/admin/levels", { params: { date, symbol } })).data
  });

  const create = useMutation({
    mutationFn: () =>
      api.post("/api/admin/levels", {
        date,
        symbol,
        levelPrice: Number(form.levelPrice),
        levelType: form.levelType,
        targetPrice: form.targetPrice ? Number(form.targetPrice) : null,
        stoplossPrice: form.stoplossPrice ? Number(form.stoplossPrice) : null,
        notes: form.notes
      }),
    onSuccess: () => {
      setForm({ levelPrice: "", levelType: "Support", targetPrice: "", stoplossPrice: "", notes: "" });
      queryClient.invalidateQueries({ queryKey: ["admin", "levels"] });
    }
  });

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<TradingLevel> }) => api.put(`/api/admin/levels/${id}`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "levels"] })
  });

  const remove = useMutation({
    mutationFn: (id: number) => api.delete(`/api/admin/levels/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "levels"] })
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-white-primary">Trading Levels Management</h1>
        <p className="mt-2 text-white-secondary">Add, edit, delete, and mark target or stoploss hits for daily levels.</p>
      </div>
      <div className="mb-6 grid gap-4 lg:grid-cols-[180px_180px_1fr]">
        <input className="premium-focus min-h-11 rounded border border-black-border bg-black-surface px-3 text-white-primary" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        <select className="premium-focus min-h-11 rounded border border-black-border bg-black-surface px-3 text-white-primary" value={symbol} onChange={(event) => setSymbol(event.target.value)}>
          {symbols.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
      </div>
      <div className="card mb-8 p-5">
        <h2 className="mb-4 text-xl font-semibold text-white-primary">Add Today&apos;s Level</h2>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <input className="premium-focus min-h-11 rounded border border-black-border bg-black-primary px-3 text-white-primary" placeholder="Level price" value={form.levelPrice} onChange={(e) => setForm({ ...form, levelPrice: e.target.value })} />
          <select className="premium-focus min-h-11 rounded border border-black-border bg-black-primary px-3 text-white-primary" value={form.levelType} onChange={(e) => setForm({ ...form, levelType: e.target.value })}>
            {levelTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
          <input className="premium-focus min-h-11 rounded border border-black-border bg-black-primary px-3 text-white-primary" placeholder="Target" value={form.targetPrice} onChange={(e) => setForm({ ...form, targetPrice: e.target.value })} />
          <input className="premium-focus min-h-11 rounded border border-black-border bg-black-primary px-3 text-white-primary" placeholder="Stoploss" value={form.stoplossPrice} onChange={(e) => setForm({ ...form, stoplossPrice: e.target.value })} />
          <button className="gold-gradient-bg premium-focus inline-flex min-h-11 items-center justify-center gap-2 rounded px-4 font-semibold text-black-primary" onClick={() => create.mutate()} disabled={!form.levelPrice}>
            <Plus size={16} /> Add
          </button>
        </div>
        <input className="premium-focus mt-3 min-h-11 w-full rounded border border-black-border bg-black-primary px-3 text-white-primary" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
      </div>
      <DataTable>
        <table className="w-full min-w-[980px] text-sm">
          <thead className="bg-black-primary text-left text-xs uppercase tracking-[0.14em] text-white-muted">
            <tr>
              {["Price", "Type", "Target", "SL", "Notes", "Hit", "Hit Time", ""].map((head) => (
                <th key={head} className="px-5 py-3">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(data?.levels || []).map((level) => (
              <tr key={level.id} className="border-t border-black-border">
                <td className="px-5 py-4 font-semibold text-white-primary">{level.levelPrice}</td>
                <td className="px-5 py-4 text-white-secondary">{level.levelType}</td>
                <td className="px-5 py-4 text-white-secondary">{level.targetPrice || "—"}</td>
                <td className="px-5 py-4 text-white-secondary">{level.stoplossPrice || "—"}</td>
                <td className="px-5 py-4 text-white-muted">{level.notes || "—"}</td>
                <td className="px-5 py-4">
                  <select
                    className="rounded border border-black-border bg-black-primary px-3 py-2 text-white-primary"
                    value={level.hitType || ""}
                    onChange={(event) =>
                      update.mutate({
                        id: level.id,
                        payload: {
                          hitType: event.target.value ? (event.target.value as "target" | "stoploss") : null,
                          isHit: Boolean(event.target.value),
                          hitTime: event.target.value ? new Date().toISOString() : null
                        }
                      })
                    }
                  >
                    <option value="">Open</option>
                    <option value="target">Target</option>
                    <option value="stoploss">Stoploss</option>
                  </select>
                </td>
                <td className="px-5 py-4 text-white-muted">{level.hitTime ? new Date(level.hitTime).toLocaleString("en-IN") : "—"}</td>
                <td className="px-5 py-4">
                  <button className="premium-focus rounded p-2 text-loss hover:bg-loss/10" onClick={() => remove.mutate(level.id)} aria-label="Delete level">
                    <Trash2 size={17} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>
    </div>
  );
}
