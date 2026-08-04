"use client";

import Link from "next/link";
import { useSettings } from "@/hooks/useSettings";
import { mediaSrc } from "@/lib/media";

export function LogoMark({ className = "", withText = true }: { className?: string; withText?: boolean }) {
  const { data: settings } = useSettings();
  const logoImage = mediaSrc(settings?.logoImage, "/stockwallah-logo.png");

  const mark = (
    <span className={`inline-flex min-w-0 items-center gap-3 ${className}`}>
      <span className="relative inline-flex h-11 w-11 shrink-0 overflow-hidden rounded-full sm:h-12 sm:w-12">
        <img src={logoImage} alt="StockWallah Trading Academy" className="h-full w-full object-cover" />
      </span>
      {withText ? (
        <span className="truncate font-display text-2xl font-bold tracking-normal text-white-primary sm:text-3xl">
          Stock<span className="text-gold-primary">Wallah</span>
        </span>
      ) : null}
    </span>
  );

  return (
    <Link href="/" className="transition hover:opacity-90" aria-label="StockWallah home">
      {mark}
    </Link>
  );
}
