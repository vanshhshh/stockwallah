"use client";

import { useSettings } from "@/hooks/useSettings";

const fallbackPlayStoreUrl = "https://play.google.com/store/apps/details?id=com.lct.nbtcgqrtd";

function PlayStoreLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path fill="#00F076" d="M3.3 2.6c-.2.2-.3.6-.3 1v16.8c0 .4.1.7.3 1l9.1-9.4-9.1-9.4Z" />
      <path fill="#00D3FF" d="m12.4 12 2.9-3-10-5.7 7.1 8.7Z" />
      <path fill="#FFCE00" d="m12.4 12-7.1 8.7 10-5.7-2.9-3Z" />
      <path fill="#FF3A44" d="m15.3 9-2.9 3 2.9 3 4.2-2.4c.8-.5.8-1.7 0-2.2L15.3 9Z" />
    </svg>
  );
}

export function PlayStoreSection() {
  const { data } = useSettings();
  const playStoreUrl = data?.playStoreUrl || fallbackPlayStoreUrl;

  return (
    <section className="border-b border-black-border bg-black-surface/55">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white-primary">StockWallah app is on Play Store</h2>
          <p className="mt-1 text-sm text-white-secondary">Install the app for quick course access and updates.</p>
        </div>
        <a
          href={playStoreUrl}
          target="_blank"
          rel="noreferrer"
          className="gold-gradient-bg premium-focus inline-flex min-h-12 items-center justify-center gap-2 rounded px-5 text-sm font-semibold text-black-primary transition hover:shadow-gold"
        >
          <PlayStoreLogo /> Get it on Play Store
        </a>
      </div>
    </section>
  );
}
