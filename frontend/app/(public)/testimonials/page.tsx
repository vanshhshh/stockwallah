"use client";

import { useMemo, useState } from "react";
import { PlayCircle, Star } from "lucide-react";
import { testimonials } from "@/lib/content";
import { cn } from "@/lib/utils";

export default function TestimonialsPage() {
  const [course, setCourse] = useState("All");
  const courses = ["All", ...Array.from(new Set(testimonials.map((item) => item.course)))];
  const filtered = useMemo(() => (course === "All" ? testimonials : testimonials.filter((item) => item.course === course)), [course]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8 max-w-3xl">
        <h1 className="font-display text-5xl font-bold text-white-primary">Student Success Stories</h1>
        <p className="mt-4 text-lg leading-8 text-white-secondary">Written and video testimonials from learners building disciplined market routines.</p>
      </div>
      <div className="mb-8 flex flex-wrap gap-2">
        {courses.map((item) => (
          <button
            key={item}
            className={cn("premium-focus min-h-11 rounded border px-4 text-sm font-semibold", course === item ? "border-gold-primary bg-gold-muted text-gold-light" : "border-black-border bg-black-surface text-white-secondary")}
            onClick={() => setCourse(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mb-10 grid gap-5 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="card overflow-hidden">
            <div className="flex aspect-video items-center justify-center bg-[linear-gradient(135deg,rgba(201,168,76,0.22),rgba(10,10,10,0.75))]">
              <PlayCircle size={54} className="text-gold-light" />
            </div>
            <div className="p-4">
              <h2 className="font-semibold text-white-primary">Video Story #{index + 1}</h2>
              <p className="mt-2 text-sm text-white-secondary">How process, risk, and practice changed the learner&apos;s trading routine.</p>
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {filtered.map((item) => (
          <article key={item.name} className="card p-6">
            <div className="flex gap-1 text-gold-primary">
              {Array.from({ length: item.rating }).map((_, index) => (
                <Star key={index} size={18} fill="currentColor" />
              ))}
            </div>
            <p className="mt-5 text-xl leading-8 text-white-primary">“{item.quote}”</p>
            <div className="mt-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="font-semibold text-white-primary">{item.name}</h2>
                <p className="text-sm text-white-secondary">{item.course}</p>
              </div>
              <span className="rounded bg-gold-muted px-3 py-2 text-sm text-gold-light">{item.outcome}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

