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
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-10 max-w-3xl">
        <h1 className="font-display text-5xl font-bold text-white-primary md:text-6xl">Gallery</h1>
        <p className="mt-4 text-lg leading-8 text-white-secondary">Photos and banners from StockWallah Trading Academy.</p>
      </div>

      {(data?.banners || []).length ? (
        <div className="mb-10 grid gap-5">
          {data?.banners.map((banner) => {
            const image = (
              <div className="relative aspect-[16/6] overflow-hidden rounded-sw border border-gold-primary/25 bg-black-surface">
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
