import { useAuth } from "@/context/AuthContext";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { mockStudents, mockAttendance, mockHomework, mockResults, mockTimetable } from "@/data/mockData";
import { LayoutDashboard, BookOpen, FileText, CalendarCheck, Trophy, Clock, ChevronRight, GraduationCap } from "lucide-react";
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
  const student = mockStudents.find(s => s.name === user?.name) ?? mockStudents[0];

  const myAttendance = mockAttendance.filter(a => a.studentId === student.id);
  const presentCount = myAttendance.filter(a => a.status === "present").length;
  const attPct = myAttendance.length > 0 ? Math.round((presentCount / myAttendance.length) * 100) : 0;

  const pendingHw = mockHomework.filter(h => h.classId === student.classId && new Date(h.dueDate) > new Date()).length;

  const myResults = mockResults.filter(r => r.studentId === student.id);
  const avgMarks = myResults.length > 0 ? Math.round(myResults.reduce((acc, r) => acc + (r.marks / r.totalMarks) * 100, 0) / myResults.length) : 0;

  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening";
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const todayDay = days[now.getDay()];
  const todayClasses = mockTimetable.filter(t => t.day === todayDay).sort((a, b) => a.period - b.period);

  const getGradeColor = (pct: number) => {
    if (pct >= 80) return "text-emerald-600";
    if (pct >= 60) return "text-blue-600";
    if (pct >= 40) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <MobileLayout header={<Header />} bottomNav={<BottomNav items={navItems} />}>
      <div className="p-4 space-y-5">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <GraduationCap size={24} className="text-white" />
              </div>
              <div>
                <p className="text-white/80 text-sm">{greeting},</p>
                <h2 className="text-xl font-bold">{user?.name}</h2>
              </div>
            </div>
            <p className="text-white/70 text-xs mt-3">
              {now.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Attendance", value: `${attPct}%`, icon: CalendarCheck, color: "text-blue-600 bg-blue-50", good: attPct >= 75 },
            { label: "Pending HW", value: pendingHw, icon: BookOpen, color: "text-violet-600 bg-violet-50", good: pendingHw === 0 },
            { label: "Avg. Score", value: `${avgMarks}%`, icon: Trophy, color: "text-amber-600 bg-amber-50", good: avgMarks >= 75 },
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
              {todayClasses.slice(0, 3).map((item, i) => (
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
