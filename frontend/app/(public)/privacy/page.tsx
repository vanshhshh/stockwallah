import { academyDisclaimer } from "@/lib/content";

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-white-primary sm:text-5xl">Privacy Policy</h1>
      <p className="mt-5 text-sm leading-6 text-white-secondary sm:mt-6 sm:text-lg sm:leading-8">
        StockWallah uses submitted contact, lead, and enrollment details only for course counseling, academy updates, and student support. We do not sell learner data.
      </p>
      <p className="mt-5 text-sm leading-6 text-white-secondary sm:mt-6 sm:text-lg sm:leading-8">
        {academyDisclaimer}
      </p>
    </section>
  );
}
