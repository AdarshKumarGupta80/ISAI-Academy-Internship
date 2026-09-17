import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

const MAX_POLLS = 7;
const POLL_INTERVAL_MS = 2000;

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const [state, setState] = useState({ status: "checking", message: "Confirming your payment…" });
  const [courseId, setCourseId] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setState({ status: "error", message: "No session_id in URL." });
      return;
    }
    let cancelled = false;
    let attempts = 0;

    const poll = async () => {
      try {
        const { data } = await api.get(`/payments/status/${sessionId}`);
        if (cancelled) return;
        if (data.course_id) setCourseId(data.course_id);
        if (data.payment_status === "paid") {
          setState({ status: "success", message: "Payment confirmed. You're enrolled!" });
          return;
        }
        if (data.status === "expired" || data.payment_status === "failed") {
          setState({ status: "error", message: "Payment was not completed." });
          return;
        }
        if (attempts < MAX_POLLS) {
          attempts += 1;
          setTimeout(poll, POLL_INTERVAL_MS);
        } else {
          setState({ status: "pending", message: "Still processing. Refresh the page in a minute." });
        }
      } catch (e) {
        if (!cancelled) setState({ status: "error", message: e.response?.data?.detail || "Unable to verify payment." });
      }
    };
    poll();
    return () => { cancelled = true; };
  }, [sessionId]);

  return (
    <div className="pt-32 pb-24 min-h-screen" data-testid="payment-success-page">
      <div className="mx-auto max-w-xl px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-3xl p-10 text-center">
          {state.status === "checking" && <Loader2 className="h-14 w-14 text-primary mx-auto animate-spin" />}
          {state.status === "success" && <CheckCircle2 className="h-14 w-14 text-secondary mx-auto" />}
          {state.status === "error" && <XCircle className="h-14 w-14 text-red-400 mx-auto" />}
          {state.status === "pending" && <Loader2 className="h-14 w-14 text-primary mx-auto" />}

          <div className="font-mono text-[11px] tracking-[0.3em] text-primary uppercase mt-6">
            // {state.status === "success" ? "Confirmed" : state.status}
          </div>
          <h1 className="font-display text-3xl font-extrabold mt-2">
            {state.status === "success" ? "Welcome aboard! 🚀" : "Payment status"}
          </h1>
          <p className="text-foreground/70 mt-3" data-testid="payment-status-message">{state.message}</p>

          <div className="mt-8 flex flex-col gap-3">
            {state.status === "success" && (
              <Button asChild className="btn-neon h-12 rounded-xl">
                <Link to="/dashboard" data-testid="go-dashboard-btn">Go to dashboard <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            )}
            <Button variant="outline" className="h-11 rounded-xl border-white/15"
              onClick={() => navigate(courseId ? `/courses/${courseId}` : "/courses")}>
              Back to courses
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
