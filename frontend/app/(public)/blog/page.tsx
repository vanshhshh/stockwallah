import Link from "next/link";
import { Clock } from "lucide-react";
import { blogPosts } from "@/lib/content";

export default function BlogPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-10 max-w-3xl">
        <h1 className="font-display text-5xl font-bold text-white-primary">StockWallah Articles</h1>
        <p className="mt-4 text-lg leading-8 text-white-secondary">Practical reads on NISM, chart reading, risk, options, and market routines.</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="card flex min-h-64 flex-col p-6 transition hover:border-gold-primary/45 hover:shadow-gold">
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

