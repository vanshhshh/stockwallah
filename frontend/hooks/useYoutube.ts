"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type YoutubeStatus = {
  isLive: boolean;
  videoId: string | null;
  title: string;
  viewerCount: number | null;
  thumbnailUrl: string | null;
  channelUrl: string;
  scheduled: Array<{ id: number; title: string; scheduledAt: string; youtubeLink: string | null }>;
};

export function useYoutubeStatus() {
  return useQuery({
    queryKey: ["youtube", "status"],
    queryFn: async () => {
      const { data } = await api.get<YoutubeStatus>("/api/youtube/status");
      return data;
    },
    refetchInterval: 60_000
  });
}

