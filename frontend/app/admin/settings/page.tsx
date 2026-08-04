"use client";

import { useEffect, useState } from "react";
import { CalendarPlus, ImagePlus, Save } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { GoldButton } from "@/components/common/GoldButton";
import { mediaSrc, readFileAsDataUrl } from "@/lib/media";

type SettingsResponse = {
  settings: Record<string, string>;
  schedule: Array<{ id: number; title: string; scheduledAt: string; youtubeLink: string | null }>;
};

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: async () => (await api.get<SettingsResponse>("/api/admin/settings")).data
  });
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [schedule, setSchedule] = useState({ title: "", scheduledAt: "", youtubeLink: "" });

  useEffect(() => {
    if (data?.settings) setSettings(data.settings);
  }, [data]);

  const save = useMutation({
    mutationFn: () => api.put("/api/admin/settings", { settings }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "settings"] })
  });
  const uploadImage = useMutation({
    mutationFn: (imageData: string) => api.post<{ imageUrl: string }>("/api/admin/settings/upload-image", { imageData })
  });
  const addSchedule = useMutation({
    mutationFn: () => api.post("/api/admin/settings/youtube-schedule", schedule),
    onSuccess: () => {
      setSchedule({ title: "", scheduledAt: "", youtubeLink: "" });
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
    }
  });

  const fields = [
    ["announcementText", "Announcement bar text"],
    ["whatsappNumber", "WhatsApp number"],
    ["contactEmail", "Contact email"],
    ["address", "Address"],
    ["mapLink", "Google Maps link"],
    ["youtubeChannelId", "YouTube channel ID"],
    ["adminEmail", "Notification email"],
    ["linkedinUrl", "LinkedIn URL"],
    ["instagramUrl", "Instagram URL"],
    ["facebookUrl", "Facebook URL"],
    ["youtubeUrl", "YouTube URL"],
    ["telegramUrl", "Telegram URL"],
    ["playStoreUrl", "Play Store URL"],
    ["appStoreUrl", "App Store URL"]
  ];

  const imageFields = [
    ["logoImage", "Logo image", "/stockwallah-logo.png"],
    ["homeHeroImage", "Home hero image", "/home-hero-exact.png"],
    ["founderImage", "Pankaj Yadav Sir image", "/pankaj-yadav-founder-new.png"],
    ["anshulImage", "Anshul Sir image", "/team/anshul-yadav.png"],
    ["deepAryaImage", "Deep Arya Sir image", "/team/deep-arya.png"],
    ["upiQrImage", "UPI QR image", "/upi-qr.png"],
    ["courseFallbackImage", "Default course image", "/pankaj-yadav-founder-new.png"]
  ];

  async function handleImageUpload(key: string, file: File | undefined) {
    if (!file) return;
    const imageData = await readFileAsDataUrl(file);
    const response = await uploadImage.mutateAsync(imageData);
    setSettings((current) => ({ ...current, [key]: response.data.imageUrl }));
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-white-primary">Site Settings</h1>
        <p className="mt-2 text-white-secondary">Configure announcement text, social links, WhatsApp, and YouTube schedules.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        <div className="card p-5">
          <h2 className="text-xl font-semibold text-white-primary">Public Settings</h2>
          <div className="mt-5 grid gap-4">
            {fields.map(([key, label]) => (
              <label key={key} className="text-sm text-white-secondary">
                {label}
                <input className="premium-focus mt-2 min-h-11 w-full rounded border border-black-border bg-black-primary px-3 text-white-primary" value={settings[key] || ""} onChange={(event) => setSettings({ ...settings, [key]: event.target.value })} />
              </label>
            ))}
          </div>
          <div className="mt-8 border-t border-black-border pt-6">
            <h3 className="text-lg font-semibold text-white-primary">Site Images</h3>
            <div className="mt-5 grid gap-5">
              {imageFields.map(([key, label, fallback]) => (
                <div key={key} className="grid gap-3 rounded border border-black-border bg-black-primary p-3 sm:grid-cols-[120px_1fr]">
                  <div className="relative h-24 overflow-hidden rounded border border-black-border bg-black-elevated">
                    <img src={mediaSrc(settings[key], fallback)} alt={label} className="h-full w-full object-contain" />
                  </div>
                  <label className="text-sm text-white-secondary">
                    {label}
                    <input className="premium-focus mt-2 min-h-11 w-full rounded border border-black-border bg-black-surface px-3 text-white-primary" value={settings[key] || ""} onChange={(event) => setSettings({ ...settings, [key]: event.target.value })} />
                    <label className="premium-focus mt-3 inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded border border-gold-primary/45 px-3 text-sm font-semibold text-gold-light hover:bg-gold-muted">
                      <ImagePlus size={16} /> Upload image
                      <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(event) => handleImageUpload(key, event.target.files?.[0])} />
                    </label>
                  </label>
                </div>
              ))}
            </div>
          </div>
          <GoldButton onClick={() => save.mutate()} className="mt-6">
            <Save size={16} /> Save Settings
          </GoldButton>
        </div>
        <aside className="grid gap-6">
          <div className="card p-5">
            <h2 className="text-xl font-semibold text-white-primary">Upcoming Session</h2>
            <div className="mt-5 grid gap-3">
              <input className="premium-focus min-h-11 rounded border border-black-border bg-black-primary px-3 text-white-primary" placeholder="Title" value={schedule.title} onChange={(e) => setSchedule({ ...schedule, title: e.target.value })} />
              <input className="premium-focus min-h-11 rounded border border-black-border bg-black-primary px-3 text-white-primary" type="datetime-local" value={schedule.scheduledAt} onChange={(e) => setSchedule({ ...schedule, scheduledAt: e.target.value })} />
              <input className="premium-focus min-h-11 rounded border border-black-border bg-black-primary px-3 text-white-primary" placeholder="YouTube link" value={schedule.youtubeLink} onChange={(e) => setSchedule({ ...schedule, youtubeLink: e.target.value })} />
              <button className="premium-focus inline-flex min-h-11 items-center justify-center gap-2 rounded border border-gold-primary/45 text-gold-light hover:bg-gold-muted" onClick={() => addSchedule.mutate()} disabled={!schedule.title || !schedule.scheduledAt}>
                <CalendarPlus size={16} /> Add Session
              </button>
            </div>
          </div>
          <div className="card p-5">
            <h2 className="text-xl font-semibold text-white-primary">Scheduled Sessions</h2>
            <div className="mt-4 grid gap-3">
              {(data?.schedule || []).map((item) => (
                <div key={item.id} className="rounded bg-black-primary p-3">
                  <div className="font-semibold text-white-primary">{item.title}</div>
                  <div className="text-sm text-white-muted">{new Date(item.scheduledAt).toLocaleString("en-IN")}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
