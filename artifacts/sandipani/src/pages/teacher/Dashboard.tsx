import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { LayoutDashboard, CalendarCheck, BookOpen, FileText, Trophy, Users, Clock, Loader2 } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Link } from "wouter";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/teacher" },
  { icon: CalendarCheck, label: "Attendance", href: "/teacher/attendance" },
  { icon: BookOpen, label: "Homework", href: "/teacher/homework" },
  { icon: FileText, label: "Notes", href: "/teacher/notes" },
  { icon: Trophy, label: "Results", href: "/teacher/results" },
];

const quickActions = [
  { label: "Mark Attendance", href: "/teacher/attendance", icon: CalendarCheck, color: "from-blue-500 to-blue-600", desc: "Record today's attendance" },
  { label: "Upload Homework", href: "/teacher/homework", icon: BookOpen, color: "from-violet-500 to-violet-600", desc: "Assign homework to class" },
  { label: "Upload Notes", href: "/teacher/notes", icon: FileText, color: "from-emerald-500 to-emerald-600", desc: "Share study materials" },
  { label: "Publish Results", href: "/teacher/results", icon: Trophy, color: "from-amber-500 to-amber-600", desc: "Enter marks & grades" },
];

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ classCount: 0, studentCount: 0, pendingHw: 0 });
  const [schedule, setSchedule] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchDashboardData = async () => {
      try {
        setError(null);

        // Fetch teacher's classes
        const { data: classes, error: classError } = await supabase
          .from("classes")
          .select("id, name, section")
          .eq("teacher_id", user.id);

        if (classError) throw classError;

        // Count students in teacher's classes
        if (classes && classes.length > 0) {
          const classIds = classes.map(c => c.id);
          const { count: studentCount, error: studentError } = await supabase
            .from("students")
            .select("*", { count: "exact", head: true })
            .in("class_id", classIds);

          if (studentError) throw studentError;

          // Fetch pending homework
          const { count: hwCount, error: hwError } = await supabase
            .from("homework")
            .select("*", { count: "exact", head: true })
            .eq("teacher_id", user.id)
            .gt("due_date", new Date().toISOString());

          if (hwError) throw hwError;

          // Fetch today's timetable
          const dayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
          const { data: timetable, error: ttError } = await supabase
            .from("timetables")
            .select("id, day, period, subject, start_time, end_time, class_id, classes!inner(name, section)")
            .eq("teacher_id", user.id)
            .eq("day", dayName)
            .order("period");

          if (ttError) throw ttError;

          setStats({
            classCount: classes.length,
            studentCount: studentCount || 0,
            pendingHw: hwCount || 0,
          });

          if (timetable) {
            setSchedule(
              timetable.map((t: any) => ({
                time: `${t.start_time} – ${t.end_time}`,
                subject: t.subject,
                class: `${t.classes?.name} ${t.classes?.section}`,
                period: t.period,
              }))
            );
          }
        } else {
          setStats({ classCount: 0, studentCount: 0, pendingHw: 0 });
        }
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id]);

  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening";

  if (loading) {
    return (
      <MobileLayout header={<Header />} bottomNav={<BottomNav items={navItems} />}>
        <div className="flex items-center justify-center py-16">
          <Loader2 size={28} className="animate-spin text-primary" />
        </div>
      </MobileLayout>
    );
  }

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
            <p className="text-white/80 text-sm">{greeting},</p>
            <h2 className="text-xl font-bold mt-0.5">{user?.fullName}</h2>
            <p className="text-white/70 text-xs mt-1">Teacher</p>
            <p className="text-white/60 text-xs mt-1">
              {now.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "My Classes", value: stats.classCount, icon: BookOpen, color: "text-blue-600 bg-blue-50" },
            { label: "My Students", value: stats.studentCount, icon: Users, color: "text-violet-600 bg-violet-50" },
            { label: "Pending HW", value: stats.pendingHw, icon: CalendarCheck, color: "text-amber-600 bg-amber-50" },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}
                className="bg-white rounded-2xl border border-border p-3 text-center shadow-sm">
                <div className={`w-9 h-9 rounded-xl ${stat.color} flex items-center justify-center mx-auto mb-2`}><Icon size={16} /></div>
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground leading-tight">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-sm font-semibold text-muted-foreground">Today's Schedule</h3>
            <Clock size={14} className="text-muted-foreground" />
          </div>
          <div className="space-y-2">
            {schedule.length > 0 ? (
              schedule.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.07 }}
                  className="bg-white rounded-2xl border border-border p-3 flex items-center gap-3 shadow-sm">
                  <div className="w-1 h-12 bg-primary rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{item.subject}</p>
                    <p className="text-xs text-muted-foreground">{item.class} · Period {item.period}</p>
                  </div>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-lg">{item.time}</span>
                </motion.div>
              ))
            ) : (
              <div className="bg-white rounded-2xl border border-border p-4 text-center">
                <p className="text-xs text-muted-foreground">No classes scheduled for today</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-1">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <motion.div key={action.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.07 }}>
                  <Link href={action.href}>
                    <div className={`bg-gradient-to-br ${action.color} rounded-2xl p-4 text-white shadow-sm active:scale-95 transition-transform cursor-pointer`}>
                      <Icon size={22} className="mb-2" />
                      <p className="text-sm font-semibold leading-tight">{action.label}</p>
                      <p className="text-white/70 text-[10px] mt-0.5">{action.desc}</p>
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
