import { Award, BookOpenCheck, CheckCircle2, FileBadge, ShieldCheck } from "lucide-react";
import { GoldButton } from "@/components/common/GoldButton";
import { academyDisclaimer, associateMentorProfile, mentorProfile } from "@/lib/content";

export default function CertificationPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
        <div>
          <h1 className="font-display text-5xl font-bold text-white-primary">NISM Series VIII Learning Path</h1>
          <p className="mt-5 text-lg leading-8 text-white-secondary">
            Build derivatives knowledge with structured preparation, practical market context, and mentor support from the StockWallah team.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <GoldButton href="/courses/all-in-one-online">Explore Courses</GoldButton>
            <GoldButton href="/contact" variant="outline">
              Talk to Advisor
            </GoldButton>
          </div>
          <p className="mt-6 max-w-2xl text-sm leading-6 text-white-muted">{academyDisclaimer}</p>
        </div>
        <div className="card p-8 text-center">
          <FileBadge className="mx-auto text-gold-primary" size={72} />
          <h2 className="mt-5 text-2xl font-semibold text-white-primary">Mentor Support</h2>
          <p className="mt-2 text-white-secondary">Guidance from {associateMentorProfile.name} and {mentorProfile.name} for disciplined derivatives learning.</p>
        </div>
      </div>
      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {[
          { icon: Award, title: "NISM Series VIII Prep", text: "Mock tests, formula revision, and equity derivatives concept clarity." },
          { icon: ShieldCheck, title: associateMentorProfile.certification, text: associateMentorProfile.summary },
          { icon: BookOpenCheck, title: "Practical study path", text: "A structured route from basics to final revision with market context." }
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="card p-6">
            <Icon className="text-gold-primary" />
            <h2 className="mt-4 text-xl font-semibold text-white-primary">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-white-secondary">{text}</p>
          </div>
        ))}
      </div>
      <div className="mt-14 card p-6">
        <h2 className="text-2xl font-semibold text-white-primary">Preparation Tips</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {["Revise contract specifications and margin logic", "Practice options payoff diagrams daily", "Memorize regulatory risk disclosure language", "Solve timed mocks before the exam week"].map((tip) => (
            <div key={tip} className="flex gap-3 text-white-secondary">
              <CheckCircle2 className="shrink-0 text-profit" /> {tip}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
