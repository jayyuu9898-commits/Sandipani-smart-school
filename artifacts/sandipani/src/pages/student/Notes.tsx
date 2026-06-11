import { MobileLayout } from "@/components/layout/MobileLayout";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { mockNotes, mockStudents } from "@/data/mockData";
import { LayoutDashboard, BookOpen, FileText, CalendarCheck, Trophy, Download, File, Presentation } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const navItems = [
  { icon: LayoutDashboard, label: "Home", href: "/student" },
  { icon: BookOpen, label: "Homework", href: "/student/homework" },
  { icon: FileText, label: "Notes", href: "/student/notes" },
  { icon: CalendarCheck, label: "Attendance", href: "/student/attendance" },
  { icon: Trophy, label: "Results", href: "/student/results" },
];

const fileTypeConfig: Record<string, { color: string; bg: string; icon: React.ElementType; label: string }> = {
  pdf: { color: "text-red-600", bg: "bg-red-50 border-red-100", icon: FileText, label: "PDF" },
  doc: { color: "text-blue-600", bg: "bg-blue-50 border-blue-100", icon: File, label: "DOC" },
  ppt: { color: "text-orange-600", bg: "bg-orange-50 border-orange-100", icon: Presentation, label: "PPT" },
};

const subjectColors: Record<string, string> = {
  Mathematics: "bg-blue-100 text-blue-700",
  Science: "bg-emerald-100 text-emerald-700",
  English: "bg-violet-100 text-violet-700",
  History: "bg-amber-100 text-amber-700",
  Geography: "bg-rose-100 text-rose-700",
};

export default function StudentNotes() {
  const { user } = useAuth();
  const { toast } = useToast();
  const student = mockStudents.find(s => s.name === user?.name) ?? mockStudents[0];
  const notes = mockNotes.filter(n => n.classId === student.classId);

  const handleDownload = (title: string) => {
    toast({ title: "Download started", description: `"${title}" is being downloaded.` });
  };

  return (
    <MobileLayout header={<Header title="Study Notes" />} bottomNav={<BottomNav items={navItems} />}>
      <div className="p-4 space-y-4">
        <p className="text-xs text-muted-foreground px-1">{notes.length} note{notes.length !== 1 ? "s" : ""} available</p>

        <div className="space-y-3">
          {notes.map((note, i) => {
            const cfg = fileTypeConfig[note.fileType] ?? fileTypeConfig.pdf;
            const Icon = cfg.icon;
            const subjColor = subjectColors[note.subject] ?? "bg-gray-100 text-gray-600";
            return (
              <motion.div key={note.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white rounded-2xl border border-border p-4 shadow-sm"
                data-testid={`card-note-${note.id}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                    <Icon size={22} className={cfg.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground leading-snug">{note.title}</p>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md inline-block mt-1 ${subjColor}`}>{note.subject}</span>
                    {note.content && <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{note.content}</p>}
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-lg flex-shrink-0 ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    Uploaded {new Date(note.uploadedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </span>
                  <Button size="sm" variant="outline" className="h-7 text-xs gap-1.5 rounded-lg" onClick={() => handleDownload(note.title)} data-testid={`button-download-${note.id}`}>
                    <Download size={12} /> Download
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </MobileLayout>
  );
}
