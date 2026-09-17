import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  PlayCircle, CheckCircle2, BookOpen, FileText, ListChecks, Award,
  ArrowLeft, Loader2, ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import api, { formatApiErrorDetail } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

/** Embed-friendly url. Supports raw YouTube watch URLs, /embed URLs and mp4. */
function embedUrl(url) {
  if (!url) return "";
  if (url.includes("youtube.com/embed")) return url;
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (m) return `https://www.youtube.com/embed/${m[1]}`;
  return url;
}

export default function CourseLearning() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Memoized reload function – avoids recreation on every render
  const reload = useCallback(async () => {
    try {
      const [c, l, a, q, p] = await Promise.all([
        api.get(`/courses/${courseId}`),
        api.get(`/courses/${courseId}/lessons`),
        api.get(`/courses/${courseId}/assignments`),
        api.get(`/courses/${courseId}/quizzes`),
        api.get(`/courses/${courseId}/progress`),
      ]);
      setCourse(c.data);
      setLessons(l.data);
      setAssignments(a.data);
      setQuizzes(q.data);
      setCompleted(p.data.completed_lesson_ids || []);
      if (!activeLesson && l.data.length) setActiveLesson(l.data[0]);
    } catch (e) {
      if (e.response?.status === 403) {
        toast.error("Enroll in this course to access learning content.");
        navigate(`/courses/${courseId}`, { replace: true });
      } else {
        toast.error(formatApiErrorDetail(e.response?.data?.detail) || "Failed to load");
      }
    } finally {
      setLoading(false);
    }
  }, [courseId, navigate, activeLesson]);

  // ✅ Effect now includes `reload` as a dependency – no more warning
  useEffect(() => {
    reload();
  }, [reload]);

  const modules = useMemo(() => {
    const map = new Map();
    for (const l of lessons) {
      if (!map.has(l.module_no)) map.set(l.module_no, []);
      map.get(l.module_no).push(l);
    }
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
  }, [lessons]);

  const totalDone = completed.length;
  const totalLessons = lessons.length;
  const progressPct = totalLessons ? Math.round((totalDone / totalLessons) * 100) : 0;

  const markComplete = async (lesson) => {
    try {
      await api.post(`/lessons/${lesson.id}/complete`);
      setCompleted((c) => (c.includes(lesson.id) ? c : [...c, lesson.id]));
      toast.success("Lesson complete — +10 XP");
    } catch (e) {
      toast.error(formatApiErrorDetail(e.response?.data?.detail) || "Failed");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-primary font-mono">
        LOADING COURSE…
      </div>
    );
  if (!course)
    return (
      <div className="min-h-screen flex items-center justify-center text-foreground/60">
        Course not found.
      </div>
    );

  return (
    <div className="pt-24 pb-24" data-testid="course-learning-page">
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
        <Link
          to={`/courses/${courseId}`}
          className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-primary mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Back to course
        </Link>

        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <div className="font-mono text-[11px] tracking-[0.3em] text-primary uppercase">
              // Learning
            </div>
            <h1 className="font-display text-2xl md:text-4xl font-extrabold mt-2 leading-tight">
              {course.title}
            </h1>
          </div>
          <div className="glass rounded-xl p-3 min-w-[220px]">
            <div className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase mb-1.5">
              Your progress
            </div>
            <Progress value={progressPct} className="h-2 bg-white/10" />
            <div className="text-xs text-foreground/70 mt-2">
              {totalDone} / {totalLessons} lessons · {progressPct}%
            </div>
          </div>
        </div>

        <Tabs defaultValue="lessons" className="w-full">
          <TabsList className="bg-white/5 border border-white/10 p-1">
            <TabsTrigger value="lessons" data-testid="tab-lessons">
              <BookOpen className="h-4 w-4 mr-1.5" />
              Lessons
            </TabsTrigger>
            <TabsTrigger value="assignments" data-testid="tab-assignments">
              <FileText className="h-4 w-4 mr-1.5" />
              Assignments
            </TabsTrigger>
            <TabsTrigger value="quizzes" data-testid="tab-quizzes">
              <ListChecks className="h-4 w-4 mr-1.5" />
              Mock Tests
            </TabsTrigger>
          </TabsList>

          {/* LESSONS */}
          <TabsContent value="lessons" className="mt-6">
            <div className="grid lg:grid-cols-12 gap-6">
              <aside className="lg:col-span-4 glass rounded-2xl p-4 max-h-[80vh] overflow-y-auto">
                {modules.length === 0 ? (
                  <div className="text-center text-foreground/60 py-8 text-sm">
                    No lessons uploaded yet.
                  </div>
                ) : (
                  modules.map(([mNo, items]) => (
                    <div key={mNo} className="mb-5 last:mb-0">
                      <div className="font-mono text-[10px] tracking-widest text-primary uppercase mb-2 pl-2">
                        Module {mNo}
                      </div>
                      <div className="space-y-1">
                        {items.map((l) => {
                          const done = completed.includes(l.id);
                          const active = activeLesson?.id === l.id;
                          return (
                            <button
                              key={l.id}
                              onClick={() => setActiveLesson(l)}
                              data-testid="lesson-item"
                              className={`w-full text-left p-3 rounded-xl border transition-colors flex items-start gap-3 ${
                                active
                                  ? "bg-primary/10 border-primary/40"
                                  : "border-white/5 hover:border-white/15 hover:bg-white/5"
                              }`}
                            >
                              <div
                                className={`mt-0.5 h-6 w-6 rounded-md flex items-center justify-center flex-shrink-0 ${
                                  done
                                    ? "bg-secondary/20 text-secondary"
                                    : "bg-white/10 text-foreground/60"
                                }`}
                              >
                                {done ? (
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                ) : (
                                  <PlayCircle className="h-3.5 w-3.5" />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="font-medium text-sm leading-snug line-clamp-2">
                                  {l.title}
                                </div>
                                <div className="text-[10px] text-foreground/50 mt-1 font-mono tracking-widest">
                                  {l.duration_minutes} MIN
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </aside>

              <main className="lg:col-span-8">
                {activeLesson ? (
                  <motion.div
                    key={activeLesson.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div
                      className="rounded-2xl overflow-hidden border border-white/10 bg-black aspect-video"
                      data-testid="lesson-video"
                    >
                      <iframe
                        title={activeLesson.title}
                        src={embedUrl(activeLesson.video_url)}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <div className="mt-5 flex items-start justify-between gap-4">
                      <div>
                        <div className="font-mono text-[10px] tracking-widest text-primary uppercase">
                          Module {activeLesson.module_no} · Lesson {activeLesson.lesson_no}
                        </div>
                        <h2 className="font-display text-2xl font-bold mt-1">
                          {activeLesson.title}
                        </h2>
                        {activeLesson.description && (
                          <p className="mt-3 text-foreground/70 leading-relaxed">
                            {activeLesson.description}
                          </p>
                        )}
                      </div>
                      <Button
                        onClick={() => markComplete(activeLesson)}
                        disabled={completed.includes(activeLesson.id)}
                        className="btn-neon h-11 px-5 rounded-xl flex-shrink-0"
                        data-testid="mark-complete-btn"
                      >
                        {completed.includes(activeLesson.id) ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-2" /> Completed
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-2" /> Mark complete
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="glass rounded-2xl p-10 text-center text-foreground/60">
                    Pick a lesson from the sidebar to begin.
                  </div>
                )}
              </main>
            </div>
          </TabsContent>

          {/* ASSIGNMENTS */}
          <TabsContent value="assignments" className="mt-6">
            <Assignments
              items={assignments}
              courseId={courseId}
              canManage={["teacher", "admin"].includes(user?.role)}
              onChange={reload}
            />
          </TabsContent>

          {/* QUIZZES */}
          <TabsContent value="quizzes" className="mt-6">
            <Quizzes
              items={quizzes}
              courseId={courseId}
              canManage={["teacher", "admin"].includes(user?.role)}
              onChange={reload}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

/* ─────────────── Assignments tab ─────────────── */
function Assignments({ items, courseId, canManage, onChange }) {
  const [mySubs, setMySubs] = useState([]);
  useEffect(() => {
    api
      .get("/submissions/me")
      .then((r) => setMySubs(r.data))
      .catch(() => {});
  }, [courseId]);

  if (items.length === 0) {
    return (
      <div className="glass rounded-2xl p-10 text-center text-foreground/60">
        No assignments yet.
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {items.map((a) => {
        const sub = mySubs.find((s) => s.assignment_id === a.id);
        return (
          <div key={a.id} className="glass rounded-2xl p-6" data-testid="assignment-card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-mono text-[10px] tracking-widest text-primary uppercase">
                  Assignment
                </div>
                <h3 className="font-display text-xl font-bold mt-1">{a.title}</h3>
                <p className="mt-2 text-sm text-foreground/75 leading-relaxed">
                  {a.description}
                </p>
              </div>
              <Badge variant="outline" className="border-secondary/40 text-secondary">
                {a.max_marks} pts
              </Badge>
            </div>

            <div className="mt-5">
              {sub ? (
                <div className="rounded-xl border border-white/10 p-4 bg-white/[0.02]">
                  <div className="flex items-center gap-2 text-sm text-foreground/80">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Submitted on {new Date(sub.submitted_at).toLocaleString()}
                  </div>
                  {sub.grade != null ? (
                    <div className="mt-3">
                      <div className="font-display text-2xl font-extrabold cyan-gold-text">
                        {sub.grade} / {a.max_marks}
                      </div>
                      {sub.feedback && (
                        <div className="text-sm text-foreground/70 mt-1">"{sub.feedback}"</div>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-foreground/50 mt-2 font-mono tracking-widest uppercase">
                      Awaiting grading
                    </div>
                  )}
                </div>
              ) : (
                <SubmissionForm
                  assignmentId={a.id}
                  onSubmitted={() =>
                    api.get("/submissions/me").then((r) => setMySubs(r.data))
                  }
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SubmissionForm({ assignmentId, onSubmitted }) {
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (content.trim().length < 2) {
      toast.error("Add your answer or a link first");
      return;
    }
    setBusy(true);
    try {
      await api.post("/submissions", { assignment_id: assignmentId, content });
      toast.success("Submitted!");
      setContent("");
      onSubmitted?.();
    } catch (e2) {
      toast.error(formatApiErrorDetail(e2.response?.data?.detail) || "Failed");
    } finally {
      setBusy(false);
    }
  };
  return (
    <form onSubmit={submit} className="space-y-3" data-testid="submission-form">
      <Textarea
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Paste your answer here, or a GitHub / Google Drive link to your solution…"
        className="bg-white/5 border-white/10 font-mono text-sm"
        data-testid="submission-content"
      />
      <Button type="submit" disabled={busy} className="btn-neon" data-testid="submission-submit">
        {busy ? "Submitting…" : "Submit"}
      </Button>
    </form>
  );
}

/* ─────────────── Quizzes tab ─────────────── */
function Quizzes({ items, courseId, canManage, onChange }) {
  const [active, setActive] = useState(null);
  if (items.length === 0) {
    return (
      <div className="glass rounded-2xl p-10 text-center text-foreground/60">
        No mock tests yet.
      </div>
    );
  }
  if (active) {
    return (
      <QuizPlayer
        quiz={active}
        onExit={() => {
          setActive(null);
          onChange?.();
        }}
      />
    );
  }
  return (
    <div className="grid md:grid-cols-2 gap-5">
      {items.map((q) => (
        <div key={q.id} className="glass rounded-2xl p-6" data-testid="quiz-card">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-mono text-[10px] tracking-widest text-primary uppercase">
                Mock Test {q.is_final && "· Final"}
              </div>
              <h3 className="font-display text-xl font-bold mt-1">{q.title}</h3>
              <div className="text-sm text-foreground/65 mt-2">
                {q.questions.length} questions · Passing {q.passing_score}%
              </div>
            </div>
            {q.is_final && (
              <Badge className="bg-secondary/20 text-secondary border-secondary/40 border">
                Final
              </Badge>
            )}
          </div>
          <Button
            onClick={() => setActive(q)}
            className="btn-neon mt-5 w-full"
            data-testid="start-quiz-btn"
          >
            Start mock test
          </Button>
        </div>
      ))}
    </div>
  );
}

function QuizPlayer({ quiz, onExit }) {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState(Array(quiz.questions.length).fill(-1));
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const submit = async () => {
    if (answers.some((a) => a < 0)) {
      toast.error("Answer every question first");
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await api.post(`/quizzes/${quiz.id}/attempt`, { answers });
      setResult(data);
      if (data.passed) toast.success(`Passed! ${data.score_pct}% · +100 XP`);
      else toast.warning(`Score: ${data.score_pct}% — try again to pass`);
      if (data.certificate) toast.success(`Certificate issued! ID: ${data.certificate.id}`);
    } catch (e) {
      toast.error(formatApiErrorDetail(e.response?.data?.detail));
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div
        className="glass rounded-2xl p-6 md:p-10 text-center max-w-3xl mx-auto"
        data-testid="quiz-result"
      >
        <div
          className={`inline-flex items-center justify-center h-20 w-20 rounded-full mb-4 ${
            result.passed
              ? "bg-primary/15 border border-primary/40"
              : "bg-destructive/15 border border-destructive/40"
          }`}
        >
          {result.passed ? (
            <Award className="h-10 w-10 text-primary" />
          ) : (
            <ListChecks className="h-10 w-10 text-destructive" />
          )}
        </div>
        <h2 className="font-display text-3xl font-extrabold">
          {result.passed ? "You passed! 🎉" : "Not yet — keep going!"}
        </h2>
        <div className="font-cyber text-5xl md:text-6xl font-extrabold cyan-gold-text mt-4">
          {result.score_pct}%
        </div>
        <div className="font-mono text-sm text-foreground/60 mt-2 tracking-widest uppercase">
          {result.score} of {result.total} correct
        </div>
        {result.certificate && (
          <Button
            className="btn-neon mt-6"
            onClick={() => navigate(`/certificate/${result.certificate.id}`)}
            data-testid="view-cert-btn"
          >
            <Award className="h-4 w-4 mr-2" /> View certificate
          </Button>
        )}
        <div className="mt-6 text-left space-y-3">
          {result.review.map((r, i) => {
            const ok = r.your_answer === r.correct;
            return (
              <div
                key={i}
                className={`rounded-xl border p-4 ${
                  ok
                    ? "border-primary/30 bg-primary/[0.04]"
                    : "border-destructive/30 bg-destructive/[0.04]"
                }`}
              >
                <div className="font-medium text-sm">
                  Q{i + 1}. {r.q}
                </div>
                <div className="text-xs mt-2 font-mono">
                  Your answer:{" "}
                  <span className={ok ? "text-primary" : "text-destructive"}>
                    {r.options[r.your_answer]}
                  </span>
                  {!ok && (
                    <>
                      {" "}
                      · Correct:{" "}
                      <span className="text-primary">{r.options[r.correct]}</span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <Button onClick={onExit} variant="outline" className="border-white/15 mt-6">
          Back to mock tests
        </Button>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 md:p-8 max-w-3xl mx-auto" data-testid="quiz-player">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold">{quiz.title}</h2>
        <Button onClick={onExit} variant="outline" size="sm" className="border-white/15">
          Exit
        </Button>
      </div>
      <div className="space-y-6">
        {quiz.questions.map((q, i) => (
          <div key={i} className="border-b border-white/10 pb-5 last:border-b-0">
            <div className="font-medium">
              Q{i + 1}. {q.q}
            </div>
            <div className="mt-3 grid gap-2">
              {q.options.map((opt, j) => (
                <label
                  key={j}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors text-sm ${
                    answers[i] === j
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-white/10 hover:border-white/25"
                  }`}
                >
                  <input
                    type="radio"
                    name={`q-${i}`}
                    className="accent-primary"
                    checked={answers[i] === j}
                    onChange={() =>
                      setAnswers((a) => a.map((v, idx) => (idx === i ? j : v)))
                    }
                    data-testid={`q-${i}-opt-${j}`}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Button
        onClick={submit}
        disabled={submitting}
        className="btn-neon mt-8 w-full h-12 rounded-xl"
        data-testid="submit-quiz-btn"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting…
          </>
        ) : (
          "Submit mock test"
        )}
      </Button>
    </div>
  );
}