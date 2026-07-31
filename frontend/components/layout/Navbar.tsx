"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
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

  return (
    <header className="fixed inset-x-0 top-10 z-50 border-b border-white/5 bg-black-primary/72 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
      <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6">
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
          className="premium-focus inline-flex h-11 w-11 items-center justify-center rounded-full border border-black-border bg-black-surface/80 text-white-primary transition hover:border-gold-primary hover:text-gold-light lg:hidden"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          <Menu size={22} />
        </button>
      </nav>
      {open ? (
        <div className="fixed inset-0 z-[60] bg-black-primary/95 p-4 backdrop-blur-xl lg:hidden">
          <div className="flex h-16 items-center justify-between border-b border-black-border pb-4">
            <div onClick={() => setOpen(false)}>
              <LogoMark />
            </div>
            <button className="premium-focus h-11 w-11 rounded-full border border-black-border bg-black-surface text-white-primary" onClick={() => setOpen(false)} aria-label="Close menu">
              <X className="mx-auto" size={22} />
            </button>
          </div>
          <div className="mt-8 grid gap-3">
            {links.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-2xl border border-black-border bg-black-surface/90 px-4 py-4 text-lg font-semibold text-white-primary transition hover:border-gold-primary hover:bg-gold-muted/10 hover:text-gold-light",
                  pathname === link.href && "border-gold-primary bg-gold-muted/10 text-gold-light"
                )}
                style={{ transitionDelay: `${index * 25}ms` }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
