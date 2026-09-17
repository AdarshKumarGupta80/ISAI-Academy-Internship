import React, { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, BookOpen, FileText, ListChecks, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import api, { formatApiErrorDetail } from "@/lib/api";

/**
 * Modal that lets a teacher / admin manage Lessons, Assignments and Quizzes
 * for a single course. Opens from a "Manage" button on the teacher dashboard.
 */
export default function CourseManager({ open, onOpenChange, course }) {
  const [lessons, setLessons] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  // ✅ Memoized refresh function – avoids recreation on every render
  const refresh = useCallback(async () => {
    if (!course?.id) return;
    const [l, a, q] = await Promise.all([
      api.get(`/courses/${course.id}/lessons`),
      api.get(`/courses/${course.id}/assignments`),
      api.get(`/courses/${course.id}/quizzes`),
    ]);
    setLessons(l.data);
    setAssignments(a.data);
    setQuizzes(q.data);
  }, [course?.id]);

  // ✅ Effect now includes `refresh` as a dependency – no more warning
  useEffect(() => {
    if (open) refresh();
  }, [open, course?.id, refresh]);

  if (!course) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-white/10 max-w-3xl max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">Manage: {course.title}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="lessons" className="mt-3">
          <TabsList className="bg-white/5 border border-white/10 p-1">
            <TabsTrigger value="lessons">
              <BookOpen className="h-4 w-4 mr-1.5" />Lessons
            </TabsTrigger>
            <TabsTrigger value="assignments">
              <FileText className="h-4 w-4 mr-1.5" />Assignments
            </TabsTrigger>
            <TabsTrigger value="quizzes">
              <ListChecks className="h-4 w-4 mr-1.5" />Mock Tests
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lessons" className="mt-5">
            <LessonForm courseId={course.id} onCreated={refresh} />
            <div className="mt-5 space-y-2">
              {lessons.map((l) => (
                <div key={l.id} className="flex items-center gap-3 p-3 rounded-xl border border-white/10" data-testid="mgr-lesson-row">
                  <div className="font-mono text-[10px] tracking-widest text-primary">M{l.module_no}·L{l.lesson_no}</div>
                  <div className="flex-1 min-w-0 truncate">{l.title}</div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/10 hover:border-destructive hover:text-destructive"
                    onClick={async () => {
                      if (!window.confirm("Delete lesson?")) return;
                      await api.delete(`/lessons/${l.id}`);
                      toast.success("Deleted");
                      refresh();
                    }}
                    data-testid="mgr-delete-lesson"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {lessons.length === 0 && (
                <div className="text-sm text-foreground/55 text-center py-4">No lessons yet.</div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="assignments" className="mt-5">
            <AssignmentForm courseId={course.id} onCreated={refresh} />
            <div className="mt-5 space-y-2">
              {assignments.map((a) => (
                <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl border border-white/10" data-testid="mgr-assignment-row">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{a.title}</div>
                    <div className="text-xs text-foreground/55 mt-0.5">{a.max_marks} pts</div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/10 hover:border-destructive hover:text-destructive"
                    onClick={async () => {
                      if (!window.confirm("Delete assignment?")) return;
                      await api.delete(`/assignments/${a.id}`);
                      toast.success("Deleted");
                      refresh();
                    }}
                    data-testid="mgr-delete-assignment"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {assignments.length === 0 && (
                <div className="text-sm text-foreground/55 text-center py-4">No assignments yet.</div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="quizzes" className="mt-5">
            <QuizForm courseId={course.id} onCreated={refresh} />
            <div className="mt-5 space-y-2">
              {quizzes.map((q) => (
                <div key={q.id} className="flex items-center gap-3 p-3 rounded-xl border border-white/10" data-testid="mgr-quiz-row">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {q.title} {q.is_final && <span className="text-secondary text-xs font-mono ml-2">FINAL</span>}
                    </div>
                    <div className="text-xs text-foreground/55 mt-0.5">
                      {q.questions.length} questions · pass {q.passing_score}%
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/10 hover:border-destructive hover:text-destructive"
                    onClick={async () => {
                      if (!window.confirm("Delete quiz?")) return;
                      await api.delete(`/quizzes/${q.id}`);
                      toast.success("Deleted");
                      refresh();
                    }}
                    data-testid="mgr-delete-quiz"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {quizzes.length === 0 && (
                <div className="text-sm text-foreground/55 text-center py-4">No mock tests yet.</div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function LessonForm({ courseId, onCreated }) {
  const [f, setF] = useState({ module_no: 1, lesson_no: 1, title: "", video_url: "", duration_minutes: 10, description: "" });
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post(`/courses/${courseId}/lessons`, {
        ...f,
        course_id: courseId,
        module_no: Number(f.module_no),
        lesson_no: Number(f.lesson_no),
        duration_minutes: Number(f.duration_minutes),
      });
      toast.success("Lesson added");
      setF({ ...f, title: "", video_url: "", description: "" });
      onCreated?.();
    } catch (e2) {
      toast.error(formatApiErrorDetail(e2.response?.data?.detail));
    } finally {
      setBusy(false);
    }
  };
  return (
    <form onSubmit={submit} className="space-y-3" data-testid="mgr-lesson-form">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Module #</Label>
          <Input type="number" min="1" value={f.module_no} onChange={(e) => setF({ ...f, module_no: e.target.value })} className="mt-1 bg-white/5 border-white/10" />
        </div>
        <div>
          <Label className="text-xs">Lesson #</Label>
          <Input type="number" min="1" value={f.lesson_no} onChange={(e) => setF({ ...f, lesson_no: e.target.value })} className="mt-1 bg-white/5 border-white/10" />
        </div>
      </div>
      <Input required placeholder="Lesson title" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} className="bg-white/5 border-white/10" data-testid="mgr-lesson-title" />
      <Input required placeholder="Video URL — YouTube, Vimeo or mp4" value={f.video_url} onChange={(e) => setF({ ...f, video_url: e.target.value })} className="bg-white/5 border-white/10 font-mono text-sm" data-testid="mgr-lesson-video" />
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Duration (min)</Label>
          <Input type="number" min="1" value={f.duration_minutes} onChange={(e) => setF({ ...f, duration_minutes: e.target.value })} className="mt-1 bg-white/5 border-white/10" />
        </div>
      </div>
      <Textarea placeholder="Optional description" rows={2} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} className="bg-white/5 border-white/10" />
      <Button type="submit" disabled={busy} className="btn-neon w-full" data-testid="mgr-add-lesson">
        <Plus className="h-4 w-4 mr-2" /> {busy ? "Adding…" : "Add lesson"}
      </Button>
    </form>
  );
}

function AssignmentForm({ courseId, onCreated }) {
  const [f, setF] = useState({ title: "", description: "", max_marks: 100 });
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post(`/courses/${courseId}/assignments`, {
        ...f,
        course_id: courseId,
        max_marks: Number(f.max_marks),
      });
      toast.success("Assignment added");
      setF({ title: "", description: "", max_marks: 100 });
      onCreated?.();
    } catch (e2) {
      toast.error(formatApiErrorDetail(e2.response?.data?.detail));
    } finally {
      setBusy(false);
    }
  };
  return (
    <form onSubmit={submit} className="space-y-3" data-testid="mgr-assignment-form">
      <Input required placeholder="Assignment title" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} className="bg-white/5 border-white/10" data-testid="mgr-assignment-title" />
      <Textarea required rows={3} placeholder="Brief & deliverables" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} className="bg-white/5 border-white/10" />
      <div>
        <Label className="text-xs">Max marks</Label>
        <Input type="number" min="1" value={f.max_marks} onChange={(e) => setF({ ...f, max_marks: e.target.value })} className="mt-1 bg-white/5 border-white/10" />
      </div>
      <Button type="submit" disabled={busy} className="btn-neon w-full" data-testid="mgr-add-assignment">
        <Plus className="h-4 w-4 mr-2" /> {busy ? "Adding…" : "Add assignment"}
      </Button>
    </form>
  );
}

function QuizForm({ courseId, onCreated }) {
  const [title, setTitle] = useState("");
  const [passing, setPassing] = useState(60);
  const [isFinal, setIsFinal] = useState(false);
  const [questions, setQuestions] = useState([{ q: "", options: ["", "", "", ""], correct: 0 }]);
  const [busy, setBusy] = useState(false);

  const setQ = (i, patch) => setQuestions((qs) => qs.map((q, idx) => (idx === i ? { ...q, ...patch } : q)));

  const submit = async (e) => {
    e.preventDefault();
    const cleaned = questions.filter((q) => q.q.trim() && q.options.filter((o) => o.trim()).length >= 2);
    if (cleaned.length === 0) {
      toast.error("Add at least one question with 2+ options");
      return;
    }
    setBusy(true);
    try {
      await api.post(`/courses/${courseId}/quizzes`, {
        course_id: courseId,
        title,
        questions: cleaned,
        passing_score: Number(passing),
        is_final: isFinal,
      });
      toast.success("Mock test added");
      setTitle("");
      setPassing(60);
      setIsFinal(false);
      setQuestions([{ q: "", options: ["", "", "", ""], correct: 0 }]);
      onCreated?.();
    } catch (e2) {
      toast.error(formatApiErrorDetail(e2.response?.data?.detail));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3" data-testid="mgr-quiz-form">
      <Input required placeholder="Quiz title" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-white/5 border-white/10" data-testid="mgr-quiz-title" />
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Passing %</Label>
          <Input type="number" min="1" max="100" value={passing} onChange={(e) => setPassing(e.target.value)} className="mt-1 bg-white/5 border-white/10" />
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isFinal} onChange={(e) => setIsFinal(e.target.checked)} className="accent-secondary" />
            Mark as <span className="text-secondary font-mono">FINAL</span> (auto-issues certificate)
          </label>
        </div>
      </div>

      <div className="space-y-3">
        {questions.map((q, i) => (
          <div key={i} className="p-3 rounded-xl border border-white/10 bg-white/[0.02]">
            <div className="flex items-center justify-between mb-2">
              <div className="font-mono text-[10px] tracking-widest text-primary uppercase">Question {i + 1}</div>
              {questions.length > 1 && (
                <button type="button" onClick={() => setQuestions((qs) => qs.filter((_, idx) => idx !== i))} className="text-foreground/40 hover:text-destructive">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Input placeholder="Question" value={q.q} onChange={(e) => setQ(i, { q: e.target.value })} className="bg-white/5 border-white/10 mb-2" />
            <div className="space-y-1.5">
              {q.options.map((opt, j) => (
                <label key={j} className="flex items-center gap-2">
                  <input type="radio" name={`correct-${i}`} checked={q.correct === j} onChange={() => setQ(i, { correct: j })} className="accent-primary" />
                  <Input
                    placeholder={`Option ${j + 1}`}
                    value={opt}
                    onChange={(e) => setQ(i, { options: q.options.map((o, idx) => (idx === j ? e.target.value : o)) })}
                    className="bg-white/5 border-white/10 text-sm"
                  />
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Button type="button" variant="outline" className="w-full border-white/15" onClick={() => setQuestions((qs) => [...qs, { q: "", options: ["", "", "", ""], correct: 0 }])}>
        <Plus className="h-4 w-4 mr-1" /> Add another question
      </Button>

      <Button type="submit" disabled={busy} className="btn-neon w-full" data-testid="mgr-add-quiz">
        {busy ? "Saving…" : "Create mock test"}
      </Button>
    </form>
  );
}