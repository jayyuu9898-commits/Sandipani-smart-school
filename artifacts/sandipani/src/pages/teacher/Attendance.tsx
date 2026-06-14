import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { LayoutDashboard, CalendarCheck, BookOpen, FileText, Trophy, Check, X, Clock, Loader2 } from "lucide-react";
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
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [classStudents, setClassStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<Record<string, AttStatus>>({});
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().split("T")[0];
  const todayDisplay = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });

  // Fetch teacher's classes
  useEffect(() => {
    if (!user?.id) return;

    const fetchClasses = async () => {
      try {
        const { data, error: err } = await supabase
          .from("classes")
          .select("id, name, section")
          .eq("teacher_id", user.id);

        if (err) throw err;
        setClasses(data || []);
        if (data && data.length > 0) {
          setSelectedClass(data[0].id);
        }
      } catch (err: any) {
        console.error("Error fetching classes:", err);
        setError(err.message);
      }
    };

    fetchClasses();
  }, [user?.id]);

  // Fetch students for selected class and today's attendance
  useEffect(() => {
    if (!selectedClass) return;

    const fetchStudentsAndAttendance = async () => {
      try {
        setLoading(true);
        setError(null);
        setSubmitted(false);

        // Get students in class
        const { data: students, error: studErr } = await supabase
          .from("students")
          .select("id, full_name, roll_no")
          .eq("class_id", selectedClass);

        if (studErr) throw studErr;
        setClassStudents(students || []);

        // Get today's attendance records
        const { data: attRecords, error: attErr } = await supabase
          .from("attendance")
          .select("student_id, status")
          .eq("class_id", selectedClass)
          .eq("date", today);

        if (attErr) throw attErr;

        // Initialize attendance state
        const attMap: Record<string, AttStatus> = {};
        students?.forEach(s => {
          const existing = attRecords?.find(a => a.student_id === s.id);
          attMap[s.id] = existing ? existing.status : "present";
        });
        setAttendance(attMap);
      } catch (err: any) {
        console.error("Error fetching attendance:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentsAndAttendance();
  }, [selectedClass, today]);

  const setStatus = (studentId: string, status: AttStatus) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
    setSubmitted(false);
  };

  const summary = {
    present: classStudents.filter(s => attendance[s.id] === "present").length,
    absent: classStudents.filter(s => attendance[s.id] === "absent").length,
    late: classStudents.filter(s => attendance[s.id] === "late").length,
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError(null);

      const attendanceRecords = classStudents.map(student => ({
        student_id: student.id,
        class_id: selectedClass,
        date: today,
        status: attendance[student.id] || "present",
        marked_by: user?.id,
      }));

      // Upsert attendance records
      const { error: err } = await supabase
        .from("attendance")
        .upsert(attendanceRecords, { onConflict: "student_id,date" });

      if (err) throw err;

      setSubmitted(true);
      const className = classes.find(c => c.id === selectedClass)?.name;
      toast({ title: "Attendance Saved", description: `Attendance for ${className} recorded successfully.` });
    } catch (err: any) {
      console.error("Error saving attendance:", err);
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").slice(0, 2);

  if (loading && classStudents.length === 0) {
    return (
      <MobileLayout header={<Header title="Mark Attendance" />} bottomNav={<BottomNav items={navItems} />}>
        <div className="flex items-center justify-center py-16">
          <Loader2 size={28} className="animate-spin text-primary" />
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout header={<Header title="Mark Attendance" />} bottomNav={<BottomNav items={navItems} />}>
      <div className="p-4 space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
            <p className="text-red-700 text-xs">{error}</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{todayDisplay}</p>
          {submitted && <Badge className="bg-emerald-500 text-white text-xs">Saved</Badge>}
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-2">Select Class</p>
          <div className="flex gap-2 flex-wrap">
            {classes.map(cls => (
              <button key={cls.id} onClick={() => setSelectedClass(cls.id)}
                className={cn("px-3 py-1.5 rounded-xl text-sm font-medium transition-all", selectedClass === cls.id ? "bg-primary text-white shadow-sm" : "bg-white border border-border text-muted-foreground")}
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
              >
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs flex-shrink-0">
                  {getInitials(student.full_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{student.full_name}</p>
                  <p className="text-xs text-muted-foreground">Roll #{student.roll_no}</p>
                </div>
                <div className="flex gap-1.5">
                  {(["present", "absent", "late"] as AttStatus[]).map(s => (
                    <button key={s} onClick={() => setStatus(student.id, s)}
                      className={cn("w-8 h-8 rounded-xl flex items-center justify-center transition-all text-xs font-bold",
                        status === s
                          ? s === "present" ? "bg-emerald-500 text-white" : s === "absent" ? "bg-red-500 text-white" : "bg-amber-500 text-white"
                          : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                      )}
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
          <Button 
            className="w-full h-12 rounded-xl text-base font-semibold" 
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
            {submitted ? "Update Attendance" : "Save Attendance"}
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}
