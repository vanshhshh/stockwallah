import type { Metadata } from "next";
import { CoursesPageClient } from "@/components/courses/CoursesPageClient";

export const metadata: Metadata = {
  title: "Courses - StockWallah",
  description:
    "Explore StockWallah online and offline courses, including SMC, intraday stock selection, price action, crypto, forex, Indian markets, and all-in-one mentorship."
};

export default function CoursesPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-10 max-w-3xl">
        <h1 className="font-display text-5xl font-bold leading-tight text-white-primary md:text-6xl">Stock Market Courses</h1>
        <p className="mt-5 text-lg leading-8 text-white-secondary">
          Practical online courses and offline mentorship for stock market trading, price action, SMC, crypto, forex, and Indian market learning.
        </p>
      </div>
      <CoursesPageClient />
    </section>
  );
}
