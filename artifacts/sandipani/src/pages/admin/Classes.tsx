import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";
import {
  useListClasses,
  useCreateClass,
  useUpdateClass,
  useDeleteClass,
  useListTeachers,
  getListClassesQueryKey,
} from "@workspace/api-client-react";
import type { SchoolClass, CreateClassInput, UpdateClassInput } from "@workspace/api-client-react";
import {
  LayoutDashboard, Users, UserCheck, BookOpen, Plus, Pencil, Trash2,
  UserCircle, Info, Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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

const CLASS_NAMES = Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`);
const SECTIONS = ["A", "B", "C", "D"];

const classColors = [
  "from-blue-500 to-blue-600",
  "from-violet-500 to-violet-600",
  "from-emerald-500 to-emerald-600",
  "from-amber-500 to-amber-600",
  "from-rose-500 to-rose-600",
];

const emptyForm = { name: "Class 1", section: "A", teacherId: "", studentCount: "" };

export default function AdminClasses() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<SchoolClass | null>(null);
  const [deleting, setDeleting] = useState<SchoolClass | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: classes = [], isLoading: classesLoading } = useListClasses();
  const { data: teachers = [] } = useListTeachers();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: getListClassesQueryKey() });

  const createMutation = useCreateClass({
    mutation: {
      onSuccess: () => {
        invalidate();
        setFormOpen(false);
        toast({ title: "Class Added", description: `${form.name} Section ${form.section} has been added.` });
      },
      onError: () => toast({ title: "Error", description: "Failed to add class.", variant: "destructive" }),
    },
  });

  const updateMutation = useUpdateClass({
    mutation: {
      onSuccess: () => {
        invalidate();
        setFormOpen(false);
        toast({ title: "Class Updated", description: `${form.name} Section ${form.section} has been updated.` });
      },
      onError: () => toast({ title: "Error", description: "Failed to update class.", variant: "destructive" }),
    },
  });

  const deleteMutation = useDeleteClass({
    mutation: {
      onSuccess: () => {
        invalidate();
        setDeleteOpen(false);
        toast({ title: "Class Removed", description: `${deleting?.name} ${deleting?.section} has been removed.`, variant: "destructive" });
        setDeleting(null);
      },
      onError: () => toast({ title: "Error", description: "Failed to delete class.", variant: "destructive" }),
    },
  });

  const getTeacherName = (teacherId: string | null | undefined) => {
    if (!teacherId) return "Unassigned";
    return teachers.find((t) => t.id === teacherId)?.fullName ?? "Unassigned";
  };

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (c: SchoolClass) => {
    setEditing(c);
    setForm({ name: c.name, section: c.section, teacherId: c.teacherId ?? "", studentCount: String(c.studentCount ?? "") });
    setFormOpen(true);
  };

  const openDelete = (c: SchoolClass) => { setDeleting(c); setDeleteOpen(true); };

  const handleSave = () => {
    if (!form.name || !form.section) return;
    const payload = {
      name: form.name,
      section: form.section,
      teacherId: form.teacherId || undefined,
      studentCount: form.studentCount ? Number(form.studentCount) : undefined,
    };
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: payload as UpdateClassInput });
    } else {
      createMutation.mutate({ data: payload as CreateClassInput });
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <MobileLayout header={<Header title="Manage Classes" />} bottomNav={<BottomNav items={navItems} />}>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-muted-foreground">
            {classesLoading ? "Loading..." : `${classes.length} class${classes.length !== 1 ? "es" : ""}`}
          </p>
          <Button size="sm" className="h-8 text-xs gap-1.5 rounded-xl" onClick={openAdd}>
            <Plus size={13} /> Add Class
          </Button>
        </div>

        {classesLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={28} className="animate-spin text-primary" />
          </div>
        ) : (
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
                    <p className="text-white font-bold text-xl">{cls.studentCount ?? 0}</p>
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
                <p className="text-xs text-muted-foreground mt-1">Click "Add Class" to create the first one</p>
              </div>
            )}
          </div>
        )}
        <Footer />
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-sm mx-4 rounded-2xl">
          <DialogHeader><DialogTitle>{editing ? "Edit Class" : "Add New Class"}</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Class *</Label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm bg-white" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}>
                  {CLASS_NAMES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <Label>Section *</Label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm bg-white" value={form.section} onChange={(e) => setForm((f) => ({ ...f, section: e.target.value }))}>
                  {SECTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <Label>Class Teacher</Label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm bg-white" value={form.teacherId} onChange={(e) => setForm((f) => ({ ...f, teacherId: e.target.value }))}>
                <option value="">Unassigned</option>
                {teachers.map((t) => <option key={t.id} value={t.id}>{t.fullName} — {t.subject}</option>)}
              </select>
            </div>
            <div className="space-y-1"><Label>Student Count</Label><Input type="number" placeholder="30" value={form.studentCount} onChange={(e) => setForm((f) => ({ ...f, studentCount: e.target.value }))} /></div>
            <div className="flex gap-2 pt-1">
              <Button variant="outline" className="flex-1" onClick={() => setFormOpen(false)} disabled={isSaving}>Cancel</Button>
              <Button className="flex-1" onClick={handleSave} disabled={!form.name || !form.section || isSaving}>
                {isSaving ? <Loader2 size={14} className="animate-spin mr-1.5" /> : null}
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
              Are you sure you want to remove <strong>{deleting?.name} Section {deleting?.section}</strong>? All associated data will be unlinked.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-2">
            <AlertDialogCancel className="flex-1 mt-0">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="flex-1 bg-destructive hover:bg-destructive/90"
              onClick={() => deleting && deleteMutation.mutate({ id: deleting.id })}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? <Loader2 size={14} className="animate-spin mr-1" /> : null}
              Yes, Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MobileLayout>
  );
}
