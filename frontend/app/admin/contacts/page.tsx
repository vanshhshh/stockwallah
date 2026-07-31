"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
import { api } from "@/lib/api";

type Contact = { id: number; name: string; email: string; phone?: string; courseInterest?: string; message: string; isRead: boolean; createdAt: string };

export default function AdminContactsPage() {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin", "contacts"],
    queryFn: async () => (await api.get<{ contacts: Contact[] }>("/api/admin/contacts")).data
  });
  const read = useMutation({
    mutationFn: (id: number) => api.patch(`/api/admin/contacts/${id}/read`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "contacts"] })
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-white-primary">Contact Messages</h1>
        <p className="mt-2 text-white-secondary">Advisor queries from the public contact form.</p>
      </div>
      <DataTable>
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-black-primary text-left text-xs uppercase tracking-[0.14em] text-white-muted">
            <tr>
              {["Name", "Contact", "Interest", "Message", "Date", "Read"].map((head) => (
                <th key={head} className="px-5 py-3">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(data?.contacts || []).map((item) => (
              <tr key={item.id} className="border-t border-black-border">
                <td className="px-5 py-4 font-semibold text-white-primary">{item.name}</td>
                <td className="px-5 py-4 text-white-secondary">{item.email}<br /><span className="text-white-muted">{item.phone || "—"}</span></td>
                <td className="px-5 py-4 text-white-secondary">{item.courseInterest || "—"}</td>
                <td className="px-5 py-4 text-white-secondary">{item.message}</td>
                <td className="px-5 py-4 text-white-muted">{new Date(item.createdAt).toLocaleString("en-IN")}</td>
                <td className="px-5 py-4">
                  {item.isRead ? (
                    <span className="text-profit">Read</span>
                  ) : (
                    <button className="premium-focus rounded p-2 text-gold-light hover:bg-gold-muted" onClick={() => read.mutate(item.id)} aria-label="Mark as read">
                      <CheckCircle2 size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>
    </div>
  );
}

