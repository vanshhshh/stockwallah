import Link from "next/link";
import { Clock } from "lucide-react";
import { blogPosts } from "@/lib/content";

export default function BlogPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8 max-w-3xl sm:mb-10">
        <h1 className="font-display text-3xl font-bold text-white-primary sm:text-5xl">StockWallah Articles</h1>
        <p className="mt-4 text-sm leading-6 text-white-secondary sm:text-lg sm:leading-8">Practical reads on NISM, chart reading, risk, options, and market routines.</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="card flex min-h-56 min-w-0 flex-col p-5 transition hover:border-gold-primary/45 hover:shadow-gold sm:min-h-64 sm:p-6">
            <span className="mb-4 w-fit rounded bg-gold-muted px-2 py-1 text-xs text-gold-light">{post.category}</span>
            <h2 className="text-xl font-semibold leading-7 text-white-primary">{post.title}</h2>
            <p className="mt-3 text-sm leading-6 text-white-secondary">{post.excerpt}</p>
            <div className="mt-auto flex items-center gap-2 pt-6 text-sm text-white-muted">
              <Clock size={15} /> {post.readMinutes} min read
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
