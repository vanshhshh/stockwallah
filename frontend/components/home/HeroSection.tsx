import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative -mt-[104px] overflow-hidden border-b border-black-border bg-black-primary pt-[104px] sm:-mt-[116px] sm:pt-[116px]">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-black-primary sm:aspect-[16/9] md:aspect-[16/7]">
        <Image
          src="/home-hero-exact.png"
          alt="StockWallah Trading Academy founder hero"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[62%_top] sm:object-top"
        />
      </div>
    </section>
  );
}
