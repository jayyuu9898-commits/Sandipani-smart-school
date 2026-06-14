import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { LayoutDashboard, BookOpen, FileText, CalendarCheck, Trophy, Clock, ChevronRight, GraduationCap, Loader2 } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Link } from "wouter";

const navItems = [
  { icon: LayoutDashboard, label: "Home", href: "/student" },
  { icon: BookOpen, label: "Homework", href: "/student/homework" },
  { icon: FileText, label: "Notes", href: "/student/notes" },
  { icon: CalendarCheck, label: "Attendance", href: "/student/attendance" },
  { icon: Trophy, label: "Results", href: "/student/results" },
];

const quickLinks = [
  { label: "View Homework", href: "/student/homework", icon: BookOpen, color: "from-violet-500 to-violet-600", desc: "Check pending assignments" },
  { label: "Study Notes", href: "/student/notes", icon: FileText, color: "from-emerald-500 to-emerald-600", desc: "Download shared notes" },
  { label: "Attendance", href: "/student/attendance", icon: CalendarCheck, color: "from-blue-500 to-blue-600", desc: "View your attendance" },
  { label: "Results", href: "/student/results", icon: Trophy, color: "from-amber-500 to-amber-600", desc: "Check exam results" },
  { label: "Timetable", href: "/student/timetable", icon: Clock, color: "from-rose-500 to-rose-600", desc: "Today's schedule" },
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ attPct: 0, pendingHw: 0, avgMarks: 0 });
  const [todayClasses, setTodayClasses] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchDashboardData = async () => {
      try {
        setError(null);

        // Get student record
        const { data: studentData, error: stdErr } = await supabase
          .from("students")
          .select("id, class_id")
          .eq("id", user.id)
          .single();

        if (stdErr) throw stdErr;
        if (!studentData) throw new Error("Student record not found");

        // Get attendance percentage
        const { data: attendanceRecords, error: attErr } = await supabase
          .from("attendance")
          .select("status")
          .eq("student_id", user.id);

        if (attErr) throw attErr;

        const presentCount = attendanceRecords?.filter(a => a.status === "present").length || 0;
        const attPct = attendanceRecords && attendanceRecords.length > 0
          ? Math.round((presentCount / attendanceRecords.length) * 100)
          : 0;

        // Get pending homework count
        const { count: hwCount, error: hwErr } = await supabase
          .from("homework")
          .select("*", { count: "exact", head: true })
          .eq("class_id", studentData.class_id)
          .gt("due_date", new Date().toISOString());

        if (hwErr) throw hwErr;

        // Get average marks
        const { data: results, error: resErr } = await supabase
          .from("exam_results")
          .select("marks_obtained, max_marks")
          .eq("student_id", user.id);

        if (resErr) throw resErr;

        let avgMarks = 0;
        if (results && results.length > 0) {
          const percentages = results.map(r => (r.marks_obtained / r.max_marks) * 100);
          avgMarks = Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length);
        }

        // Get today's timetable
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const todayDay = days[new Date().getDay()];

        const { data: timetable, error: ttErr } = await supabase
          .from("timetables")
          .select("id, period, subject, start_time, end_time, teachers(full_name)")
          .eq("class_id", studentData.class_id)
          .eq("day", todayDay)
          .order("period");

        if (ttErr) throw ttErr;

        setTodayClasses(
          (timetable || []).slice(0, 3).map((t: any) => ({
            subject: t.subject,
            teacherName: t.teachers?.full_name || "Teacher",
            time: `${t.start_time} – ${t.end_time}`,
            period: t.period,
          }))
        );

        setStats({
          attPct,
          pendingHw: hwCount || 0,
          avgMarks,
        });
      } catch (err: any) {
        console.error("Error fetching dashboard:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id]);

  if (loading) {
    return (
      <MobileLayout header={<Header />} bottomNav={<BottomNav items={navItems} />}>
        <div className="flex items-center justify-center py-16">
          <Loader2 size={28} className="animate-spin text-primary" />
        </div>
      </MobileLayout>
    );
  }

  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening";

  const getGradeColor = (pct: number) => {
    if (pct >= 80) return "text-emerald-600";
    if (pct >= 60) return "text-blue-600";
    if (pct >= 40) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <MobileLayout header={<Header />} bottomNav={<BottomNav items={navItems} />}>
      <div className="p-4 space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
            <p className="text-red-700 text-xs">{error}</p>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <GraduationCap size={24} className="text-white" />
              </div>
              <div>
                <p className="text-white/80 text-sm">{greeting},</p>
                <h2 className="text-xl font-bold">{user?.fullName}</h2>
              </div>
            </div>
            <p className="text-white/70 text-xs mt-3">
              {now.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Attendance", value: `${stats.attPct}%`, icon: CalendarCheck, color: "text-blue-600 bg-blue-50", good: stats.attPct >= 75 },
            { label: "Pending HW", value: stats.pendingHw, icon: BookOpen, color: "text-violet-600 bg-violet-50", good: stats.pendingHw === 0 },
            { label: "Avg. Score", value: `${stats.avgMarks}%`, icon: Trophy, color: "text-amber-600 bg-amber-50", good: stats.avgMarks >= 75 },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}
                className="bg-white rounded-2xl border border-border p-3 text-center shadow-sm">
                <div className={`w-9 h-9 rounded-xl ${stat.color} flex items-center justify-center mx-auto mb-2`}><Icon size={16} /></div>
                <p className={`text-xl font-bold ${stat.good ? "text-emerald-600" : "text-foreground"}`}>{stat.value}</p>
                <p className="text-[10px] text-muted-foreground leading-tight">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {todayClasses.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-sm font-semibold text-muted-foreground">Today's Classes</h3>
              <Link href="/student/timetable" className="text-xs text-primary font-medium flex items-center gap-0.5">
                Full schedule <ChevronRight size={12} />
              </Link>
            </div>
            <div className="space-y-2">
              {todayClasses.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.06 }}
                  className="bg-white rounded-2xl border border-border p-3 flex items-center gap-3 shadow-sm">
                  <div className="w-1 h-10 bg-primary rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{item.subject}</p>
                    <p className="text-xs text-muted-foreground">{item.teacherName}</p>
                  </div>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-lg">{item.time}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-1">Quick Access</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickLinks.map((link, i) => {
              const Icon = link.icon;
              return (
                <motion.div key={link.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.06 }}>
                  <Link href={link.href}>
                    <div className={`bg-gradient-to-br ${link.color} rounded-2xl p-4 text-white shadow-sm active:scale-95 transition-transform cursor-pointer`}>
                      <Icon size={22} className="mb-2" />
                      <p className="text-sm font-semibold leading-tight">{link.label}</p>
                      <p className="text-white/70 text-[10px] mt-0.5">{link.desc}</p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
        <Footer />
      </div>
    </MobileLayout>
  );
}
