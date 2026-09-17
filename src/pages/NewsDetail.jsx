import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User2, ExternalLink } from "lucide-react";
import api from "@/lib/api";

function renderMd(src) {
  if (!src) return "";
  const esc = src.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  let out = esc;
  out = out.replace(/^### (.*)$/gm, '<h3 class="font-display text-xl font-bold mt-8 mb-2">$1</h3>');
  out = out.replace(/^## (.*)$/gm, '<h2 class="font-display text-2xl font-bold mt-10 mb-3">$1</h2>');
  out = out.replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground">$1</strong>');
  out = out.replace(/^(\d+)\. (.*)$/gm, '<li class="ml-6 list-decimal text-foreground/85">$2</li>');
  out = out.replace(/^- (.*)$/gm, '<li class="ml-6 list-disc text-foreground/85">$1</li>');
  out = out.split(/\n{2,}/).map((block) => {
    if (block.match(/^<(h\d|li|ul|ol)/)) return block;
    return `<p class="text-foreground/80 leading-relaxed my-4">${block.replace(/\n/g, "<br/>")}</p>`;
  }).join("\n");
  return out;
}

export default function NewsDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/news/${id}`).then((r) => setItem(r.data)).catch(() => setItem(false)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-primary font-mono">LOADING…</div>;
  if (!item) return <div className="min-h-screen flex items-center justify-center text-foreground/60">News item not found.</div>;

  return (
    <article className="pt-28 pb-24" data-testid="news-detail-page">
      <div className="mx-auto max-w-3xl px-6 md:px-8">
        <Link to="/news" className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" /> All news
        </Link>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="font-mono text-[11px] tracking-[0.3em] text-primary uppercase">// {item.category}</div>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold mt-3 leading-[1.1]">
            {item.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-foreground/60">
            <span className="flex items-center gap-2"><User2 className="h-4 w-4 text-primary" /> {item.author_name || "ISAI Admin"}</span>
            <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> {new Date(item.created_at).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</span>
          </div>
        </motion.div>

        {item.image_url && (
          <div className="mt-8 rounded-2xl overflow-hidden border border-white/10">
            <img src={item.image_url} alt="" className="w-full aspect-[16/9] object-cover" />
          </div>
        )}

        <p className="mt-8 text-lg text-foreground/85 leading-relaxed">{item.summary}</p>
        <div className="mt-4" dangerouslySetInnerHTML={{ __html: renderMd(item.content) }} />

        {item.external_link && (
          <a href={item.external_link} target="_blank" rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 text-primary font-medium hover:underline">
            Read full announcement <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>
    </article>
  );
}
