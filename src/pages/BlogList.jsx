import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import api, { formatApiErrorDetail } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import ParticleBg from "@/components/ParticleBg";

const COVER_FALLBACK = "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200";

export default function BlogList() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const refresh = () => {
    setLoading(true);
    api.get("/blogs").then((r) => setBlogs(r.data)).finally(() => setLoading(false));
  };
  useEffect(() => { refresh(); }, []);

  const canWrite = user && (user.role === "admin" || user.role === "teacher");

  const remove = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await api.delete(`/blogs/${id}`);
      toast.success("Post deleted");
      refresh();
    } catch (e) { toast.error(formatApiErrorDetail(e.response?.data?.detail)); }
  };

  return (
    <div className="relative pt-28 pb-24" data-testid="blog-list-page">
      <ParticleBg variant="minimal" />
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="font-mono text-[11px] tracking-[0.3em] text-primary uppercase">// Insights</div>
            <h1 className="font-display text-5xl md:text-6xl font-extrabold mt-3 leading-[1.05]">
              The <span className="cyan-gold-text">ISAI Journal</span>
            </h1>
            <p className="mt-5 max-w-xl text-foreground/70">
              Tutorials, lab dispatches, AI essays and stories from our students &amp; faculty.
            </p>
          </motion.div>

          {canWrite && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="btn-neon h-11 rounded-xl px-5" data-testid="new-blog-btn">
                  <Plus className="h-4 w-4 mr-2" /> Write a post
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-white/10 max-w-xl">
                <DialogHeader><DialogTitle className="font-display">New blog post</DialogTitle></DialogHeader>
                <BlogForm onCreated={() => { setOpen(false); refresh(); }} />
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="mt-12">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-white/10 overflow-hidden bg-card">
                  <div className="aspect-[16/9] bg-white/5 animate-pulse" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 w-3/4 bg-white/10 rounded animate-pulse" />
                    <div className="h-3 w-1/2 bg-white/10 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center text-foreground/60 py-20">No posts yet. Check back soon.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((b, i) => (
                <motion.article
                  key={b.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: (i % 6) * 0.06 }}
                  className="group relative rounded-2xl overflow-hidden border border-white/10 bg-card hover:border-primary/40 transition-colors"
                  data-testid="blog-card"
                >
                  {canWrite && (user.role === "admin" || user.id === b.author_id) && (
                    <button
                      onClick={() => remove(b.id)}
                      className="absolute top-3 right-3 z-10 h-8 w-8 rounded-md glass flex items-center justify-center hover:bg-destructive/20 hover:text-destructive"
                      title="Delete"
                      data-testid="blog-delete-btn"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  <Link to={`/blog/${b.slug}`}>
                    <div className="aspect-[16/9] overflow-hidden">
                      <img src={b.cover || COVER_FALLBACK} alt="" loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="p-5">
                      <div className="font-mono text-[10px] tracking-widest text-primary uppercase">
                        {b.category || "Insight"} · {new Date(b.created_at).toLocaleDateString()}
                      </div>
                      <h3 className="font-display text-lg font-bold mt-2 leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                        {b.title}
                      </h3>
                      <p className="mt-2 text-sm text-foreground/65 line-clamp-3">{b.excerpt}</p>
                      <div className="mt-4 flex items-center justify-between text-xs text-foreground/55">
                        <span>by {b.author_name}</span>
                        <span className="text-primary flex items-center gap-1 group-hover:gap-2 transition-all">Read <ArrowRight className="h-3.5 w-3.5" /></span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function BlogForm({ onCreated }) {
  const [form, setForm] = useState({ title: "", excerpt: "", content: "", cover: "", category: "AI", tags: "" });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      };
      await api.post("/blogs", payload);
      toast.success("Post published! 🚀");
      setForm({ title: "", excerpt: "", content: "", cover: "", category: "AI", tags: "" });
      onCreated?.();
    } catch (e2) {
      toast.error(formatApiErrorDetail(e2.response?.data?.detail) || "Failed to publish");
    } finally { setBusy(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-4 mt-2" data-testid="blog-form">
      <div>
        <Label>Title</Label>
        <Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="mt-2 bg-white/5 border-white/10" data-testid="blog-title" />
      </div>
      <div>
        <Label>Excerpt (1-2 sentence preview)</Label>
        <Textarea required rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          className="mt-2 bg-white/5 border-white/10" data-testid="blog-excerpt" />
      </div>
      <div>
        <Label>Content (markdown supported)</Label>
        <Textarea required rows={8} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="mt-2 bg-white/5 border-white/10 font-mono text-sm" data-testid="blog-content" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Category</Label>
          <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="mt-2 bg-white/5 border-white/10" placeholder="AI, Coding, Robotics" />
        </div>
        <div>
          <Label>Tags (comma separated)</Label>
          <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className="mt-2 bg-white/5 border-white/10" placeholder="python, ml" />
        </div>
      </div>
      <div>
        <Label>Cover image URL (optional)</Label>
        <Input value={form.cover} onChange={(e) => setForm({ ...form, cover: e.target.value })}
          className="mt-2 bg-white/5 border-white/10" placeholder="https://…" data-testid="blog-cover" />
      </div>
      <Button type="submit" disabled={busy} className="btn-neon w-full" data-testid="blog-submit">
        {busy ? "Publishing…" : "Publish post"}
      </Button>
    </form>
  );
}
