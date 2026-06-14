import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { LayoutDashboard, CalendarCheck, BookOpen, FileText, Trophy, Plus, Paperclip, Calendar, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/teacher" },
  { icon: CalendarCheck, label: "Attendance", href: "/teacher/attendance" },
  { icon: BookOpen, label: "Homework", href: "/teacher/homework" },
  { icon: FileText, label: "Notes", href: "/teacher/notes" },
  { icon: Trophy, label: "Results", href: "/teacher/results" },
];

const subjects = ["Mathematics", "Science", "English", "History", "Geography"];

export default function TeacherHomework() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<any[]>([]);
  const [homeworkList, setHomeworkList] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", subject: subjects[0], classId: "", dueDate: "", description: "" });
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

  // Fetch homework
  useEffect(() => {
    if (!user?.id) return;

    const fetchHomework = async () => {
      try {
        const { data, error: err } = await supabase
          .from("homework")
          .select("id, title, description, subject, class_id, due_date, status, created_at")
          .eq("teacher_id", user.id)
          .order("due_date", { ascending: false });

        if (err) throw err;
        setHomeworkList(data || []);
      } catch (err: any) {
        console.error("Error fetching homework:", err);
      }
    };

    fetchHomework();
  }, [user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.dueDate || !form.classId) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const { data, error: err } = await supabase
        .from("homework")
        .insert([
          {
            title: form.title,
            description: form.description,
            subject: form.subject,
            class_id: form.classId,
            teacher_id: user?.id,
            due_date: new Date(form.dueDate).toISOString(),
            status: "active",
            created_by: user?.id,
          },
        ])
        .select();

      if (err) throw err;

      setHomeworkList(prev => [...(data || []), ...prev]);
      setForm({ title: "", subject: subjects[0], classId: classes[0]?.id || "", dueDate: "", description: "" });
      setShowForm(false);
      toast({ title: "Homework uploaded", description: `"${form.title}" assigned successfully.` });
    } catch (err: any) {
      console.error("Error creating homework:", err);
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const getDueStatus = (dueDate: string) => {
    const d = new Date(dueDate);
    const now = new Date();
    const diff = Math.ceil((d.getTime() - now.getTime()) / 86400000);
    if (diff < 0) return { label: "Overdue", className: "bg-red-100 text-red-600" };
    if (diff === 0) return { label: "Due Today", className: "bg-amber-100 text-amber-600" };
    return { label: `Due in ${diff}d`, className: "bg-emerald-100 text-emerald-600" };
  };

  const getClassName = (classId: string) => {
    const cls = classes.find(c => c.id === classId);
    return cls ? `${cls.name} ${cls.section}` : classId;
  };

  if (loading) {
    return (
      <MobileLayout header={<Header title="Homework" />} bottomNav={<BottomNav items={navItems} />}>
        <div className="flex items-center justify-center py-16">
          <Loader2 size={28} className="animate-spin text-primary" />
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout header={<Header title="Homework" />} bottomNav={<BottomNav items={navItems} />}>
      <div className="p-4 space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
            <p className="text-red-700 text-xs">{error}</p>
          </div>
        )}

        {!showForm ? (
          <Button className="w-full rounded-xl" onClick={() => setShowForm(true)}>
            <Plus size={16} className="mr-2" /> Assign New Homework
          </Button>
        ) : (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-border p-4 shadow-sm">
            <h3 className="font-semibold text-sm mb-4 text-foreground">New Homework Assignment</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1"><Label>Title</Label><Input placeholder="Homework title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required /></div>
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
              <div className="space-y-1"><Label>Due Date</Label><Input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} required /></div>
              <div className="space-y-1"><Label>Description</Label><Textarea placeholder="Instructions for students..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="resize-none" rows={3} /></div>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-xl">
                <Paperclip size={14} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground flex-1">Attach file (optional)</span>
                <Button type="button" variant="outline" size="sm" className="text-xs h-7">Browse</Button>
              </div>
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
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-1">Uploaded Assignments ({homeworkList.length})</h3>
          <div className="space-y-2">
            {homeworkList.length > 0 ? (
              homeworkList.map((hw, i) => {
                const due = getDueStatus(hw.due_date);
                return (
                  <motion.div key={hw.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    className="bg-white rounded-2xl border border-border p-3 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-foreground truncate">{hw.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{hw.subject} · {getClassName(hw.class_id)}</p>
                        {hw.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{hw.description}</p>}
                      </div>
                      <span className={`text-[10px] font-medium px-2 py-1 rounded-lg flex-shrink-0 ${due.className}`}>{due.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2">
                      <Calendar size={11} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Due: {new Date(hw.due_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="bg-white rounded-2xl border border-border p-4 text-center">
                <p className="text-xs text-muted-foreground">No homework assigned yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
