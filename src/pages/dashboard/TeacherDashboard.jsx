import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Video, Plus, Calendar, Users, Sparkles, BookOpen, PenSquare, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import api, { formatApiErrorDetail } from "@/lib/api";
import { BlogForm } from "@/pages/BlogList";
import CourseManager from "@/components/CourseManager";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [live, setLive] = useState([]);
  const [courses, setCourses] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", course_id: "", scheduled_at: "", duration_minutes: 60, description: "", provider: "zoom", meeting_url: "" });
  const [creating, setCreating] = useState(false);
  const [manageCourse, setManageCourse] = useState(null);

  const loadData = () => {
    api.get("/live-classes").then((r) => setLive(r.data)).catch(() => {});
    api.get("/courses").then((r) => setCourses(r.data)).catch(() => {});
  };

  useEffect(() => { loadData(); }, []);

  const createLive = async (e) => {
    e.preventDefault();
    if (!form.title || !form.course_id || !form.scheduled_at) {
      toast.error("Title, course and time are required");
      return;
    }
    setCreating(true);
    try {
      await api.post("/live-classes", {
        ...form,
        scheduled_at: new Date(form.scheduled_at).toISOString(),
        duration_minutes: Number(form.duration_minutes),
      });
      toast.success("Live class scheduled!");
      setOpen(false);
      setForm({ title: "", course_id: "", scheduled_at: "", duration_minutes: 60, description: "", provider: "zoom", meeting_url: "" });
      loadData();
    } catch (e2) {
      toast.error(formatApiErrorDetail(e2.response?.data?.detail) || "Failed");
    } finally { setCreating(false); }
  };

  return (
    <div className="pt-28 pb-24" data-testid="teacher-dashboard">
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="font-mono text-[11px] tracking-[0.3em] text-primary uppercase">// Teacher Console</div>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold mt-2 leading-tight">
            Good day, {user?.name?.split(" ")[0]} 🎓
          </h1>
          <p className="text-foreground/65 mt-2">Manage live classes, assignments and your students.</p>
        </motion.div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Tile icon={Video} value={live.length} label="Live classes" />
          <Tile icon={BookOpen} value={courses.length} label="Courses" />
          <Tile icon={Users} value="142" label="Students" />
          <Tile icon={Sparkles} value="4.9" label="Avg rating" />
        </div>

        {/* Course management quick-grid */}
        <div className="mt-8 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-mono text-[11px] tracking-widest text-primary uppercase">// Course content</div>
              <h2 className="font-display text-xl font-bold mt-1">Manage lessons, assignments & mock tests</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {courses.slice(0, 9).map((c) => (
              <button
                key={c.id}
                onClick={() => setManageCourse(c)}
                data-testid="manage-course-btn"
                className="text-left p-3 rounded-xl border border-white/10 hover:border-primary/40 hover:bg-white/5 transition-colors flex items-center gap-3 group"
              >
                <img src={c.cover} alt="" className="h-12 w-16 rounded-md object-cover flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm truncate group-hover:text-primary">{c.title}</div>
                  <div className="text-[10px] text-foreground/50 mt-1 font-mono tracking-widest uppercase">{c.category}</div>
                </div>
                <Settings2 className="h-4 w-4 text-foreground/40 group-hover:text-primary" />
              </button>
            ))}
          </div>
        </div>


        <div className="mt-8 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono text-[11px] tracking-widest text-primary uppercase">// Live Classes</div>
                <h2 className="font-display text-xl font-bold mt-1">Your schedule</h2>
              </div>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="btn-neon" data-testid="schedule-live-btn">
                    <Plus className="h-4 w-4 mr-2" /> Schedule
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-white/10">
                  <DialogHeader><DialogTitle className="font-display">Schedule a live class</DialogTitle></DialogHeader>
                  <form onSubmit={createLive} className="space-y-4 mt-2">
                    <div>
                      <Label>Title</Label>
                      <Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="mt-2 bg-white/5 border-white/10" data-testid="live-title" />
                    </div>
                    <div>
                      <Label>Course</Label>
                      <Select value={form.course_id} onValueChange={(v) => setForm({ ...form, course_id: v })}>
                        <SelectTrigger className="mt-2 bg-white/5 border-white/10" data-testid="live-course-select">
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-white/10 max-h-72">
                          {courses.map((c) => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Date & time</Label>
                        <Input required type="datetime-local" value={form.scheduled_at}
                          onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })}
                          className="mt-2 bg-white/5 border-white/10" data-testid="live-time" />
                      </div>
                      <div>
                        <Label>Duration (min)</Label>
                        <Input type="number" min={15} step={15} value={form.duration_minutes}
                          onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })}
                          className="mt-2 bg-white/5 border-white/10" />
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea rows={3} value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="mt-2 bg-white/5 border-white/10" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Provider</Label>
                        <Select value={form.provider} onValueChange={(v) => setForm({ ...form, provider: v })}>
                          <SelectTrigger className="mt-2 bg-white/5 border-white/10" data-testid="live-provider-select">
                            <SelectValue placeholder="Choose" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-white/10">
                            <SelectItem value="zoom">Zoom (auto-create)</SelectItem>
                            <SelectItem value="meet">Google Meet</SelectItem>
                            <SelectItem value="custom">Custom link</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Custom URL (optional)</Label>
                        <Input value={form.meeting_url}
                          onChange={(e) => setForm({ ...form, meeting_url: e.target.value })}
                          placeholder="paste your meet/zoom link"
                          className="mt-2 bg-white/5 border-white/10" />
                      </div>
                    </div>
                    <p className="text-[11px] text-foreground/55">
                      Tip: Zoom uses your Server-to-Server OAuth keys from <code>backend/.env</code>.
                      Until real keys are added, a placeholder URL is generated.
                    </p>
                    <Button type="submit" disabled={creating} className="btn-neon w-full" data-testid="live-submit">
                      {creating ? "Creating…" : "Schedule class"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="mt-5 space-y-3">
              {live.length === 0 ? (
                <div className="text-sm text-foreground/60 py-6 text-center">No live classes yet. Schedule your first one!</div>
              ) : live.map((l) => (
                <div key={l.id} className="flex items-center gap-4 p-3 rounded-xl border border-white/10" data-testid="teacher-live-row">
                  <div className="h-12 w-12 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-bold truncate">{l.title}</div>
                    <div className="text-xs text-foreground/60">
                      {new Date(l.scheduled_at).toLocaleString()} • {l.duration_minutes} min
                    </div>
                  </div>
                  <Button asChild size="sm" variant="outline" className="border-white/15">
                    <a href={l.meeting_url} target="_blank" rel="noopener noreferrer">Open link</a>
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono text-[11px] tracking-widest text-primary uppercase">// Journal</div>
                <h2 className="font-display text-xl font-bold mt-1">Publish a post</h2>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="btn-neon" data-testid="teacher-new-blog">
                    <PenSquare className="h-4 w-4 mr-1" /> Write
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-white/10 max-w-xl">
                  <DialogHeader><DialogTitle className="font-display">New blog post</DialogTitle></DialogHeader>
                  <BlogForm onCreated={() => toast.success("Post visible on the Blog page")} />
                </DialogContent>
              </Dialog>
            </div>
            <p className="mt-4 text-sm text-foreground/65">
              Share tutorials, lab dispatches or essays. Your posts appear on the homepage and Blog page.
            </p>
            <div className="font-mono text-[11px] tracking-widest text-primary uppercase mt-6 mb-1">// AI Tools</div>
            <ul className="space-y-2.5 text-sm">
              {["Generate quiz questions", "Plan a 4-week lesson", "Evaluate student code", "Create study notes"].map((x) => (
                <li key={x} className="flex items-start gap-3 text-foreground/85">
                  <Sparkles className="h-4 w-4 text-secondary mt-0.5" /> {x}
                </li>
              ))}
            </ul>
            <Button className="btn-neon w-full mt-5"
              onClick={() => document.querySelector('[data-testid="ai-tutor-toggle"]')?.click()}>
              Open NOVA
            </Button>
          </div>
        </div>
      </div>
      <CourseManager open={!!manageCourse} onOpenChange={(v) => !v && setManageCourse(null)} course={manageCourse} />
    </div>
  );
}

function Tile({ icon: Icon, value, label }) {
  return (
    <div className="glass rounded-2xl p-4 md:p-5">
      <div className="h-9 w-9 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="font-display text-2xl md:text-3xl font-extrabold mt-3">{value}</div>
      <div className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
