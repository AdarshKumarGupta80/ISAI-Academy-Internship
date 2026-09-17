import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen, Flame, Trophy, Sparkles, PlayCircle, Calendar, Award, Target,
  ArrowRight, Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [enrolls, setEnrolls] = useState([]);
  const [live, setLive] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [certs, setCerts] = useState([]);
  const [game, setGame] = useState({ xp: 0, streak_days: 0, longest_streak: 0, badges: [], earned_count: 0 });

  useEffect(() => {
    api.get("/enrollments/me").then((r) => setEnrolls(r.data)).catch(() => {});
    api.get("/live-classes").then((r) => setLive(r.data.slice(0, 3))).catch(() => {});
    api.get("/leaderboard").then((r) => setLeaderboard(r.data)).catch(() => {});
    api.get("/certificates/me").then((r) => setCerts(r.data)).catch(() => {});
    api.get("/gamification/me").then((r) => setGame(r.data)).catch(() => {});
  }, []);

  return (
    <div className="pt-28 pb-24" data-testid="student-dashboard">
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="font-mono text-[11px] tracking-[0.3em] text-primary uppercase">// Student Console</div>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold mt-2 leading-tight">
            Hi, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-foreground/65 mt-2">Let's keep the streak alive. Pick up where you left off.</p>
        </motion.div>

        {/* Top stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatTile icon={Trophy} label="XP earned" value={game.xp || user?.xp || 0} accent="primary" testId="stat-xp" />
          <StatTile icon={Flame} label="Day streak" value={game.streak_days || 0} accent="secondary" testId="stat-streak" />
          <StatTile icon={BookOpen} label="Courses" value={enrolls.length} accent="primary" testId="stat-courses" />
          <StatTile icon={Award} label="Badges" value={game.earned_count || 0} accent="secondary" testId="stat-badges" />
        </div>

        <div className="mt-10 grid lg:grid-cols-3 gap-6">
          {/* My courses */}
          <div className="lg:col-span-2 glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="font-mono text-[11px] tracking-widest text-primary uppercase">// My Courses</div>
                <h2 className="font-display text-xl font-bold mt-1">Continue learning</h2>
              </div>
              <Button asChild variant="ghost" className="text-primary"><Link to="/courses">Browse more</Link></Button>
            </div>
            {enrolls.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-foreground/60 text-sm">You haven't enrolled yet.</p>
                <Button asChild className="btn-neon mt-4"><Link to="/courses">Find your first course <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
              </div>
            ) : (
              <div className="space-y-3">
                {enrolls.map((e) => (
                  <div key={e.id} className="flex items-center gap-4 p-3 rounded-xl border border-white/10 hover:border-primary/40 transition-colors" data-testid="enrolled-course">
                    <img src={e.course.cover} alt="" className="h-16 w-24 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-bold truncate">{e.course.title}</div>
                      <div className="mt-1.5 flex items-center gap-3">
                        <Progress value={e.progress} className="h-1.5 flex-1 bg-white/10" />
                        <span className="font-mono text-xs text-primary">{e.progress}%</span>
                      </div>
                    </div>
                    <Button asChild size="sm" variant="outline" className="border-white/15">
                      <Link to={`/learn/${e.course.id}`}><PlayCircle className="h-4 w-4 mr-1" />Resume</Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Tutor card */}
          <div className="glass rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary/30 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Bot className="h-5 w-5 text-black" />
                </div>
                <div>
                  <div className="font-display font-bold">NOVA AI Tutor</div>
                  <div className="font-mono text-[10px] tracking-widest text-primary uppercase">Claude Sonnet 4.5</div>
                </div>
              </div>
              <p className="mt-4 text-sm text-foreground/75">
                Stuck on a problem? Ask NOVA anything — from "what is recursion" to "explain transformers".
                Available 24×7.
              </p>
              <Button className="btn-neon mt-5 w-full" onClick={() => document.querySelector('[data-testid="ai-tutor-toggle"]')?.click()}>
                <Sparkles className="mr-2 h-4 w-4" /> Open NOVA
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid lg:grid-cols-3 gap-6">
          {/* Upcoming live */}
          <div className="lg:col-span-2 glass rounded-2xl p-6">
            <div className="font-mono text-[11px] tracking-widest text-primary uppercase">// Live Schedule</div>
            <h2 className="font-display text-xl font-bold mt-1">Upcoming live classes</h2>
            <div className="mt-5 space-y-3">
              {live.length === 0 ? (
                <div className="text-sm text-foreground/60">No live classes scheduled. Check back later.</div>
              ) : live.map((l) => (
                <div key={l.id} className="flex items-center gap-4 p-3 rounded-xl border border-white/10" data-testid="live-class-row">
                  <div className="h-12 w-12 rounded-lg bg-secondary/15 border border-secondary/30 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-bold truncate">{l.title}</div>
                    <div className="text-xs text-foreground/60">{new Date(l.scheduled_at).toLocaleString()} • {l.duration_minutes} min</div>
                  </div>
                  <Button asChild size="sm" className="btn-neon">
                    <a href={l.meeting_url} target="_blank" rel="noopener noreferrer">Join</a>
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Badges */}
          <div className="glass rounded-2xl p-6">
            <div className="font-mono text-[11px] tracking-widest text-primary uppercase">// Achievements</div>
            <h2 className="font-display text-xl font-bold mt-1">Badges</h2>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {game.badges.map((b) => (
                <div key={b.key} title={b.desc}
                  className={`aspect-square rounded-xl border flex flex-col items-center justify-center text-center p-2 text-[10px] font-mono uppercase tracking-wider ${
                    b.earned
                      ? "border-secondary/40 bg-secondary/10 text-secondary"
                      : "border-white/10 text-foreground/30"
                  }`}
                  data-testid={`badge-${b.earned ? "earned" : "locked"}`}
                >
                  <Target className="h-4 w-4 mb-1" />
                  {b.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="mt-8 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass rounded-2xl p-6">
            <div className="font-mono text-[11px] tracking-widest text-primary uppercase">// Top Learners</div>
            <h2 className="font-display text-xl font-bold mt-1">Global leaderboard</h2>
            <div className="mt-5 divide-y divide-white/5">
              {leaderboard.length === 0 ? (
                <div className="text-sm text-foreground/60 py-4">Be the first on the board — earn XP by enrolling and completing lessons.</div>
              ) : leaderboard.map((u, i) => (
                <div key={u.id} className="flex items-center gap-4 py-3" data-testid="leaderboard-row">
                  <div className={`h-8 w-8 rounded-md flex items-center justify-center font-mono text-xs font-bold ${
                    i === 0 ? "bg-secondary text-black" : i === 1 ? "bg-primary/30 text-primary" : "bg-white/5 text-foreground/70"
                  }`}>
                    {(i + 1).toString().padStart(2, "0")}
                  </div>
                  <div className="flex-1 font-display font-bold">{u.name}</div>
                  <div className="font-mono text-primary text-sm">{u.xp} XP</div>
                </div>
              ))}
            </div>
          </div>

          {/* Certificates */}
          <div className="glass rounded-2xl p-6" data-testid="certificates-section">
            <div className="font-mono text-[11px] tracking-widest text-primary uppercase">// Certificates</div>
            <h2 className="font-display text-xl font-bold mt-1">My credentials</h2>
            {certs.length === 0 ? (
              <p className="mt-4 text-sm text-foreground/65">
                Pass the final mock test of any course to earn a verifiable certificate.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {certs.map((c) => (
                  <Link key={c.id} to={`/certificate/${c.id}`}
                    className="block p-3 rounded-xl border border-secondary/30 bg-secondary/[0.04] hover:bg-secondary/10 transition-colors"
                    data-testid="cert-card"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-secondary/20 border border-secondary/40 flex items-center justify-center flex-shrink-0">
                        <Award className="h-5 w-5 text-secondary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-display font-bold truncate text-sm">{c.course_title}</div>
                        <div className="font-mono text-[10px] tracking-widest text-foreground/55 uppercase mt-0.5">
                          {c.id} · {new Date(c.issued_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatTile({ icon: Icon, label, value, accent, testId }) {
  return (
    <div className="glass rounded-2xl p-4 md:p-5" data-testid={testId}>
      <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${accent === "primary" ? "bg-primary/15 text-primary" : "bg-secondary/15 text-secondary"}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="font-display text-2xl md:text-3xl font-extrabold mt-3">{value}</div>
      <div className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
