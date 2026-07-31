import { academyDisclaimer } from "@/lib/content";

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-5xl font-bold text-white-primary">Terms</h1>
      <p className="mt-6 text-lg leading-8 text-white-secondary">
        {academyDisclaimer}
      </p>
    </section>
  );
}

