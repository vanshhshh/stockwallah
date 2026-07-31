import { cacheGet, cacheSet } from "../lib/redis.js";
import { prisma } from "../lib/prisma.js";
import { logger } from "../lib/logger.js";

export type YoutubeStatus = {
  isLive: boolean;
  videoId: string | null;
  title: string;
  viewerCount: number | null;
  thumbnailUrl: string | null;
  channelUrl: string;
  scheduled: Array<{ id: number; title: string; scheduledAt: string; youtubeLink: string | null }>;
};

export async function getYoutubeStatus(): Promise<YoutubeStatus> {
  const cached = await cacheGet<YoutubeStatus>("youtube:status");
  if (cached) return cached;

  const channelId = process.env.YOUTUBE_CHANNEL_ID || "UCxxxxxxxxxxxxxxxxxxxxxxxx";
  const channelUrl = `https://www.youtube.com/channel/${channelId}`;
  const scheduled = await prisma.youtubeSchedule
    .findMany({ orderBy: { scheduledAt: "asc" }, take: 6 })
    .then((rows) =>
      rows.map((row) => ({
        id: row.id,
        title: row.title,
        scheduledAt: row.scheduledAt.toISOString(),
        youtubeLink: row.youtubeLink,
      })),
    )
    .catch(() => []);

  if (!process.env.YOUTUBE_API_KEY || !process.env.YOUTUBE_CHANNEL_ID) {
    const fallback = {
      isLive: false,
      videoId: null,
      title: "Latest StockWallah market class",
      viewerCount: null,
      thumbnailUrl: null,
      channelUrl,
      scheduled,
    };
    await cacheSet("youtube:status", fallback, 60);
    return fallback;
  }

  try {
    const liveUrl = new URL("https://www.googleapis.com/youtube/v3/search");
    liveUrl.searchParams.set("part", "snippet");
    liveUrl.searchParams.set("channelId", process.env.YOUTUBE_CHANNEL_ID);
    liveUrl.searchParams.set("eventType", "live");
    liveUrl.searchParams.set("type", "video");
    liveUrl.searchParams.set("key", process.env.YOUTUBE_API_KEY);

    const liveResponse = await fetch(liveUrl);
    const liveJson = (await liveResponse.json()) as Record<string, any>;
    const item = liveJson.items?.[0];

    if (item?.id?.videoId) {
      const statsUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
      statsUrl.searchParams.set("part", "liveStreamingDetails,snippet");
      statsUrl.searchParams.set("id", item.id.videoId);
      statsUrl.searchParams.set("key", process.env.YOUTUBE_API_KEY);
      const statsJson = (await (await fetch(statsUrl)).json()) as Record<string, any>;
      const statsItem = statsJson.items?.[0];
      const status = {
        isLive: true,
        videoId: item.id.videoId,
        title: item.snippet.title,
        viewerCount: Number(statsItem?.liveStreamingDetails?.concurrentViewers || 0),
        thumbnailUrl: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || null,
        channelUrl,
        scheduled,
      };
      await cacheSet("youtube:status", status, 60);
      return status;
    }

    const latestUrl = new URL("https://www.googleapis.com/youtube/v3/search");
    latestUrl.searchParams.set("part", "snippet");
    latestUrl.searchParams.set("channelId", process.env.YOUTUBE_CHANNEL_ID);
    latestUrl.searchParams.set("order", "date");
    latestUrl.searchParams.set("maxResults", "1");
    latestUrl.searchParams.set("type", "video");
    latestUrl.searchParams.set("key", process.env.YOUTUBE_API_KEY);
    const latestJson = (await (await fetch(latestUrl)).json()) as Record<string, any>;
    const latest = latestJson.items?.[0];
    const status = {
      isLive: false,
      videoId: latest?.id?.videoId || null,
      title: latest?.snippet?.title || "Latest StockWallah market class",
      viewerCount: null,
      thumbnailUrl: latest?.snippet?.thumbnails?.high?.url || latest?.snippet?.thumbnails?.medium?.url || null,
      channelUrl,
      scheduled,
    };
    await cacheSet("youtube:status", status, 60);
    return status;
  } catch (error) {
    logger.warn("YouTube API failed; hiding live state gracefully", { error: error instanceof Error ? error.message : error });
    const fallback = {
      isLive: false,
      videoId: null,
      title: "StockWallah market sessions",
      viewerCount: null,
      thumbnailUrl: null,
      channelUrl,
      scheduled,
    };
    await cacheSet("youtube:status", fallback, 60);
    return fallback;
  }
}

