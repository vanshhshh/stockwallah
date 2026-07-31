import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";
import { BrandSocialLink } from "@/components/common/BrandSocialLink";
import { LogoMark } from "@/components/common/LogoMark";
import { academyDisclaimer, academyMission, contactInfo, socialLinks } from "@/lib/content";

export function Footer() {
  return (
    <footer className="border-t border-black-border bg-black-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <LogoMark />
          <p className="mt-4 text-sm leading-6 text-white-secondary">
            {academyMission}
          </p>
          <div className="mt-5 flex gap-3">
            {[
              { href: socialLinks.youtube, label: "YouTube" },
              { href: socialLinks.instagram, label: "Instagram" },
              { href: socialLinks.facebook, label: "Facebook" },
              { href: socialLinks.linkedin, label: "LinkedIn" }
            ].map(({ href, label }) => (
              <BrandSocialLink key={label} href={href} label={label} compact />
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-base font-semibold text-white-primary">Quick Links</h3>
          <div className="grid gap-3 text-sm text-white-secondary">
            {["Courses", "Levels", "Market", "Live", "News", "Gallery"].map((item) => (
              <Link key={item} href={`/${item.toLowerCase()}`} className="hover:text-gold-light">
                {item}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-base font-semibold text-white-primary">Courses</h3>
          <div className="grid gap-3 text-sm text-white-secondary">
            <Link href="/courses/smc" className="hover:text-gold-light">
              SMC
            </Link>
            <Link href="/courses/intraday-stock-selection" className="hover:text-gold-light">
              Intraday Stock Selection
            </Link>
            <Link href="/courses/price-action-mastery" className="hover:text-gold-light">
              Price Action Mastery
            </Link>
            <Link href="/courses/all-in-one-online" className="hover:text-gold-light">
              All In One
            </Link>
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-base font-semibold text-white-primary">Contact</h3>
          <div className="grid gap-3 text-sm text-white-secondary">
            <p className="flex gap-2">
              <MapPin size={18} className="shrink-0 text-gold-primary" /> {contactInfo.addressShort}
            </p>
            <a className="flex gap-2 hover:text-gold-light" href={`tel:${contactInfo.phoneLink}`}>
              <Phone size={18} className="text-gold-primary" /> {contactInfo.phoneDisplay}
            </a>
            <a className="flex gap-2 hover:text-gold-light" href={`mailto:${contactInfo.email}`}>
              <Mail size={18} className="text-gold-primary" /> {contactInfo.email}
            </a>
          </div>
          <div className="mt-4 inline-flex items-center gap-2 rounded border border-gold-primary/30 bg-gold-muted px-3 py-2 text-xs text-gold-light">
            <MapPin size={14} /> {contactInfo.address}
          </div>
        </div>
      </div>
      <div className="border-t border-black-border px-4 py-5">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-white-muted md:flex-row md:items-center md:justify-between">
          <p>© 2026 StockWallah. Educational market training for learners across India.</p>
          <p className="max-w-3xl text-xs leading-5 text-white-muted">{academyDisclaimer}</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-gold-light">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gold-light">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
