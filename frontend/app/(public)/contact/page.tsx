"use client";

import { useState } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { api } from "@/lib/api";
import { GoldButton } from "@/components/common/GoldButton";
import { BrandSocialLink } from "@/components/common/BrandSocialLink";
import { courses, contactInfo, socialLinks } from "@/lib/content";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", courseInterest: "", message: "" });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (form.name.length < 2 || !form.email.includes("@") || form.message.length < 3) {
      setStatus("Please enter your name, valid email, and a short message.");
      return;
    }
    setLoading(true);

    // Build WhatsApp message with the filled fields
    const parts = [
      `Name: ${form.name}`,
      form.phone ? `Phone: ${form.phone}` : undefined,
      `Email: ${form.email}`,
      form.courseInterest ? `Course: ${form.courseInterest}` : undefined,
      `Message: ${form.message}`
    ].filter(Boolean);

    const waText = encodeURIComponent(parts.join("\n"));
    const waHref = `https://wa.me/${contactInfo.whatsappNumber}?text=${waText}`;

    // Open WhatsApp in a new tab so the user can send the message from their phone/WhatsApp Web
    try {
      window.open(waHref, "_blank");
    } catch (e) {
      // ignore
    }

    // Save the enquiry in the backend as well (best-effort)
    try {
      await api.post("/api/contact", form);
      setStatus("WhatsApp opened — please send the message. We've also saved your enquiry.");
      setForm({ name: "", email: "", phone: "", courseInterest: "", message: "" });
    } catch (err) {
      setStatus("WhatsApp opened — please send the message. (Saving the enquiry failed.)");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8 max-w-4xl">
        <div className="inline-flex rounded-full border border-gold-primary/35 bg-gold-muted px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold-light">Contact & Support</div>
        <h1 className="mt-4 font-display text-4xl font-bold text-white-primary md:text-5xl">Get in touch with StockWallah</h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-white-secondary md:text-lg">Ask about courses, batches, or partnerships — we reply fastest on WhatsApp. Use the form below or reach us via the quick actions.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">
        <div>
          <form onSubmit={submit} className="card border border-black-border/80 bg-black-surface/95 p-5 shadow-deep md:p-6">
            <div className="mb-4 rounded-2xl border border-gold-primary/15 bg-gold-muted/10 p-4">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-primary">Send an enquiry</div>
              <p className="mt-1 text-sm leading-6 text-white-secondary">Tell us your course interest, preferred batch, and a short message.</p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <input aria-label="Name" className="premium-focus h-11 rounded-lg border border-black-border bg-black-primary px-3 text-white-primary placeholder:text-white-muted" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input aria-label="Email" className="premium-focus h-11 rounded-lg border border-black-border bg-black-primary px-3 text-white-primary placeholder:text-white-muted" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>

            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <input aria-label="Phone" className="premium-focus h-11 rounded-lg border border-black-border bg-black-primary px-3 text-white-primary placeholder:text-white-muted" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <select aria-label="Course interest" className="premium-focus h-11 rounded-lg border border-black-border bg-black-primary px-3 text-white-primary" value={form.courseInterest} onChange={(e) => setForm({ ...form, courseInterest: e.target.value })}>
                <option value="">Course Interest</option>
                {courses.map((course) => (
                  <option key={course.slug} value={course.title}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-3">
              <textarea aria-label="Message" className="premium-focus min-h-32 w-full rounded-lg border border-black-border bg-black-primary px-3 py-3 text-white-primary placeholder:text-white-muted" placeholder="Message (brief)" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </div>

            {status ? <p className="mt-3 text-sm text-gold-light">{status}</p> : null}

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <GoldButton type="submit">{loading ? "Sending..." : "Send Message"} <ArrowRight size={16} /></GoldButton>
              <a href={`https://wa.me/${contactInfo.whatsappNumber}`} target="_blank" rel="noreferrer" className="ml-0 sm:ml-3 inline-flex items-center gap-2 rounded border border-black-border bg-black-primary px-4 py-2 text-sm text-white-primary hover:border-gold-primary">
                <MessageCircle /> Chat on WhatsApp
              </a>
            </div>
          </form>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <a href={`tel:${contactInfo.phoneLink}`} className="rounded-lg border border-black-border bg-black-primary px-3 py-2 text-sm text-white-primary text-center transition hover:border-gold-primary">Call</a>
            <a href={`https://wa.me/${contactInfo.whatsappNumber}`} target="_blank" rel="noreferrer" className="rounded-lg border border-black-border bg-black-primary px-3 py-2 text-sm text-white-primary text-center transition hover:border-gold-primary">WhatsApp</a>
            <a href={contactInfo.mapLink} target="_blank" rel="noreferrer" className="rounded-lg border border-black-border bg-black-primary px-3 py-2 text-center text-sm text-white-primary transition hover:border-gold-primary">Directions</a>
          </div>
        </div>

        <aside>
          <div className="card mb-4 p-5">
            <div className="text-sm uppercase tracking-[0.18em] text-gold-primary">Office</div>
            <h3 className="mt-2 font-semibold text-white-primary">{contactInfo.addressShort}</h3>
            <p className="mt-1 text-sm text-white-secondary">{contactInfo.address}</p>
            <a className="mt-3 inline-block text-sm text-gold-light" href={contactInfo.mapLink} target="_blank" rel="noreferrer">Open in Google Maps</a>
          </div>

          <div className="card mb-4 p-5">
            <div className="text-sm uppercase tracking-[0.18em] text-gold-primary">Contact</div>
            <div className="mt-2 text-sm text-white-secondary">Phone: <a className="text-white-primary" href={`tel:${contactInfo.phoneLink}`}>{contactInfo.phoneDisplay}</a></div>
            <div className="mt-1 text-sm text-white-secondary">WhatsApp: <a className="text-white-primary" href={`https://wa.me/${contactInfo.whatsappNumber}`}>Open chat</a></div>
            <div className="mt-1 text-sm text-white-secondary">Email: <a className="text-white-primary" href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a></div>
          </div>

          <div className="card mb-4 p-5">
            <div className="text-sm uppercase tracking-[0.18em] text-gold-primary">Social</div>
            <div className="mt-3 grid gap-2">
              <BrandSocialLink href={socialLinks.linkedin} label="LinkedIn" />
              <BrandSocialLink href={socialLinks.instagram} label="Instagram" />
              <BrandSocialLink href={socialLinks.facebook} label="Facebook" />
              <BrandSocialLink href={socialLinks.youtube} label="YouTube" />
            </div>
          </div>

          <iframe className="h-60 w-full rounded-sw border border-black-border grayscale" src={`https://www.google.com/maps?q=${encodeURIComponent(contactInfo.mapQuery)}&output=embed`} title="map" loading="lazy" />
        </aside>
      </div>
    </section>
  );
}
