import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";
import {
  useListStudents,
  useCreateStudent,
  useUpdateStudent,
  useDeleteStudent,
  getListStudentsQueryKey,
} from "@workspace/api-client-react";
import type { Student, CreateStudentInput, UpdateStudentInput } from "@workspace/api-client-react";
import {
  LayoutDashboard, Users, UserCheck, BookOpen, Search, Plus, Pencil, Trash2,
  X, Info, Eye, Phone, Mail, Hash, Loader2,
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

const CLASS_NAMES = Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`);
const SECTIONS = ["A", "B", "C", "D"];
const STREAMS = ["Arts", "Commerce", "Maths Science", "Bio Science", "Agriculture"];
const ADDITIONAL_SUBJECTS = ["Sanskrit", "Retail", "Health Care"];
const GENDERS = ["Male", "Female", "Other"];

const getInitials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
const avatarColors = [
  "bg-blue-100 text-blue-600",
  "bg-violet-100 text-violet-600",
  "bg-emerald-100 text-emerald-600",
  "bg-amber-100 text-amber-600",
  "bg-rose-100 text-rose-600",
];

const emptyForm = {
  fullName: "", rollNo: "", className: "Class 1", section: "A",
  stream: "", additionalSubject: "", gender: "", dateOfBirth: "",
  parentName: "", parentMobile: "", address: "", email: "", phone: "",
};

type FormState = typeof emptyForm;

export default function AdminStudents() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [viewing, setViewing] = useState<Student | null>(null);
  const [deleting, setDeleting] = useState<Student | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const { data: students = [], isLoading } = useListStudents();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: getListStudentsQueryKey() });

  const createMutation = useCreateStudent({
    mutation: {
      onSuccess: () => {
        invalidate();
        setFormOpen(false);
        toast({ title: "Student Added", description: `${form.fullName} has been added successfully.` });
      },
      onError: () => toast({ title: "Error", description: "Failed to add student.", variant: "destructive" }),
    },
  });

  const updateMutation = useUpdateStudent({
    mutation: {
      onSuccess: () => {
        invalidate();
        setFormOpen(false);
        toast({ title: "Student Updated", description: `${form.fullName} has been updated successfully.` });
      },
      onError: () => toast({ title: "Error", description: "Failed to update student.", variant: "destructive" }),
    },
  });

  const deleteMutation = useDeleteStudent({
    mutation: {
      onSuccess: () => {
        invalidate();
        setDeleteOpen(false);
        toast({ title: "Student Removed", description: `${deleting?.fullName} has been removed.`, variant: "destructive" });
        setDeleting(null);
      },
      onError: () => toast({ title: "Error", description: "Failed to delete student.", variant: "destructive" }),
    },
  });

  const filtered = students.filter((s) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      s.fullName.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q) ||
      s.className.toLowerCase().includes(q) ||
      s.section.toLowerCase().includes(q)
    );
  });

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (s: Student) => {
    setEditing(s);
    setForm({
      fullName: s.fullName, rollNo: String(s.rollNo), className: s.className,
      section: s.section, stream: s.stream ?? "", additionalSubject: s.additionalSubject ?? "",
      gender: s.gender ?? "", dateOfBirth: s.dateOfBirth ?? "", parentName: s.parentName ?? "",
      parentMobile: s.parentMobile ?? "", address: s.address ?? "",
      email: s.email ?? "", phone: s.phone ?? "",
    });
    setFormOpen(true);
  };

  const openView = (s: Student) => { setViewing(s); setViewOpen(true); };
  const openDelete = (s: Student) => { setDeleting(s); setDeleteOpen(true); };

  const handleSave = () => {
    if (!form.fullName || !form.rollNo || !form.className || !form.section) return;
    const payload = {
      fullName: form.fullName,
      rollNo: Number(form.rollNo),
      className: form.className,
      section: form.section,
      stream: form.stream || undefined,
      additionalSubject: form.additionalSubject || undefined,
      gender: form.gender || undefined,
      dateOfBirth: form.dateOfBirth || undefined,
      parentName: form.parentName || undefined,
      parentMobile: form.parentMobile || undefined,
      address: form.address || undefined,
      email: form.email || undefined,
      phone: form.phone || undefined,
    };
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: payload as UpdateStudentInput });
    } else {
      createMutation.mutate({ data: payload as CreateStudentInput });
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const needsStream = form.className === "Class 11" || form.className === "Class 12";

  const f = (key: keyof FormState, val: string) => setForm((p) => ({ ...p, [key]: val }));

  return (
    <MobileLayout header={<Header title="Manage Students" />} bottomNav={<BottomNav items={navItems} />}>
      <div className="p-4 space-y-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name, ID, class..." className="pl-9 bg-white" value={query} onChange={(e) => setQuery(e.target.value)} />
          {query && <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X size={14} className="text-muted-foreground" /></button>}
        </div>

        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-muted-foreground">
            {isLoading ? "Loading..." : `${filtered.length} of ${students.length} students`}
          </p>
          <Button size="sm" className="h-8 text-xs gap-1.5 rounded-xl" onClick={openAdd}>
            <Plus size={13} /> Add Student
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={28} className="animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((student, i) => (
              <motion.div key={student.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="bg-white rounded-2xl border border-border p-3 flex items-center gap-3 shadow-sm">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${avatarColors[i % avatarColors.length]}`}>
                  {getInitials(student.fullName)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">{student.fullName}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{student.className} {student.section}</Badge>
                    <span className="text-xs text-muted-foreground">Roll #{student.rollNo}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">{student.id}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openView(student)} className="p-2 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                    <Eye size={14} className="text-blue-600" />
                  </button>
                  <button onClick={() => openEdit(student)} className="p-2 hover:bg-primary/10 rounded-lg transition-colors" title="Edit">
                    <Pencil size={14} className="text-primary" />
                  </button>
                  <button onClick={() => openDelete(student)} className="p-2 hover:bg-destructive/10 rounded-lg transition-colors" title="Delete">
                    <Trash2 size={14} className="text-destructive" />
                  </button>
                </div>
              </motion.div>
            ))}
            {filtered.length === 0 && !isLoading && (
              <div className="bg-white rounded-2xl border border-border p-8 text-center">
                <Users size={32} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No students found</p>
                <p className="text-xs text-muted-foreground mt-1">Click "Add Student" to create the first one</p>
              </div>
            )}
          </div>
        )}
        <Footer />
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-sm mx-4 rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Student" : "Add New Student"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="space-y-1"><Label>Full Name *</Label><Input placeholder="Student full name" value={form.fullName} onChange={(e) => f("fullName", e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Class *</Label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm bg-white" value={form.className} onChange={(e) => f("className", e.target.value)}>
                  {CLASS_NAMES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <Label>Section *</Label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm bg-white" value={form.section} onChange={(e) => f("section", e.target.value)}>
                  {SECTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-1"><Label>Roll Number *</Label><Input type="number" placeholder="1" value={form.rollNo} onChange={(e) => f("rollNo", e.target.value)} /></div>
            {needsStream && (
              <div className="space-y-1">
                <Label>Stream</Label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm bg-white" value={form.stream} onChange={(e) => f("stream", e.target.value)}>
                  <option value="">Select stream</option>
                  {STREAMS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}
            <div className="space-y-1">
              <Label>Additional Subject</Label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm bg-white" value={form.additionalSubject} onChange={(e) => f("additionalSubject", e.target.value)}>
                <option value="">None</option>
                {ADDITIONAL_SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Gender</Label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm bg-white" value={form.gender} onChange={(e) => f("gender", e.target.value)}>
                  <option value="">Select</option>
                  {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="space-y-1"><Label>Date of Birth</Label><Input type="date" value={form.dateOfBirth} onChange={(e) => f("dateOfBirth", e.target.value)} /></div>
            </div>
            <div className="space-y-1"><Label>Parent Name</Label><Input placeholder="Parent/Guardian name" value={form.parentName} onChange={(e) => f("parentName", e.target.value)} /></div>
            <div className="space-y-1"><Label>Parent Mobile</Label><Input placeholder="Parent mobile number" value={form.parentMobile} onChange={(e) => f("parentMobile", e.target.value)} /></div>
            <div className="space-y-1"><Label>Address</Label><Input placeholder="Full address" value={form.address} onChange={(e) => f("address", e.target.value)} /></div>
            <div className="space-y-1"><Label>Email</Label><Input type="email" placeholder="student@email.com" value={form.email} onChange={(e) => f("email", e.target.value)} /></div>
            <div className="space-y-1"><Label>Phone</Label><Input placeholder="Student phone" value={form.phone} onChange={(e) => f("phone", e.target.value)} /></div>
            <div className="flex gap-2 pt-1">
              <Button variant="outline" className="flex-1" onClick={() => setFormOpen(false)} disabled={isSaving}>Cancel</Button>
              <Button className="flex-1" onClick={handleSave} disabled={!form.fullName || !form.rollNo || isSaving}>
                {isSaving ? <Loader2 size={14} className="animate-spin mr-1.5" /> : null}
                {editing ? "Update Student" : "Add Student"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-sm mx-4 rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Student Details</DialogTitle></DialogHeader>
          {viewing && (
            <div className="mt-2 space-y-4">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl ${avatarColors[0]}`}>
                  {getInitials(viewing.fullName)}
                </div>
                <div>
                  <p className="font-bold text-lg">{viewing.fullName}</p>
                  <Badge variant="secondary">{viewing.className} {viewing.section}</Badge>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">{viewing.id}</p>
                </div>
              </div>
              <div className="bg-muted rounded-2xl p-4 space-y-3">
                {[
                  { icon: Hash, label: "Roll Number", value: `#${viewing.rollNo}` },
                  { icon: Mail, label: "Email", value: viewing.email || "Not provided" },
                  { icon: Phone, label: "Phone", value: viewing.phone || "Not provided" },
                  { icon: BookOpen, label: "Class", value: `${viewing.className} - Section ${viewing.section}` },
                  ...(viewing.stream ? [{ icon: BookOpen, label: "Stream", value: viewing.stream }] : []),
                  ...(viewing.additionalSubject ? [{ icon: BookOpen, label: "Add. Subject", value: viewing.additionalSubject }] : []),
                  ...(viewing.gender ? [{ icon: Users, label: "Gender", value: viewing.gender }] : []),
                  ...(viewing.dateOfBirth ? [{ icon: Hash, label: "Date of Birth", value: viewing.dateOfBirth }] : []),
                  ...(viewing.parentName ? [{ icon: Users, label: "Parent Name", value: viewing.parentName }] : []),
                  ...(viewing.parentMobile ? [{ icon: Phone, label: "Parent Mobile", value: viewing.parentMobile }] : []),
                  ...(viewing.address ? [{ icon: Mail, label: "Address", value: viewing.address }] : []),
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0 mt-0.5">
                      <Icon size={13} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">{label}</p>
                      <p className="text-sm font-medium">{value}</p>
                    </div>
                  </div>
                ))}
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
            <AlertDialogTitle>Remove Student</AlertDialogTitle>
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
