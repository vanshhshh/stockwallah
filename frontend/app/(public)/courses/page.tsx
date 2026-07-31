import type { Metadata } from "next";
import { CoursesPageClient } from "@/components/courses/CoursesPageClient";

export const metadata: Metadata = {
  title: "Courses - StockWallah",
  description:
    "Explore StockWallah online and offline courses, including SMC, intraday stock selection, price action, crypto, forex, Indian markets, and all-in-one mentorship."
};

export default function CoursesPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:py-14 lg:py-16">
      <div className="mb-8 max-w-3xl sm:mb-10">
        <h1 className="font-display text-3xl font-bold leading-tight text-white-primary sm:text-5xl lg:text-6xl">Stock Market Courses</h1>
        <p className="mt-4 text-sm leading-6 text-white-secondary sm:mt-5 sm:text-lg sm:leading-8">
          Practical online courses and offline mentorship for stock market trading, price action, SMC, crypto, forex, and Indian market learning.
        </p>
      </div>
      <CoursesPageClient />
    </section>
  );
}
