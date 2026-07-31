import type { ReactNode } from "react";

const brandStyles: Record<string, string> = {
  YouTube: "border-red-500/35 bg-red-500/10 text-red-300 hover:border-red-500 hover:bg-red-500/20",
  Instagram: "border-pink-500/35 bg-pink-500/10 text-pink-300 hover:border-pink-500 hover:bg-pink-500/20",
  Facebook: "border-blue-500/35 bg-blue-500/10 text-blue-300 hover:border-blue-500 hover:bg-blue-500/20",
  LinkedIn: "border-sky-500/35 bg-sky-500/10 text-sky-300 hover:border-sky-500 hover:bg-sky-500/20"
};

const logos: Record<string, ReactNode> = {
  YouTube: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path fill="currentColor" d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.6 4.6 12 4.6 12 4.6s-5.6 0-7.5.5a3 3 0 0 0-2.1 2.1A31 31 0 0 0 2 12a31 31 0 0 0 .4 4.8 3 3 0 0 0 2.1 2.1c1.9.5 7.5.5 7.5.5s5.6 0 7.5-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 22 12a31 31 0 0 0-.4-4.8ZM10 15.4V8.6l5.7 3.4L10 15.4Z" />
    </svg>
  ),
  Instagram: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path fill="currentColor" d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.8Zm8.9 2.4a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8ZM12 7.2a4.8 4.8 0 1 1 0 9.6 4.8 4.8 0 0 1 0-9.6Zm0 2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6Z" />
    </svg>
  ),
  Facebook: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path fill="currentColor" d="M14 9h3V5h-3c-3.1 0-5 1.9-5 5v2H6v4h3v6h4v-6h3.2l.8-4h-4v-2c0-.7.3-1 1-1Z" />
    </svg>
  ),
  LinkedIn: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path fill="currentColor" d="M6.9 8.8H3.2V21h3.7V8.8ZM5 3a2.1 2.1 0 1 0 0 4.2A2.1 2.1 0 0 0 5 3Zm16 11.2c0-3.6-1.9-5.7-4.8-5.7a4.1 4.1 0 0 0-3.7 2h-.1V8.8H8.9V21h3.7v-6c0-1.6.3-3.1 2.2-3.1 1.9 0 2 1.8 2 3.2V21H21v-6.8Z" />
    </svg>
  )
};

export function BrandSocialLink({ href, label, compact = false }: { href: string; label: string; compact?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`${brandStyles[label] || "border-black-border bg-black-primary text-white-secondary"} premium-focus inline-flex items-center justify-center gap-2 rounded border transition ${compact ? "h-10 w-10" : "px-3 py-2 text-sm font-semibold"}`}
      aria-label={label}
    >
      {logos[label]}
      {compact ? null : label}
    </a>
  );
}
