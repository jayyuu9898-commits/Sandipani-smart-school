import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { LayoutDashboard, CalendarCheck, BookOpen, FileText, Trophy, Plus, File, Presentation, Sheet, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/teacher" },
  { icon: CalendarCheck, label: "Attendance", href: "/teacher/attendance" },
  { icon: BookOpen, label: "Homework", href: "/teacher/homework" },
  { icon: FileText, label: "Notes", href: "/teacher/notes" },
  { icon: Trophy, label: "Results", href: "/teacher/results" },
];

const subjects = ["Mathematics", "Science", "English", "History", "Geography"];
const fileTypes: Array<"pdf" | "doc" | "ppt"> = ["pdf", "doc", "ppt"];

const fileTypeConfig: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  pdf: { color: "text-red-600", bg: "bg-red-50 border-red-100", icon: FileText },
  doc: { color: "text-blue-600", bg: "bg-blue-50 border-blue-100", icon: File },
  ppt: { color: "text-orange-600", bg: "bg-orange-50 border-orange-100", icon: Presentation },
};

export default function TeacherNotes() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", subject: subjects[0], classId: "", fileType: "pdf" as "pdf" | "doc" | "ppt", content: "" });
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
          setForm(f => ({ ...f, classId: data[0].id }));
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

  // Fetch notes
  useEffect(() => {
    if (!user?.id) return;

    const fetchNotes = async () => {
      try {
        const { data, error: err } = await supabase
          .from("notes")
          .select("id, title, content, subject, class_id, file_type, is_published, created_at")
          .eq("teacher_id", user.id)
          .order("created_at", { ascending: false });

        if (err) throw err;
        setNotes(data || []);
      } catch (err: any) {
        console.error("Error fetching notes:", err);
      }
    };

    fetchNotes();
  }, [user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.classId) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const { data, error: err } = await supabase
        .from("notes")
        .insert([
          {
            title: form.title,
            content: form.content,
            subject: form.subject,
            class_id: form.classId,
            teacher_id: user?.id,
            file_type: form.fileType,
            is_published: true,
            created_by: user?.id,
          },
        ])
        .select();

      if (err) throw err;

      setNotes(prev => [...(data || []), ...prev]);
      setForm({ title: "", subject: subjects[0], classId: classes[0]?.id || "", fileType: "pdf", content: "" });
      setShowForm(false);
      toast({ title: "Notes uploaded", description: `"${form.title}" shared with class.` });
    } catch (err: any) {
      console.error("Error creating notes:", err);
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const getClassName = (classId: string) => {
    const cls = classes.find(c => c.id === classId);
    return cls ? `${cls.name} ${cls.section}` : classId;
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

        {!showForm ? (
          <Button className="w-full rounded-xl" onClick={() => setShowForm(true)}>
            <Plus size={16} className="mr-2" /> Upload New Notes
          </Button>
        ) : (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-border p-4 shadow-sm">
            <h3 className="font-semibold text-sm mb-4">Upload Study Notes</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1"><Label>Title</Label><Input placeholder="Note title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Subject</Label>
                  <select className="w-full border rounded-lg px-3 py-2 text-sm bg-white" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
                    {subjects.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <Label>Class</Label>
                  <select className="w-full border rounded-lg px-3 py-2 text-sm bg-white" value={form.classId} onChange={e => setForm(f => ({ ...f, classId: e.target.value }))}>
                    {classes.map(c => <option key={c.id} value={c.id}>{c.name} {c.section}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <Label>File Type</Label>
                <div className="flex gap-2">
                  {fileTypes.map(ft => {
                    const cfg = fileTypeConfig[ft];
                    return (
                      <button key={ft} type="button" onClick={() => setForm(f => ({ ...f, fileType: ft }))}
                        className={cn("flex-1 py-2 rounded-xl border text-xs font-semibold uppercase transition-all", form.fileType === ft ? `${cfg.bg} ${cfg.color} border-current` : "bg-white border-border text-muted-foreground")}>
                        {ft}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-1"><Label>Description</Label><Textarea placeholder="Brief description..." value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} className="resize-none" rows={2} /></div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit" className="flex-1" disabled={saving}>
                  {saving ? <Loader2 size={14} className="animate-spin mr-2" /> : null}
                  Upload
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-1">Uploaded Notes ({notes.length})</h3>
          <div className="space-y-2">
            {notes.length > 0 ? (
              notes.map((note, i) => {
                const cfg = fileTypeConfig[note.file_type || "pdf"];
                const Icon = cfg.icon;
                return (
                  <motion.div key={note.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    className="bg-white rounded-2xl border border-border p-3 flex items-center gap-3 shadow-sm"
                  >
                    <div className={`w-11 h-11 rounded-xl border flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                      <Icon size={20} className={cfg.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{note.title}</p>
                      <p className="text-xs text-muted-foreground">{note.subject} · {getClassName(note.class_id)}</p>
                      {note.content && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{note.content}</p>}
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-lg ${cfg.bg} ${cfg.color}`}>{note.file_type || "pdf"}</span>
                  </motion.div>
                );
              })
            ) : (
              <div className="bg-white rounded-2xl border border-border p-4 text-center">
                <p className="text-xs text-muted-foreground">No notes uploaded yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
