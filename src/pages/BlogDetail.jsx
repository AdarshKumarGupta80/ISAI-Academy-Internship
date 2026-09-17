import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User2 } from "lucide-react";
import api from "@/lib/api";

/** Tiny markdown-ish renderer (paragraphs, h2/h3, lists, bold).
 *  Keeps things safe by escaping HTML first. */
function renderMd(src) {
  if (!src) return "";
  const esc = src.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  let out = esc;
  out = out.replace(/^### (.*)$/gm, '<h3 class="font-display text-xl font-bold mt-8 mb-2">$1</h3>');
  out = out.replace(/^## (.*)$/gm, '<h2 class="font-display text-2xl font-bold mt-10 mb-3">$1</h2>');
  out = out.replace(/^# (.*)$/gm, '<h1 class="font-display text-3xl font-extrabold mt-10 mb-4">$1</h1>');
  out = out.replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground">$1</strong>');
  out = out.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-white/10 font-mono text-primary text-sm">$1</code>');
  // Lists
  out = out.replace(/^(\d+)\. (.*)$/gm, '<li class="ml-6 list-decimal text-foreground/85">$2</li>');
  out = out.replace(/^- (.*)$/gm, '<li class="ml-6 list-disc text-foreground/85">$1</li>');
  // Paragraphs
  out = out.split(/\n{2,}/).map((block) => {
    if (block.match(/^<(h\d|li|ul|ol)/)) return block;
    return `<p class="text-foreground/80 leading-relaxed my-4">${block.replace(/\n/g, "<br/>")}</p>`;
  }).join("\n");
  return out;
}

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/blogs/${slug}`).then((r) => setBlog(r.data)).catch(() => setBlog(false)).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-primary font-mono">LOADING…</div>;
  if (!blog) return <div className="min-h-screen flex items-center justify-center text-foreground/60">Post not found.</div>;

  return (
    <article className="pt-28 pb-24" data-testid="blog-detail-page">
      <div className="mx-auto max-w-3xl px-6 md:px-8">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" /> All posts
        </Link>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="font-mono text-[11px] tracking-[0.3em] text-primary uppercase">
            // {blog.category || "Insight"}
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold mt-3 leading-[1.1]" data-testid="blog-title">
            {blog.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-foreground/60">
            <span className="flex items-center gap-2"><User2 className="h-4 w-4 text-primary" /> {blog.author_name}</span>
            <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> {new Date(blog.created_at).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</span>
            <span className="capitalize px-2 py-0.5 rounded-md bg-white/5 border border-white/10 font-mono text-[10px] tracking-widest">{blog.author_role}</span>
          </div>
        </motion.div>

        {blog.cover && (
          <div className="mt-8 rounded-2xl overflow-hidden border border-white/10">
            <img src={blog.cover} alt="" className="w-full aspect-[16/9] object-cover" />
          </div>
        )}

        <div className="mt-10 prose-invert" dangerouslySetInnerHTML={{ __html: renderMd(blog.content) }} />

        {blog.tags?.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {blog.tags.map((t) => (
              <span key={t} className="text-xs px-2.5 py-1 rounded-full border border-white/10 text-foreground/70 font-mono uppercase tracking-widest">#{t}</span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
