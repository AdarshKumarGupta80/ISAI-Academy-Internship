import React from "react";
import api, { API_BASE } from "@/lib/api";
import { toast } from "sonner";

/**
 * GitHub OAuth login button. Hits backend /api/auth/github/start which 302s to
 * github.com. If credentials are not configured, the server returns 503 — we
 * surface a friendly toast.
 */
export default function GithubLoginButton({ label = "Continue with GitHub" }) {
  const handleClick = async () => {
    // Probe the endpoint first so a 503 (creds missing) becomes a clear toast
    // instead of a confusing redirect-back-to-login loop.
    try {
      await api.get("/auth/github/start", { maxRedirects: 0, validateStatus: () => true })
        .then((r) => {
          if (r.status === 503) {
            toast.error("GitHub login isn't configured yet. Admin: set GITHUB_CLIENT_ID & GITHUB_CLIENT_SECRET in backend/.env");
            return null;
          }
          // Endpoint is live — navigate the full window so GitHub can take over
          window.location.href = `${API_BASE}/auth/github/start`;
        });
    } catch {
      window.location.href = `${API_BASE}/auth/github/start`;
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      data-testid="github-login-btn"
      className="w-full h-12 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20 transition-colors flex items-center justify-center gap-3 text-sm font-medium"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <path d="M12 .5C5.65.5.5 5.66.5 12.02c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.1c-3.2.69-3.87-1.36-3.87-1.36-.52-1.34-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.58.23 2.75.11 3.04.74.8 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.26 5.68.42.36.78 1.05.78 2.12v3.14c0 .31.21.68.8.56C20.21 21.4 23.5 17.1 23.5 12.02 23.5 5.66 18.35.5 12 .5Z" />
      </svg>
      {label}
    </button>
  );
}
