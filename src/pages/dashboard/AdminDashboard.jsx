import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, BookOpen, Mail, Video, IndianRupee, Trash2, Inbox, GraduationCap, PenSquare, FileText, Image as ImageIcon, Newspaper, UserCheck, Check, X as XIcon, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import api, { formatApiErrorDetail } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { BlogForm } from "@/pages/BlogList";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState({});
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [news, setNews] = useState([]);
  const [applications, setApplications] = useState([]);
  const [blogDialog, setBlogDialog] = useState(false);
  const [galleryDialog, setGalleryDialog] = useState(false);
  const [newsDialog, setNewsDialog] = useState(false);

  const refresh = () => {
    api.get("/admin/analytics").then((r) => setAnalytics(r.data)).catch(() => {});
    api.get("/admin/users").then((r) => setUsers(r.data)).catch(() => {});
    api.get("/courses").then((r) => setCourses(r.data)).catch(() => {});
    api.get("/inquiries").then((r) => setInquiries(r.data)).catch(() => {});
    api.get("/blogs").then((r) => setBlogs(r.data)).catch(() => {});
    api.get("/gallery").then((r) => setGallery(r.data)).catch(() => {});
    api.get("/news").then((r) => setNews(r.data)).catch(() => {});
    api.get("/teacher-applications").then((r) => setApplications(r.data)).catch(() => {});
  };
  useEffect(() => { refresh(); }, []);

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success("User deleted");
      refresh();
    } catch (e) { toast.error(formatApiErrorDetail(e.response?.data?.detail)); }
  };

  const deleteCourse = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      await api.delete(`/courses/${id}`);
      toast.success("Course deleted");
      refresh();
    } catch (e) { toast.error(formatApiErrorDetail(e.response?.data?.detail)); }
  };

  const deleteBlog = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await api.delete(`/blogs/${id}`);
      toast.success("Post deleted");
      refresh();
    } catch (e) { toast.error(formatApiErrorDetail(e.response?.data?.detail)); }
  };

  const deleteGalleryItem = async (id) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      await api.delete(`/gallery/${id}`);
      toast.success("Image deleted");
      refresh();
    } catch (e) { toast.error(formatApiErrorDetail(e.response?.data?.detail)); }
  };

  const deleteNewsItem = async (id) => {
    if (!window.confirm("Delete this news?")) return;
    try {
      await api.delete(`/news/${id}`);
      toast.success("News deleted");
      refresh();
    } catch (e) { toast.error(formatApiErrorDetail(e.response?.data?.detail)); }
  };

  const approveApplication = async (id, full_name) => {
    if (!window.confirm(`Approve ${full_name} as a teacher? This will create their account.`)) return;
    try {
      const { data } = await api.post(`/teacher-applications/${id}/approve`);
      // Show credentials to admin so they can share with the new teacher
      const credText = `Email: ${data.email}\nTemporary password: ${data.temp_password}`;
      try { await navigator.clipboard.writeText(credText); } catch { /* ignore */ }
      toast.success(`Approved! Temp credentials copied to clipboard.\n${credText}`, { duration: 15000 });
      refresh();
    } catch (e) { toast.error(formatApiErrorDetail(e.response?.data?.detail)); }
  };

  const rejectApplication = async (id) => {
    if (!window.confirm("Reject this application?")) return;
    try {
      await api.post(`/teacher-applications/${id}/reject`);
      toast.success("Application rejected");
      refresh();
    } catch (e) { toast.error(formatApiErrorDetail(e.response?.data?.detail)); }
  };

  const revenue = (analytics.enrollments || 0) * 8999; // mock avg

  return (
    <div className="pt-28 pb-24" data-testid="admin-dashboard">
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="font-mono text-[11px] tracking-[0.3em] text-primary uppercase">// Admin Control</div>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold mt-2 leading-tight">
            Welcome, {user?.name?.split(" ")[0]} ⚡
          </h1>
          <p className="text-foreground/65 mt-2">Full visibility across users, courses, finance & live ops.</p>
        </motion.div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPI icon={GraduationCap} label="Students" value={analytics.students ?? 0} />
          <KPI icon={Users} label="Teachers" value={analytics.teachers ?? 0} />
          <KPI icon={BookOpen} label="Courses" value={analytics.courses ?? 0} />
          <KPI icon={Inbox} label="Inquiries" value={analytics.inquiries ?? 0} />
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPI icon={IndianRupee} label="Est. revenue" value={`₹${(revenue / 100000).toFixed(1)}L`} accent="secondary" />
          <KPI icon={Mail} label="Parents" value={analytics.parents ?? 0} accent="secondary" />
          <KPI icon={Video} label="Live classes" value={analytics.live_classes ?? 0} accent="secondary" />
          <KPI icon={BookOpen} label="Enrollments" value={analytics.enrollments ?? 0} accent="secondary" />
        </div>

        <div className="mt-10">
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="bg-white/5 border border-white/10 p-1">
              <TabsTrigger value="users" data-testid="tab-users">Users</TabsTrigger>
              <TabsTrigger value="courses" data-testid="tab-courses">Courses</TabsTrigger>
              <TabsTrigger value="blogs" data-testid="tab-blogs">Blogs</TabsTrigger>
              <TabsTrigger value="applications" data-testid="tab-applications">
                Applications
                {applications.filter(a => a.status === "pending").length > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold">
                    {applications.filter(a => a.status === "pending").length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="gallery" data-testid="tab-gallery">Gallery</TabsTrigger>
              <TabsTrigger value="news" data-testid="tab-news">News</TabsTrigger>
              <TabsTrigger value="inquiries" data-testid="tab-inquiries">Inquiries</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="mt-6">
              <div className="glass rounded-2xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>XP</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.id} className="border-white/5" data-testid="admin-user-row">
                        <TableCell className="font-medium">{u.name}</TableCell>
                        <TableCell className="text-foreground/70">{u.email}</TableCell>
                        <TableCell>
                          <Badge className={`${u.role === "admin" ? "bg-secondary/20 text-secondary border-secondary/30" : u.role === "teacher" ? "bg-primary/15 text-primary border-primary/30" : "bg-white/5 text-foreground/70 border-white/10"} border`}>
                            {u.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-primary">{u.xp ?? 0}</TableCell>
                        <TableCell className="text-right">
                          {u.id !== user?.id && (
                            <Button size="sm" variant="outline" className="border-white/10 hover:border-destructive hover:text-destructive"
                              onClick={() => deleteUser(u.id)} data-testid="delete-user-btn">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="courses" className="mt-6">
              <div className="glass rounded-2xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.map((c) => (
                      <TableRow key={c.id} className="border-white/5" data-testid="admin-course-row">
                        <TableCell className="font-medium">{c.title}</TableCell>
                        <TableCell><Badge variant="outline" className="border-white/10 capitalize">{c.category}</Badge></TableCell>
                        <TableCell>{c.level}</TableCell>
                        <TableCell className="font-mono text-primary">₹{c.price.toLocaleString()}</TableCell>
                        <TableCell>{c.students.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" className="border-white/10 hover:border-destructive hover:text-destructive"
                            onClick={() => deleteCourse(c.id)} data-testid="delete-course-btn">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="applications" className="mt-6">
              <div className="font-mono text-[11px] tracking-widest text-primary uppercase mb-4">
                {applications.filter(a => a.status === "pending").length} pending · {applications.length} total
              </div>
              <div className="space-y-3">
                {applications.length === 0 ? (
                  <div className="glass rounded-2xl p-10 text-center text-foreground/60">No teacher applications yet.</div>
                ) : applications.map((a) => (
                  <div key={a.id} className="glass rounded-2xl p-5" data-testid="admin-application-row">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-display text-lg font-bold">{a.full_name}</h3>
                          <Badge className={`border ${
                            a.status === "pending" ? "bg-secondary/15 text-secondary border-secondary/30"
                            : a.status === "approved" ? "bg-primary/15 text-primary border-primary/30"
                            : "bg-destructive/15 text-destructive border-destructive/30"
                          }`}>
                            {a.status.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-xs text-foreground/65 mt-1 font-mono">
                          {a.email} · {a.phone} · {a.experience_years} yr exp
                        </div>
                      </div>
                      {a.status === "pending" && (
                        <div className="flex gap-2">
                          <Button size="sm" className="btn-neon" onClick={() => approveApplication(a.id, a.full_name)} data-testid="approve-application-btn">
                            <Check className="h-4 w-4 mr-1" /> Approve
                          </Button>
                          <Button size="sm" variant="outline" className="border-destructive/40 text-destructive hover:bg-destructive/10"
                            onClick={() => rejectApplication(a.id)} data-testid="reject-application-btn">
                            <XIcon className="h-4 w-4 mr-1" /> Reject
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 grid sm:grid-cols-2 gap-3 text-sm">
                      <div><span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Qualifications</span><div className="text-foreground/85 mt-0.5">{a.qualifications}</div></div>
                      <div><span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Expertise</span>
                        <div className="text-foreground/85 mt-0.5 flex flex-wrap gap-1">
                          {a.expertise.map((x) => <span key={x} className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-mono">{x}</span>)}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3"><span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Bio</span>
                      <p className="text-foreground/75 mt-1 text-sm leading-relaxed">{a.bio}</p>
                    </div>
                    {(a.resume_url || a.linkedin_url || a.portfolio_url) && (
                      <div className="mt-3 flex flex-wrap gap-3 text-xs">
                        {a.resume_url && <a href={a.resume_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Resume ↗</a>}
                        {a.linkedin_url && <a href={a.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">LinkedIn ↗</a>}
                        {a.portfolio_url && <a href={a.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Portfolio ↗</a>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>


            <TabsContent value="blogs" className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="font-mono text-[11px] tracking-widest text-primary uppercase">{blogs.length} blog posts</div>
                <Dialog open={blogDialog} onOpenChange={setBlogDialog}>
                  <DialogTrigger asChild>
                    <Button className="btn-neon" data-testid="admin-new-blog">
                      <PenSquare className="h-4 w-4 mr-2" /> New post
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-white/10 max-w-xl">
                    <DialogHeader><DialogTitle className="font-display">New blog post</DialogTitle></DialogHeader>
                    <BlogForm onCreated={() => { setBlogDialog(false); refresh(); }} />
                  </DialogContent>
                </Dialog>
              </div>
              <div className="glass rounded-2xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Published</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blogs.map((b) => (
                      <TableRow key={b.id} className="border-white/5" data-testid="admin-blog-row">
                        <TableCell className="font-medium max-w-xs truncate">{b.title}</TableCell>
                        <TableCell className="text-foreground/70">{b.author_name}</TableCell>
                        <TableCell><Badge variant="outline" className="border-white/10">{b.category}</Badge></TableCell>
                        <TableCell className="text-foreground/60 text-sm">{new Date(b.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" className="border-white/10 hover:border-destructive hover:text-destructive"
                            onClick={() => deleteBlog(b.id)} data-testid="delete-blog-btn">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="gallery" className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="font-mono text-[11px] tracking-widest text-primary uppercase">{gallery.length} images</div>
                <Dialog open={galleryDialog} onOpenChange={setGalleryDialog}>
                  <DialogTrigger asChild>
                    <Button className="btn-neon" data-testid="admin-new-gallery">
                      <ImageIcon className="h-4 w-4 mr-2" /> Add image
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-white/10 max-w-md">
                    <DialogHeader><DialogTitle className="font-display">Add gallery image</DialogTitle></DialogHeader>
                    <GalleryForm onCreated={() => { setGalleryDialog(false); refresh(); }} />
                  </DialogContent>
                </Dialog>
              </div>
              {gallery.length === 0 ? (
                <div className="glass rounded-2xl p-10 text-center text-foreground/60">No images yet.</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {gallery.map((g) => (
                    <div key={g.id} className="relative rounded-xl overflow-hidden border border-white/10 group" data-testid="admin-gallery-tile">
                      <img src={g.image_url} alt="" className="w-full aspect-square object-cover" />
                      <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/85 to-transparent">
                        <div className="font-mono text-[9px] tracking-widest text-primary uppercase truncate">{g.category}</div>
                        <div className="text-xs font-medium truncate">{g.title}</div>
                      </div>
                      <button onClick={() => deleteGalleryItem(g.id)} data-testid="admin-delete-gallery"
                        className="absolute top-2 right-2 h-7 w-7 rounded-md bg-black/70 backdrop-blur opacity-0 group-hover:opacity-100 flex items-center justify-center hover:bg-destructive/30 hover:text-destructive transition-all">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="news" className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="font-mono text-[11px] tracking-widest text-primary uppercase">{news.length} news items</div>
                <Dialog open={newsDialog} onOpenChange={setNewsDialog}>
                  <DialogTrigger asChild>
                    <Button className="btn-neon" data-testid="admin-new-news">
                      <Newspaper className="h-4 w-4 mr-2" /> Post news
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-white/10 max-w-xl">
                    <DialogHeader><DialogTitle className="font-display">Post news</DialogTitle></DialogHeader>
                    <NewsForm onCreated={() => { setNewsDialog(false); refresh(); }} />
                  </DialogContent>
                </Dialog>
              </div>
              <div className="glass rounded-2xl overflow-hidden">
                {news.length === 0 ? (
                  <div className="p-8 text-center text-foreground/60">No news yet.</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Posted</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {news.map((n) => (
                        <TableRow key={n.id} className="border-white/5" data-testid="admin-news-row">
                          <TableCell className="font-medium max-w-xs truncate">{n.title}</TableCell>
                          <TableCell><Badge variant="outline" className="border-white/10">{n.category}</Badge></TableCell>
                          <TableCell className="text-foreground/60 text-sm">{new Date(n.created_at).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="outline" className="border-white/10 hover:border-destructive hover:text-destructive"
                              onClick={() => deleteNewsItem(n.id)} data-testid="admin-delete-news">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </TabsContent>




            <TabsContent value="inquiries" className="mt-6">
              <div className="glass rounded-2xl overflow-hidden">
                {inquiries.length === 0 ? (
                  <div className="p-8 text-center text-foreground/60">No inquiries yet.</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Interest</TableHead>
                        <TableHead>Message</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inquiries.map((q) => (
                        <TableRow key={q.id} className="border-white/5" data-testid="admin-inquiry-row">
                          <TableCell className="font-medium">{q.name}</TableCell>
                          <TableCell className="text-foreground/70">{q.email}</TableCell>
                          <TableCell>{q.phone || "—"}</TableCell>
                          <TableCell>{q.course_interest || "—"}</TableCell>
                          <TableCell className="text-foreground/70 max-w-xs truncate">{q.message}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function KPI({ icon: Icon, label, value, accent = "primary" }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${accent === "primary" ? "bg-primary/15 text-primary border border-primary/30" : "bg-secondary/15 text-secondary border border-secondary/30"}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="font-display text-2xl md:text-3xl font-extrabold mt-3">{value}</div>
      <div className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function GalleryForm({ onCreated }) {
  const [f, setF] = useState({ title: "", image_url: "", caption: "", category: "Campus" });
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/gallery", f);
      toast.success("Image added");
      setF({ title: "", image_url: "", caption: "", category: "Campus" });
      onCreated?.();
    } catch (e2) { toast.error(formatApiErrorDetail(e2.response?.data?.detail)); }
    finally { setBusy(false); }
  };
  return (
    <form onSubmit={submit} className="space-y-3 mt-2" data-testid="gallery-form">
      <div><Label>Title</Label>
        <Input required value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })}
          className="mt-2 bg-white/5 border-white/10" data-testid="gallery-title" /></div>
      <div><Label>Image URL</Label>
        <Input required value={f.image_url} onChange={(e) => setF({ ...f, image_url: e.target.value })}
          className="mt-2 bg-white/5 border-white/10 font-mono text-sm" placeholder="https://…" data-testid="gallery-image-url" /></div>
      <div><Label>Caption (optional)</Label>
        <Textarea rows={2} value={f.caption} onChange={(e) => setF({ ...f, caption: e.target.value })}
          className="mt-2 bg-white/5 border-white/10" /></div>
      <div><Label>Category</Label>
        <Input value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })}
          className="mt-2 bg-white/5 border-white/10" placeholder="Campus, Robotics, Events, Labs" /></div>
      {f.image_url && (
        <div className="rounded-xl overflow-hidden border border-white/10 mt-2">
          <img src={f.image_url} alt="preview" className="w-full aspect-video object-cover" />
        </div>
      )}
      <Button type="submit" disabled={busy} className="btn-neon w-full" data-testid="gallery-submit">
        {busy ? "Adding…" : "Add image"}
      </Button>
    </form>
  );
}

function NewsForm({ onCreated }) {
  const [f, setF] = useState({ title: "", summary: "", content: "", image_url: "", category: "Announcement", external_link: "" });
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/news", { ...f, external_link: f.external_link || null, image_url: f.image_url || null });
      toast.success("News posted");
      setF({ title: "", summary: "", content: "", image_url: "", category: "Announcement", external_link: "" });
      onCreated?.();
    } catch (e2) { toast.error(formatApiErrorDetail(e2.response?.data?.detail)); }
    finally { setBusy(false); }
  };
  return (
    <form onSubmit={submit} className="space-y-3 mt-2" data-testid="news-form">
      <div><Label>Title</Label>
        <Input required value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })}
          className="mt-2 bg-white/5 border-white/10" data-testid="news-title" /></div>
      <div><Label>Summary (1-2 sentences)</Label>
        <Textarea required rows={2} value={f.summary} onChange={(e) => setF({ ...f, summary: e.target.value })}
          className="mt-2 bg-white/5 border-white/10" data-testid="news-summary" /></div>
      <div><Label>Content (markdown supported)</Label>
        <Textarea required rows={6} value={f.content} onChange={(e) => setF({ ...f, content: e.target.value })}
          className="mt-2 bg-white/5 border-white/10 font-mono text-sm" data-testid="news-content" /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Category</Label>
          <Input value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })}
            className="mt-2 bg-white/5 border-white/10" placeholder="Announcement, Event, Student Win" /></div>
        <div><Label>External link (optional)</Label>
          <Input value={f.external_link} onChange={(e) => setF({ ...f, external_link: e.target.value })}
            className="mt-2 bg-white/5 border-white/10 font-mono text-sm" /></div>
      </div>
      <div><Label>Cover image URL (optional)</Label>
        <Input value={f.image_url} onChange={(e) => setF({ ...f, image_url: e.target.value })}
          className="mt-2 bg-white/5 border-white/10 font-mono text-sm" data-testid="news-image-url" /></div>
      <Button type="submit" disabled={busy} className="btn-neon w-full" data-testid="news-submit">
        {busy ? "Posting…" : "Post news"}
      </Button>
    </form>
  );
}
