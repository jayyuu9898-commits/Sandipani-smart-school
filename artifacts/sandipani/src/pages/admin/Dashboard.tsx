import { useAuth } from "@/context/AuthContext";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { mockStudents, mockTeachers, mockClasses, mockAttendance } from "@/data/mockData";
import { LayoutDashboard, Users, UserCheck, BookOpen, TrendingUp, CalendarCheck, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Users, label: "Students", href: "/admin/students" },
  { icon: UserCheck, label: "Teachers", href: "/admin/teachers" },
  { icon: BookOpen, label: "Classes", href: "/admin/classes" },
];

const today = new Date().toISOString().split("T")[0];
const todayAttendance = mockAttendance.filter(a => a.date === today);
const presentToday = todayAttendance.filter(a => a.status === "present").length;
const attendancePct = todayAttendance.length > 0 ? Math.round((presentToday / mockStudents.length) * 100) : 0;

const statCards = [
  { label: "Total Students", value: mockStudents.length, icon: Users, color: "bg-blue-50 text-blue-600", border: "border-blue-100" },
  { label: "Total Teachers", value: mockTeachers.length, icon: UserCheck, color: "bg-emerald-50 text-emerald-600", border: "border-emerald-100" },
  { label: "Total Classes", value: mockClasses.length, icon: BookOpen, color: "bg-violet-50 text-violet-600", border: "border-violet-100" },
  { label: "Attendance Today", value: `${attendancePct}%`, icon: CalendarCheck, color: "bg-amber-50 text-amber-600", border: "border-amber-100" },
];

const quickActions = [
  { label: "Manage Students", href: "/admin/students", icon: Users, color: "from-blue-500 to-blue-600" },
  { label: "Manage Teachers", href: "/admin/teachers", icon: UserCheck, color: "from-emerald-500 to-emerald-600" },
  { label: "Manage Classes", href: "/admin/classes", icon: BookOpen, color: "from-violet-500 to-violet-600" },
  { label: "View Reports", href: "/admin", icon: TrendingUp, color: "from-amber-500 to-amber-600" },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening";

  return (
    <MobileLayout
      header={<Header />}
      bottomNav={<BottomNav items={navItems} />}
    >
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
          <div className="grid grid-cols-2 gap-3">
            {statCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.07 }}
                  className={`bg-white rounded-2xl p-4 border ${card.border} shadow-sm`}
                >
                  <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center mb-3`}>
                    <Icon size={20} />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{card.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-1">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28 + i * 0.07 }}
                >
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

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-1">Recent Activity</h3>
          <div className="bg-white rounded-2xl border border-border shadow-sm divide-y divide-border">
            {[
              { text: "New student Rishabh Pant enrolled in Class 10C", time: "2m ago", icon: "📋" },
              { text: "Anjali Sharma marked attendance for Class 8A", time: "1h ago", icon: "✓" },
              { text: "Homework uploaded for Class 9B – Science", time: "3h ago", icon: "📂" },
              { text: "Mid Term results published for Class 8A", time: "Yesterday", icon: "📊" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className="flex items-start gap-3 p-3"
              >
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-sm flex-shrink-0">
                  <TrendingUp size={14} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground leading-snug">{item.text}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
