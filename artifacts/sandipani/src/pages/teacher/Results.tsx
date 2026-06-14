import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { LayoutDashboard, CalendarCheck, BookOpen, FileText, Trophy, Save, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/teacher" },
  { icon: CalendarCheck, label: "Attendance", href: "/teacher/attendance" },
  { icon: BookOpen, label: "Homework", href: "/teacher/homework" },
  { icon: FileText, label: "Notes", href: "/teacher/notes" },
  { icon: Trophy, label: "Results", href: "/teacher/results" },
];

const examTypes = ["Unit Test 1", "Unit Test 2", "Mid Term", "Final Exam"];
const subjects = ["Mathematics", "Science", "English", "History", "Geography"];

const calcGrade = (marks: number, total: number): string => {
  const pct = (marks / total) * 100;
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B+";
  if (pct >= 60) return "B";
  if (pct >= 50) return "C";
  return "F";
};

const gradeColor: Record<string, string> = {
  "A+": "bg-emerald-100 text-emerald-700",
  "A": "bg-green-100 text-green-700",
  "B+": "bg-blue-100 text-blue-700",
  "B": "bg-indigo-100 text-indigo-700",
  "C": "bg-amber-100 text-amber-700",
  "F": "bg-red-100 text-red-700",
};

export default function TeacherResults() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedExam, setSelectedExam] = useState(examTypes[0]);
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]);
  const [marks, setMarks] = useState<Record<string, string>>({});
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [user?.id]);

  // Fetch students for selected class
  useEffect(() => {
    if (!selectedClass) return;

    const fetchStudents = async () => {
      try {
        const { data, error: err } = await supabase
          .from("students")
          .select("id, full_name, roll_no")
          .eq("class_id", selectedClass)
          .order("roll_no");

        if (err) throw err;
        setStudents(data || []);
      } catch (err: any) {
        console.error("Error fetching students:", err);
      }
    };

    fetchStudents();
  }, [selectedClass]);

  // Fetch existing results
  useEffect(() => {
    if (!selectedClass || !selectedExam || !selectedSubject) return;

    const fetchResults = async () => {
      try {
        const { data, error: err } = await supabase
          .from("exam_results")
          .select("student_id, marks_obtained, max_marks, grade")
          .eq("exam_type", selectedExam)
          .eq("subject", selectedSubject)
          .in("student_id", students.map(s => s.id));

        if (err) throw err;

        const marksMap: Record<string, string> = {};
        data?.forEach(r => {
          marksMap[r.student_id] = String(r.marks_obtained);
        });
        setMarks(marksMap);
        setResults(data || []);
        setPublished(false);
      } catch (err: any) {
        console.error("Error fetching results:", err);
      }
    };

    if (students.length > 0) {
      fetchResults();
    }
  }, [selectedClass, selectedExam, selectedSubject, students]);

  const getMark = (studentId: string) => marks[studentId] ?? "";

  const handlePublish = async () => {
    try {
      setSaving(true);
      setError(null);

      const recordsToInsert = students
        .filter(s => marks[s.id])
        .map(s => {
          const m = Number(marks[s.id]);
          return {
            student_id: s.id,
            exam_type: selectedExam,
            subject: selectedSubject,
            marks_obtained: m,
            max_marks: 100,
            grade: calcGrade(m, 100),
            exam_date: new Date().toISOString().split("T")[0],
            academic_year: new Date().getFullYear().toString(),
            created_by: user?.id,
          };
        });

      if (recordsToInsert.length === 0) {
        toast({ title: "Error", description: "Please enter marks for at least one student", variant: "destructive" });
        return;
      }

      const { error: err } = await supabase
        .from("exam_results")
        .upsert(recordsToInsert, {
          onConflict: "student_id,exam_type,subject",
        });

      if (err) throw err;

      setPublished(true);
      toast({ title: "Results Published", description: `${selectedSubject} results for ${classes.find(c => c.id === selectedClass)?.name} published.` });
    } catch (err: any) {
      console.error("Error publishing results:", err);
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").slice(0, 2);

  if (loading) {
    return (
      <MobileLayout header={<Header title="Publish Results" />} bottomNav={<BottomNav items={navItems} />}>
        <div className="flex items-center justify-center py-16">
          <Loader2 size={28} className="animate-spin text-primary" />
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout header={<Header title="Publish Results" />} bottomNav={<BottomNav items={navItems} />}>
      <div className="p-4 space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
            <p className="text-red-700 text-xs">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-2">Class</p>
            <div className="flex gap-2 flex-wrap">
              {classes.map(cls => (
                <button key={cls.id} onClick={() => { setSelectedClass(cls.id); setPublished(false); setMarks({}); }}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${selectedClass === cls.id ? "bg-primary text-white" : "bg-white border border-border text-muted-foreground"}`}
                >
                  {cls.name} {cls.section}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Exam Type</p>
              <select className="w-full border rounded-xl px-3 py-2 text-sm bg-white" value={selectedExam} onChange={e => { setSelectedExam(e.target.value); setPublished(false); }}>
                {examTypes.map(e => <option key={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Subject</p>
              <select className="w-full border rounded-xl px-3 py-2 text-sm bg-white" value={selectedSubject} onChange={e => { setSelectedSubject(e.target.value); setPublished(false); }}>
                {subjects.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="px-4 py-2.5 bg-muted flex items-center">
            <span className="text-xs font-semibold text-muted-foreground flex-1">Student</span>
            <span className="text-xs font-semibold text-muted-foreground w-20 text-center">Marks /100</span>
            <span className="text-xs font-semibold text-muted-foreground w-12 text-center">Grade</span>
          </div>
          {students.length > 0 ? (
            students.map((student, i) => {
              const m = getMark(student.id);
              const grade = m ? calcGrade(Number(m), 100) : "-";
              return (
                <motion.div key={student.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-2 px-4 py-2.5 border-t border-border"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                      {getInitials(student.full_name)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate">{student.full_name}</p>
                      <p className="text-[10px] text-muted-foreground">Roll #{student.roll_no}</p>
                    </div>
                  </div>
                  <div className="w-20 flex justify-center">
                    <Input
                      type="number" min="0" max="100" placeholder="—"
                      value={m}
                      onChange={e => setMarks(prev => ({ ...prev, [student.id]: e.target.value }))}
                      className="w-16 h-8 text-center text-sm px-2 rounded-lg"
                    />
                  </div>
                  <div className="w-12 flex justify-center">
                    {m ? <Badge className={`text-[10px] px-1.5 ${gradeColor[grade] ?? "bg-gray-100 text-gray-600"}`}>{grade}</Badge> : <span className="text-xs text-muted-foreground">—</span>}
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="px-4 py-8 text-center">
              <p className="text-xs text-muted-foreground">No students in this class</p>
            </div>
          )}
        </div>

        <Button 
          className="w-full h-12 rounded-xl text-base font-semibold" 
          onClick={handlePublish}
          disabled={saving || students.length === 0}
        >
          {saving ? <Loader2 size={16} className="animate-spin mr-2" /> : <Save size={16} className="mr-2" />}
          {published ? "Update Results" : "Publish Results"}
        </Button>
        {published && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-xs text-emerald-600 font-medium">
            Results published successfully
          </motion.p>
        )}
      </div>
    </MobileLayout>
  );
}
