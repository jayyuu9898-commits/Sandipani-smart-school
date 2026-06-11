import { useState } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { mockStudents, mockClasses, Student } from "@/data/mockData";
import { LayoutDashboard, Users, UserCheck, BookOpen, Search, Plus, Pencil, Trash2, X } from "lucide-react";
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
  return cls ? `${cls.name} ${cls.section}` : classId;
};

const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").slice(0, 2);

export default function AdminStudents() {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", classId: "c1", rollNo: "" });
  const { toast } = useToast();

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.email.toLowerCase().includes(query.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", email: "", phone: "", classId: "c1", rollNo: "" });
    setOpen(true);
  };

  const openEdit = (s: Student) => {
    setEditing(s);
    setForm({ name: s.name, email: s.email, phone: s.phone, classId: s.classId, rollNo: String(s.rollNo) });
    setOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.email) return;
    if (editing) {
      setStudents(prev => prev.map(s => s.id === editing.id ? { ...s, ...form, rollNo: Number(form.rollNo) } : s));
      toast({ title: "Student updated", description: `${form.name} has been updated.` });
    } else {
      const newStudent: Student = { id: `s${Date.now()}`, ...form, rollNo: Number(form.rollNo) };
      setStudents(prev => [...prev, newStudent]);
      toast({ title: "Student added", description: `${form.name} has been added.` });
    }
    setOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    toast({ title: "Student removed", description: `${name} has been removed.`, variant: "destructive" });
  };

  const avatarColors = ["bg-blue-100 text-blue-600", "bg-violet-100 text-violet-600", "bg-emerald-100 text-emerald-600", "bg-amber-100 text-amber-600", "bg-rose-100 text-rose-600"];

  return (
    <MobileLayout header={<Header title="Manage Students" />} bottomNav={<BottomNav items={navItems} />}>
      <div className="p-4 space-y-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            className="pl-9 bg-white"
            value={query}
            onChange={e => setQuery(e.target.value)}
            data-testid="input-search-students"
          />
          {query && <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X size={14} className="text-muted-foreground" /></button>}
        </div>

        <p className="text-xs text-muted-foreground px-1">{filtered.length} student{filtered.length !== 1 ? "s" : ""}</p>

        <div className="space-y-2">
          {filtered.map((student, i) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-white rounded-2xl border border-border p-3 flex items-center gap-3 shadow-sm"
              data-testid={`card-student-${student.id}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${avatarColors[i % avatarColors.length]}`}>
                {getInitials(student.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground truncate">{student.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{getClassName(student.classId)}</Badge>
                  <span className="text-xs text-muted-foreground">Roll #{student.rollNo}</span>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(student)} className="p-2 hover:bg-primary/10 rounded-lg transition-colors" data-testid={`button-edit-student-${student.id}`}>
                  <Pencil size={14} className="text-primary" />
                </button>
                <button onClick={() => handleDelete(student.id, student.name)} className="p-2 hover:bg-destructive/10 rounded-lg transition-colors" data-testid={`button-delete-student-${student.id}`}>
                  <Trash2 size={14} className="text-destructive" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <button
        onClick={openAdd}
        className="fixed bottom-20 right-4 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform z-40"
        data-testid="button-add-student"
      >
        <Plus size={24} />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm mx-4 rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Student" : "Add Student"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="space-y-1">
              <Label>Full Name</Label>
              <Input placeholder="Student name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input type="email" placeholder="email@student.edu" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Phone</Label>
              <Input placeholder="Phone number" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Class</Label>
                <select
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                  value={form.classId}
                  onChange={e => setForm(f => ({ ...f, classId: e.target.value }))}
                >
                  {mockClasses.map(c => <option key={c.id} value={c.id}>{c.name} {c.section}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <Label>Roll No.</Label>
                <Input type="number" placeholder="1" value={form.rollNo} onChange={e => setForm(f => ({ ...f, rollNo: e.target.value }))} />
              </div>
            </div>
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
