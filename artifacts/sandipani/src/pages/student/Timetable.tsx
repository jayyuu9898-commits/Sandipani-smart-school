import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { LayoutDashboard, BookOpen, FileText, CalendarCheck, Trophy, Clock, Loader2 } from "lucide-react";
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
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [timetable, setTimetable] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchTimetable = async () => {
      try {
        setError(null);

        // Get student's class
        const { data: student, error: stdErr } = await supabase
          .from("students")
          .select("class_id")
          .eq("id", user.id)
          .single();

        if (stdErr) throw stdErr;
        if (!student) throw new Error("Student record not found");

        // Get timetable for student's class with teacher info
        const { data: ttData, error: ttErr } = await supabase
          .from("timetables")
          .select("id, period, subject, start_time, end_time, day, teachers(full_name)")
          .eq("class_id", student.class_id)
          .order("day")
          .order("period");

        if (ttErr) throw ttErr;
        setTimetable(ttData || []);

        // Set default day
        const today = new Date().getDay();
        const todayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][today];
        if (days.includes(todayName)) {
          setSelectedDay(todayName);
        }
      } catch (err: any) {
        console.error("Error fetching timetable:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, [user?.id]);

  if (loading) {
    return (
      <MobileLayout header={<Header title="Timetable" />} bottomNav={<BottomNav items={navItems} />}>
        <div className="flex items-center justify-center py-16">
          <Loader2 size={28} className="animate-spin text-primary" />
        </div>
      </MobileLayout>
    );
  }

  const today = new Date().getDay();
  const todayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][today];

  const periods = timetable
    .filter(t => t.day === selectedDay)
    .sort((a, b) => a.period - b.period);

  const allPeriods = Array.from({ length: 8 }, (_, i) => i + 1);

  return (
    <MobileLayout header={<Header title="Timetable" />} bottomNav={<BottomNav items={navItems} />}>
      <div className="p-4 space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
            <p className="text-red-700 text-xs">{error}</p>
          </div>
        )}

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
              >
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="w-7 h-7 bg-muted rounded-lg flex items-center justify-center text-xs font-bold text-muted-foreground flex-shrink-0">
                    {periodNum}
                  </div>
                  {entry ? (
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm ${textColor}`}>{entry.subject}</p>
                      <p className="text-xs text-muted-foreground">{entry.teachers?.full_name || "Teacher"}</p>
                    </div>
                  ) : (
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground italic">Free Period</p>
                    </div>
                  )}
                  {entry && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground bg-white/70 px-2 py-1 rounded-lg">
                      <Clock size={11} />
                      {entry.start_time} – {entry.end_time}
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
