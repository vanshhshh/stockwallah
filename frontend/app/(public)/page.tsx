import { HeroSection } from "@/components/home/HeroSection";
import { PlayStoreSection } from "@/components/home/PlayStoreSection";
import { MarketOverview } from "@/components/home/MarketOverview";
import { CoursesPreview } from "@/components/home/CoursesPreview";
import { NewsSection } from "@/components/home/NewsSection";
import { TestimonialsCarousel } from "@/components/home/TestimonialsCarousel";
import { LevelsTeaser } from "@/components/home/LevelsTeaser";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PlayStoreSection />
      <CoursesPreview />
      <MarketOverview />
      <LevelsTeaser />
      <TestimonialsCarousel />
      <NewsSection />
    </>
  );
}
