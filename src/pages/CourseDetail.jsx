import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, BookOpen, Users, Star, ArrowLeft, Sparkles, PlayCircle, CreditCard, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api, { formatApiErrorDetail } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const SYLLABUS = [
  "Introduction & setup", "Core concepts walk-through", "Hands-on mini-project #1",
  "Intermediate techniques", "Real-world case study", "Capstone project & certificate"
];
const PERKS = [
  "Live mentor support (Zoom + Google Meet)",
  "Lifetime access to recordings",
  "Hands-on coding labs & assignments",
  "Industry-grade capstone projects",
  "ISAI verified certificate of completion",
  "AI tutor NOVA — 24×7 doubt solving",
];

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    api.get(`/courses/${id}`)
      .then((r) => setCourse(r.data))
      .catch(() => setCourse(false))
      .finally(() => setLoading(false));
    if (user) {
      api.get("/enrollments/me")
        .then((r) => setEnrolled(r.data.some((e) => e.course_id === id)))
        .catch(() => {});
    }
  }, [id, user]);

  const handlePay = async (provider) => {
    if (!user) { navigate("/login", { state: { from: { pathname: `/courses/${id}` } } }); return; }
    setPaying(true);
    try {
      const { data } = await api.post("/payments/checkout", {
        course_id: id,
        provider,
        origin_url: window.location.origin,
      });
      if (data.already_enrolled) { toast.info("You're already enrolled."); navigate("/dashboard"); return; }
      if (data.free) { toast.success("Enrolled! +50 XP 🎉"); navigate("/dashboard"); return; }
      if (provider === "stripe" && data.checkout_url) {
        window.location.href = data.checkout_url;
        return;
      }
      if (provider === "razorpay") {
        if (data.mode === "dummy") {
          // Scaffold mode: confirm-fake-payment via verify endpoint
          toast.info("Razorpay is in scaffold mode. Simulating payment...");
          const verify = await api.post("/payments/razorpay/verify", {
            razorpay_order_id: data.order_id,
            razorpay_payment_id: "pay_DUMMY_" + Date.now(),
            razorpay_signature: "DUMMY_SIG",
            course_id: id,
          });
          if (verify.data?.verified) {
            toast.success("Enrolled! Replace Razorpay keys in .env for real payments.");
            navigate("/dashboard");
          }
          return;
        }
        // Real Razorpay checkout via script tag
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => {
          // eslint-disable-next-line no-undef
          const rzp = new window.Razorpay({
            key: data.key_id,
            amount: data.amount,
            currency: data.currency,
            name: "ISAI Academy",
            description: course.title,
            order_id: data.order_id,
            theme: { color: "#06b6d4" },
            handler: async (resp) => {
              const verify = await api.post("/payments/razorpay/verify", {
                razorpay_order_id: resp.razorpay_order_id,
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_signature: resp.razorpay_signature,
                course_id: id,
              });
              if (verify.data?.verified) {
                toast.success("Payment successful! Enrolled.");
                navigate("/dashboard");
              } else {
                toast.error("Verification failed");
              }
            },
          });
          rzp.open();
        };
        document.body.appendChild(script);
      }
    } catch (e) {
      toast.error(formatApiErrorDetail(e.response?.data?.detail) || "Payment failed");
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-primary font-mono">LOADING…</div>;
  if (!course) return <div className="min-h-screen flex items-center justify-center text-foreground/60">Course not found.</div>;

  const isFree = !course.price || course.price <= 0;

  return (
    <div className="pt-28 pb-24" data-testid="course-detail-page">
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
        <Link to="/courses" className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to courses
        </Link>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="rounded-3xl overflow-hidden border border-white/10 aspect-[16/9] relative">
              <img src={course.cover} alt={course.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3">
                <div>
                  <div className="font-mono text-[11px] tracking-widest text-primary uppercase">{course.level}</div>
                  <h1 className="font-display text-3xl md:text-4xl font-extrabold mt-1" data-testid="course-title">
                    {course.title}
                  </h1>
                </div>
                <div className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-lg">
                  <Star className="h-4 w-4 fill-secondary text-secondary" />
                  <span className="font-bold text-sm">{course.rating}</span>
                </div>
              </div>
            </motion.div>

            <div className="mt-8">
              <p className="text-foreground/80 leading-relaxed text-lg">{course.description}</p>
            </div>

            <div className="mt-10">
              <div className="font-mono text-[11px] tracking-[0.3em] text-primary uppercase">// What you'll build</div>
              <h2 className="font-display text-2xl font-bold mt-2">Syllabus & outcomes</h2>
              <div className="mt-6 space-y-3">
                {SYLLABUS.map((s, i) => (
                  <div key={i} className="glass rounded-xl p-4 flex items-start gap-3" data-testid={`syllabus-${i}`}>
                    <div className="h-7 w-7 rounded-md bg-primary/15 border border-primary/30 flex-shrink-0 flex items-center justify-center font-mono text-xs text-primary">
                      {(i + 1).toString().padStart(2, "0")}
                    </div>
                    <div>
                      <div className="font-display font-bold">Module {i + 1}</div>
                      <div className="text-sm text-foreground/70">{s}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10">
              <div className="font-mono text-[11px] tracking-[0.3em] text-primary uppercase">// What's included</div>
              <h2 className="font-display text-2xl font-bold mt-2">Why this course</h2>
              <div className="mt-6 grid sm:grid-cols-2 gap-3">
                {PERKS.map((p, i) => (
                  <div key={i} className="flex items-start gap-3 text-foreground/85">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 self-start">
            <div className="glass-strong rounded-2xl p-6">
              <div className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">Starts at</div>
              <div className="font-display text-4xl font-extrabold cyan-gold-text">
                ₹{course.price.toLocaleString()}
              </div>
              <div className="text-xs text-foreground/60 mt-1">EMI from ₹{Math.round(course.price / 6).toLocaleString()}/mo</div>

              {enrolled ? (
                <Button asChild className="btn-neon w-full h-12 mt-6 rounded-xl text-base" data-testid="learn-btn">
                  <Link to={`/learn/${course.id}`}><PlayCircle className="h-5 w-5 mr-2" /> Start learning</Link>
                </Button>
              ) : isFree ? (
                <Button onClick={() => handlePay("stripe")} disabled={paying} className="btn-neon w-full h-12 mt-6 rounded-xl text-base" data-testid="enroll-btn">
                  {paying ? "Enrolling…" : "Enroll now (Free)"}
                </Button>
              ) : (
                <div className="mt-6 space-y-3">
                  <Button onClick={() => handlePay("razorpay")} disabled={paying} className="btn-neon w-full h-12 rounded-xl text-base" data-testid="pay-razorpay-btn">
                    <IndianRupee className="h-4 w-4 mr-1.5" /> {paying ? "Processing…" : "Pay with Razorpay (UPI/Card)"}
                  </Button>
                  <Button onClick={() => handlePay("stripe")} disabled={paying} variant="outline" className="w-full h-12 rounded-xl text-base border-white/15 hover:bg-white/5" data-testid="pay-stripe-btn">
                    <CreditCard className="h-4 w-4 mr-1.5" /> Pay with Stripe (Card)
                  </Button>
                </div>
              )}

              <Button asChild variant="outline" className="w-full h-11 mt-3 rounded-xl border-white/15 hover:bg-white/5">
                <Link to="/contact">Talk to a counsellor</Link>
              </Button>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center gap-3 text-foreground/80"><Clock className="h-4 w-4 text-primary" /> {course.duration}</div>
                <div className="flex items-center gap-3 text-foreground/80"><BookOpen className="h-4 w-4 text-primary" /> {course.lessons} lessons</div>
                <div className="flex items-center gap-3 text-foreground/80"><Users className="h-4 w-4 text-primary" /> {course.students.toLocaleString()} enrolled</div>
                <div className="flex items-center gap-3 text-foreground/80"><Sparkles className="h-4 w-4 text-secondary" /> Includes NOVA AI tutor</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
