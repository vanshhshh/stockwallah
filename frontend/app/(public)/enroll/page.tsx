"use client";

import { Suspense, useState } from "react";
import { ArrowRight, CheckCircle2, MessageCircle, QrCode, ShieldCheck, Sparkles } from "lucide-react";
import QRCode from "react-qr-code";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { academyDisclaimer, contactInfo, courses } from "@/lib/content";
import { GoldButton } from "@/components/common/GoldButton";
import { cn } from "@/lib/utils";
import { formatInr } from "@/lib/utils";

const modes = ["online", "offline", "both"];

function EnrollPageContent() {
  const searchParams = useSearchParams();
  const selectedCourse = courses.find((course) => course.slug === searchParams.get("course")) || courses[0];
  const preselected = Boolean(searchParams.get("course"));
  const [step, setStep] = useState(preselected ? 2 : 1);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    course: selectedCourse.title,
    mode: "online",
    name: "",
    email: "",
    phone: "",
    city: "",
    experience: "Beginner",
    query: ""
  });

  const paymentCourse = courses.find((course) => course.title === form.course) || selectedCourse;
  const whatsappHref = `https://wa.me/${contactInfo.whatsappNumber}?text=${encodeURIComponent(
    `Hi, I have paid for ${form.course}. Student name: ${form.name || "[your name]"}. Please find my payment screenshot attached and confirm my enrollment.`
  )}`;

  function next() {
    setError("");
    if (step === 1 && !form.course) setError("Choose a course to continue.");
    else if (step === 2 && (form.name.length < 2 || !form.email.includes("@") || form.phone.length < 10)) setError("Enter valid personal details.");
    else setStep((current) => Math.min(current + 1, 3));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    try {
      await api.post("/api/enrollments", form);
      setSuccess(true);
    } catch {
      setError("Enrollment could not be submitted. Please try again.");
    }
  }

  if (success) {
    return (
      <section className="mx-auto flex max-w-3xl flex-col items-center px-4 py-20 text-center">
        <CheckCircle2 className="text-profit" size={72} />
        <h1 className="mt-6 font-display text-5xl font-bold text-white-primary">Enrollment Request Received</h1>
        <p className="mt-4 max-w-2xl text-lg text-white-secondary">A StockWallah advisor will confirm your batch, schedule, and payment details shortly. Please send the payment screenshot, student name, and selected course on WhatsApp.</p>
        <GoldButton href={whatsappHref} className="mt-8">
          <MessageCircle size={18} /> Share Payment Screenshot
        </GoldButton>
      </section>
    );
  }

  // If the page was opened from an "Enroll Now" CTA with a preselected course,
  // show a minimal payment-first UI: instructions, QR (supplied image preferred),
  // and the WhatsApp handoff button only.
  if (preselected) {
    return (
      <section className="mx-auto flex max-w-3xl flex-col items-center px-4 py-20 text-center">
        <div className="inline-flex rounded-full border border-gold-primary/35 bg-gold-muted px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold-light shadow-[0_0_0_1px_rgba(201,168,76,0.08)]">
          Pay via UPI QR
        </div>
        <h1 className="mt-6 font-display text-4xl font-bold text-white-primary md:text-5xl">Complete payment to enroll</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-white-secondary md:text-lg">Scan the QR below, pay the course fee, then share the payment screenshot on WhatsApp to confirm your enrollment.</p>

        <div className="mx-auto mt-8 w-full max-w-3xl space-y-5">
          <div className="card mx-auto max-w-2xl border border-black-border/80 bg-black-surface/95 p-4 text-left shadow-deep">
            <div className="text-xs uppercase tracking-[0.2em] text-gold-primary">Selected course</div>
            <h2 className="mt-2 text-lg font-semibold text-white-primary md:text-xl">{selectedCourse.title}</h2>
            <div className="mt-2 text-xl font-bold text-white-primary md:text-2xl">{formatInr(selectedCourse.price)}</div>
            {selectedCourse.originalPrice ? <div className="text-sm text-white-muted line-through">{formatInr(selectedCourse.originalPrice)}</div> : null}
          </div>

          <div className="mx-auto rounded-3xl bg-white p-4 shadow-[0_20px_50px_rgba(0,0,0,0.28)]">
            {contactInfo.upiQrImage ? (
              <img src={contactInfo.upiQrImage} alt="UPI QR" width={360} height={360} className="rounded-2xl object-contain" />
            ) : (
              <QRCode value={contactInfo.upiPayUri} size={360} bgColor="#FFFFFF" fgColor="#000000" />
            )}
          </div>

          <div className="text-center">
            <GoldButton href={whatsappHref} className="inline-flex min-w-64 justify-center">
              <MessageCircle size={18} /> Share Payment Screenshot on WhatsApp
            </GoldButton>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-start">
        <div className="space-y-5">
          <div className="inline-flex rounded-full border border-gold-primary/35 bg-gold-muted px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold-light shadow-[0_0_0_1px_rgba(201,168,76,0.08)]">
            Pay via UPI QR
          </div>
          <h1 className="font-display text-5xl font-bold text-white-primary md:text-6xl">Enroll at StockWallah</h1>
          <p className="max-w-2xl text-lg leading-8 text-white-secondary">Scan the QR code, pay the selected course fee, and then send the screenshot on WhatsApp with your student name and desired course.</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { icon: QrCode, title: "Scan QR", text: "Use any UPI app to scan and pay." },
              { icon: ShieldCheck, title: "Pay securely", text: `UPI ID: ${contactInfo.upiId}` },
              { icon: Sparkles, title: "Confirm on WhatsApp", text: "Send screenshot, name, and course." }
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="card border border-black-border/80 bg-black-surface/95 p-4 shadow-[0_12px_28px_rgba(0,0,0,0.22)]">
                <Icon className="text-gold-primary" />
                <h2 className="mt-3 font-semibold text-white-primary">{title}</h2>
                <p className="mt-1 text-sm text-white-secondary">{text}</p>
              </div>
            ))}
          </div>
          <p className="rounded-2xl border border-gold-primary/20 bg-gold-muted/20 p-4 text-sm leading-6 text-white-secondary">{academyDisclaimer}</p>
        </div>
        <div className="card border border-gold-primary/30 bg-black-surface p-6 shadow-deep">
          <div className="rounded-3xl border border-black-border bg-white p-6 text-center text-black-primary shadow-[0_0_50px_rgba(201,168,76,0.18)]">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">StockWallah Trading Academy</div>
            <div className="mt-2 text-2xl font-bold leading-tight">UPI ID: {contactInfo.upiId}</div>
            <p className="mt-3 text-sm text-neutral-600">Scan this QR code with any UPI app to transfer the course fee.</p>
            <div className="mx-auto mt-5 inline-flex rounded-2xl bg-white p-4 shadow-[0_10px_24px_rgba(0,0,0,0.08)]">
              {contactInfo.upiQrImage ? (
                <img src={contactInfo.upiQrImage} alt="UPI QR" width={224} height={224} className="object-contain" />
              ) : (
                <QRCode value={contactInfo.upiPayUri} size={224} bgColor="#FFFFFF" fgColor="#000000" />
              )}
            </div>
            <div className="mt-5 grid gap-2 text-sm text-neutral-700">
              <div>Payee: StockWallah Trading Academy</div>
              <div>UPI ID: {contactInfo.upiId}</div>
              <div>Selected fee: {formatInr(paymentCourse.price)}</div>
            </div>
          </div>
          <div className="mt-4 rounded-2xl border border-black-border bg-black-primary p-4">
            <div className="text-sm uppercase tracking-[0.18em] text-gold-primary">After payment</div>
            <p className="mt-2 text-sm leading-6 text-white-secondary">Click the WhatsApp button and share the payment screenshot with your name and the course you want.</p>
          </div>
        </div>
      </div>
      <div className="mb-8 grid grid-cols-3 gap-2">
        {[1, 2, 3].map((item) => (
          <div key={item} className={cn("h-2 rounded", item <= step ? "bg-gold-primary" : "bg-black-border")} />
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <form onSubmit={submit} className="card p-6">
          {step === 1 && !preselected ? (
            <div className="grid gap-5">
              <label className="text-sm text-white-secondary">
                Course selection
                <select className="premium-focus mt-2 min-h-12 w-full rounded border border-black-border bg-black-primary px-4 text-white-primary" value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })}>
                  {courses.map((course) => (
                    <option key={course.slug} value={course.title}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </label>
              <div>
                <div className="mb-2 text-sm text-white-secondary">Mode</div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {modes.map((mode) => (
                    <button
                      type="button"
                      key={mode}
                      className={cn("premium-focus min-h-12 rounded border px-4 font-semibold capitalize", form.mode === mode ? "border-gold-primary bg-gold-muted text-gold-light" : "border-black-border bg-black-primary text-white-secondary")}
                      onClick={() => setForm({ ...form, mode })}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
          {step === 2 ? (
            <div className="grid gap-4">
              <div className="rounded border border-gold-primary/20 bg-gold-muted/25 p-4 text-sm text-white-secondary">
                Selected course fee: <span className="font-semibold text-white-primary">{formatInr(paymentCourse.price)}</span>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <input className="premium-focus min-h-12 rounded border border-black-border bg-black-primary px-4 text-white-primary" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <input className="premium-focus min-h-12 rounded border border-black-border bg-black-primary px-4 text-white-primary" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <input className="premium-focus min-h-12 rounded border border-black-border bg-black-primary px-4 text-white-primary" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <input className="premium-focus min-h-12 rounded border border-black-border bg-black-primary px-4 text-white-primary" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </div>
              <select className="premium-focus min-h-12 rounded border border-black-border bg-black-primary px-4 text-white-primary" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })}>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
                <option>Investor</option>
              </select>
            </div>
          ) : null}
          {step === 3 ? (
            <div className="grid gap-4">
              <div className="rounded border border-gold-primary/20 bg-gold-muted/25 p-4 text-sm text-white-secondary">
                Payment completed? Save the screenshot, then press the WhatsApp button on the right with your student name and selected course.
              </div>
              <textarea className="premium-focus min-h-40 rounded border border-black-border bg-black-primary px-4 py-3 text-white-primary" placeholder="Schedule preference or query" value={form.query} onChange={(e) => setForm({ ...form, query: e.target.value })} />
              <div className="rounded border border-black-border bg-black-primary p-4 text-sm text-white-secondary">
                Selected: <span className="text-white-primary">{form.course}</span> • Mode: <span className="capitalize text-white-primary">{form.mode}</span>
              </div>
            </div>
          ) : null}
          {error ? <p className="mt-4 text-sm text-loss">{error}</p> : null}
          <div className="mt-6 flex justify-between gap-3">
            {!(
              preselected && step === 2
            ) ? (
              <button type="button" className="premium-focus min-h-11 rounded border border-black-border px-5 text-white-secondary" onClick={() => setStep((current) => Math.max(current - 1, 1))}>
                Back
              </button>
            ) : null}
            {step < 3 ? (
              <GoldButton onClick={next}>Next</GoldButton>
            ) : (
              <GoldButton type="submit">Submit Enrollment</GoldButton>
            )}
          </div>
        </form>
        <aside className="grid gap-4">
          <div className="card p-5">
            <div className="text-sm uppercase tracking-[0.18em] text-gold-primary">WhatsApp handoff</div>
            <p className="mt-3 text-sm leading-6 text-white-secondary">After payment, open WhatsApp and share the screenshot with your name and selected course. We will confirm your batch and schedule.</p>
            <GoldButton href={whatsappHref} className="mt-5 w-full">
              <MessageCircle size={18} /> Open WhatsApp
            </GoldButton>
          </div>
          <div className="card p-5">
            <div className="text-sm uppercase tracking-[0.18em] text-gold-primary">Selected course</div>
            <h2 className="mt-3 text-xl font-semibold text-white-primary">{paymentCourse.title}</h2>
            <p className="mt-2 text-sm text-white-secondary">{paymentCourse.description}</p>
            <div className="mt-4 text-2xl font-bold text-white-primary">{formatInr(paymentCourse.price)}</div>
            <div className="mt-1 text-sm text-white-muted line-through">{formatInr(paymentCourse.originalPrice)}</div>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default function EnrollPage() {
  return (
    <Suspense fallback={<section className="min-h-screen bg-black-primary" />}>
      <EnrollPageContent />
    </Suspense>
  );
}
