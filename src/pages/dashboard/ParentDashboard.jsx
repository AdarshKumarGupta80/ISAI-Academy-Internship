import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Plus, Flame, BookOpen, Trophy, Trash2, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import api, { formatApiErrorDetail } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function ParentDashboard() {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [email, setEmail] = useState("");
  const [linking, setLinking] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchChildren = async () => {
    try {
      const { data } = await api.get("/parent/children");
      setChildren(data);
    } catch (e) {
      toast.error("Failed to load children");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchChildren(); }, []);

  const handleLink = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLinking(true);
    try {
      const { data } = await api.post("/parent/link-child", { child_email: email.trim() });
      if (data.already_linked) toast.info("Already linked to that student.");
      else toast.success("Child linked successfully!");
      setEmail("");
      fetchChildren();
    } catch (e) {
      toast.error(formatApiErrorDetail(e.response?.data?.detail) || "Failed to link child");
    } finally { setLinking(false); }
  };

  const handleUnlink = async (childId) => {
    if (!window.confirm("Unlink this student?")) return;
    try {
      await api.delete(`/parent/unlink/${childId}`);
      toast.success("Unlinked.");
      fetchChildren();
    } catch (e) {
      toast.error("Failed to unlink");
    }
  };

  return (
    <div className="pt-28 pb-24" data-testid="parent-dashboard">
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="font-mono text-[11px] tracking-[0.3em] text-primary uppercase">// Parent Console</div>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold mt-2 leading-tight">
            Hi, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-foreground/65 mt-2">Track your child's learning journey — courses, attendance & XP.</p>
        </motion.div>

        {/* Link child card */}
        <div className="mt-8 glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Link2 className="h-5 w-5 text-primary" />
            <div className="font-display text-lg font-bold">Link a student</div>
          </div>
          <form onSubmit={handleLink} className="flex flex-col sm:flex-row gap-3" data-testid="link-child-form">
            <Input
              type="email"
              placeholder="Student's registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/5 border-white/15 h-11 flex-1"
              data-testid="child-email-input"
            />
            <Button type="submit" disabled={linking} className="btn-neon h-11" data-testid="link-child-btn">
              <Plus className="h-4 w-4 mr-1.5" /> {linking ? "Linking…" : "Link child"}
            </Button>
          </form>
          <p className="text-xs text-foreground/55 mt-3">
            The student must already have an ISAI Academy account. Use their registered email.
          </p>
        </div>

        {/* Children list */}
        <div className="mt-10">
          <div className="flex items-center gap-2 mb-5">
            <Users className="h-5 w-5 text-secondary" />
            <h2 className="font-display text-xl font-bold">Linked students</h2>
          </div>

          {loading ? (
            <div className="text-foreground/60 text-sm">Loading…</div>
          ) : children.length === 0 ? (
            <div className="glass rounded-2xl p-10 text-center">
              <p className="text-foreground/65">No students linked yet. Use the form above to connect with your child's account.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {children.map((c) => (
                <motion.div key={c.child.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  className="glass-strong rounded-2xl p-6" data-testid="child-card">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-display text-lg font-bold">{c.child.name}</div>
                      <div className="font-mono text-[10px] tracking-widest text-foreground/55 uppercase mt-0.5">
                        {c.child.email}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleUnlink(c.child.id)}
                      className="text-foreground/40 hover:text-red-400" data-testid="unlink-btn">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-5">
                    <Stat icon={Trophy} label="XP" value={c.child.xp ?? 0} accent="primary" />
                    <Stat icon={Flame} label="Streak" value={`${c.streak_days}d`} accent="secondary" />
                    <Stat icon={BookOpen} label="Lessons" value={c.lessons_completed} accent="primary" />
                  </div>

                  <div className="mt-5">
                    <div className="font-mono text-[10px] tracking-widest text-foreground/55 uppercase">// Courses</div>
                    {c.enrollments.length === 0 ? (
                      <p className="text-sm text-foreground/55 mt-2">Not enrolled in any course yet.</p>
                    ) : (
                      <div className="mt-3 space-y-2.5">
                        {c.enrollments.slice(0, 4).map((e) => (
                          <div key={e.id} className="text-sm">
                            <div className="flex items-center justify-between gap-2">
                              <span className="truncate font-medium">{e.course?.title || "Course"}</span>
                              <span className="font-mono text-xs text-primary">{e.progress}%</span>
                            </div>
                            <Progress value={e.progress} className="h-1.5 mt-1.5 bg-white/10" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, accent }) {
  return (
    <div className="rounded-xl border border-white/10 p-3 text-center">
      <Icon className={`h-4 w-4 mx-auto ${accent === "primary" ? "text-primary" : "text-secondary"}`} />
      <div className="font-display text-xl font-extrabold mt-1.5">{value}</div>
      <div className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}
