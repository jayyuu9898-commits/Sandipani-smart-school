import { MobileLayout } from "@/components/layout/MobileLayout";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { mockAttendance, mockStudents } from "@/data/mockData";
import { LayoutDashboard, BookOpen, FileText, CalendarCheck, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Home", href: "/student" },
  { icon: BookOpen, label: "Homework", href: "/student/homework" },
  { icon: FileText, label: "Notes", href: "/student/notes" },
  { icon: CalendarCheck, label: "Attendance", href: "/student/attendance" },
  { icon: Trophy, label: "Results", href: "/student/results" },
];

const statusConfig = {
  present: { color: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50 border-emerald-100", label: "Present" },
  absent: { color: "bg-red-500", text: "text-red-700", bg: "bg-red-50 border-red-100", label: "Absent" },
  late: { color: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50 border-amber-100", label: "Late" },
};

export default function StudentAttendance() {
  const { user } = useAuth();
  const student = mockStudents.find(s => s.name === user?.name) ?? mockStudents[0];
  const myAttendance = mockAttendance.filter(a => a.studentId === student.id);

  const present = myAttendance.filter(a => a.status === "present").length;
  const absent = myAttendance.filter(a => a.status === "absent").length;
  const late = myAttendance.filter(a => a.status === "late").length;
  const total = myAttendance.length;
  const pct = total > 0 ? Math.round((present / total) * 100) : 0;

  const pctColor = pct >= 75 ? "text-emerald-600" : pct >= 60 ? "text-amber-600" : "text-red-600";
  const progressColor = pct >= 75 ? "bg-emerald-500" : pct >= 60 ? "bg-amber-500" : "bg-red-500";

  const sorted = [...myAttendance].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <MobileLayout header={<Header title="My Attendance" />} bottomNav={<BottomNav items={navItems} />}>
      <div className="p-4 space-y-5">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl border border-border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-muted-foreground">Overall Attendance</p>
              <p className={`text-4xl font-bold mt-1 ${pctColor}`}>{pct}%</p>
              <p className="text-xs text-muted-foreground mt-1">{total} school days tracked</p>
            </div>
            <div className="w-20 h-20 relative flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                <circle cx="18" cy="18" r="15" fill="none"
                  stroke={pct >= 75 ? "#10b981" : pct >= 60 ? "#f59e0b" : "#ef4444"}
                  strokeWidth="3"
                  strokeDasharray={`${(pct / 100) * 94.2} 94.2`}
                  strokeLinecap="round"
                />
              </svg>
              <span className={`absolute text-sm font-bold ${pctColor}`}>{pct}%</span>
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-2 mb-4">
            <div className={`h-2 rounded-full transition-all ${progressColor}`} style={{ width: `${pct}%` }} />
          </div>
          {pct < 75 && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
              <p className="text-xs text-amber-700 font-medium">Attendance below 75%. Please attend more classes to meet the requirement.</p>
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Present", value: present, key: "present" },
            { label: "Absent", value: absent, key: "absent" },
            { label: "Late", value: late, key: "late" },
          ].map((s, i) => {
            const cfg = statusConfig[s.key as keyof typeof statusConfig];
            return (
              <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.07 }}
                className={`rounded-2xl border p-3 text-center ${cfg.bg}`}>
                <p className={`text-2xl font-bold ${cfg.text}`}>{s.value}</p>
                <p className={`text-xs font-medium ${cfg.text}`}>{s.label}</p>
              </motion.div>
            );
          })}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-1">Attendance History</h3>
          <div className="space-y-2">
            {sorted.length === 0 && (
              <div className="bg-white rounded-2xl border border-border p-8 text-center">
                <CalendarCheck size={32} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No attendance records yet</p>
              </div>
            )}
            {sorted.map((record, i) => {
              const cfg = statusConfig[record.status];
              return (
                <motion.div key={`${record.studentId}-${record.date}-${i}`}
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.04 }}
                  className="bg-white rounded-xl border border-border px-4 py-3 flex items-center gap-3 shadow-sm"
                  data-testid={`row-attendance-${i}`}
                >
                  <div className={`w-2 h-2 rounded-full ${cfg.color} flex-shrink-0`} />
                  <p className="text-sm text-foreground flex-1">
                    {new Date(record.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                  </p>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
