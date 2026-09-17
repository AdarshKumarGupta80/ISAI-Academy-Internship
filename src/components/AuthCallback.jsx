import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api, { formatApiErrorDetail } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

/**
 * Handles the #session_id=... fragment returned by Emergent Google Auth.
 * Synchronously detected in App router BEFORE normal routes render.
 */
export default function AuthCallback() {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const hash = window.location.hash || "";
    const m = hash.match(/session_id=([^&]+)/);
    if (!m) { navigate("/login", { replace: true }); return; }
    const sessionId = m[1];

    (async () => {
      try {
        const { data } = await api.post("/auth/google/session", { session_id: sessionId });
        // Clear the hash so it isn't re-processed on refresh
        window.history.replaceState(null, "", "/dashboard");
        await refresh();
        toast.success(`Welcome${data?.user?.name ? `, ${data.user.name.split(" ")[0]}` : ""}!`);
        navigate("/dashboard", { replace: true });
      } catch (e) {
        toast.error(formatApiErrorDetail(e.response?.data?.detail) || "Google login failed");
        navigate("/login", { replace: true });
      }
    })();
  }, [navigate, refresh]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="font-cyber text-primary text-lg tracking-widest animate-pulse">AUTHENTICATING…</div>
        <div className="font-mono text-xs text-muted-foreground mt-2 tracking-[0.3em]">// VERIFYING GOOGLE SESSION</div>
      </div>
    </div>
  );
}
