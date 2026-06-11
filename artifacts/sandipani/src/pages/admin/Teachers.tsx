import { useState } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";
import { mockTeachers, mockClasses, Teacher } from "@/data/mockData";
import { LayoutDashboard, Users, UserCheck, BookOpen, Search, Plus, Pencil, Trash2, X, Phone, Mail, Eye, Info } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Users, label: "Students", href: "/admin/students" },
  { icon: UserCheck, label: "Teachers", href: "/admin/teachers" },
  { icon: BookOpen, label: "Classes", href: "/admin/classes" },
  { icon: Info, label: "About", href: "/about" },
];

const getClassName = (classId: string) => {
  const cls = mockClasses.find(c => c.id === classId);
  return cls ? `${cls.name} ${cls.section}` : classId;
};

const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").slice(0, 2);
const avatarColors = ["bg-blue-100 text-blue-600", "bg-violet-100 text-violet-600", "bg-emerald-100 text-emerald-600", "bg-amber-100 text-amber-600", "bg-rose-100 text-rose-600"];

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<Teacher | null>(null);
  const [viewing, setViewing] = useState<Teacher | null>(null);
  const [deleting, setDeleting] = useState<Teacher | null>(null);
  const [form, setForm] = useState({ name: "", subject: "", email: "", phone: "" });
  const { toast } = useToast();

  const filtered = teachers.filter(t =>
    t.name.toLowerCase().includes(query.toLowerCase()) ||
    t.subject.toLowerCase().includes(query.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", subject: "", email: "", phone: "" });
    setFormOpen(true);
  };

  const openEdit = (t: Teacher) => {
    setEditing(t);
    setForm({ name: t.name, subject: t.subject, email: t.email, phone: t.phone });
    setFormOpen(true);
  };

  const openView = (t: Teacher) => {
    setViewing(t);
    setViewOpen(true);
  };

  const openDelete = (t: Teacher) => {
    setDeleting(t);
    setDeleteOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.subject) return;
    if (editing) {
      setTeachers(prev => prev.map(t => t.id === editing.id ? { ...t, ...form } : t));
      toast({ title: "Teacher Updated", description: `${form.name} has been updated successfully.` });
    } else {
      const newTeacher: Teacher = { id: `t${Date.now()}`, ...form, classIds: [] };
      setTeachers(prev => [...prev, newTeacher]);
      toast({ title: "Teacher Added", description: `${form.name} has been added successfully.` });
    }
    setFormOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!deleting) return;
    setTeachers(prev => prev.filter(t => t.id !== deleting.id));
    toast({ title: "Teacher Removed", description: `${deleting.name} has been removed.`, variant: "destructive" });
    setDeleting(null);
    setDeleteOpen(false);
  };

  return (
    <MobileLayout header={<Header title="Manage Teachers" />} bottomNav={<BottomNav items={navItems} />}>
      <div className="p-4 space-y-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name or subject..." className="pl-9 bg-white" value={query} onChange={e => setQuery(e.target.value)} />
          {query && <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X size={14} className="text-muted-foreground" /></button>}
        </div>

        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-muted-foreground">{filtered.length} of {teachers.length} teachers</p>
          <Button size="sm" className="h-8 text-xs gap-1.5 rounded-xl" onClick={openAdd}>
            <Plus size={13} /> Add Teacher
          </Button>
        </div>

        <div className="space-y-2">
          {filtered.map((teacher, i) => (
            <motion.div key={teacher.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="bg-white rounded-2xl border border-border p-3 shadow-sm">
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
          {filtered.length === 0 && (
            <div className="bg-white rounded-2xl border border-border p-8 text-center">
              <UserCheck size={32} className="mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No teachers found</p>
            </div>
          )}
        </div>
        <Footer />
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-sm mx-4 rounded-2xl">
          <DialogHeader><DialogTitle>{editing ? "Edit Teacher" : "Add New Teacher"}</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="space-y-1"><Label>Full Name *</Label><Input placeholder="Teacher name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div className="space-y-1"><Label>Subject *</Label><Input placeholder="Subject taught" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} /></div>
            <div className="space-y-1"><Label>Email</Label><Input type="email" placeholder="email@sandipani.edu" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
            <div className="space-y-1"><Label>Phone</Label><Input placeholder="Phone number" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
            <div className="flex gap-2 pt-1">
              <Button variant="outline" className="flex-1" onClick={() => setFormOpen(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleSave} disabled={!form.name || !form.subject}>
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
                  {getInitials(viewing.name)}
                </div>
                <div>
                  <p className="font-bold text-lg">{viewing.name}</p>
                  <Badge variant="outline">{viewing.subject}</Badge>
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
                    {viewing.classIds.length > 0
                      ? viewing.classIds.map(cId => <span key={cId} className="text-xs bg-primary/10 text-primary rounded-lg px-2 py-1 font-medium">{getClassName(cId)}</span>)
                      : <span className="text-xs text-muted-foreground">No classes assigned</span>
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
              Are you sure you want to remove <strong>{deleting?.name}</strong>? This action cannot be undone.
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
