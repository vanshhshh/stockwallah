"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/admin/DataTable";
import { api } from "@/lib/api";
import { formatInr } from "@/lib/utils";

type AdminCourse = {
  id: number;
  title: string;
  category: string;
  level: string;
  duration: string;
  mode: string;
  price: number;
  originalPrice: number | null;
  active: boolean;
  enrollmentCount: number;
  description: string;
};

export default function AdminCoursesPage() {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin", "courses"],
    queryFn: async () => (await api.get<{ courses: AdminCourse[] }>("/api/admin/courses")).data
  });
  const update = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<AdminCourse> }) => api.patch(`/api/admin/courses/${id}`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "courses"] })
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-white-primary">Course Management</h1>
        <p className="mt-2 text-white-secondary">Edit course names, descriptions, prices, modes, and active state.</p>
      </div>
      <DataTable>
        <table className="w-full min-w-[1280px] text-sm">
          <thead className="bg-black-primary text-left text-xs uppercase tracking-[0.14em] text-white-muted">
            <tr>
              {["Course", "Description", "Category", "Mode", "Duration", "Price", "Enrollments", "Active"].map((head) => (
                <th key={head} className="px-5 py-3">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(data?.courses || []).map((course) => (
              <tr key={course.id} className="border-t border-black-border">
                <td className="px-5 py-4 align-top">
                  <input
                    className="w-52 rounded border border-black-border bg-black-primary px-3 py-2 font-semibold text-white-primary"
                    defaultValue={course.title}
                    onBlur={(event) => update.mutate({ id: course.id, payload: { title: event.target.value } })}
                    aria-label={`Title for ${course.title}`}
                  />
                </td>
                <td className="px-5 py-4 align-top">
                  <textarea
                    className="h-24 w-80 rounded border border-black-border bg-black-primary px-3 py-2 text-white-primary"
                    defaultValue={course.description}
                    onBlur={(event) => update.mutate({ id: course.id, payload: { description: event.target.value } })}
                    aria-label={`Description for ${course.title}`}
                  />
                </td>
                <td className="px-5 py-4 align-top">
                  <input
                    className="w-40 rounded border border-black-border bg-black-primary px-3 py-2 text-white-primary"
                    defaultValue={course.category}
                    onBlur={(event) => update.mutate({ id: course.id, payload: { category: event.target.value, level: event.target.value.includes("Offline") ? "Offline" : "Online" } })}
                    aria-label={`Category for ${course.title}`}
                  />
                </td>
                <td className="px-5 py-4 align-top">
                  <input
                    className="w-32 rounded border border-black-border bg-black-primary px-3 py-2 text-white-primary"
                    defaultValue={course.mode}
                    onBlur={(event) => update.mutate({ id: course.id, payload: { mode: event.target.value } })}
                    aria-label={`Mode for ${course.title}`}
                  />
                </td>
                <td className="px-5 py-4 align-top">
                  <input
                    className="w-36 rounded border border-black-border bg-black-primary px-3 py-2 text-white-primary"
                    defaultValue={course.duration}
                    onBlur={(event) => update.mutate({ id: course.id, payload: { duration: event.target.value } })}
                    aria-label={`Duration for ${course.title}`}
                  />
                </td>
                <td className="px-5 py-4 align-top">
                  <input
                    className="w-28 rounded border border-black-border bg-black-primary px-3 py-2 text-white-primary"
                    defaultValue={course.price}
                    onBlur={(event) => update.mutate({ id: course.id, payload: { price: Number(event.target.value) } })}
                    aria-label={`Price for ${course.title}`}
                  />
                  <div className="mt-1 text-xs text-white-muted">{formatInr(course.price)}</div>
                </td>
                <td className="px-5 py-4 align-top">
                  <input
                    className="w-24 rounded border border-black-border bg-black-primary px-3 py-2 text-white-primary"
                    defaultValue={course.enrollmentCount}
                    onBlur={(event) => update.mutate({ id: course.id, payload: { enrollmentCount: Number(event.target.value) } })}
                    aria-label={`Enrollment count for ${course.title}`}
                  />
                </td>
                <td className="px-5 py-4 align-top">
                  <button
                    onClick={() => update.mutate({ id: course.id, payload: { active: !course.active } })}
                    className={`rounded px-3 py-2 text-sm font-semibold ${course.active ? "bg-profit/10 text-profit" : "bg-loss/10 text-loss"}`}
                  >
                    {course.active ? "Active" : "Inactive"}
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
