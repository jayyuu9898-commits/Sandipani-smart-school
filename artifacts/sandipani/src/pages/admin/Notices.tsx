import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { supabase, Notice } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Bell, Plus, Pencil, Trash2, Loader as Loader2, Megaphone, Calendar, Users } from "lucide-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

const navItems = [
  { icon: null, label: "Dashboard", href: "/admin" },
  { icon: null, label: "Students", href: "/admin/students" },
  { icon: null, label: "Teachers", href: "/admin/teachers" },
  { icon: null, label: "Notices", href: "/admin/notices" },
  { icon: null, label: "Settings", href: "/admin/settings" },
];

export default function AdminNotices() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    notice_type: "general",
    target_audience: "all",
    priority: "normal",
  });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const { data, error } = await supabase
        .from("notices")
        .select("*")
        .order("published_date", { ascending: false });

      if (error) throw error;
      setNotices(data || []);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch notices",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingNotice) {
        const { error } = await supabase
          .from("notices")
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingNotice.id);

        if (error) throw error;
        toast({ title: "Notice Updated", description: "Notice has been updated successfully" });
      } else {
        const { error } = await supabase.from("notices").insert({
          ...formData,
          is_active: true,
          published_date: new Date().toISOString().split("T")[0],
        });

        if (error) throw error;
        toast({ title: "Notice Created", description: "New notice has been published" });
      }

      setDialogOpen(false);
      setEditingNotice(null);
      setFormData({
        title: "",
        content: "",
        notice_type: "general",
        target_audience: "all",
        priority: "normal",
      });
      fetchNotices();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save notice",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this notice?")) return;

    try {
      const { error } = await supabase.from("notices").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Notice Deleted", description: "Notice has been removed" });
      fetchNotices();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete notice",
      });
    }
  };

  const openEditDialog = (notice: Notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      notice_type: notice.notice_type,
      target_audience: notice.target_audience,
      priority: notice.priority,
    });
    setDialogOpen(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-700 border-red-200";
      case "high": return "bg-orange-100 text-orange-700 border-orange-200";
      case "low": return "bg-gray-100 text-gray-700 border-gray-200";
      default: return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "event": return <Calendar size={16} />;
      case "holiday": return <Calendar size={16} />;
      case "exam": return <Megaphone size={16} />;
      case "emergency": return <Bell size={16} />;
      default: return <Bell size={16} />;
    }
  };

  return (
    <MobileLayout header={<Header />} bottomNav={<BottomNav items={navItems} />}>
      <div className="p-4 space-y-5">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground">Notices</h1>
            <p className="text-sm text-muted-foreground">Manage school announcements</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingNotice(null);
                setFormData({ title: "", content: "", notice_type: "general", target_audience: "all", priority: "normal" });
              }} className="gap-2">
                <Plus size={16} /> New Notice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingNotice ? "Edit Notice" : "Create New Notice"}</DialogTitle>
                <DialogDescription>
                  {editingNotice ? "Update the notice details" : "Publish a new announcement"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Notice title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Notice details..."
                    rows={4}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                      value={formData.notice_type}
                      onValueChange={(val) => setFormData({ ...formData, notice_type: val })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                        <SelectItem value="holiday">Holiday</SelectItem>
                        <SelectItem value="exam">Exam</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(val) => setFormData({ ...formData, priority: val })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Target Audience</Label>
                  <Select
                    value={formData.target_audience}
                    onValueChange={(val) => setFormData({ ...formData, target_audience: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="students">Students</SelectItem>
                      <SelectItem value="teachers">Teachers</SelectItem>
                      <SelectItem value="parents">Parents</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">
                  {editingNotice ? "Update Notice" : "Publish Notice"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : notices.length === 0 ? (
          <div className="text-center py-12">
            <Bell size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No notices yet</p>
            <p className="text-sm text-muted-foreground">Create your first announcement</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notices.map((notice, i) => (
              <motion.div
                key={notice.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          {getTypeIcon(notice.notice_type)}
                        </div>
                        <div>
                          <CardTitle className="text-base">{notice.title}</CardTitle>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Users size={12} /> {notice.target_audience}
                            <span className="mx-1">-</span>
                            {format(new Date(notice.published_date), "dd MMM yyyy")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(notice.priority)}`}>
                          {notice.priority}
                        </span>
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(notice)}>
                          <Pencil size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(notice.id)}>
                          <Trash2 size={16} className="text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{notice.content}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
