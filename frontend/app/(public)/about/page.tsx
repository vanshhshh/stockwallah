"use client";

import { BookOpenCheck, CandlestickChart, MapPin, ShieldCheck } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import {
  academyDisclaimer,
  academyMission,
  associateMentorProfile,
  contactInfo,
  founderProfile,
  mentorProfile
} from "@/lib/content";
import { mediaSrc } from "@/lib/media";

const pillars = [
  { icon: CandlestickChart, label: "Real market learning" },
  { icon: ShieldCheck, label: "Risk-first process" },
  { icon: BookOpenCheck, label: "Online and offline courses" },
  { icon: MapPin, label: "Faridabad classroom" }
];

export default function AboutPage() {
  const { data: settings } = useSettings();
  const teachers = [
    {
      name: founderProfile.name,
      role: founderProfile.role,
      image: mediaSrc(settings?.founderImage, founderProfile.image),
      summary: founderProfile.summary,
      points: ["Equity", "Derivatives", "Crypto + Forex"]
    },
    {
      name: associateMentorProfile.name,
      role: associateMentorProfile.role,
      image: mediaSrc(settings?.anshulImage, associateMentorProfile.image),
      summary: associateMentorProfile.summary,
      points: ["Stock market basics", "Futures", "Derivatives"]
    },
    {
      name: mentorProfile.name,
      role: mentorProfile.role,
      image: mediaSrc(settings?.deepAryaImage, mentorProfile.image),
      summary: mentorProfile.summary,
      points: ["SMC", "Order flow", "Scalping"]
    }
  ];

  return (
    <section>
      <div className="border-b border-black-border bg-black-surface/35">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:py-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-end lg:py-16">
          <div>
            <h1 className="font-display text-3xl font-bold leading-tight text-white-primary sm:text-5xl lg:text-6xl">
              About StockWallah
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white-secondary sm:mt-5 sm:text-lg sm:leading-8">
              StockWallah is a practical stock market academy built for learners who want clear concepts, disciplined execution, and mentor-led guidance.
            </p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white-secondary">
              {academyMission}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {pillars.map(({ icon: Icon, label }) => (
              <div key={label} className="rounded border border-black-border bg-black-primary p-4">
                <Icon className="text-gold-primary" size={22} />
                <p className="mt-3 text-sm font-semibold text-white-primary">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14 lg:py-16">
        <div className="mb-9 max-w-2xl">
          <h2 className="font-display text-3xl font-bold text-white-primary sm:text-4xl">Meet the Teachers</h2>
          <p className="mt-3 text-base leading-7 text-white-secondary">
            A focused mentor desk for market structure, price action, risk management, and classroom support.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {teachers.map((teacher) => (
            <article key={teacher.name} className="card overflow-hidden">
              <div className="relative aspect-[4/5] bg-black-primary">
                <img
                  src={teacher.image}
                  alt={`${teacher.name}, ${teacher.role} at StockWallah`}
                  className="h-full w-full object-cover object-top"
                />
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black-primary to-transparent" />
              </div>
              <div className="p-5">
                <div className="text-sm uppercase tracking-[0.16em] text-gold-primary">{teacher.role}</div>
                <h3 className="mt-2 text-2xl font-semibold text-white-primary">{teacher.name}</h3>
                <p className="mt-3 text-sm leading-6 text-white-secondary">{teacher.summary}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {teacher.points.map((point) => (
                    <span key={point} className="rounded border border-gold-primary/30 bg-gold-muted px-3 py-1 text-xs font-semibold text-gold-light">
                      {point}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-[1fr_420px] lg:items-start">
          <div className="rounded border border-gold-primary/30 bg-gold-muted p-5 text-sm leading-7 text-white-secondary">
            {academyDisclaimer}
          </div>
          <div className="card p-5">
            <h2 className="flex min-w-0 items-start gap-2 text-base font-semibold leading-6 text-white-primary sm:text-xl">
              <MapPin className="text-gold-primary" /> {contactInfo.addressShort}
            </h2>
            <iframe
              className="mt-4 h-72 w-full rounded border border-black-border grayscale"
              src={`https://www.google.com/maps?q=${encodeURIComponent(contactInfo.mapQuery)}&output=embed`}
              title="SCO 104 OMAXE WORLD STREET Faridabad map"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
