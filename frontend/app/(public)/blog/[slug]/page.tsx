import { notFound } from "next/navigation";
import { Clock } from "lucide-react";
import { blogPosts } from "@/lib/content";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((item) => item.slug === params.slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <span className="rounded bg-gold-muted px-3 py-1 text-sm text-gold-light">{post.category}</span>
      <h1 className="mt-5 font-display text-5xl font-bold leading-tight text-white-primary">{post.title}</h1>
      <div className="mt-4 flex items-center gap-2 text-sm text-white-muted">
        <Clock size={15} /> {post.readMinutes} min read
      </div>
      <p className="mt-8 text-xl leading-9 text-white-secondary">{post.excerpt}</p>
      <div className="mt-8 border-t border-black-border pt-8 text-lg leading-9 text-white-secondary">{post.content}</div>
    </article>
  );
}

