import Link from "next/link";
import { cn } from "@/lib/utils";

type GoldButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: "solid" | "outline" | "ghost";
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
};

const base =
  "premium-focus inline-flex min-h-11 items-center justify-center gap-2 rounded px-5 py-3 text-sm font-semibold transition-all duration-300 ease-premium hover:shadow-gold";

const variants = {
  solid: "gold-gradient-bg text-black-primary",
  outline: "border border-gold-primary/55 text-gold-light hover:border-gold-light hover:bg-gold-muted",
  ghost: "text-gold-light hover:bg-gold-muted"
};

export function GoldButton({ children, href, variant = "solid", className, type = "button", onClick }: GoldButtonProps) {
  const classes = cn(base, variants[variant], className);
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick}>
      {children}
    </button>
  );
}

