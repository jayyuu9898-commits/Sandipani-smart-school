import { useState } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { mockTeachers, mockClasses, Teacher } from "@/data/mockData";
import { LayoutDashboard, Users, UserCheck, BookOpen, Search, Plus, Pencil, Trash2, X, Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Users, label: "Students", href: "/admin/students" },
  { icon: UserCheck, label: "Teachers", href: "/admin/teachers" },
  { icon: BookOpen, label: "Classes", href: "/admin/classes" },
];

const getClassName = (classId: string) => {
  const cls = mockClasses.find(c => c.id === classId);
  return cls ? `${cls.name}${cls.section}` : classId;
};

const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").slice(0, 2);
const avatarColors = ["bg-blue-100 text-blue-600", "bg-violet-100 text-violet-600", "bg-emerald-100 text-emerald-600", "bg-amber-100 text-amber-600", "bg-rose-100 text-rose-600"];

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Teacher | null>(null);
  const [form, setForm] = useState({ name: "", subject: "", email: "", phone: "" });
  const { toast } = useToast();

  const filtered = teachers.filter(t =>
    t.name.toLowerCase().includes(query.toLowerCase()) ||
    t.subject.toLowerCase().includes(query.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", subject: "", email: "", phone: "" });
    setOpen(true);
  };

  const openEdit = (t: Teacher) => {
    setEditing(t);
    setForm({ name: t.name, subject: t.subject, email: t.email, phone: t.phone });
    setOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.subject) return;
    if (editing) {
      setTeachers(prev => prev.map(t => t.id === editing.id ? { ...t, ...form } : t));
      toast({ title: "Teacher updated", description: `${form.name} has been updated.` });
    } else {
      const newTeacher: Teacher = { id: `t${Date.now()}`, ...form, classIds: [] };
      setTeachers(prev => [...prev, newTeacher]);
      toast({ title: "Teacher added", description: `${form.name} has been added.` });
    }
    setOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
    toast({ title: "Teacher removed", description: `${name} has been removed.`, variant: "destructive" });
  };

  return (
    <MobileLayout header={<Header title="Manage Teachers" />} bottomNav={<BottomNav items={navItems} />}>
      <div className="p-4 space-y-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search teachers..." className="pl-9 bg-white" value={query} onChange={e => setQuery(e.target.value)} data-testid="input-search-teachers" />
          {query && <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X size={14} className="text-muted-foreground" /></button>}
        </div>

        <p className="text-xs text-muted-foreground px-1">{filtered.length} teacher{filtered.length !== 1 ? "s" : ""}</p>

        <div className="space-y-2">
          {filtered.map((teacher, i) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-white rounded-2xl border border-border p-3 shadow-sm"
              data-testid={`card-teacher-${teacher.id}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${avatarColors[i % avatarColors.length]}`}>
                  {getInitials(teacher.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground">{teacher.name}</p>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 mt-0.5">{teacher.subject}</Badge>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {teacher.classIds.map(cId => (
                      <span key={cId} className="text-[10px] bg-primary/10 text-primary rounded px-1.5 py-0.5 font-medium">{getClassName(cId)}</span>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-2">
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Phone size={10} />{teacher.phone}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1 truncate"><Mail size={10} />{teacher.email}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <button onClick={() => openEdit(teacher)} className="p-2 hover:bg-primary/10 rounded-lg transition-colors" data-testid={`button-edit-teacher-${teacher.id}`}>
                    <Pencil size={14} className="text-primary" />
                  </button>
                  <button onClick={() => handleDelete(teacher.id, teacher.name)} className="p-2 hover:bg-destructive/10 rounded-lg transition-colors" data-testid={`button-delete-teacher-${teacher.id}`}>
                    <Trash2 size={14} className="text-destructive" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <button onClick={openAdd} className="fixed bottom-20 right-4 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform z-40" data-testid="button-add-teacher">
        <Plus size={24} />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm mx-4 rounded-2xl">
          <DialogHeader><DialogTitle>{editing ? "Edit Teacher" : "Add Teacher"}</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="space-y-1"><Label>Full Name</Label><Input placeholder="Teacher name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div className="space-y-1"><Label>Subject</Label><Input placeholder="Subject taught" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} /></div>
            <div className="space-y-1"><Label>Email</Label><Input type="email" placeholder="email@sandipani.edu" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
            <div className="space-y-1"><Label>Phone</Label><Input placeholder="Phone number" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
            <div className="flex gap-2 pt-1">
              <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleSave}>{editing ? "Update" : "Add"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
}
