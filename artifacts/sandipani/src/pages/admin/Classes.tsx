import { useState } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { mockClasses, mockTeachers, Class } from "@/data/mockData";
import { LayoutDashboard, Users, UserCheck, BookOpen, Plus, Pencil, Trash2, UserCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Users, label: "Students", href: "/admin/students" },
  { icon: UserCheck, label: "Teachers", href: "/admin/teachers" },
  { icon: BookOpen, label: "Classes", href: "/admin/classes" },
];

const getTeacherName = (teacherId: string) => mockTeachers.find(t => t.id === teacherId)?.name ?? "Unassigned";

const classColors = [
  "from-blue-500 to-blue-600",
  "from-violet-500 to-violet-600",
  "from-emerald-500 to-emerald-600",
  "from-amber-500 to-amber-600",
  "from-rose-500 to-rose-600",
];

export default function AdminClasses() {
  const [classes, setClasses] = useState<Class[]>(mockClasses);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Class | null>(null);
  const [form, setForm] = useState({ name: "", section: "", teacherId: "t1", studentCount: "" });
  const { toast } = useToast();

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", section: "", teacherId: "t1", studentCount: "" });
    setOpen(true);
  };

  const openEdit = (c: Class) => {
    setEditing(c);
    setForm({ name: c.name, section: c.section, teacherId: c.teacherId, studentCount: String(c.studentCount) });
    setOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.section) return;
    if (editing) {
      setClasses(prev => prev.map(c => c.id === editing.id ? { ...c, ...form, studentCount: Number(form.studentCount) } : c));
      toast({ title: "Class updated", description: `${form.name} ${form.section} updated.` });
    } else {
      const newClass: Class = { id: `c${Date.now()}`, ...form, studentCount: Number(form.studentCount) };
      setClasses(prev => [...prev, newClass]);
      toast({ title: "Class added", description: `${form.name} ${form.section} added.` });
    }
    setOpen(false);
  };

  const handleDelete = (id: string, name: string, section: string) => {
    setClasses(prev => prev.filter(c => c.id !== id));
    toast({ title: "Class removed", description: `${name} ${section} removed.`, variant: "destructive" });
  };

  return (
    <MobileLayout header={<Header title="Manage Classes" />} bottomNav={<BottomNav items={navItems} />}>
      <div className="p-4 space-y-4">
        <p className="text-xs text-muted-foreground px-1">{classes.length} class{classes.length !== 1 ? "es" : ""}</p>

        <div className="grid grid-cols-1 gap-3">
          {classes.map((cls, i) => (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden"
              data-testid={`card-class-${cls.id}`}
            >
              <div className={`bg-gradient-to-r ${classColors[i % classColors.length]} px-4 py-3 flex items-center justify-between`}>
                <div>
                  <p className="text-white font-bold text-lg">{cls.name}</p>
                  <p className="text-white/80 text-sm">Section {cls.section}</p>
                </div>
                <div className="bg-white/20 rounded-xl px-3 py-1.5 text-center">
                  <p className="text-white font-bold text-xl">{cls.studentCount}</p>
                  <p className="text-white/80 text-[10px]">Students</p>
                </div>
              </div>
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCircle size={16} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Class Teacher:</span>
                  <Badge variant="secondary" className="text-xs">{getTeacherName(cls.teacherId)}</Badge>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(cls)} className="p-2 hover:bg-primary/10 rounded-lg transition-colors" data-testid={`button-edit-class-${cls.id}`}>
                    <Pencil size={14} className="text-primary" />
                  </button>
                  <button onClick={() => handleDelete(cls.id, cls.name, cls.section)} className="p-2 hover:bg-destructive/10 rounded-lg transition-colors" data-testid={`button-delete-class-${cls.id}`}>
                    <Trash2 size={14} className="text-destructive" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <button onClick={openAdd} className="fixed bottom-20 right-4 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform z-40" data-testid="button-add-class">
        <Plus size={24} />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm mx-4 rounded-2xl">
          <DialogHeader><DialogTitle>{editing ? "Edit Class" : "Add Class"}</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Class Name</Label><Input placeholder="Class 8" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
              <div className="space-y-1"><Label>Section</Label><Input placeholder="A" value={form.section} onChange={e => setForm(f => ({ ...f, section: e.target.value }))} /></div>
            </div>
            <div className="space-y-1">
              <Label>Class Teacher</Label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm bg-white" value={form.teacherId} onChange={e => setForm(f => ({ ...f, teacherId: e.target.value }))}>
                {mockTeachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div className="space-y-1"><Label>Student Count</Label><Input type="number" placeholder="30" value={form.studentCount} onChange={e => setForm(f => ({ ...f, studentCount: e.target.value }))} /></div>
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
