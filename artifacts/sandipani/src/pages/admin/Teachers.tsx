import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";
import {
  useListTeachers,
  useCreateTeacher,
  useUpdateTeacher,
  useDeleteTeacher,
  getListTeachersQueryKey,
} from "@workspace/api-client-react";
import type { Teacher, CreateTeacherInput, UpdateTeacherInput } from "@workspace/api-client-react";
import {
  LayoutDashboard, Users, UserCheck, BookOpen, Search, Plus, Pencil, Trash2,
  X, Phone, Mail, Eye, Info, Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Users, label: "Students", href: "/admin/students" },
  { icon: UserCheck, label: "Teachers", href: "/admin/teachers" },
  { icon: BookOpen, label: "Classes", href: "/admin/classes" },
  { icon: Info, label: "About", href: "/about" },
];

const SUBJECTS = [
  "Mathematics", "Science", "English", "Hindi", "Social Science",
  "History", "Geography", "Physics", "Chemistry", "Biology",
  "Computer Science", "Sanskrit", "Economics", "Political Science",
  "Accountancy", "Business Studies", "Physical Education", "Art",
];

const getInitials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
const avatarColors = [
  "bg-blue-100 text-blue-600",
  "bg-violet-100 text-violet-600",
  "bg-emerald-100 text-emerald-600",
  "bg-amber-100 text-amber-600",
  "bg-rose-100 text-rose-600",
];

const emptyForm = { fullName: "", subject: "", email: "", phone: "" };

