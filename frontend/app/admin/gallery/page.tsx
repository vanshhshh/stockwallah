"use client";

import Image from "next/image";
import { ImagePlus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, API_URL } from "@/lib/api";

type MediaItem = { id: number; title: string; imageUrl: string; linkUrl?: string | null; active: boolean };

function toSrc(url: string) {
  return url.startsWith("http") ? url : `${API_URL}${url}`;
}

function UploadForm({ type }: { type: "images" | "banners" }) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [imageData, setImageData] = useState("");

  const upload = useMutation({
    mutationFn: () => api.post(`/api/admin/gallery/${type}`, { title, linkUrl, imageData }),
    onSuccess: () => {
      setTitle("");
      setLinkUrl("");
      setImageData("");
      queryClient.invalidateQueries({ queryKey: ["admin", "gallery"] });
    }
  });

  async function pickFile(file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageData(String(reader.result));
    reader.readAsDataURL(file);
  }

  return (
    <div className="card p-5">
      <h2 className="text-xl font-semibold text-white-primary">{type === "images" ? "Upload Gallery Picture" : "Upload Banner"}</h2>
      <div className="mt-4 grid gap-3">
        <input className="premium-focus min-h-11 rounded border border-black-border bg-black-primary px-3 text-white-primary" placeholder="Title" value={title} onChange={(event) => setTitle(event.target.value)} />
        {type === "banners" ? (
          <input className="premium-focus min-h-11 rounded border border-black-border bg-black-primary px-3 text-white-primary" placeholder="Optional banner link" value={linkUrl} onChange={(event) => setLinkUrl(event.target.value)} />
        ) : null}
        <input className="premium-focus rounded border border-black-border bg-black-primary p-3 text-white-secondary file:mr-4 file:rounded file:border-0 file:bg-gold-muted file:px-3 file:py-2 file:text-gold-light" type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => pickFile(event.target.files?.[0])} />
        {imageData ? <img src={imageData} alt="Preview" className="h-32 rounded border border-black-border object-cover" /> : null}
        <button className="gold-gradient-bg premium-focus inline-flex min-h-11 items-center justify-center gap-2 rounded px-4 font-semibold text-black-primary disabled:opacity-50" disabled={!title || !imageData || upload.isPending} onClick={() => upload.mutate()}>
          <ImagePlus size={16} /> {upload.isPending ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
}

export default function AdminGalleryPage() {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin", "gallery"],
    queryFn: async () => (await api.get<{ images: MediaItem[]; banners: MediaItem[] }>("/api/admin/gallery")).data
  });

  const patch = useMutation({
    mutationFn: ({ type, item }: { type: "images" | "banners"; item: MediaItem }) => api.patch(`/api/admin/gallery/${type}/${item.id}`, { active: !item.active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "gallery"] })
  });

  const remove = useMutation({
    mutationFn: ({ type, id }: { type: "images" | "banners"; id: number }) => api.delete(`/api/admin/gallery/${type}/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "gallery"] })
  });

  const sections: Array<{ type: "images" | "banners"; title: string; items: MediaItem[] }> = [
    { type: "banners", title: "Banners", items: data?.banners || [] },
    { type: "images", title: "Gallery Pictures", items: data?.images || [] }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-white-primary">Gallery & Banners</h1>
        <p className="mt-2 text-white-secondary">Upload public gallery photos and site banners from here.</p>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <UploadForm type="banners" />
        <UploadForm type="images" />
      </div>

      <div className="grid gap-8">
        {sections.map((section) => (
          <div key={section.type}>
            <h2 className="mb-4 text-2xl font-semibold text-white-primary">{section.title}</h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {section.items.map((item) => (
                <article key={item.id} className="card overflow-hidden">
                  <div className="relative aspect-video bg-black-primary">
                    <Image src={toSrc(item.imageUrl)} alt={item.title} fill sizes="(min-width: 1280px) 33vw, 100vw" className="object-cover" unoptimized />
                  </div>
                  <div className="flex items-center justify-between gap-3 p-4">
                    <div>
                      <div className="font-semibold text-white-primary">{item.title}</div>
                      <div className={item.active ? "text-sm text-profit" : "text-sm text-loss"}>{item.active ? "Active" : "Inactive"}</div>
                    </div>
                    <div className="flex gap-2">
                      <button className="rounded border border-black-border px-3 py-2 text-sm text-white-secondary hover:border-gold-primary" onClick={() => patch.mutate({ type: section.type, item })}>
                        {item.active ? "Hide" : "Show"}
                      </button>
                      <button className="rounded border border-loss/30 p-2 text-loss hover:bg-loss/10" onClick={() => remove.mutate({ type: section.type, id: item.id })} aria-label="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
