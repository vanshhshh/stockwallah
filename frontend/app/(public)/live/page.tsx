"use client";

import { Bell, CalendarDays, Youtube } from "lucide-react";
import { useYoutubeStatus } from "@/hooks/useYoutube";
import { GoldButton } from "@/components/common/GoldButton";
import { socialLinks } from "@/lib/content";

export default function LivePage() {
  const { data } = useYoutubeStatus();
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-gold-primary">
            {data?.isLive ? <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-loss" /> : <Youtube size={16} />} {data?.isLive ? "Live Now" : "StockWallah Live"}
          </div>
          <h1 className="font-display text-5xl font-bold text-white-primary">{data?.title || "Live Market Classroom"}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-white-secondary">Pre-market planning, trading psychology, NISM prep, and live Q&A sessions from the StockWallah mentor desk.</p>
        </div>
        <GoldButton href={socialLinks.youtube} variant="outline">
          <Bell size={18} /> Subscribe
        </GoldButton>
      </div>

      {data?.videoId ? (
        <div className="overflow-hidden rounded-sw border border-black-border bg-black-primary shadow-deep">
          <iframe
            className="aspect-video w-full"
            src={`https://www.youtube.com/embed/${data.videoId}${data?.isLive ? "?autoplay=1" : ""}`}
            title={data?.title || "StockWallah YouTube stream"}
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
            <Youtube className="mx-auto text-gold-light" size={78} />
            <p className="mt-5 text-xl font-semibold text-white-primary">Open StockWallah on YouTube</p>
            <p className="mt-2 text-white-secondary">Open the official StockWallah Trading Academy channel for live classes and uploads.</p>
          </div>
        </a>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div>
          <h2 className="mb-5 text-2xl font-semibold text-white-primary">Past Live Streams</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <a key={index} href={socialLinks.youtube} target="_blank" rel="noreferrer" className="card overflow-hidden transition hover:border-gold-primary/45 hover:shadow-gold">
                <div className="aspect-video bg-[linear-gradient(135deg,rgba(201,168,76,0.2),rgba(10,10,10,0.7)),repeating-linear-gradient(90deg,rgba(201,168,76,0.2)_0_1px,transparent_1px_28px)]" />
                <div className="p-4">
                  <h3 className="font-semibold text-white-primary">Market Levels Review #{index + 1}</h3>
                  <p className="mt-2 text-sm text-white-secondary">Nifty, Bank Nifty, risk management, and trading plan replay.</p>
                </div>
              </a>
            ))}
          </div>
        </div>
        <aside className="card h-fit p-6">
          <h2 className="flex items-center gap-2 text-2xl font-semibold text-white-primary">
            <CalendarDays className="text-gold-primary" /> Upcoming Sessions
          </h2>
          <div className="mt-5 grid gap-4">
            {(data?.scheduled || []).length ? (
              data?.scheduled.map((session) => (
                <a key={session.id} href={session.youtubeLink || socialLinks.youtube} target="_blank" rel="noreferrer" className="rounded border border-black-border bg-black-primary p-4 transition hover:border-gold-primary/60">
                  <div className="font-semibold text-white-primary">{session.title}</div>
                  <div className="mt-2 text-sm text-white-muted">
                    {new Date(session.scheduledAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" })}
                  </div>
                </a>
              ))
            ) : (
              <p className="text-white-secondary">Upcoming session schedule will appear here from the admin portal.</p>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
