import { ArrowRight } from "lucide-react";
import { CourseCard } from "@/components/courses/CourseCard";
import { SectionHeading } from "@/components/common/SectionHeading";
import { courses } from "@/lib/content";
import { GoldButton } from "@/components/common/GoldButton";

export function CoursesPreview() {
  const previewCourses = ["secret-strategy", "smc", "all-in-one-online"]
    .map((slug) => courses.find((course) => course.slug === slug))
    .filter((course): course is (typeof courses)[number] => Boolean(course));

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:py-14 lg:py-16">
      <div className="mb-7 flex flex-col gap-5 sm:mb-9 md:flex-row md:items-end md:justify-between">
        <SectionHeading title="Courses Built for Basic to Advance and Advance to Pro" description="Choose focused online programs or complete offline mentorship across SMC, price action, stock selection, crypto, forex, and Indian markets." />
        <GoldButton href="/courses" variant="outline" className="w-full shrink-0 sm:w-auto">
          View All <ArrowRight size={18} />
        </GoldButton>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {previewCourses.map((course) => (
          <CourseCard key={course.slug} course={course} />
        ))}
      </div>
    </section>
  );
}
