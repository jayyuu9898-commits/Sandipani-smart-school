import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase";
import { LayoutDashboard, Users, UserCheck, BookOpen, TrendingUp, CalendarCheck, GraduationCap, Settings, Bell, Clock, Loader as Loader2, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Users, label: "Students", href: "/admin/students" },
  { icon: UserCheck, label: "Teachers", href: "/admin/teachers" },
  { icon: BookOpen, label: "Classes", href: "/admin/classes" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

interface QuickAction {
  label: string;
  href: string;
  icon: React.ElementType;
  color: string;
}

const quickActions: QuickAction[] = [
  { label: "Manage Students", href: "/admin/students", icon: Users, color: "from-blue-500 to-blue-600" },
  { label: "Manage Teachers", href: "/admin/teachers", icon: UserCheck, color: "from-emerald-500 to-emerald-600" },
  { label: "Manage Classes", href: "/admin/classes", icon: BookOpen, color: "from-violet-500 to-violet-600" },
  { label: "School Settings", href: "/admin/settings", icon: Settings, color: "from-gray-600 to-gray-700" },
  { label: "Notices", href: "/admin/notices", icon: Bell, color: "from-orange-500 to-orange-600" },
  { label: "Timetables", href: "/admin/timetable", icon: Clock, color: "from-cyan-500 to-cyan-600" },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    classes: 0,
    attendancePct: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [studentsRes, teachersRes, classesRes, attendanceRes] = await Promise.all([
        supabase.from("students").select("id", { count: "exact", head: true }),
        supabase.from("teachers").select("id", { count: "exact", head: true }),
        supabase.from("classes").select("id", { count: "exact", head: true }),
        supabase.from("attendance").select("status").eq("date", new Date().toISOString().split("T")[0]),
      ]);

      const totalStudents = studentsRes.count || 0;
      const todayAttendance = attendanceRes.data || [];
      const presentToday = todayAttendance.filter((a) => a.status === "present").length;
      const attendancePct = totalStudents > 0 ? Math.round((presentToday / totalStudents) * 100) : 0;

      setStats({
        students: totalStudents,
        teachers: teachersRes.count || 0,
        classes: classesRes.count || 0,
        attendancePct,
      });
    } catch (err) {
      // Use fallback stats if database fails
      setStats({ students: 0, teachers: 0, classes: 0, attendancePct: 0 });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: "Total Students", value: stats.students, icon: Users, color: "bg-blue-50 text-blue-600", border: "border-blue-100" },
    { label: "Total Teachers", value: stats.teachers, icon: UserCheck, color: "bg-emerald-50 text-emerald-600", border: "border-emerald-100" },
    { label: "Total Classes", value: stats.classes, icon: BookOpen, color: "bg-violet-50 text-violet-600", border: "border-violet-100" },
    { label: "Attendance Today", value: `${stats.attendancePct}%`, icon: CalendarCheck, color: "bg-amber-50 text-amber-600", border: "border-amber-100" },
  ];

  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening";

  return (
    <MobileLayout header={<Header />} bottomNav={<BottomNav items={navItems} />}>
      <div className="p-4 space-y-5">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-1">
              <div className="bg-white/20 p-2 rounded-xl">
                <GraduationCap size={22} className="text-white" />
              </div>
              <div>
                <p className="text-white/80 text-sm">{greeting},</p>
                <h2 className="text-xl font-bold">{user?.name}</h2>
              </div>
            </div>
            <p className="text-white/70 text-xs mt-2">
              {now.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </motion.div>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-1">Overview</h3>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {statCards.map((card, i) => {
                const Icon = card.icon;
                return (
                  <motion.div key={card.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}
                    className={`bg-white rounded-2xl p-4 border ${card.border} shadow-sm`}>
                    <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center mb-3`}>
                      <Icon size={20} />
                    </div>
                    <p className="text-2xl font-bold text-foreground">{card.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-1">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <motion.div key={action.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 + i * 0.05 }}>
                  <Link href={action.href}>
                    <div className={`bg-gradient-to-br ${action.color} rounded-2xl p-4 text-white shadow-sm active:scale-95 transition-transform cursor-pointer`}>
                      <Icon size={24} className="mb-2" />
                      <p className="text-sm font-semibold leading-tight">{action.label}</p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp size={18} /> Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { text: "System initialized successfully", time: "Just now" },
                { text: "Admin dashboard loaded", time: "1m ago" },
                { text: "Database tables ready", time: "2m ago" },
                { text: "Welcome to Sandipani Smart School", time: "Today" },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.05 }}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp size={14} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground leading-snug">{item.text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Footer />
      </div>
    </MobileLayout>
  );
}
