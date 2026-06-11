import { useState } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";
import { mockClasses, mockTeachers, Class } from "@/data/mockData";
import { LayoutDashboard, Users, UserCheck, BookOpen, Plus, Pencil, Trash2, UserCircle, Info } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Users, label: "Students", href: "/admin/students" },
  { icon: UserCheck, label: "Teachers", href: "/admin/teachers" },
  { icon: BookOpen, label: "Classes", href: "/admin/classes" },
  { icon: Info, label: "About", href: "/about" },
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
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<Class | null>(null);
  const [deleting, setDeleting] = useState<Class | null>(null);
  const [form, setForm] = useState({ name: "", section: "", teacherId: "t1", studentCount: "" });
  const { toast } = useToast();

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", section: "", teacherId: "t1", studentCount: "" });
    setFormOpen(true);
  };

  const openEdit = (c: Class) => {
    setEditing(c);
    setForm({ name: c.name, section: c.section, teacherId: c.teacherId, studentCount: String(c.studentCount) });
    setFormOpen(true);
  };

  const openDelete = (c: Class) => {
    setDeleting(c);
    setDeleteOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.section) return;
    if (editing) {
      setClasses(prev => prev.map(c => c.id === editing.id ? { ...c, ...form, studentCount: Number(form.studentCount) } : c));
      toast({ title: "Class Updated", description: `${form.name} ${form.section} has been updated.` });
    } else {
      const newClass: Class = { id: `c${Date.now()}`, ...form, studentCount: Number(form.studentCount) };
      setClasses(prev => [...prev, newClass]);
      toast({ title: "Class Added", description: `${form.name} ${form.section} has been added.` });
    }
    setFormOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!deleting) return;
    setClasses(prev => prev.filter(c => c.id !== deleting.id));
    toast({ title: "Class Removed", description: `${deleting.name} ${deleting.section} has been removed.`, variant: "destructive" });
    setDeleting(null);
    setDeleteOpen(false);
  };

  return (
    <MobileLayout header={<Header title="Manage Classes" />} bottomNav={<BottomNav items={navItems} />}>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-muted-foreground">{classes.length} class{classes.length !== 1 ? "es" : ""}</p>
          <Button size="sm" className="h-8 text-xs gap-1.5 rounded-xl" onClick={openAdd}>
            <Plus size={13} /> Add Class
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {classes.map((cls, i) => (
            <motion.div key={cls.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
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
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <UserCircle size={15} className="text-muted-foreground flex-shrink-0" />
                  <span className="text-xs text-muted-foreground">Teacher:</span>
                  <Badge variant="secondary" className="text-xs truncate">{getTeacherName(cls.teacherId)}</Badge>
                </div>
                <div className="flex gap-1 ml-2">
                  <button onClick={() => openEdit(cls)} className="p-2 hover:bg-primary/10 rounded-lg transition-colors" title="Edit">
                    <Pencil size={14} className="text-primary" />
                  </button>
                  <button onClick={() => openDelete(cls)} className="p-2 hover:bg-destructive/10 rounded-lg transition-colors" title="Delete">
                    <Trash2 size={14} className="text-destructive" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          {classes.length === 0 && (
            <div className="bg-white rounded-2xl border border-border p-8 text-center">
              <BookOpen size={32} className="mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No classes yet</p>
            </div>
          )}
        </div>
        <Footer />
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-sm mx-4 rounded-2xl">
          <DialogHeader><DialogTitle>{editing ? "Edit Class" : "Add New Class"}</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Class Name *</Label><Input placeholder="Class 8" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
              <div className="space-y-1"><Label>Section *</Label><Input placeholder="A" value={form.section} onChange={e => setForm(f => ({ ...f, section: e.target.value }))} /></div>
            </div>
            <div className="space-y-1">
              <Label>Class Teacher</Label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm bg-white" value={form.teacherId} onChange={e => setForm(f => ({ ...f, teacherId: e.target.value }))}>
                {mockTeachers.map(t => <option key={t.id} value={t.id}>{t.name} — {t.subject}</option>)}
              </select>
            </div>
            <div className="space-y-1"><Label>Student Count</Label><Input type="number" placeholder="30" value={form.studentCount} onChange={e => setForm(f => ({ ...f, studentCount: e.target.value }))} /></div>
            <div className="flex gap-2 pt-1">
              <Button variant="outline" className="flex-1" onClick={() => setFormOpen(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleSave} disabled={!form.name || !form.section}>
                {editing ? "Update Class" : "Add Class"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="max-w-sm mx-4 rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Class</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{deleting?.name} {deleting?.section}</strong>? All associated data will be unlinked.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-2">
            <AlertDialogCancel className="flex-1 mt-0">Cancel</AlertDialogCancel>
            <AlertDialogAction className="flex-1 bg-destructive hover:bg-destructive/90" onClick={handleDeleteConfirm}>
              Yes, Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MobileLayout>
  );
}
