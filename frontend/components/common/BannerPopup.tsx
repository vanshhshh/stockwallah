"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, API_URL } from "@/lib/api";

type Banner = { id: number; title: string; imageUrl: string; linkUrl?: string | null };

function toSrc(url: string) {
  return url.startsWith("http") ? url : `${API_URL}${url}`;
}

export function BannerPopup() {
  const [open, setOpen] = useState(false);
  const { data } = useQuery({
    queryKey: ["gallery", "banners"],
    queryFn: async () => (await api.get<{ banners: Banner[] }>("/api/gallery")).data.banners,
    staleTime: 5 * 60_000
  });

  const banner = data?.[0];

  useEffect(() => {
    if (!banner) return;
    const timer = window.setTimeout(() => setOpen(true), 4500);
    return () => window.clearTimeout(timer);
  }, [banner]);

  if (!open || !banner) return null;

  const image = <img src={toSrc(banner.imageUrl)} alt={banner.title} className="max-h-[76vh] w-full rounded object-contain" />;

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black-primary/80 px-4 backdrop-blur">
      <div className="relative w-full max-w-3xl rounded-sw border border-gold-primary/30 bg-black-surface p-3 shadow-deep">
        <button
          type="button"
          aria-label="Close banner"
          className="premium-focus absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black-primary/80 text-white-primary transition hover:text-gold-light"
          onClick={() => setOpen(false)}
        >
          <X size={18} />
        </button>
        {banner.linkUrl ? (
          <a href={banner.linkUrl} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
            {image}
          </a>
        ) : (
          image
        )}
      </div>
    </div>
  );
}
