import { cn } from "@/lib/utils";

export function SectionHeading({
  title,
  eyebrow,
  description,
  align = "left",
  className
}: {
  title: string;
  eyebrow?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-3xl", align === "center" && "text-center", className)}>
      {eyebrow ? <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-gold-primary sm:text-sm sm:tracking-[0.18em]">{eyebrow}</p> : null}
      <h2 className="font-display text-3xl font-bold leading-tight text-white-primary sm:text-4xl md:text-5xl">{title}</h2>
      {description ? <p className="mt-4 text-sm leading-6 text-white-secondary sm:text-base sm:leading-7 md:text-lg">{description}</p> : null}
    </div>
  );
}
