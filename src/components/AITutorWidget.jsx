import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, Sparkles, X, Bot, User as UserIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api, { formatApiErrorDetail } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const SUGGESTIONS = [
  "Suggest a course for a Class 9 student.",
  "Explain how a neural network learns.",
  "Help me debug a Python loop.",
  "What is the difference between AI and ML?",
];

export default function AITutorWidget() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm NOVA, your AI tutor at ISAI Academy. Ask me anything about coding, robotics, AI or which course suits you best." },
  ]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, open]);

  const send = async (msg) => {
    const content = (msg ?? text).trim();
    if (!content || sending) return;
    if (!user) {
      setMessages((m) => [...m, { role: "assistant", content: "Please log in to chat with NOVA — it's free for all enrolled students." }]);
      setText("");
      return;
    }
    setMessages((m) => [...m, { role: "user", content }]);
    setText("");
    setSending(true);
    try {
      const { data } = await api.post("/ai/chat", { message: content, session_id: sessionId });
      setSessionId(data.session_id);
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch (e) {
      setMessages((m) => [...m, {
        role: "assistant",
        content: `⚠️ ${formatApiErrorDetail(e.response?.data?.detail) || "AI service unavailable. Try again shortly."}`
      }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.4, type: "spring", stiffness: 200, damping: 14 }}
        onClick={() => setOpen((v) => !v)}
        data-testid="ai-tutor-toggle"
        className="fixed bottom-6 left-6 md:left-auto md:bottom-6 md:right-24 z-50 h-14 w-14 md:h-16 md:w-16 rounded-full bg-gradient-to-br from-primary to-secondary text-black flex items-center justify-center shadow-neon-cyan animate-pulse-glow"
        aria-label="Open AI Tutor"
      >
        {open ? <X className="h-6 w-6" /> : <Sparkles className="h-6 w-6" strokeWidth={2.5} />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-4 md:right-24 z-50 w-[calc(100vw-2rem)] sm:w-[400px] md:w-[440px] h-[70vh] sm:h-[560px] glass-strong rounded-2xl flex flex-col overflow-hidden shadow-card-elevated"
            data-testid="ai-tutor-panel"
          >
            <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-background/40">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Bot className="h-5 w-5 text-black" />
              </div>
              <div>
                <div className="font-display font-bold leading-tight">NOVA AI Tutor</div>
                <div className="font-mono text-[10px] tracking-[0.2em] text-primary uppercase">Claude Sonnet 4.5 · Online</div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3" data-testid="ai-tutor-messages">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.role === "assistant" && (
                    <div className="h-7 w-7 rounded-md bg-primary/15 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div className={`max-w-[80%] text-sm leading-relaxed px-3 py-2 rounded-xl whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-primary text-black rounded-tr-sm"
                      : "bg-white/5 text-foreground rounded-tl-sm border border-white/10"
                  }`}>
                    {m.content}
                  </div>
                  {m.role === "user" && (
                    <div className="h-7 w-7 rounded-md bg-secondary/15 flex items-center justify-center flex-shrink-0">
                      <UserIcon className="h-4 w-4 text-secondary" />
                    </div>
                  )}
                </div>
              ))}
              {sending && (
                <div className="flex gap-2">
                  <div className="h-7 w-7 rounded-md bg-primary/15 flex items-center justify-center"><Bot className="h-4 w-4 text-primary" /></div>
                  <div className="bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-sm flex items-center gap-2 text-foreground/70">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> NOVA is thinking…
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {messages.length <= 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-[11px] px-2.5 py-1.5 rounded-full border border-white/10 hover:border-primary/50 hover:text-primary transition-colors text-foreground/70"
                    data-testid="ai-tutor-suggestion"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => { e.preventDefault(); send(); }}
              className="p-3 border-t border-white/10 flex items-center gap-2 bg-background/50"
            >
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={user ? "Ask NOVA anything…" : "Login to chat with NOVA…"}
                className="bg-white/5 border-white/10 focus-visible:ring-primary"
                data-testid="ai-tutor-input"
              />
              <Button type="submit" disabled={sending || !text.trim()} className="btn-neon" data-testid="ai-tutor-send">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
