import React, { useEffect, useState } from "react";
import { Mail, Phone, ArrowRight, Loader2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api, { formatApiErrorDetail } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * OTP login — user picks Email or Phone. We send a 6-digit code, then verify.
 * In dev (no Resend/Twilio creds) the backend returns `dev_otp` which we auto-fill.
 */
export default function OtpLogin() {
  const { refresh } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [channel, setChannel] = useState("email"); // "email" | "phone"
  const [identifier, setIdentifier] = useState("");
  const [name, setName] = useState("");
  const [stage, setStage] = useState("identifier"); // identifier | otp
  const [otp, setOtp] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const sendOtp = async (e) => {
    e?.preventDefault?.();
    if (!identifier.trim()) { toast.error(`Enter your ${channel}`); return; }
    setSending(true);
    try {
      const { data } = await api.post("/auth/otp/send", { identifier: identifier.trim(), channel });
      toast.success(`OTP sent to your ${channel}`);
      setStage("otp");
      setCooldown(30);
      if (data.dev_otp) {
        // Dev mode — autofill OTP and notify
        setOtp(data.dev_otp);
        toast.message(`DEV mode: code is ${data.dev_otp}`, {
          description: "In production, this code is sent via email/SMS. The field has been pre-filled.",
          duration: 6000,
        });
      }
    } catch (e2) {
      toast.error(formatApiErrorDetail(e2.response?.data?.detail) || "Failed to send OTP");
    } finally { setSending(false); }
  };

  const verify = async (e) => {
    e?.preventDefault?.();
    if (otp.trim().length < 4) { toast.error("Enter the OTP"); return; }
    setVerifying(true);
    try {
      const { data } = await api.post("/auth/otp/verify", {
        identifier: identifier.trim(),
        channel,
        otp: otp.trim(),
        name: name.trim() || undefined,
      });
      toast.success(`Welcome${data.user?.name ? `, ${data.user.name.split(" ")[0]}` : ""}!`);
      await refresh();
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    } catch (e2) {
      toast.error(formatApiErrorDetail(e2.response?.data?.detail) || "Invalid code");
    } finally { setVerifying(false); }
  };

  return (
    <div data-testid="otp-login-panel">
      {/* Channel switcher */}
      <div className="grid grid-cols-2 p-1 rounded-xl bg-white/5 border border-white/10 mb-4">
        {[
          { id: "email", icon: Mail, label: "Email" },
          { id: "phone", icon: Phone, label: "Phone" },
        ].map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => { setChannel(c.id); setIdentifier(""); setStage("identifier"); setOtp(""); }}
            data-testid={`otp-tab-${c.id}`}
            className={`flex items-center justify-center gap-2 h-10 rounded-lg text-sm font-medium transition-all ${
              channel === c.id ? "bg-primary text-black shadow-neon-cyan" : "text-foreground/70 hover:text-foreground"
            }`}
          >
            <c.icon className="h-4 w-4" /> {c.label}
          </button>
        ))}
      </div>

      {stage === "identifier" ? (
        <form onSubmit={sendOtp} className="space-y-4">
          <div>
            <Label>{channel === "email" ? "Email" : "Phone (with country code)"}</Label>
            <Input
              required
              type={channel === "email" ? "email" : "tel"}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={channel === "email" ? "you@email.com" : "+91-9999999999"}
              className="mt-2 bg-white/5 border-white/10"
              data-testid="otp-identifier"
            />
          </div>
          <Button type="submit" disabled={sending} className="btn-neon w-full h-12 rounded-xl" data-testid="otp-send-btn">
            {sending ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending…</>)
                     : (<>Send OTP <ArrowRight className="ml-2 h-4 w-4" /></>)}
          </Button>
        </form>
      ) : (
        <form onSubmit={verify} className="space-y-4">
          <div className="text-xs text-foreground/65">
            Code sent to <span className="text-foreground font-medium">{identifier}</span>.
            <button type="button" onClick={() => setStage("identifier")} className="ml-2 text-primary hover:underline">change</button>
          </div>
          <div>
            <Label>One-time code</Label>
            <Input
              required
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="6-digit code"
              className="mt-2 bg-white/5 border-white/10 font-mono text-center text-xl tracking-[0.4em]"
              data-testid="otp-input"
              autoFocus
            />
          </div>
          <div>
            <Label className="text-xs text-foreground/60">Your name (only if first time here)</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Optional"
              className="mt-2 bg-white/5 border-white/10"
              data-testid="otp-name"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={verifying} className="btn-neon flex-1 h-12 rounded-xl" data-testid="otp-verify-btn">
              {verifying ? "Verifying…" : (<><KeyRound className="h-4 w-4 mr-2" /> Verify &amp; sign in</>)}
            </Button>
            <Button type="button" variant="outline" disabled={cooldown > 0 || sending}
              onClick={sendOtp} className="border-white/15 h-12" data-testid="otp-resend-btn">
              {cooldown > 0 ? `Resend ${cooldown}s` : "Resend"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
