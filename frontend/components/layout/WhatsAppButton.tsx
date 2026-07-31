"use client";

import { contactInfo, socialLinks } from "@/lib/content";
import { useSettings } from "@/hooks/useSettings";

function SocialIcon({ label }: { label: string }) {
  if (label === "Play Store") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        <path fill="#00F076" d="M3.3 2.6c-.2.2-.3.6-.3 1v16.8c0 .4.1.7.3 1l9.1-9.4-9.1-9.4Z" />
        <path fill="#00D3FF" d="m12.4 12 2.9-3-10-5.7 7.1 8.7Z" />
        <path fill="#FFCE00" d="m12.4 12-7.1 8.7 10-5.7-2.9-3Z" />
        <path fill="#FF3A44" d="m15.3 9-2.9 3 2.9 3 4.2-2.4c.8-.5.8-1.7 0-2.2L15.3 9Z" />
      </svg>
    );
  }
  if (label === "App Store") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        <path fill="currentColor" d="M16.5 13.1c0-2.5 2.1-3.7 2.2-3.8-1.2-1.7-3-1.9-3.6-2-1.5-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9-1.7 0-3.3 1-4.2 2.5-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.5 1.3-.1 1.8-.8 3.4-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.2 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9-.1 0-3.1-1.2-3.1-4Zm-2.4-7.4c.7-.9 1.2-2.1 1.1-3.2-1.1 0-2.3.7-3.1 1.6-.7.8-1.3 2-1.1 3.2 1.2.1 2.4-.6 3.1-1.6Z" />
      </svg>
    );
  }
  if (label === "WhatsApp") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        <path fill="currentColor" d="M12.04 2a9.86 9.86 0 0 0-8.43 14.96L2.5 21.04l4.18-1.1A9.94 9.94 0 1 0 12.04 2Zm0 1.9a8.03 8.03 0 1 1 0 16.06 8.15 8.15 0 0 1-4.12-1.13l-.3-.18-2.48.65.66-2.42-.2-.31A8.02 8.02 0 0 1 12.04 3.9Zm-3.4 3.93c-.18 0-.47.07-.72.34-.25.27-.94.92-.94 2.24 0 1.32.96 2.6 1.1 2.78.13.18 1.9 2.9 4.6 4.07.64.28 1.14.44 1.53.56.64.2 1.22.17 1.68.1.51-.08 1.57-.64 1.79-1.26.22-.62.22-1.16.15-1.27-.06-.11-.24-.18-.5-.31-.27-.13-1.57-.78-1.82-.86-.24-.09-.42-.13-.6.13-.18.27-.69.86-.85 1.04-.15.18-.31.2-.58.07-.27-.13-1.13-.42-2.15-1.33-.8-.71-1.33-1.58-1.49-1.85-.15-.27-.02-.41.12-.54.12-.12.27-.31.4-.47.13-.16.18-.27.27-.45.09-.18.04-.34-.02-.47-.07-.13-.6-1.45-.82-1.98-.22-.52-.44-.45-.6-.46h-.51Z" />
      </svg>
    );
  }
  if (label === "Instagram") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        <path fill="currentColor" d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.8Zm8.9 2.4a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8ZM12 7.2a4.8 4.8 0 1 1 0 9.6 4.8 4.8 0 0 1 0-9.6Zm0 2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6Z" />
      </svg>
    );
  }
  if (label === "YouTube") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        <path fill="currentColor" d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.6 4.6 12 4.6 12 4.6s-5.6 0-7.5.5a3 3 0 0 0-2.1 2.1A31 31 0 0 0 2 12a31 31 0 0 0 .4 4.8 3 3 0 0 0 2.1 2.1c1.9.5 7.5.5 7.5.5s5.6 0 7.5-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 22 12a31 31 0 0 0-.4-4.8ZM10 15.4V8.6l5.7 3.4L10 15.4Z" />
      </svg>
    );
  }
  if (label === "Telegram") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        <path fill="currentColor" d="M21.7 4.4 18.5 19c-.24 1.03-.88 1.28-1.78.8l-4.9-3.62-2.36 2.27c-.26.26-.48.48-.98.48l.35-4.98 9.08-8.2c.4-.35-.09-.55-.61-.2L6.08 12.62 1.25 11.1c-1.05-.33-1.07-1.05.22-1.55L20.35 2.3c.87-.33 1.64.2 1.35 2.1Z" />
      </svg>
    );
  }
  if (label === "LinkedIn") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        <path fill="currentColor" d="M6.9 8.8H3.2V21h3.7V8.8ZM5 3a2.1 2.1 0 1 0 0 4.2A2.1 2.1 0 0 0 5 3Zm16 11.2c0-3.6-1.9-5.7-4.8-5.7a4.1 4.1 0 0 0-3.7 2h-.1V8.8H8.9V21h3.7v-6c0-1.6.3-3.1 2.2-3.1 1.9 0 2 1.8 2 3.2V21H21v-6.8Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
      <path fill="currentColor" d="M14 9h3V5h-3c-3.1 0-5 1.9-5 5v2H6v4h3v6h4v-6h3.2l.8-4h-4v-2c0-.7.3-1 1-1Z" />
    </svg>
  );
}

function FloatingLink({ href, label, className, side }: { href?: string; label: string; className: string; side: "left" | "right" }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`group relative inline-flex h-12 w-12 items-center justify-center rounded-full text-white shadow-[0_0_28px_rgba(0,0,0,0.35)] transition hover:scale-105 sm:h-14 sm:w-14 ${className}`}
      aria-label={label}
    >
      <SocialIcon label={label} />
      <span className={`pointer-events-none absolute bottom-1/2 w-max translate-y-1/2 rounded bg-black-elevated px-3 py-2 text-xs text-white-primary opacity-0 shadow-deep transition group-hover:opacity-100 ${side === "left" ? "left-16" : "right-16"}`}>
        {label}
      </span>
    </a>
  );
}

export function WhatsAppButton() {
  const { data } = useSettings();
  const number = data?.whatsappNumber || contactInfo.whatsappNumber;
  const whatsappHref = `https://wa.me/${number}?text=${encodeURIComponent("Hi, I'm interested in StockWallah courses")}`;

  return (
    <>
      <div className="fixed bottom-4 right-3 z-40 grid gap-2 sm:bottom-5 sm:right-5 sm:gap-3">
        <FloatingLink href={data?.playStoreUrl} label="Play Store" className="bg-black-surface ring-1 ring-white/15" side="right" />
        <FloatingLink href={data?.youtubeUrl || socialLinks.youtube} label="YouTube" className="bg-red-600" side="right" />
        <FloatingLink href={data?.instagramUrl || socialLinks.instagram} label="Instagram" className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400" side="right" />
        <FloatingLink href={whatsappHref} label="WhatsApp" className="bg-[#25D366]" side="right" />
      </div>
      <div className="fixed bottom-4 left-3 z-40 grid gap-2 sm:bottom-5 sm:left-5 sm:gap-3">
        <FloatingLink href={data?.appStoreUrl} label="App Store" className="bg-black-surface ring-1 ring-white/15" side="left" />
        <FloatingLink href={data?.telegramUrl || "https://t.me/stockwallahacademy"} label="Telegram" className="bg-[#26A5E4]" side="left" />
        <FloatingLink href={data?.linkedinUrl || socialLinks.linkedin} label="LinkedIn" className="bg-[#0A66C2]" side="left" />
        <FloatingLink href={data?.facebookUrl || socialLinks.facebook} label="Facebook" className="bg-[#1877F2]" side="left" />
      </div>
    </>
  );
}
