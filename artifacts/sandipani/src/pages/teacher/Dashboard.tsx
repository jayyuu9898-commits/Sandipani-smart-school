import { useAuth } from "@/context/AuthContext";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { mockTeachers, mockStudents, mockHomework, mockClasses } from "@/data/mockData";
import { LayoutDashboard, CalendarCheck, BookOpen, FileText, Trophy, Users, Clock, ChevronRight } from "lucide-react";
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

const schedule = [
  { time: "08:00 – 08:45", subject: "Mathematics", class: "Class 8A", period: 1 },
  { time: "09:45 – 10:30", subject: "Mathematics", class: "Class 9B", period: 3 },
  { time: "11:30 – 12:15", subject: "Mathematics", class: "Class 8A", period: 5 },
];

export default function TeacherDashboard() {
  const { user } = useAuth();
  const teacher = mockTeachers.find(t => t.name === user?.name) ?? mockTeachers[0];
  const myStudents = mockStudents.filter(s => teacher.classIds.includes(s.classId));
  const pendingHw = mockHomework.filter(h => h.teacherId === teacher.id && new Date(h.dueDate) > new Date());
  const myClasses = mockClasses.filter(c => teacher.classIds.includes(c.id));

  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening";

  return (
    <MobileLayout header={<Header />} bottomNav={<BottomNav items={navItems} />}>
      <div className="p-4 space-y-5">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-5 text-white shadow-lg">
            <p className="text-white/80 text-sm">{greeting},</p>
            <h2 className="text-xl font-bold mt-0.5">{user?.name}</h2>
            <p className="text-white/70 text-xs mt-1">{teacher.subject} Teacher</p>
            <p className="text-white/60 text-xs mt-1">
              {now.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "My Classes", value: myClasses.length, icon: BookOpen, color: "text-blue-600 bg-blue-50" },
            { label: "My Students", value: myStudents.length, icon: Users, color: "text-violet-600 bg-violet-50" },
            { label: "Pending HW", value: pendingHw.length, icon: CalendarCheck, color: "text-amber-600 bg-amber-50" },
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
            {schedule.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.07 }}
                className="bg-white rounded-2xl border border-border p-3 flex items-center gap-3 shadow-sm">
                <div className="w-1 h-12 bg-primary rounded-full flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-sm">{item.subject}</p>
                  <p className="text-xs text-muted-foreground">{item.class} · Period {item.period}</p>
                </div>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-lg">{item.time}</span>
              </motion.div>
            ))}
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
