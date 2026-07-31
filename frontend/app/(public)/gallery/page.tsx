"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { api, API_URL } from "@/lib/api";

type GalleryResponse = {
  images: Array<{ id: number; title: string; imageUrl: string }>;
  banners: Array<{ id: number; title: string; imageUrl: string; linkUrl?: string | null }>;
};

function toSrc(url: string) {
  return url.startsWith("http") ? url : `${API_URL}${url}`;
}

export default function GalleryPage() {
  const { data } = useQuery({
    queryKey: ["gallery"],
    queryFn: async () => (await api.get<GalleryResponse>("/api/gallery")).data
  });

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:py-14 lg:py-16">
      <div className="mb-8 max-w-3xl sm:mb-10">
        <h1 className="font-display text-3xl font-bold text-white-primary sm:text-5xl lg:text-6xl">Gallery</h1>
        <p className="mt-4 text-sm leading-6 text-white-secondary sm:text-lg sm:leading-8">Photos and banners from StockWallah Trading Academy.</p>
      </div>

      {(data?.banners || []).length ? (
        <div className="mb-10 grid gap-5">
          {data?.banners.map((banner) => {
            const image = (
              <div className="relative aspect-[16/10] overflow-hidden rounded-sw border border-gold-primary/25 bg-black-surface sm:aspect-[16/6]">
                <Image src={toSrc(banner.imageUrl)} alt={banner.title} fill sizes="100vw" className="object-cover" unoptimized />
              </div>
            );
            return banner.linkUrl ? (
              <a key={banner.id} href={banner.linkUrl} target="_blank" rel="noreferrer" aria-label={banner.title}>
                {image}
              </a>
            ) : (
              <div key={banner.id}>{image}</div>
            );
          })}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {(data?.images || []).map((image) => (
          <article key={image.id} className="card overflow-hidden">
            <div className="relative aspect-[4/3] bg-black-surface">
              <Image src={toSrc(image.imageUrl)} alt={image.title} fill sizes="(min-width: 1280px) 33vw, 100vw" className="object-cover" unoptimized />
            </div>
            <div className="p-4 font-semibold text-white-primary">{image.title}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
