"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
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
  thumbnail?: string | null;
};

export default function AdminCoursesPage() {
  const queryClient = useQueryClient();
  const [newCourse, setNewCourse] = useState({
    title: "",
    category: "Online Course",
    level: "Online",
    mode: "Online",
    duration: "Online access",
    price: "",
    originalPrice: "",
    description: "",
    thumbnail: "/pankaj-yadav-founder-new.png"
  });
  const { data } = useQuery({
    queryKey: ["admin", "courses"],
    queryFn: async () => (await api.get<{ courses: AdminCourse[] }>("/api/admin/courses")).data
  });
  const update = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<AdminCourse> }) => api.patch(`/api/admin/courses/${id}`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "courses"] })
  });
  const create = useMutation({
    mutationFn: () =>
      api.post("/api/admin/courses", {
        ...newCourse,
        price: Number(newCourse.price),
        originalPrice: newCourse.originalPrice ? Number(newCourse.originalPrice) : Number(newCourse.price),
      }),
    onSuccess: () => {
      setNewCourse({
        title: "",
        category: "Online Course",
        level: "Online",
        mode: "Online",
        duration: "Online access",
        price: "",
        originalPrice: "",
        description: "",
        thumbnail: "/pankaj-yadav-founder-new.png"
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "courses"] });
    }
  });

  function addCourse(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newCourse.title || !newCourse.description || !newCourse.price) return;
    create.mutate();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-white-primary">Course Management</h1>
        <p className="mt-2 text-white-secondary">Edit course names, descriptions, prices, modes, and active state.</p>
      </div>

      <form onSubmit={addCourse} className="card mb-8 grid gap-4 p-4 sm:p-5">
        <div>
          <h2 className="text-xl font-semibold text-white-primary">Add New Course</h2>
          <p className="mt-1 text-sm text-white-secondary">New active courses appear on the public courses page after saving.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <input className="premium-focus min-h-11 rounded border border-black-border bg-black-primary px-3 text-white-primary" placeholder="Course title" value={newCourse.title} onChange={(event) => setNewCourse({ ...newCourse, title: event.target.value })} />
          <input className="premium-focus min-h-11 rounded border border-black-border bg-black-primary px-3 text-white-primary" placeholder="Category" value={newCourse.category} onChange={(event) => setNewCourse({ ...newCourse, category: event.target.value })} />
          <input className="premium-focus min-h-11 rounded border border-black-border bg-black-primary px-3 text-white-primary" placeholder="Mode" value={newCourse.mode} onChange={(event) => setNewCourse({ ...newCourse, mode: event.target.value })} />
          <input className="premium-focus min-h-11 rounded border border-black-border bg-black-primary px-3 text-white-primary" placeholder="Duration" value={newCourse.duration} onChange={(event) => setNewCourse({ ...newCourse, duration: event.target.value })} />
          <input className="premium-focus min-h-11 rounded border border-black-border bg-black-primary px-3 text-white-primary" placeholder="Price" inputMode="numeric" value={newCourse.price} onChange={(event) => setNewCourse({ ...newCourse, price: event.target.value })} />
          <input className="premium-focus min-h-11 rounded border border-black-border bg-black-primary px-3 text-white-primary" placeholder="Original price" inputMode="numeric" value={newCourse.originalPrice} onChange={(event) => setNewCourse({ ...newCourse, originalPrice: event.target.value })} />
          <input className="premium-focus min-h-11 rounded border border-black-border bg-black-primary px-3 text-white-primary" placeholder="Level" value={newCourse.level} onChange={(event) => setNewCourse({ ...newCourse, level: event.target.value })} />
          <input className="premium-focus min-h-11 rounded border border-black-border bg-black-primary px-3 text-white-primary" placeholder="Image path or URL" value={newCourse.thumbnail} onChange={(event) => setNewCourse({ ...newCourse, thumbnail: event.target.value })} />
        </div>
        <textarea className="premium-focus min-h-24 rounded border border-black-border bg-black-primary px-3 py-2 text-white-primary" placeholder="Description" value={newCourse.description} onChange={(event) => setNewCourse({ ...newCourse, description: event.target.value })} />
        <button className="gold-gradient-bg premium-focus min-h-11 rounded px-4 font-semibold text-black-primary disabled:opacity-50 sm:w-fit" disabled={create.isPending || !newCourse.title || !newCourse.description || !newCourse.price}>
          {create.isPending ? "Adding..." : "Add Course"}
        </button>
      </form>

      <DataTable>
        <table className="w-full min-w-[1280px] text-sm">
          <thead className="bg-black-primary text-left text-xs uppercase tracking-[0.14em] text-white-muted">
            <tr>
              {["Course", "Description", "Category", "Mode", "Duration", "Price", "Original", "Enrollments", "Active"].map((head) => (
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
                    className="w-28 rounded border border-black-border bg-black-primary px-3 py-2 text-white-primary"
                    defaultValue={course.originalPrice ?? course.price}
                    onBlur={(event) => update.mutate({ id: course.id, payload: { originalPrice: Number(event.target.value) } })}
                    aria-label={`Original price for ${course.title}`}
                  />
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
