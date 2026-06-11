import { useState } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { mockHomework, mockClasses, Homework } from "@/data/mockData";
import { LayoutDashboard, CalendarCheck, BookOpen, FileText, Trophy, Plus, Paperclip, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  const [homeworkList, setHomeworkList] = useState<Homework[]>(mockHomework);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", subject: subjects[0], classId: "c1", dueDate: "", description: "" });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.dueDate) return;
    const newHw: Homework = {
      id: `hw${Date.now()}`, ...form,
      teacherId: "t1",
      uploadedAt: new Date().toISOString(),
    };
    setHomeworkList(prev => [newHw, ...prev]);
    setForm({ title: "", subject: subjects[0], classId: "c1", dueDate: "", description: "" });
    setShowForm(false);
    toast({ title: "Homework uploaded", description: `"${newHw.title}" assigned successfully.` });
  };

  const getClassName = (classId: string) => {
    const cls = mockClasses.find(c => c.id === classId);
    return cls ? `${cls.name} ${cls.section}` : classId;
  };

  const getDueStatus = (dueDate: string) => {
    const d = new Date(dueDate);
    const now = new Date();
    const diff = Math.ceil((d.getTime() - now.getTime()) / 86400000);
    if (diff < 0) return { label: "Overdue", className: "bg-red-100 text-red-600" };
    if (diff === 0) return { label: "Due Today", className: "bg-amber-100 text-amber-600" };
    return { label: `Due in ${diff}d`, className: "bg-emerald-100 text-emerald-600" };
  };

  return (
    <MobileLayout header={<Header title="Homework" />} bottomNav={<BottomNav items={navItems} />}>
      <div className="p-4 space-y-4">
        {!showForm ? (
          <Button className="w-full rounded-xl" onClick={() => setShowForm(true)} data-testid="button-new-homework">
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
                    {mockClasses.map(c => <option key={c.id} value={c.id}>{c.name} {c.section}</option>)}
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
                <Button type="submit" className="flex-1">Upload</Button>
              </div>
            </form>
          </motion.div>
        )}

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-1">Uploaded Assignments ({homeworkList.length})</h3>
          <div className="space-y-2">
            {homeworkList.map((hw, i) => {
              const due = getDueStatus(hw.dueDate);
              return (
                <motion.div key={hw.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  className="bg-white rounded-2xl border border-border p-3 shadow-sm"
                  data-testid={`card-homework-${hw.id}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">{hw.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{hw.subject} · {getClassName(hw.classId)}</p>
                      {hw.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{hw.description}</p>}
                    </div>
                    <span className={`text-[10px] font-medium px-2 py-1 rounded-lg flex-shrink-0 ${due.className}`}>{due.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <Calendar size={11} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Due: {new Date(hw.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
