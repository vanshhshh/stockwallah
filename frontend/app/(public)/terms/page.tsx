import { academyDisclaimer } from "@/lib/content";

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-white-primary sm:text-5xl">Terms</h1>
      <p className="mt-5 text-sm leading-6 text-white-secondary sm:mt-6 sm:text-lg sm:leading-8">
        {academyDisclaimer}
      </p>
    </section>
  );
}
