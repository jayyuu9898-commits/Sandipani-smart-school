import { MobileLayout } from "@/components/layout/MobileLayout";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { mockHomework, mockStudents } from "@/data/mockData";
import { LayoutDashboard, BookOpen, FileText, CalendarCheck, Trophy, Calendar, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { icon: LayoutDashboard, label: "Home", href: "/student" },
  { icon: BookOpen, label: "Homework", href: "/student/homework" },
  { icon: FileText, label: "Notes", href: "/student/notes" },
  { icon: CalendarCheck, label: "Attendance", href: "/student/attendance" },
  { icon: Trophy, label: "Results", href: "/student/results" },
];

const subjectColors: Record<string, string> = {
  Mathematics: "bg-blue-100 text-blue-700",
  Science: "bg-emerald-100 text-emerald-700",
  English: "bg-violet-100 text-violet-700",
  History: "bg-amber-100 text-amber-700",
  Geography: "bg-rose-100 text-rose-700",
};

export default function StudentHomework() {
  const { user } = useAuth();
  const student = mockStudents.find(s => s.name === user?.name) ?? mockStudents[0];
  const homework = mockHomework
    .filter(h => h.classId === student.classId)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const getDueStatus = (dueDate: string) => {
    const d = new Date(dueDate);
    const now = new Date();
    const diff = Math.ceil((d.getTime() - now.getTime()) / 86400000);
    if (diff < 0) return { label: "Overdue", className: "bg-red-100 text-red-600", icon: "!" };
    if (diff === 0) return { label: "Due Today", className: "bg-amber-100 text-amber-600", icon: "!" };
    if (diff <= 2) return { label: `Due in ${diff}d`, className: "bg-orange-100 text-orange-600", icon: "" };
    return { label: `Due in ${diff}d`, className: "bg-emerald-100 text-emerald-600", icon: "" };
  };

  const overdue = homework.filter(h => new Date(h.dueDate) < new Date()).length;
  const dueToday = homework.filter(h => {
    const d = new Date(h.dueDate).toDateString();
    return d === new Date().toDateString();
  }).length;
  const upcoming = homework.filter(h => new Date(h.dueDate) > new Date()).length;

  return (
    <MobileLayout header={<Header title="Homework" />} bottomNav={<BottomNav items={navItems} />}>
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Upcoming", value: upcoming, color: "bg-emerald-50 border-emerald-100 text-emerald-600" },
            { label: "Due Today", value: dueToday, color: "bg-amber-50 border-amber-100 text-amber-600" },
            { label: "Overdue", value: overdue, color: "bg-red-50 border-red-100 text-red-600" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}
              className={`rounded-2xl border p-3 text-center ${s.color}`}>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-[10px] font-medium">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <h3 className="text-sm font-semibold text-muted-foreground px-1">{homework.length} Assignment{homework.length !== 1 ? "s" : ""}</h3>

        <div className="space-y-2">
          {homework.map((hw, i) => {
            const due = getDueStatus(hw.dueDate);
            const subjColor = subjectColors[hw.subject] ?? "bg-gray-100 text-gray-600";
            return (
              <motion.div key={hw.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
                className="bg-white rounded-2xl border border-border p-4 shadow-sm"
                data-testid={`card-homework-${hw.id}`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground leading-snug">{hw.title}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-1 rounded-lg flex-shrink-0 ${due.className}`}>{due.label}</span>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md inline-block mb-2 ${subjColor}`}>{hw.subject}</span>
                {hw.description && <p className="text-xs text-muted-foreground leading-relaxed">{hw.description}</p>}
                <div className="flex items-center gap-3 mt-2 pt-2 border-t border-border">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar size={11} />
                    {new Date(hw.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock size={11} />
                    Uploaded {new Date(hw.uploadedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </MobileLayout>
  );
}
