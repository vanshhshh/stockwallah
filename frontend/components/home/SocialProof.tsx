import { Award, BookOpenCheck, Building2, GraduationCap, ShieldCheck, Target, Users } from "lucide-react";
import { academyHighlights, associateMentorProfile, founderProfile, mentorProfile } from "@/lib/content";

const items = [
  { icon: Users, title: founderProfile.learnersMentored, text: founderProfile.experience },
  { icon: ShieldCheck, title: associateMentorProfile.certification, text: associateMentorProfile.summary },
  { icon: Building2, title: "Offline + Online", text: "Structured learning for Faridabad classroom batches and remote learners" },
  { icon: Target, title: "Risk-first discipline", text: "Position sizing, review loops, and trade management before prediction" },
  { icon: Award, title: mentorProfile.experience[2], text: mentorProfile.summary },
  { icon: GraduationCap, title: "Practical learning", text: academyHighlights[3].text },
  { icon: BookOpenCheck, title: "Real-market vision", text: "Practical, real-market-based financial education that builds confident traders and investors." }
];

export function SocialProof() {
  return (
    <section className="border-y border-black-border bg-black-surface/45 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card p-6 transition hover:border-gold-primary/50 hover:shadow-gold">
              <Icon className="text-gold-primary" size={28} />
              <h3 className="mt-5 text-xl font-semibold text-white-primary">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-white-secondary">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
