"use client";

import { useMemo, useState } from "react";
import { CourseCard } from "./CourseCard";
import { CourseFilters } from "./CourseFilters";
import { useCourses } from "@/hooks/useCourses";

export function CoursesPageClient() {
  const [filter, setFilter] = useState("All");
  const { data: courses = [] } = useCourses();
  const filtered = useMemo(() => {
    if (filter === "All") return courses;
    return courses.filter((course) => course.level === filter || course.category === filter || course.mode.toLowerCase().includes(filter.toLowerCase()));
  }, [courses, filter]);

  return (
    <>
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <CourseFilters value={filter} onChange={setFilter} />
        <p className="text-sm text-white-muted">{filtered.length} courses available</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((course) => (
          <CourseCard key={course.slug} course={course} />
        ))}
      </div>
    </>
  );
}
