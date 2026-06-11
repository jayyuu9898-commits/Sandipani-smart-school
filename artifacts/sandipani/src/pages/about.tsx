import { useAuth } from "@/context/AuthContext";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";
import { LayoutDashboard, Users, UserCheck, BookOpen, GraduationCap, Code2, Info, Calendar, Tag, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

const adminNav = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Users, label: "Students", href: "/admin/students" },
  { icon: UserCheck, label: "Teachers", href: "/admin/teachers" },
  { icon: BookOpen, label: "Classes", href: "/admin/classes" },
  { icon: Info, label: "About", href: "/about" },
];

const teacherNav = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/teacher" },
  { icon: ArrowLeft, label: "Back", href: "/teacher" },
];

const studentNav = [
  { icon: LayoutDashboard, label: "Home", href: "/student" },
  { icon: ArrowLeft, label: "Back", href: "/student" },
];

const details = [
  { icon: GraduationCap, label: "App Name", value: "Sandipani Smart School" },
  { icon: Code2, label: "Developer", value: "Jay Soni" },
  { icon: BookOpen, label: "Class", value: "12th Science" },
  { icon: Tag, label: "Version", value: "1.0" },
  { icon: Calendar, label: "Year", value: "2025" },
];

export default function AboutPage() {
  const { user } = useAuth();

  const navItems =
    user?.role === "admin" ? adminNav :
    user?.role === "teacher" ? teacherNav :
    user?.role === "student" ? studentNav : [];

  return (
    <MobileLayout header={<Header title="About Developer" />} bottomNav={navItems.length > 0 ? <BottomNav items={navItems} /> : undefined}>
      <div className="p-4 space-y-5">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 text-white text-center shadow-lg">
            <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center mx-auto mb-4 shadow-inner">
              <span className="text-3xl font-black text-white">JS</span>
            </div>
            <h2 className="text-2xl font-bold">Jay Soni</h2>
            <p className="text-white/80 text-sm mt-1">Class 12th Science Student</p>
            <div className="mt-3 inline-flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1">
              <Code2 size={12} className="text-white" />
              <span className="text-xs text-white font-medium">Full Stack Developer</span>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-border p-4 shadow-sm">
          <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <Info size={14} className="text-primary" /> About This App
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This application was designed and developed by Jay Soni, a Class 12th Science student, to help students, teachers and parents manage school activities efficiently through a modern digital platform.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="px-4 py-2.5 bg-muted">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">App Details</p>
          </div>
          {details.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div key={item.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.05 }}
                className="flex items-center gap-3 px-4 py-3 border-t border-border">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={14} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-semibold text-foreground">{item.value}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-100 rounded-2xl p-4">
          <h3 className="text-sm font-bold text-indigo-700 mb-2">Features Built</h3>
          <div className="grid grid-cols-2 gap-2">
            {["Role-Based Login", "Admin Dashboard", "Student Portal", "Teacher Portal", "Attendance System", "Homework Manager", "Study Notes", "Results Tracker", "Timetable View", "CRUD Operations"].map((f) => (
              <div key={f} className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                <span className="text-xs text-indigo-700">{f}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
          className="bg-white rounded-2xl border border-border p-4 text-center shadow-sm">
          <p className="text-xs text-muted-foreground">Built with</p>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {["React", "TypeScript", "Vite", "Tailwind CSS", "Framer Motion", "Wouter", "shadcn/ui"].map(t => (
              <span key={t} className="text-[10px] bg-primary/10 text-primary font-medium px-2 py-1 rounded-full">{t}</span>
            ))}
          </div>
        </motion.div>

        <Footer />
      </div>
    </MobileLayout>
  );
}
