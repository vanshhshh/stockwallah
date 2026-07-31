"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/admin/DataTable";
import { api } from "@/lib/api";

type Enrollment = { id: number; name: string; email: string; phone: string; course: string; mode: string; status: string; createdAt: string };

export default function AdminEnrollmentsPage() {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin", "enrollments"],
    queryFn: async () => (await api.get<{ enrollments: Enrollment[] }>("/api/admin/enrollments")).data
  });
  const update = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => api.patch(`/api/admin/enrollments/${id}`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "enrollments"] })
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-white-primary">Enrollment Management</h1>
        <p className="mt-2 text-white-secondary">Confirm, cancel, and monitor course enrollment requests.</p>
      </div>
      <DataTable>
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-black-primary text-left text-xs uppercase tracking-[0.14em] text-white-muted">
            <tr>
              {["Name", "Contact", "Course", "Mode", "Date", "Status"].map((head) => (
                <th key={head} className="px-5 py-3">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(data?.enrollments || []).map((item) => (
              <tr key={item.id} className="border-t border-black-border">
                <td className="px-5 py-4 font-semibold text-white-primary">{item.name}</td>
                <td className="px-5 py-4 text-white-secondary">{item.phone}<br /><span className="text-white-muted">{item.email}</span></td>
                <td className="px-5 py-4 text-white-secondary">{item.course}</td>
                <td className="px-5 py-4 capitalize text-white-secondary">{item.mode}</td>
                <td className="px-5 py-4 text-white-muted">{new Date(item.createdAt).toLocaleString("en-IN")}</td>
                <td className="px-5 py-4">
                  <select className="rounded border border-black-border bg-black-primary px-3 py-2 text-white-primary" value={item.status} onChange={(event) => update.mutate({ id: item.id, status: event.target.value })}>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>
    </div>
  );
}