export default function AdminTeachers() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<Teacher | null>(null);
  const [viewing, setViewing] = useState<Teacher | null>(null);
  const [deleting, setDeleting] = useState<Teacher | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: teachers = [], isLoading } = useListTeachers();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: getListTeachersQueryKey() });

  const createMutation = useCreateTeacher({
    mutation: {
      onSuccess: () => {
        invalidate();
        setFormOpen(false);
        toast({ title: "Teacher Added", description: `${form.fullName} has been added successfully.` });
      },
      onError: () => toast({ title: "Error", description: "Failed to add teacher.", variant: "destructive" }),
    },
  });

  const updateMutation = useUpdateTeacher({
    mutation: {
      onSuccess: () => {
        invalidate();
        setFormOpen(false);
        toast({ title: "Teacher Updated", description: `${form.fullName} has been updated successfully.` });
      },
      onError: () => toast({ title: "Error", description: "Failed to update teacher.", variant: "destructive" }),
    },
  });

  const deleteMutation = useDeleteTeacher({
    mutation: {
      onSuccess: () => {
        invalidate();
        setDeleteOpen(false);
        toast({ title: "Teacher Removed", description: `${deleting?.fullName} has been removed.`, variant: "destructive" });
        setDeleting(null);
      },
      onError: () => toast({ title: "Error", description: "Failed to delete teacher.", variant: "destructive" }),
    },
  });

  const filtered = teachers.filter((t) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      t.fullName.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q)
    );
  });

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (t: Teacher) => {
    setEditing(t);
    setForm({ fullName: t.fullName, subject: t.subject, email: t.email ?? "", phone: t.phone ?? "" });
    setFormOpen(true);
  };

  const openView = (t: Teacher) => { setViewing(t); setViewOpen(true); };
  const openDelete = (t: Teacher) => { setDeleting(t); setDeleteOpen(true); };

  const handleSave = () => {
    if (!form.fullName || !form.subject) return;
    const payload = {
      fullName: form.fullName,
      subject: form.subject,
      email: form.email || undefined,
      phone: form.phone || undefined,
    };
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: payload as UpdateTeacherInput });
    } else {
      createMutation.mutate({ data: payload as CreateTeacherInput });
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <MobileLayout header={<Header title="Manage Teachers" />} bottomNav={<BottomNav items={navItems} />}>
      <div className="p-4 space-y-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name, ID, subject..." className="pl-9 bg-white" value={query} onChange={(e) => setQuery(e.target.value)} />
          {query && <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X size={14} className="text-muted-foreground" /></button>}
        </div>

        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-muted-foreground">
            {isLoading ? "Loading..." : `${filtered.length} of ${teachers.length} teachers`}
          </p>
          <Button size="sm" className="h-8 text-xs gap-1.5 rounded-xl" onClick={openAdd}>
            <Plus size={13} /> Add Teacher
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={28} className="animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((teacher, i) => (
              <motion.div key={teacher.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="bg-white rounded-2xl border border-border p-3 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${avatarColors[i % avatarColors.length]}`}>
                    {getInitials(teacher.fullName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground">{teacher.fullName}</p>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 mt-0.5">{teacher.subject}</Badge>
                    <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{teacher.id}</p>
                    <div className="flex gap-3 mt-1.5">
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Phone size={10} />{teacher.phone || "—"}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1 truncate"><Mail size={10} />{teacher.email || "—"}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button onClick={() => openView(teacher)} className="p-2 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                      <Eye size={14} className="text-blue-600" />
                    </button>
                    <button onClick={() => openEdit(teacher)} className="p-2 hover:bg-primary/10 rounded-lg transition-colors" title="Edit">
                      <Pencil size={14} className="text-primary" />
                    </button>
                    <button onClick={() => openDelete(teacher)} className="p-2 hover:bg-destructive/10 rounded-lg transition-colors" title="Delete">
                      <Trash2 size={14} className="text-destructive" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
            {filtered.length === 0 && !isLoading && (
              <div className="bg-white rounded-2xl border border-border p-8 text-center">
                <UserCheck size={32} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No teachers found</p>
                <p className="text-xs text-muted-foreground mt-1">Click "Add Teacher" to create the first one</p>
              </div>
            )}
          </div>
        )}
        <Footer />
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-sm mx-4 rounded-2xl">
          <DialogHeader><DialogTitle>{editing ? "Edit Teacher" : "Add New Teacher"}</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="space-y-1"><Label>Full Name *</Label><Input placeholder="Teacher full name" value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} /></div>
            <div className="space-y-1">
              <Label>Subject *</Label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm bg-white" value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}>
                <option value="">Select subject</option>
                {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-1"><Label>Email</Label><Input type="email" placeholder="email@sandipani.edu" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} /></div>
            <div className="space-y-1"><Label>Phone</Label><Input placeholder="Mobile number" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} /></div>
            <div className="flex gap-2 pt-1">
              <Button variant="outline" className="flex-1" onClick={() => setFormOpen(false)} disabled={isSaving}>Cancel</Button>
              <Button className="flex-1" onClick={handleSave} disabled={!form.fullName || !form.subject || isSaving}>
                {isSaving ? <Loader2 size={14} className="animate-spin mr-1.5" /> : null}
                {editing ? "Update Teacher" : "Add Teacher"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-sm mx-4 rounded-2xl">
          <DialogHeader><DialogTitle>Teacher Details</DialogTitle></DialogHeader>
          {viewing && (
            <div className="mt-2 space-y-4">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl ${avatarColors[1]}`}>
                  {getInitials(viewing.fullName)}
                </div>
                <div>
                  <p className="font-bold text-lg">{viewing.fullName}</p>
                  <Badge variant="outline">{viewing.subject}</Badge>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">{viewing.id}</p>
                </div>
              </div>
              <div className="bg-muted rounded-2xl p-4 space-y-3">
                {[
                  { icon: Mail, label: "Email", value: viewing.email || "Not provided" },
                  { icon: Phone, label: "Phone", value: viewing.phone || "Not provided" },
                  { icon: BookOpen, label: "Subject", value: viewing.subject },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                      <Icon size={13} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">{label}</p>
                      <p className="text-sm font-medium">{value}</p>
                    </div>
                  </div>
                ))}
                <div>
                  <p className="text-[10px] text-muted-foreground mb-1.5">Classes Assigned</p>
                  <div className="flex flex-wrap gap-1">
                    {(viewing.assignedClasses?.length ?? 0) > 0
                      ? viewing.assignedClasses!.map((c) => <span key={c} className="text-xs bg-primary/10 text-primary rounded-lg px-2 py-1 font-medium">{c}</span>)
                      : <span className="text-xs text-muted-foreground">No classes assigned yet</span>
                    }
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setViewOpen(false)}>Close</Button>
                <Button className="flex-1" onClick={() => { setViewOpen(false); openEdit(viewing); }}>
                  <Pencil size={13} className="mr-1.5" /> Edit
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="max-w-sm mx-4 rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Teacher</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{deleting?.fullName}</strong>? This action cannot be undone.
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
