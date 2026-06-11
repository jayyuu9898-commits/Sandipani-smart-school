import { useState } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { mockResults, mockStudents } from "@/data/mockData";
import { LayoutDashboard, BookOpen, FileText, CalendarCheck, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { icon: LayoutDashboard, label: "Home", href: "/student" },
  { icon: BookOpen, label: "Homework", href: "/student/homework" },
  { icon: FileText, label: "Notes", href: "/student/notes" },
  { icon: CalendarCheck, label: "Attendance", href: "/student/attendance" },
  { icon: Trophy, label: "Results", href: "/student/results" },
];

const gradeConfig: Record<string, { bg: string; text: string }> = {
  "A+": { bg: "bg-emerald-100", text: "text-emerald-700" },
  "A": { bg: "bg-green-100", text: "text-green-700" },
  "B+": { bg: "bg-blue-100", text: "text-blue-700" },
  "B": { bg: "bg-indigo-100", text: "text-indigo-700" },
  "C": { bg: "bg-amber-100", text: "text-amber-700" },
  "F": { bg: "bg-red-100", text: "text-red-700" },
};

const subjectColors: Record<string, string> = {
  Mathematics: "bg-blue-500",
  Science: "bg-emerald-500",
  English: "bg-violet-500",
  History: "bg-amber-500",
  Geography: "bg-rose-500",
};

export default function StudentResults() {
  const { user } = useAuth();
  const student = mockStudents.find(s => s.name === user?.name) ?? mockStudents[0];
  const myResults = mockResults.filter(r => r.studentId === student.id);

  const examTypes = [...new Set(myResults.map(r => r.examType))];
  const [selectedExam, setSelectedExam] = useState(examTypes[0] ?? "");

  const filtered = myResults.filter(r => r.examType === selectedExam);
  const avgPct = filtered.length > 0 ? Math.round(filtered.reduce((acc, r) => acc + (r.marks / r.totalMarks) * 100, 0) / filtered.length) : 0;
  const totalMarks = filtered.reduce((acc, r) => acc + r.marks, 0);
  const maxMarks = filtered.reduce((acc, r) => acc + r.totalMarks, 0);

  const pctColor = avgPct >= 80 ? "text-emerald-600" : avgPct >= 60 ? "text-blue-600" : avgPct >= 40 ? "text-amber-600" : "text-red-600";

  return (
    <MobileLayout header={<Header title="My Results" />} bottomNav={<BottomNav items={navItems} />}>
      <div className="p-4 space-y-4">
        <div>
          <p className="text-xs text-muted-foreground mb-2">Select Exam</p>
          <div className="flex gap-2 flex-wrap">
            {examTypes.map(exam => (
              <button key={exam} onClick={() => setSelectedExam(exam)}
                className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${selectedExam === exam ? "bg-primary text-white shadow-sm" : "bg-white border border-border text-muted-foreground"}`}
                data-testid={`button-exam-${exam.replace(/\s+/g, "-").toLowerCase()}`}
              >
                {exam}
              </button>
            ))}
          </div>
        </div>

        {filtered.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-xs">{selectedExam} — Overall</p>
                <p className="text-4xl font-bold mt-1">{avgPct}%</p>
                <p className="text-white/70 text-xs mt-1">{totalMarks} / {maxMarks} marks</p>
              </div>
              <div className="text-right">
                <Trophy size={40} className="text-white/30 mb-1" />
                <span className="text-lg font-bold">{filtered[0]?.grade}</span>
              </div>
            </div>
          </motion.div>
        )}

        <div className="space-y-2">
          {filtered.map((result, i) => {
            const pct = Math.round((result.marks / result.totalMarks) * 100);
            const grade = gradeConfig[result.grade] ?? { bg: "bg-gray-100", text: "text-gray-700" };
            const barColor = subjectColors[result.subject] ?? "bg-primary";
            return (
              <motion.div key={result.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-border p-4 shadow-sm"
                data-testid={`card-result-${result.id}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-sm">{result.subject}</p>
                  <Badge className={`text-xs font-bold ${grade.bg} ${grade.text} border-0`}>{result.grade}</Badge>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-2 rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-sm font-semibold text-foreground w-16 text-right">{result.marks}/{result.totalMarks}</span>
                </div>
                <p className="text-xs text-muted-foreground">{pct}% score</p>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-border p-8 text-center">
            <Trophy size={32} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No results for this exam</p>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
