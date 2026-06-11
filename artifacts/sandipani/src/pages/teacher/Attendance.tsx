import { useState } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { mockStudents, mockClasses } from "@/data/mockData";
import { LayoutDashboard, CalendarCheck, BookOpen, FileText, Trophy, Check, X, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/teacher" },
  { icon: CalendarCheck, label: "Attendance", href: "/teacher/attendance" },
  { icon: BookOpen, label: "Homework", href: "/teacher/homework" },
  { icon: FileText, label: "Notes", href: "/teacher/notes" },
  { icon: Trophy, label: "Results", href: "/teacher/results" },
];

type AttStatus = "present" | "absent" | "late";

export default function TeacherAttendance() {
  const [selectedClass, setSelectedClass] = useState("c1");
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const classStudents = mockStudents.filter(s => s.classId === selectedClass);
  const [attendance, setAttendance] = useState<Record<string, AttStatus>>(() => {
    const init: Record<string, AttStatus> = {};
    mockStudents.forEach(s => { init[s.id] = "present"; });
    return init;
  });

  const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });

  const setStatus = (studentId: string, status: AttStatus) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const summary = {
    present: classStudents.filter(s => attendance[s.id] === "present").length,
    absent: classStudents.filter(s => attendance[s.id] === "absent").length,
    late: classStudents.filter(s => attendance[s.id] === "late").length,
  };

  const handleSubmit = () => {
    setSubmitted(true);
    toast({ title: "Attendance Saved", description: `Attendance for ${mockClasses.find(c => c.id === selectedClass)?.name} recorded.` });
  };

  const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").slice(0, 2);

  return (
    <MobileLayout header={<Header title="Mark Attendance" />} bottomNav={<BottomNav items={navItems} />}>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{today}</p>
          {submitted && <Badge className="bg-emerald-500 text-white text-xs">Saved</Badge>}
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-2">Select Class</p>
          <div className="flex gap-2 flex-wrap">
            {mockClasses.map(cls => (
              <button key={cls.id} onClick={() => { setSelectedClass(cls.id); setSubmitted(false); }}
                className={cn("px-3 py-1.5 rounded-xl text-sm font-medium transition-all", selectedClass === cls.id ? "bg-primary text-white shadow-sm" : "bg-white border border-border text-muted-foreground")}
                data-testid={`button-class-${cls.id}`}
              >
                {cls.name} {cls.section}
              </button>
            ))}
          </div>
        </div>

        {submitted && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-3 gap-3">
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3 text-center">
              <p className="text-2xl font-bold text-emerald-600">{summary.present}</p>
              <p className="text-xs text-emerald-600">Present</p>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-2xl p-3 text-center">
              <p className="text-2xl font-bold text-red-600">{summary.absent}</p>
              <p className="text-xs text-red-600">Absent</p>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3 text-center">
              <p className="text-2xl font-bold text-amber-600">{summary.late}</p>
              <p className="text-xs text-amber-600">Late</p>
            </div>
          </motion.div>
        )}

        <div className="space-y-2">
          {classStudents.map((student, i) => {
            const status = attendance[student.id];
            return (
              <motion.div key={student.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="bg-white rounded-2xl border border-border p-3 flex items-center gap-3 shadow-sm"
                data-testid={`row-student-${student.id}`}
              >
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs flex-shrink-0">
                  {getInitials(student.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{student.name}</p>
                  <p className="text-xs text-muted-foreground">Roll #{student.rollNo}</p>
                </div>
                <div className="flex gap-1.5">
                  {(["present", "absent", "late"] as AttStatus[]).map(s => (
                    <button key={s} onClick={() => setStatus(student.id, s)}
                      className={cn("w-8 h-8 rounded-xl flex items-center justify-center transition-all text-xs font-bold",
                        status === s
                          ? s === "present" ? "bg-emerald-500 text-white" : s === "absent" ? "bg-red-500 text-white" : "bg-amber-500 text-white"
                          : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                      )}
                      data-testid={`button-${s}-${student.id}`}
                    >
                      {s === "present" ? <Check size={14} /> : s === "absent" ? <X size={14} /> : <Clock size={14} />}
                    </button>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="pb-2">
          <Button className="w-full h-12 rounded-xl text-base font-semibold" onClick={handleSubmit} data-testid="button-submit-attendance">
            {submitted ? "Update Attendance" : "Save Attendance"}
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}
