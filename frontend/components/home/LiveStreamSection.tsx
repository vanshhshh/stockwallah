"use client";

import { Radio, Bell, Users, PlayCircle } from "lucide-react";
import { useYoutubeStatus } from "@/hooks/useYoutube";
import { GoldButton } from "@/components/common/GoldButton";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { socialLinks } from "@/lib/content";

export function LiveStreamSection() {
  const { data, isLoading } = useYoutubeStatus();

  if (isLoading) return <LoadingSpinner />;
  if (!data) return null;

  return (
    <section className="border-y border-black-border bg-black-surface/50 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-gold-primary">
              {data.isLive ? <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-loss" /> : <Radio size={16} />} {data.isLive ? "Live Now" : "Latest Class"}
            </div>
            <h2 className="font-display text-4xl font-bold text-white-primary">{data.title}</h2>
          </div>
          {data.isLive && data.viewerCount ? (
            <div className="inline-flex items-center gap-2 rounded border border-black-border bg-black-primary px-4 py-3 text-white-secondary">
              <Users size={18} className="text-gold-primary" /> {data.viewerCount.toLocaleString("en-IN")} watching
            </div>
          ) : (
            <GoldButton href={socialLinks.youtube} variant="outline">
              <Bell size={18} /> Set Reminder
            </GoldButton>
          )}
        </div>
        {data.videoId ? (
          <div className="overflow-hidden rounded-sw border border-black-border bg-black-primary shadow-deep">
            <iframe
              className="aspect-video w-full"
              src={`https://www.youtube.com/embed/${data.videoId}${data.isLive ? "?autoplay=1" : ""}`}
              title={data.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <a
            href={socialLinks.youtube}
            target="_blank"
            rel="noreferrer"
            className="flex aspect-video w-full items-center justify-center rounded-sw border border-black-border bg-[linear-gradient(135deg,rgba(201,168,76,0.18),rgba(10,10,10,0.78)),repeating-linear-gradient(90deg,rgba(201,168,76,0.14)_0_1px,transparent_1px_34px)] shadow-deep transition hover:border-gold-primary/50 hover:shadow-gold"
          >
            <div className="text-center">
              <PlayCircle className="mx-auto text-gold-light" size={78} />
              <p className="mt-5 text-xl font-semibold text-white-primary">Open Latest StockWallah Class</p>
              <p className="mt-2 text-white-secondary">Open the official StockWallah Trading Academy YouTube channel.</p>
            </div>
          </a>
        )}
      </div>
    </section>
  );
}
