import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import api from "@/lib/api";
import CourseCard from "@/components/CourseCard";
import { Input } from "@/components/ui/input";
import ParticleBg from "@/components/ParticleBg";

const TABS = [
  { id: "all", label: "All Courses" },
  { id: "primary", label: "Class 3–8" },
  { id: "secondary", label: "Class 9–12" },
  { id: "higher", label: "UG / PG / Pro" },
];

export default function CoursesPage() {
  const [params, setParams] = useSearchParams();
  const initial = params.get("category") || "all";
  const [active, setActive] = useState(initial);
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const q = active === "all" ? "" : `?category=${active}`;
    api.get(`/courses${q}`).then((r) => setCourses(r.data)).finally(() => setLoading(false));
  }, [active]);

  const handleTab = (id) => {
    setActive(id);
    if (id === "all") { params.delete("category"); setParams(params); }
    else { params.set("category", id); setParams(params); }
  };

  const filtered = courses.filter((c) =>
    !search ? true : (c.title + c.tagline + c.description).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative" data-testid="courses-page">
      <section className="relative pt-32 pb-16 overflow-hidden">
        <ParticleBg variant="minimal" />
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="font-mono text-[11px] tracking-[0.3em] text-primary uppercase">// Course Catalog</div>
            <h1 className="font-display text-5xl md:text-6xl font-extrabold mt-3 leading-[1.05] tracking-tight">
              Build skills for the <span className="cyan-gold-text">next decade.</span>
            </h1>
            <p className="mt-4 max-w-2xl text-foreground/70 leading-relaxed">
              {courses.length} curated courses across AI, Coding, Robotics, Cybersecurity & Emerging Tech.
            </p>
          </motion.div>

          <div className="mt-10 flex flex-col md:flex-row md:items-center gap-4 justify-between">
            <div className="flex flex-wrap gap-2">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleTab(t.id)}
                  data-testid={`tab-${t.id}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                    active === t.id
                      ? "bg-primary text-black border-primary shadow-neon-cyan"
                      : "bg-transparent border-white/10 text-foreground/70 hover:border-white/30 hover:text-foreground"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses…"
                className="pl-9 bg-white/5 border-white/10"
                data-testid="course-search"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-white/10 bg-card overflow-hidden">
                  <div className="aspect-[16/10] bg-white/5 animate-pulse" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 w-3/4 bg-white/10 rounded animate-pulse" />
                    <div className="h-3 w-1/2 bg-white/10 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center text-foreground/60 py-20">No courses found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((c, i) => <CourseCard key={c.id} course={c} index={i} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
