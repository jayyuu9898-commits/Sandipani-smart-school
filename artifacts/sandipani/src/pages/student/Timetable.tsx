import { useState } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { mockTimetable } from "@/data/mockData";
import { LayoutDashboard, BookOpen, FileText, CalendarCheck, Trophy, Clock } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { icon: LayoutDashboard, label: "Home", href: "/student" },
  { icon: BookOpen, label: "Homework", href: "/student/homework" },
  { icon: FileText, label: "Notes", href: "/student/notes" },
  { icon: CalendarCheck, label: "Attendance", href: "/student/attendance" },
  { icon: Trophy, label: "Results", href: "/student/results" },
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const dayShort: Record<string, string> = { Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed", Thursday: "Thu", Friday: "Fri", Saturday: "Sat" };

const subjectColors: Record<string, string> = {
  Mathematics: "border-l-blue-500 bg-blue-50",
  Science: "border-l-emerald-500 bg-emerald-50",
  English: "border-l-violet-500 bg-violet-50",
  History: "border-l-amber-500 bg-amber-50",
  Geography: "border-l-rose-500 bg-rose-50",
  Games: "border-l-green-500 bg-green-50",
  Library: "border-l-indigo-500 bg-indigo-50",
};

const subjectTextColors: Record<string, string> = {
  Mathematics: "text-blue-700",
  Science: "text-emerald-700",
  English: "text-violet-700",
  History: "text-amber-700",
  Geography: "text-rose-700",
  Games: "text-green-700",
  Library: "text-indigo-700",
};

export default function StudentTimetable() {
  const today = new Date().getDay();
  const todayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][today];
  const defaultDay = days.includes(todayName) ? todayName : "Monday";
  const [selectedDay, setSelectedDay] = useState(defaultDay);

  const periods = mockTimetable
    .filter(t => t.day === selectedDay)
    .sort((a, b) => a.period - b.period);

  const allPeriods = Array.from({ length: 8 }, (_, i) => i + 1);

  return (
    <MobileLayout header={<Header title="Timetable" />} bottomNav={<BottomNav items={navItems} />}>
      <div className="p-4 space-y-4">
        <div>
          <p className="text-xs text-muted-foreground mb-2">Select Day</p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {days.map(day => {
              const isToday = day === todayName;
              const isSelected = day === selectedDay;
              return (
                <button key={day} onClick={() => setSelectedDay(day)}
                  className={`flex-shrink-0 px-3 py-2 rounded-xl text-sm font-medium transition-all min-w-[60px] ${
                    isSelected ? "bg-primary text-white shadow-sm" : isToday ? "bg-primary/10 text-primary border border-primary/20" : "bg-white border border-border text-muted-foreground"
                  }`}
                  data-testid={`button-day-${day.toLowerCase()}`}
                >
                  {dayShort[day]}
                  {isToday && <span className="block text-[8px] font-semibold mt-0.5 opacity-70">TODAY</span>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          {allPeriods.map((periodNum, i) => {
            const entry = periods.find(p => p.period === periodNum);
            const colorClass = entry ? (subjectColors[entry.subject] ?? "border-l-gray-400 bg-gray-50") : "bg-white";
            const textColor = entry ? (subjectTextColors[entry.subject] ?? "text-gray-700") : "text-muted-foreground";

            return (
              <motion.div key={periodNum} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className={`rounded-2xl border border-border ${entry ? `border-l-4 ${colorClass}` : "bg-white"} shadow-sm overflow-hidden`}
                data-testid={`row-period-${periodNum}`}
              >
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="w-7 h-7 bg-muted rounded-lg flex items-center justify-center text-xs font-bold text-muted-foreground flex-shrink-0">
                    {periodNum}
                  </div>
                  {entry ? (
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm ${textColor}`}>{entry.subject}</p>
                      <p className="text-xs text-muted-foreground">{entry.teacherName}</p>
                    </div>
                  ) : (
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground italic">Free Period</p>
                    </div>
                  )}
                  {entry && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground bg-white/70 px-2 py-1 rounded-lg">
                      <Clock size={11} />
                      {entry.time}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </MobileLayout>
  );
}
