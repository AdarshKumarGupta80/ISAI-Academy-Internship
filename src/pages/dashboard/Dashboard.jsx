import React from "react";
import { useAuth } from "@/context/AuthContext";
import StudentDashboard from "@/pages/dashboard/StudentDashboard";
import TeacherDashboard from "@/pages/dashboard/TeacherDashboard";
import AdminDashboard from "@/pages/dashboard/AdminDashboard";
import ParentDashboard from "@/pages/dashboard/ParentDashboard";

export default function Dashboard() {
  const { user } = useAuth();
  if (!user) return null;
  if (user.role === "admin") return <AdminDashboard />;
  if (user.role === "teacher") return <TeacherDashboard />;
  if (user.role === "parent") return <ParentDashboard />;
  return <StudentDashboard />;
}
