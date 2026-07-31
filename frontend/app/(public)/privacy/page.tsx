import { academyDisclaimer } from "@/lib/content";

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-5xl font-bold text-white-primary">Privacy Policy</h1>
      <p className="mt-6 text-lg leading-8 text-white-secondary">
        StockWallah uses submitted contact, lead, and enrollment details only for course counseling, academy updates, and student support. We do not sell learner data.
      </p>
      <p className="mt-6 text-lg leading-8 text-white-secondary">
        {academyDisclaimer}
      </p>
    </section>
  );
}

