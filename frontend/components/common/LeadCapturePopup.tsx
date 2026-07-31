"use client";

import { useEffect, useState } from "react";
import { Lock, X } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { useLeadCapture } from "@/hooks/useLeadCapture";
import { academyMission } from "@/lib/content";
import { LogoMark } from "@/components/common/LogoMark";

export function LeadCapturePopup() {
  const { isOpen, initialize, markCaptured } = useLeadCapture();
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!isOpen) return null;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (form.name.trim().length < 2 || form.phone.trim().length < 10 || !form.email.includes("@")) {
      setError("Enter your full name, valid phone number, and email.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/api/leads", {
        name: form.name.trim(),
        phone: `+91${form.phone.replace(/^\+?91/, "").replace(/\D/g, "")}`,
        email: form.email.trim(),
        source: "popup",
        timestamp: new Date().toISOString()
      });
      markCaptured();
    } catch {
      setError("Could not save your access request. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black-primary/90 px-0 backdrop-blur-md md:px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="noise-overlay flex h-full w-full flex-col justify-center border-gold-primary/40 bg-black-surface p-6 shadow-[0_0_60px_rgba(201,168,76,0.2)] md:h-auto md:max-w-lg md:rounded-modal md:border md:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-title"
      >
        <div className="mb-8 flex items-center justify-between">
          <LogoMark />
          <button
            aria-label="Skip lead capture"
            className="premium-focus rounded p-2 text-white-muted transition hover:bg-black-elevated hover:text-white-primary md:hidden"
            onClick={markCaptured}
            type="button"
          >
            <X size={20} />
          </button>
        </div>
        <h2 id="lead-title" className="font-display text-4xl font-bold leading-tight text-white-primary">
          Get Free Access to Our <span className="gold-gradient-text">Daily Market Levels</span>
        </h2>
        <p className="mt-4 text-base leading-7 text-white-secondary">
          {academyMission}
        </p>
        <form className="mt-8 space-y-4" onSubmit={submit}>
          <input
            className="premium-focus min-h-12 w-full rounded border border-black-border bg-black-primary px-4 text-white-primary placeholder:text-white-muted"
            placeholder="Full Name"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          />
          <div className="flex min-h-12 overflow-hidden rounded border border-black-border bg-black-primary focus-within:shadow-gold">
            <span className="flex items-center border-r border-black-border px-4 text-white-secondary">+91</span>
            <input
              className="min-w-0 flex-1 bg-transparent px-4 text-white-primary outline-none placeholder:text-white-muted"
              placeholder="Phone Number"
              inputMode="tel"
              value={form.phone}
              onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
            />
          </div>
          <input
            className="premium-focus min-h-12 w-full rounded border border-black-border bg-black-primary px-4 text-white-primary placeholder:text-white-muted"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          />
          {error ? <p className="text-sm text-loss">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="gold-gradient-bg premium-focus min-h-12 w-full rounded font-semibold text-black-primary transition hover:shadow-gold disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Saving..." : "Get Free Access"}
          </button>
        </form>
        <p className="mt-4 flex items-center justify-center gap-2 text-sm text-white-secondary">
          <Lock size={14} className="text-gold-primary" /> No spam. Unsubscribe anytime.
        </p>
        <button type="button" onClick={markCaptured} className="premium-focus mx-auto mt-5 block text-sm text-white-muted hover:text-gold-light">
          Skip for now
        </button>
      </motion.div>
    </div>
  );
}
