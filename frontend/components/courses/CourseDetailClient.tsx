"use client";

import { useState } from "react";
import { Check, ChevronDown, Clock, FileBadge, PlayCircle, Star, Users } from "lucide-react";
import { contactInfo, curriculum, type Course } from "@/lib/content";
import { associateMentorProfile, founderProfile, mentorProfile } from "@/lib/content";
import { formatInr } from "@/lib/utils";
import { GoldButton } from "@/components/common/GoldButton";
import { useCourses } from "@/hooks/useCourses";

const tabs = ["Overview", "Curriculum", "Instructor", "Reviews", "FAQs"];

export function CourseDetailClient({ course: initialCourse }: { course: Course }) {
  const { data: publicCourses } = useCourses();
  const course = publicCourses?.find((item) => item.slug === initialCourse.slug) || initialCourse;
  const [active, setActive] = useState("Overview");
  const [openModule, setOpenModule] = useState(0);
  const hasDiscount = course.originalPrice > course.price;

  return (
    <div>
      <section className="border-b border-black-border bg-black-surface/45">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:py-14 lg:grid-cols-[1.15fr_0.85fr] lg:py-16">
          <div className="min-w-0">
            <div className="mb-4 inline-flex rounded border border-gold-primary/35 bg-gold-muted px-3 py-1 text-sm text-gold-light">{course.category}</div>
            <h1 className="font-display text-3xl font-bold leading-tight text-white-primary sm:text-5xl lg:text-6xl">{course.title}</h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-white-secondary sm:mt-5 sm:text-lg sm:leading-8">{course.description}</p>
            <div className="mt-7 flex flex-wrap gap-4 text-sm text-white-secondary">
              <span className="inline-flex items-center gap-2">
                <Star size={17} fill="currentColor" className="text-gold-primary" /> {course.rating} rating
              </span>
              <span className="inline-flex items-center gap-2">
                <Users size={17} className="text-gold-primary" /> {course.students.toLocaleString("en-IN")} students
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock size={17} className="text-gold-primary" /> Last updated May 2026
              </span>
            </div>
          </div>
          <div className="overflow-hidden rounded-sw border border-black-border bg-black-primary shadow-deep">
            <div className="relative flex aspect-video items-center justify-center">
              <img src={course.image} alt={`${course.title} course`} className="h-full w-full object-cover object-[center_32%]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black-primary/85 via-black-primary/20 to-transparent" />
              <PlayCircle size={72} className="relative z-10 text-gold-light drop-shadow" />
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:py-12 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0">
          <div className="mb-8 flex gap-2 overflow-x-auto border-b border-black-border pb-3 scrollbar-thin">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`premium-focus min-h-11 shrink-0 rounded px-4 text-sm font-semibold transition ${active === tab ? "bg-gold-muted text-gold-light" : "text-white-secondary hover:text-gold-light"}`}
                onClick={() => setActive(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          {active === "Overview" ? (
            <div className="grid gap-8">
              <div className="card p-4 sm:p-6">
                <h2 className="text-2xl font-semibold text-white-primary">What you&apos;ll learn</h2>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {[
                    "Read Indian equity charts with market structure context",
                    "Build a daily trading plan around risk-first execution",
                    "Identify support, resistance, target, and invalidation zones",
                    "Maintain a trade journal that improves decision-making"
                  ].map((item) => (
                    <div key={item} className="flex gap-3 text-white-secondary">
                      <Check className="mt-1 shrink-0 text-profit" size={18} /> {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="card p-4 sm:p-6">
                <h2 className="text-2xl font-semibold text-white-primary">Requirements</h2>
                <p className="mt-3 text-white-secondary">Laptop or mobile device, active demat account preferred, and a willingness to maintain a risk journal.</p>
              </div>
            </div>
          ) : null}
          {active === "Curriculum" ? (
            <div className="grid gap-3">
              {curriculum.map((module, index) => (
                <div key={module.module} className="card overflow-hidden">
                  <button
                    className="premium-focus flex w-full items-center justify-between px-5 py-4 text-left font-semibold text-white-primary"
                    onClick={() => setOpenModule(openModule === index ? -1 : index)}
                  >
                    {module.module}
                    <ChevronDown className={`transition ${openModule === index ? "rotate-180" : ""}`} />
                  </button>
                  {openModule === index ? (
                    <div className="border-t border-black-border px-5 py-4">
                      {module.lessons.map((lesson) => (
                        <div key={lesson} className="flex items-center gap-3 py-2 text-white-secondary">
                          <PlayCircle size={16} className="text-gold-primary" /> {lesson}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
          {active === "Instructor" ? (
            <div className="card p-4 sm:p-6">
              <h2 className="text-2xl font-semibold text-white-primary">StockWallah Mentor Desk</h2>
              <p className="mt-3 leading-7 text-white-secondary">
                Led by {founderProfile.name}, {associateMentorProfile.name}, and {mentorProfile.name}, with practical market experience, derivatives support, and a focus on disciplined Indian market education.
              </p>
            </div>
          ) : null}
          {active === "Reviews" ? (
            <div className="card p-4 sm:p-6">
              <h2 className="text-2xl font-semibold text-white-primary">Rating Breakdown</h2>
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="mt-4 grid grid-cols-[54px_1fr_44px] items-center gap-2 text-sm text-white-secondary sm:grid-cols-[60px_1fr_48px] sm:gap-3">
                  <span>{rating} star</span>
                  <div className="h-2 rounded bg-black-primary">
                    <div className="h-2 rounded bg-gold-primary" style={{ width: `${rating === 5 ? 84 : rating === 4 ? 12 : 2}%` }} />
                  </div>
                  <span>{rating === 5 ? "84%" : rating === 4 ? "12%" : "2%"}</span>
                </div>
              ))}
            </div>
          ) : null}
          {active === "FAQs" ? (
            <div className="grid gap-4">
              {[
                ["Do I get a certificate?", "Yes, successful learners receive a StockWallah completion certificate and exam guidance where applicable."],
                ["Can I attend offline?", `Offline classes are available at ${contactInfo.address} for offline course support.`],
                ["Is there WhatsApp advisor support?", "Yes, course advisors help you choose the right level and schedule."]
              ].map(([question, answer]) => (
                <div key={question} className="card p-5">
                  <h3 className="font-semibold text-white-primary">{question}</h3>
                  <p className="mt-2 text-white-secondary">{answer}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
        <aside className="h-fit rounded-sw border border-black-border bg-black-surface p-4 shadow-deep sm:p-6 lg:sticky lg:top-32">
          <div className="text-3xl font-bold text-white-primary sm:text-4xl">{formatInr(course.price)}</div>
          {hasDiscount ? (
            <div className="mt-1 flex items-center gap-3">
              <span className="text-white-muted line-through">{formatInr(course.originalPrice)}</span>
              <span className="rounded bg-gold-muted px-2 py-1 text-xs font-bold text-gold-light">Limited batch discount</span>
            </div>
          ) : null}
          <div className="mt-6 grid gap-3">
            <GoldButton href={`/enroll?course=${course.slug}`} className="w-full">
              Enroll Now
            </GoldButton>
            <GoldButton href={`https://wa.me/${contactInfo.whatsappNumber}`} variant="outline" className="w-full">
              Talk to Advisor
            </GoldButton>
          </div>
          <div className="mt-6 grid gap-3 text-sm text-white-secondary">
            <span className="flex items-center gap-2">
              <PlayCircle size={16} className="text-gold-primary" /> {course.lessons} video lessons
            </span>
            <span className="flex items-center gap-2">
              <FileBadge size={16} className="text-gold-primary" /> Certificate included
            </span>
            <span className="flex items-center gap-2">
              <Check size={16} className="text-profit" /> 7-day money-back guarantee
            </span>
          </div>
        </aside>
      </section>
    </div>
  );
}
