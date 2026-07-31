import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative -mt-[112px] overflow-hidden border-b border-black-border bg-black-primary pt-[112px]">
      <div className="relative w-full overflow-hidden bg-black-primary aspect-[16/9] md:aspect-[16/7]">
        <Image
          src="/home-hero-exact.png"
          alt="StockWallah Trading Academy founder hero"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
      </div>
    </section>
  );
}
