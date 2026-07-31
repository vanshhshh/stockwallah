import Image from "next/image";
import Link from "next/link";
import { Clock, GraduationCap, MonitorPlay, Star } from "lucide-react";
import type { Course } from "@/lib/content";
import { formatInr } from "@/lib/utils";

export function CourseCard({ course }: { course: Course }) {
  const hasDiscount = course.originalPrice > course.price;

  return (
    <article className="card group flex min-h-[400px] min-w-0 flex-col overflow-hidden transition hover:border-gold-primary/45 hover:shadow-gold sm:min-h-[420px]">
      <div className="relative h-48 overflow-hidden bg-black-elevated sm:h-56">
        <Image src={course.image} alt={`${course.title} course`} fill sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover object-[center_32%] transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black-primary via-black-primary/20 to-transparent" />
        <div className="absolute bottom-4 left-4 rounded bg-black-primary/75 px-3 py-1 text-xs font-semibold text-gold-light backdrop-blur">{course.category}</div>
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="mb-3 flex items-center gap-1 text-sm text-gold-light">
          <Star size={15} fill="currentColor" /> {course.rating} <span className="text-white-muted">({course.students.toLocaleString("en-IN")} learners)</span>
        </div>
        <h3 className="text-lg font-semibold leading-7 text-white-primary sm:text-xl">{course.title}</h3>
        <p className="mt-3 text-sm leading-6 text-white-secondary">{course.description}</p>
        <div className="mt-5 grid gap-2 text-sm text-white-muted">
          <span className="inline-flex items-center gap-2">
            <Clock size={16} className="text-gold-primary" /> {course.duration}
          </span>
          <span className="inline-flex items-center gap-2">
            <MonitorPlay size={16} className="text-gold-primary" /> {course.mode}
          </span>
          <span className="inline-flex items-center gap-2">
            <GraduationCap size={16} className="text-gold-primary" /> {course.lessons} lessons
          </span>
        </div>
        <div className="mt-auto flex flex-col gap-4 pt-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-2xl font-bold text-white-primary">{formatInr(course.price)}</div>
            {hasDiscount ? <div className="text-sm text-white-muted line-through">{formatInr(course.originalPrice)}</div> : null}
          </div>
          <Link href={`/enroll?course=${course.slug}`} className="gold-gradient-bg inline-flex min-h-11 items-center justify-center rounded px-4 py-3 text-sm font-semibold text-black-primary transition group-hover:shadow-gold">
            Enroll Now
          </Link>
        </div>
      </div>
    </article>
  );
}
