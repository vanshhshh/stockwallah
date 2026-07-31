"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { testimonials } from "@/lib/content";

export function TestimonialsCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((current) => (current + 1) % testimonials.length), 4200);
    return () => clearInterval(timer);
  }, []);

  const active = testimonials[index];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-primary">Student Success</p>
          <h2 className="mt-3 font-display text-4xl font-bold text-white-primary">Built by Consistency, Not Noise</h2>
          <p className="mt-4 text-white-secondary">Real learners, real routines, and a process that survives market volatility.</p>
        </div>
        <div className="card min-h-[280px] p-7">
          <div className="mb-6 flex gap-1 text-gold-primary">
            {Array.from({ length: active.rating }).map((_, star) => (
              <Star key={star} size={20} fill="currentColor" />
            ))}
          </div>
          <p className="text-2xl leading-9 text-white-primary">&ldquo;{active.quote}&rdquo;</p>
          <div className="mt-8 flex items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-white-primary">{active.name}</h3>
              <p className="text-sm text-white-secondary">{active.course}</p>
            </div>
            <div className="hidden rounded border border-gold-primary/30 bg-gold-muted px-3 py-2 text-right text-sm text-gold-light md:block">{active.outcome}</div>
          </div>
          <div className="mt-7 flex gap-2">
            {testimonials.map((item, itemIndex) => (
              <button
                key={item.name}
                aria-label={`Show testimonial ${itemIndex + 1}`}
                className={`h-2 rounded-full transition-all ${itemIndex === index ? "w-8 bg-gold-primary" : "w-2 bg-black-border"}`}
                onClick={() => setIndex(itemIndex)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
