import { useState } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { mockStudents, mockClasses, mockResults, Result } from "@/data/mockData";
import { LayoutDashboard, CalendarCheck, BookOpen, FileText, Trophy, Save } from "lucide-react";
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
  const [selectedClass, setSelectedClass] = useState("c1");
  const [selectedExam, setSelectedExam] = useState(examTypes[0]);
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]);
  const [marks, setMarks] = useState<Record<string, string>>({});
  const [published, setPublished] = useState(false);
  const { toast } = useToast();

  const classStudents = mockStudents.filter(s => s.classId === selectedClass);

  const getExistingMark = (studentId: string) => {
    const r = mockResults.find(r => r.studentId === studentId && r.subject === selectedSubject && r.examType === selectedExam);
    return r ? String(r.marks) : "";
  };

  const getMark = (studentId: string) => marks[studentId] ?? getExistingMark(studentId);

  const handlePublish = () => {
    setPublished(true);
    toast({ title: "Results Published", description: `${selectedSubject} results for ${mockClasses.find(c => c.id === selectedClass)?.name} published.` });
  };

  const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").slice(0, 2);

  return (
    <MobileLayout header={<Header title="Publish Results" />} bottomNav={<BottomNav items={navItems} />}>
      <div className="p-4 space-y-4">
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-2">Class</p>
            <div className="flex gap-2 flex-wrap">
              {mockClasses.map(cls => (
                <button key={cls.id} onClick={() => { setSelectedClass(cls.id); setPublished(false); setMarks({}); }}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${selectedClass === cls.id ? "bg-primary text-white" : "bg-white border border-border text-muted-foreground"}`}
                  data-testid={`button-class-${cls.id}`}
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
          {classStudents.map((student, i) => {
            const m = getMark(student.id);
            const grade = m ? calcGrade(Number(m), 100) : "-";
            return (
              <motion.div key={student.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                className="flex items-center gap-2 px-4 py-2.5 border-t border-border"
                data-testid={`row-result-${student.id}`}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                    {getInitials(student.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">{student.name}</p>
                    <p className="text-[10px] text-muted-foreground">Roll #{student.rollNo}</p>
                  </div>
                </div>
                <div className="w-20 flex justify-center">
                  <Input
                    type="number" min="0" max="100" placeholder="—"
                    value={m}
                    onChange={e => setMarks(prev => ({ ...prev, [student.id]: e.target.value }))}
                    className="w-16 h-8 text-center text-sm px-2 rounded-lg"
                    data-testid={`input-marks-${student.id}`}
                  />
                </div>
                <div className="w-12 flex justify-center">
                  {m ? <Badge className={`text-[10px] px-1.5 ${gradeColor[grade] ?? "bg-gray-100 text-gray-600"}`}>{grade}</Badge> : <span className="text-xs text-muted-foreground">—</span>}
                </div>
              </motion.div>
            );
          })}
        </div>

        <Button className="w-full h-12 rounded-xl text-base font-semibold" onClick={handlePublish} data-testid="button-publish-results">
          <Save size={16} className="mr-2" />
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
