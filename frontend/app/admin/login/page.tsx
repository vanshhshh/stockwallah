"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { api } from "@/lib/api";
import { GoldButton } from "@/components/common/GoldButton";

function AdminLoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/api/admin/auth/login", form);
      const next = search.get("next");
      const target = next?.startsWith("/admin/") && !next.includes("://") ? next : "/admin/dashboard";
      router.replace(target);
      router.refresh();
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-black-primary px-4">
      <form onSubmit={submit} autoComplete="off" className="noise-overlay w-full max-w-md rounded-modal border border-gold-primary/35 bg-black-surface p-8 shadow-[0_0_60px_rgba(201,168,76,0.18)]">
        <LockKeyhole className="text-gold-primary" size={34} />
        <h1 className="mt-5 font-display text-4xl font-bold text-white-primary">Admin Login</h1>
        <p className="mt-2 text-sm text-white-secondary">Protected portal for StockWallah Academy operations.</p>
        <div className="mt-7 grid gap-4">
          <input className="premium-focus min-h-12 rounded border border-black-border bg-black-primary px-4 text-white-primary" placeholder="Username" type="email" autoComplete="off" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="premium-focus min-h-12 rounded border border-black-border bg-black-primary px-4 text-white-primary" placeholder="Password" type="password" autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        {error ? <p className="mt-4 text-sm text-loss">{error}</p> : null}
        <GoldButton type="submit" className="mt-6 w-full">
          {loading ? "Signing in..." : "Sign In"}
        </GoldButton>
      </form>
    </section>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<section className="min-h-screen bg-black-primary" />}>
      <AdminLoginForm />
    </Suspense>
  );
}
