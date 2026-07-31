"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSettings } from "@/hooks/useSettings";

export function AnnouncementBar() {
  const { data } = useSettings();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setDismissed(sessionStorage.getItem("sw_announcement_dismissed") === "true");
  }, []);

  function dismiss() {
    sessionStorage.setItem("sw_announcement_dismissed", "true");
    setDismissed(true);
  }

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-10 overflow-hidden bg-gold-primary text-black-primary">
      {!dismissed ? (
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 text-sm font-semibold">
          <Link href="/enroll" className="min-w-0 truncate transition hover:opacity-80">
            {data?.announcementText || "New Batch Starting June 1st — Limited Seats! Enroll Now"}
          </Link>
          <button className="premium-focus rounded p-1 transition hover:bg-black-primary/10" onClick={dismiss} aria-label="Dismiss announcement">
            <X size={16} />
          </button>
        </div>
      ) : null}
    </div>
  );
}

