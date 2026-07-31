"use client";

import { useState } from "react";
import { Download, Search, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/admin/DataTable";
import { API_URL, api } from "@/lib/api";

type Lead = { id: number; name: string; phone: string; email: string; source: string; status: string; createdAt: string };

export default function AdminLeadsPage() {
  const [q, setQ] = useState("");
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin", "leads", q],
    queryFn: async () => (await api.get<{ leads: Lead[] }>("/api/admin/leads", { params: { q } })).data
  });

  const update = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => api.patch(`/api/admin/leads/${id}`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "leads"] })
  });
  const remove = useMutation({
    mutationFn: (id: number) => api.delete(`/api/admin/leads/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "leads"] })
  });

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold text-white-primary">Lead Management</h1>
          <p className="mt-2 text-white-secondary">Track popup leads and advisor follow-ups.</p>
        </div>
        <a href={`${API_URL}/api/admin/leads/export`} className="gold-gradient-bg inline-flex min-h-11 items-center justify-center gap-2 rounded px-4 text-sm font-semibold text-black-primary">
          <Download size={16} /> Export CSV
        </a>
      </div>
      <label className="relative mb-5 block max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white-muted" size={18} />
        <input className="premium-focus min-h-11 w-full rounded border border-black-border bg-black-surface pl-10 pr-4 text-white-primary" placeholder="Search leads" value={q} onChange={(event) => setQ(event.target.value)} />
      </label>
      <DataTable>
        <table className="w-full min-w-[880px] text-sm">
          <thead className="bg-black-primary text-left text-xs uppercase tracking-[0.14em] text-white-muted">
            <tr>
              {["Name", "Phone", "Email", "Source", "Date", "Status", ""].map((head) => (
                <th key={head} className="px-5 py-3">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(data?.leads || []).map((lead) => (
              <tr key={lead.id} className="border-t border-black-border">
                <td className="px-5 py-4 font-semibold text-white-primary">{lead.name}</td>
                <td className="px-5 py-4 text-white-secondary">{lead.phone}</td>
                <td className="px-5 py-4 text-white-secondary">{lead.email}</td>
                <td className="px-5 py-4 text-white-secondary">{lead.source}</td>
                <td className="px-5 py-4 text-white-muted">{new Date(lead.createdAt).toLocaleString("en-IN")}</td>
                <td className="px-5 py-4">
                  <select className="rounded border border-black-border bg-black-primary px-3 py-2 text-white-primary" value={lead.status} onChange={(event) => update.mutate({ id: lead.id, status: event.target.value })}>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="enrolled">Enrolled</option>
                  </select>
                </td>
                <td className="px-5 py-4">
                  <button className="premium-focus rounded p-2 text-loss hover:bg-loss/10" onClick={() => remove.mutate(lead.id)} aria-label={`Delete ${lead.name}`}>
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

