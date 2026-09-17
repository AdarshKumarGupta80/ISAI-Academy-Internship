import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialBar from "@/components/SocialBar";
import AITutorWidget from "@/components/AITutorWidget";
import ProtectedRoute from "@/components/ProtectedRoute";
import AuthCallback from "@/components/AuthCallback";
import Landing from "@/pages/Landing";
import Courses from "@/pages/Courses";
import CourseDetail from "@/pages/CourseDetail";
import OfflineCenter from "@/pages/OfflineCenter";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Career from "@/pages/Career";
import Internship from "@/pages/Internship";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/dashboard/Dashboard";
import BlogList from "@/pages/BlogList";
import BlogDetail from "@/pages/BlogDetail";
import CourseLearning from "@/pages/CourseLearning";
import Certificate from "@/pages/Certificate";
import Gallery from "@/pages/Gallery";
import News from "@/pages/News";
import NewsDetail from "@/pages/NewsDetail";
import TeacherApply from "@/pages/TeacherApply";
import PaymentSuccess from "@/pages/PaymentSuccess";

function AppRouter() {
  const location = useLocation();
  // CRITICAL: Detect session_id in URL fragment synchronously (not in useEffect)
  // so the OAuth callback runs BEFORE protected routes try to check auth.
  if (location.hash?.includes("session_id=")) {
    return <AuthCallback />;
  }
  return (
    <>
      <Header />
      <SocialBar />
      <main className="relative">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/teach" element={<TeacherApply />} />
          <Route path="/certificate/:id" element={<Certificate />} />
          <Route
            path="/learn/:courseId"
            element={<ProtectedRoute><CourseLearning /></ProtectedRoute>}
          />
          <Route path="/offline-center" element={<OfflineCenter />} />
          <Route path="/about" element={<About />} />
          <Route path="/career" element={<Career />} />
          <Route path="/internship" element={<Internship />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
          />
          <Route
            path="/payment/success"
            element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>}
          />
        </Routes>
      </main>
      <Footer />
      <AITutorWidget />
    </>
  );
}

function App() {
  return (
    <div className="App dark min-h-screen bg-background text-foreground">
      <AuthProvider>
        <BrowserRouter>
          <AppRouter />
          <Toaster theme="dark" position="bottom-right" />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
