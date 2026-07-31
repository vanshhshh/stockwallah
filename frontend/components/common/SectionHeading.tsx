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
      {eyebrow ? <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-gold-primary">{eyebrow}</p> : null}
      <h2 className="font-display text-4xl font-bold leading-tight text-white-primary md:text-5xl">{title}</h2>
      {description ? <p className="mt-4 text-base leading-7 text-white-secondary md:text-lg">{description}</p> : null}
    </div>
  );
}

