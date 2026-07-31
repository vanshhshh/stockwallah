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
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black-primary/90 px-3 py-3 backdrop-blur-md sm:px-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="noise-overlay my-auto flex max-h-[calc(100dvh-1.5rem)] w-full max-w-lg flex-col overflow-y-auto rounded-modal border border-gold-primary/40 bg-black-surface p-4 shadow-[0_0_60px_rgba(201,168,76,0.2)] sm:p-6 md:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-title"
      >
        <div className="mb-5 flex items-center justify-between sm:mb-8">
          <LogoMark />
          <button
            aria-label="Skip lead capture"
            className="premium-focus inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black-border bg-black-primary text-white-muted transition hover:bg-black-elevated hover:text-white-primary"
            onClick={markCaptured}
            type="button"
          >
            <X size={20} />
          </button>
        </div>
        <h2 id="lead-title" className="font-display text-3xl font-bold leading-tight text-white-primary sm:text-4xl">
          Get Free Access to Our <span className="gold-gradient-text">Daily Market Levels</span>
        </h2>
        <p className="mt-3 text-sm leading-6 text-white-secondary sm:mt-4 sm:text-base sm:leading-7">
          {academyMission}
        </p>
        <form className="mt-5 space-y-3 sm:mt-8 sm:space-y-4" onSubmit={submit}>
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
        <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-white-secondary sm:text-sm">
          <Lock size={14} className="text-gold-primary" /> No spam. Unsubscribe anytime.
        </p>
        <button type="button" onClick={markCaptured} className="premium-focus mx-auto mt-4 block min-h-10 px-4 text-sm text-white-muted hover:text-gold-light sm:mt-5">
          Skip for now
        </button>
      </motion.div>
    </div>
  );
}
