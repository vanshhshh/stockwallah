"use client";

import { useSettings } from "@/hooks/useSettings";
import { mediaSrc } from "@/lib/media";

export function HeroSection() {
  const { data: settings } = useSettings();
  const heroImage = mediaSrc(settings?.homeHeroImage, "/home-hero-exact.png");

  return (
    <section className="relative -mt-[104px] overflow-hidden border-b border-black-border bg-black-primary pt-[104px] sm:-mt-[116px] sm:pt-[116px]">
      <div className="relative aspect-[7/4] w-full overflow-hidden bg-black-primary">
        <img
          src={heroImage}
          alt="StockWallah Trading Academy founder hero"
          className="h-full w-full object-contain object-center"
        />
      </div>
    </section>
  );
}
