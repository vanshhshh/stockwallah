import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CourseDetailClient } from "@/components/courses/CourseDetailClient";
import { courses } from "@/lib/content";

export function generateStaticParams() {
  return courses.map((course) => ({ slug: course.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const course = courses.find((item) => item.slug === params.slug);
  return {
    title: course ? `${course.title} — StockWallah` : "Course — StockWallah",
    description: course?.description
  };
}

export default function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = courses.find((item) => item.slug === params.slug);
  if (!course) notFound();
  return <CourseDetailClient course={course} />;
}

