import React from "react";

const REDIRECT_PATH = "/dashboard"; // Where user lands after Google auth

/**
 * REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH.
 * The redirect URL is dynamically built from window.location.origin to avoid env mismatches.
 */
export default function GoogleLoginButton({ label = "Continue with Google" }) {
  const handleClick = () => {
    const redirectUrl = window.location.origin + REDIRECT_PATH;
    window.location.href =
      `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      data-testid="google-login-btn"
      className="w-full h-12 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20 transition-colors flex items-center justify-center gap-3 text-sm font-medium"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
        <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.4-1.5 4.1-5.4 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.4 14.5 2.5 12 2.5 6.7 2.5 2.5 6.7 2.5 12s4.2 9.5 9.5 9.5c5.5 0 9.1-3.8 9.1-9.3 0-.6-.1-1.1-.2-2H12z"/>
        <path fill="#FBBC05" d="M3.9 7.7l3.2 2.3C7.9 8.1 9.8 6.8 12 6.8c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.4 14.5 2.5 12 2.5c-3.6 0-6.7 2.1-8.1 5.2z"/>
        <path fill="#34A853" d="M12 21.5c2.4 0 4.5-.8 6-2.2l-2.8-2.3c-.8.6-1.9 1-3.2 1-2.7 0-4.9-1.8-5.7-4.3l-3.2 2.5c1.4 3 4.7 5.3 8.9 5.3z"/>
        <path fill="#4285F4" d="M21.4 12.2c0-.6-.1-1.1-.2-2H12v3.9h5.4c-.3 1.3-1 2.2-2.2 2.9l2.8 2.3c1.6-1.5 2.7-3.8 2.7-7.1z"/>
      </svg>
      {label}
    </button>
  );
}
