import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Filter } from "lucide-react";
import api from "@/lib/api";
import GalleryGrid from "@/components/GalleryGrid";
import ParticleBg from "@/components/ParticleBg";

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    api.get("/gallery").then((r) => setItems(r.data)).finally(() => setLoading(false));
  }, []);

  const cats = ["All", ...Array.from(new Set(items.map((i) => i.category)))];
  const filtered = filter === "All" ? items : items.filter((i) => i.category === filter);

  return (
    <div className="relative pt-28 pb-24" data-testid="gallery-page">
      <ParticleBg variant="minimal" />
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="font-mono text-[11px] tracking-[0.3em] text-primary uppercase">// Gallery</div>
          <h1 className="font-cyber text-5xl md:text-6xl font-extrabold mt-3 leading-[1.05] uppercase tracking-wide">
            Through the <span className="cyan-gold-text neon-text">Supernova lens</span>
          </h1>
          <p className="mt-5 max-w-2xl text-foreground/70 leading-relaxed">
            Glimpses of life at ISAI Academy — labs, hackathons, demo days &amp; the everyday magic of curious minds at work.
          </p>
        </motion.div>

        <div className="mt-10 flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase mr-2 flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5" /> Filter
          </span>
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              data-testid={`gallery-filter-${c.toLowerCase()}`}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                filter === c
                  ? "bg-primary text-black border-primary shadow-neon-cyan"
                  : "bg-transparent border-white/10 text-foreground/70 hover:border-white/30 hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-10">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] rounded-2xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : (
            <GalleryGrid items={filtered} />
          )}
        </div>
      </div>
    </div>
  );
}
