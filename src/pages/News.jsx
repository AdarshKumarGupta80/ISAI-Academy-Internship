import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, User2 } from "lucide-react";
import api from "@/lib/api";
import ParticleBg from "@/components/ParticleBg";

export default function News() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/news").then((r) => setItems(r.data)).finally(() => setLoading(false));
  }, []);

  const [first, ...rest] = items;

  return (
    <div className="relative pt-28 pb-24" data-testid="news-page">
      <ParticleBg variant="minimal" />
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="font-mono text-[11px] tracking-[0.3em] text-primary uppercase">// News & Announcements</div>
          <h1 className="font-cyber text-5xl md:text-6xl font-extrabold mt-3 leading-[1.05] uppercase tracking-wide">
            The <span className="cyan-gold-text neon-text">Supernova</span> wire
          </h1>
          <p className="mt-5 max-w-2xl text-foreground/70 leading-relaxed">
            Program launches, student wins, events &amp; everything happening at ISAI Academy.
          </p>
        </motion.div>

        {loading ? (
          <div className="mt-12 grid lg:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-card overflow-hidden">
                <div className="aspect-[16/9] bg-white/5 animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-4 w-3/4 bg-white/10 rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-white/10 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="mt-12 text-center text-foreground/55 py-20">No news yet.</div>
        ) : (
          <div className="mt-12 space-y-10">
            {first && <FeaturedNews item={first} />}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((n, i) => <NewsCard key={n.id} item={n} index={i} />)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function FeaturedNews({ item }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
      className="grid lg:grid-cols-2 gap-8 items-stretch rounded-3xl overflow-hidden border border-white/10 glass-strong"
      data-testid="featured-news"
    >
      <Link to={`/news/${item.id}`} className="block aspect-[16/10] lg:aspect-auto overflow-hidden">
        <img
          src={item.image_url || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200"}
          alt=""
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
        />
      </Link>
      <div className="p-8 md:p-10 flex flex-col">
        <div className="font-mono text-[10px] tracking-widest text-primary uppercase">
          {item.category} · {new Date(item.created_at).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-extrabold mt-3 leading-tight">{item.title}</h2>
        <p className="mt-4 text-foreground/75 leading-relaxed">{item.summary}</p>
        <div className="mt-auto pt-6 flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm text-foreground/55">
            <User2 className="h-4 w-4 text-primary" /> {item.author_name || "ISAI Admin"}
          </span>
          <Link to={`/news/${item.id}`} className="text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">
            Read more <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

function NewsCard({ item, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ duration: 0.45, delay: (index % 6) * 0.06 }}
      className="group rounded-2xl overflow-hidden border border-white/10 bg-card hover:border-primary/40 transition-colors"
      data-testid="news-card"
    >
      <Link to={`/news/${item.id}`}>
        {item.image_url && (
          <div className="aspect-[16/9] overflow-hidden">
            <img src={item.image_url} alt="" loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
        )}
        <div className="p-5">
          <div className="font-mono text-[10px] tracking-widest text-primary uppercase flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            {item.category} · {new Date(item.created_at).toLocaleDateString()}
          </div>
          <h3 className="font-display text-lg font-bold mt-2 leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {item.title}
          </h3>
          <p className="mt-2 text-sm text-foreground/65 line-clamp-3">{item.summary}</p>
        </div>
      </Link>
    </motion.article>
  );
}
