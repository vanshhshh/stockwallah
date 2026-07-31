"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/common/LogoMark";

const links = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/levels", label: "Levels" },
  { href: "/market", label: "Market" },
  { href: "/live", label: "Live" },
  { href: "/news", label: "News" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-10 z-50 border-b border-white/5 bg-black-primary/86 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
      <nav className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-3 sm:h-[76px] sm:px-6">
        <LogoMark />
        <div className="hidden items-center gap-1 rounded-full border border-black-border/60 bg-black-surface/60 p-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-4 py-2 text-[13px] font-medium tracking-[0.06em] text-white-secondary transition duration-300 hover:bg-gold-muted hover:text-gold-light",
                pathname === link.href && "bg-gold-muted text-gold-light shadow-[0_0_0_1px_rgba(201,168,76,0.2)]"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <button
          className="premium-focus inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black-border bg-black-surface/80 text-white-primary transition hover:border-gold-primary hover:text-gold-light lg:hidden"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <Menu size={22} />
        </button>
      </nav>
      {open ? (
        <div className="fixed inset-0 top-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Site menu">
          <button
            type="button"
            className="absolute inset-0 bg-black-primary/70 backdrop-blur-sm"
            aria-label="Close menu backdrop"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-0 flex h-dvh w-[min(88vw,24rem)] flex-col border-l border-gold-primary/20 bg-black-primary shadow-[0_0_60px_rgba(0,0,0,0.55)]">
            <div className="flex min-h-[76px] items-center justify-between border-b border-black-border px-4">
              <div onClick={() => setOpen(false)}>
                <LogoMark />
              </div>
              <button className="premium-focus inline-flex h-11 w-11 items-center justify-center rounded-full border border-black-border bg-black-surface text-white-primary" onClick={() => setOpen(false)} aria-label="Close menu">
                <X size={22} />
              </button>
            </div>
            <div className="scrollbar-thin grid flex-1 content-start gap-2 overflow-y-auto px-4 py-5">
              {links.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "min-h-12 rounded border border-black-border bg-black-surface/88 px-4 py-3 text-base font-semibold text-white-primary transition hover:border-gold-primary hover:bg-gold-muted/10 hover:text-gold-light",
                    pathname === link.href && "border-gold-primary bg-gold-muted/10 text-gold-light"
                  )}
                  style={{ transitionDelay: `${index * 25}ms` }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
