import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { LayoutDashboard, BookOpen, FileText, CalendarCheck, Trophy, Download, File, Presentation, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
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
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchNotes = async () => {
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

        // Get published notes for student's class
        const { data: notesData, error: notesErr } = await supabase
          .from("notes")
          .select("id, title, content, subject, file_type, created_at")
          .eq("class_id", student.class_id)
          .eq("is_published", true)
          .order("created_at", { ascending: false });

        if (notesErr) throw notesErr;
        setNotes(notesData || []);
      } catch (err: any) {
        console.error("Error fetching notes:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [user?.id]);

  const handleDownload = (title: string) => {
    toast({ title: "Download started", description: `"${title}" is being downloaded.` });
  };

  if (loading) {
    return (
      <MobileLayout header={<Header title="Study Notes" />} bottomNav={<BottomNav items={navItems} />}>
        <div className="flex items-center justify-center py-16">
          <Loader2 size={28} className="animate-spin text-primary" />
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout header={<Header title="Study Notes" />} bottomNav={<BottomNav items={navItems} />}>
      <div className="p-4 space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
            <p className="text-red-700 text-xs">{error}</p>
          </div>
        )}

        <p className="text-xs text-muted-foreground px-1">{notes.length} note{notes.length !== 1 ? "s" : ""} available</p>

        <div className="space-y-3">
          {notes.length > 0 ? (
            notes.map((note, i) => {
              const cfg = fileTypeConfig[note.file_type || "pdf"] ?? fileTypeConfig.pdf;
              const Icon = cfg.icon;
              const subjColor = subjectColors[note.subject] ?? "bg-gray-100 text-gray-600";
              return (
                <motion.div key={note.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  className="bg-white rounded-2xl border border-border p-4 shadow-sm"
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
                      Posted {new Date(note.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </span>
                    <Button size="sm" variant="outline" className="h-7 text-xs gap-1.5 rounded-lg" onClick={() => handleDownload(note.title)}>
                      <Download size={12} /> Download
                    </Button>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="bg-white rounded-2xl border border-border p-8 text-center">
              <FileText size={32} className="mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No notes available yet</p>
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}
