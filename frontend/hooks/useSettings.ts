"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type PublicSettings = {
  announcementText?: string;
  whatsappNumber?: string;
  youtubeChannelId?: string;
  youtubeUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  telegramUrl?: string;
  playStoreUrl?: string;
  appStoreUrl?: string;
  adminEmail?: string;
  contactEmail?: string;
  address?: string;
  mapLink?: string;
};

export function useSettings() {
  return useQuery({
    queryKey: ["settings", "public"],
    queryFn: async () => {
      const { data } = await api.get<{ settings: PublicSettings }>("/api/settings/public");
      return data.settings;
    },
    staleTime: 10 * 60_000
  });
}
