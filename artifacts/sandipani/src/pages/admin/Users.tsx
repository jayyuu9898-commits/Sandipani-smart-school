import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { supabase } from "@/lib/supabase";
import { UserProfile } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Users,
  ShieldCheck,
  UserCheck,
  UserX,
  Loader as Loader2,
  Check,
  X,
  Pencil,
  Trash2,
  Search,
} from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const navItems = [
  { icon: null, label: "Dashboard", href: "/admin" },
  { icon: null, label: "Users", href: "/admin/users" },
  { icon: null, label: "Teachers", href: "/admin/teachers" },
  { icon: null, label: "Settings", href: "/admin/settings" },
];

export default function AdminUsers() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editForm, setEditForm] = useState({
    full_name: "",
    role: "student",
    section: "",
    stream: "",
    subject: "",
    class_id: "",
    is_active: true,
    is_approved: true,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch users",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_approved: true, updated_at: new Date().toISOString() })
        .eq("id", userId);

      if (error) throw error;
      toast({ title: "User Approved", description: "The user can now access the system." });
      fetchUsers();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to approve user",
      });
    }
  };

  const handleDeactivate = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq("id", userId);

      if (error) throw error;
      toast({ title: "User Deactivated" });
      fetchUsers();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to deactivate user",
      });
    }
  };

  const handleActivate = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_active: true, updated_at: new Date().toISOString() })
        .eq("id", userId);

      if (error) throw error;
      toast({ title: "User Activated" });
      fetchUsers();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to activate user",
      });
    }
  };

  const openEditDialog = (profile: UserProfile) => {
    setEditingUser(profile);
    setEditForm({
      full_name: profile.full_name || "",
      role: profile.role,
      section: profile.section || "",
      stream: profile.stream || "",
      subject: profile.subject || "",
      class_id: profile.class_id || "",
      is_active: profile.is_active,
      is_approved: profile.is_approved,
    });
    setEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingUser) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          ...editForm,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingUser.id);

      if (error) throw error;
      toast({ title: "User Updated", description: "Profile changes saved successfully." });
      setEditDialogOpen(false);
      fetchUsers();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user",
      });
    }
  };

  const filteredUsers = users.filter((u) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (u.full_name?.toLowerCase().includes(searchLower) || false) ||
      (u.email?.toLowerCase().includes(searchLower) || false)
    );
  });

  const pendingUsers = filteredUsers.filter((u) => !u.is_approved);
  const approvedUsers = filteredUsers.filter((u) => u.is_approved);
  const adminUsers = filteredUsers.filter((u) => u.role === "admin");
  const teacherUsers = filteredUsers.filter((u) => u.role === "teacher" && u.is_approved);
  const studentUsers = filteredUsers.filter((u) => u.role === "student" && u.is_approved);

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-700";
      case "teacher":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-green-100 text-green-700";
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
            <h1 className="text-2xl font-bold text-foreground">User Management</h1>
            <p className="text-sm text-muted-foreground">Manage accounts and permissions</p>
          </div>
        </motion.div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pending" className="relative">
              Pending
              {pendingUsers.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {pendingUsers.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="teachers">Teachers</TabsTrigger>
            <TabsTrigger value="admins">Admins</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-3 mt-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : pendingUsers.length === 0 ? (
              <div className="text-center py-12">
                <ShieldCheck size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No pending approvals</p>
              </div>
            ) : (
              pendingUsers.map((profile) => (
                <Card key={profile.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                          <Users size={20} className="text-yellow-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{profile.full_name || "No name"}</p>
                          <p className="text-xs text-muted-foreground">{profile.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="default" onClick={() => handleApprove(profile.id)}>
                          <Check size={14} className="mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => openEditDialog(profile)}>
                          <Pencil size={14} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="students" className="space-y-3 mt-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : studentUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No students yet</p>
              </div>
            ) : (
              studentUsers.map((profile) => (
                <Card key={profile.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Users size={20} className="text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{profile.full_name || "No name"}</p>
                          <p className="text-xs text-muted-foreground">{profile.email}</p>
                          {profile.section && (
                            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                              {profile.section}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${profile.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {profile.is_active ? "Active" : "Inactive"}
                        </span>
                        <Button size="sm" variant="outline" onClick={() => openEditDialog(profile)}>
                          <Pencil size={14} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="teachers" className="space-y-3 mt-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : teacherUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No teachers yet</p>
              </div>
            ) : (
              teacherUsers.map((profile) => (
                <Card key={profile.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{profile.full_name || "No name"}</p>
                          <p className="text-xs text-muted-foreground">{profile.email}</p>
                          {profile.subject && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                              {profile.subject}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${profile.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {profile.is_active ? "Active" : "Inactive"}
                        </span>
                        <Button size="sm" variant="outline" onClick={() => openEditDialog(profile)}>
                          <Pencil size={14} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="admins" className="space-y-3 mt-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : adminUsers.length === 0 ? (
              <div className="text-center py-12">
                <ShieldCheck size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No admins yet</p>
              </div>
            ) : (
              adminUsers.map((profile) => (
                <Card key={profile.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <ShieldCheck size={20} className="text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{profile.full_name || "No name"}</p>
                          <p className="text-xs text-muted-foreground">{profile.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${profile.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {profile.is_active ? "Active" : "Inactive"}
                        </span>
                        <Button size="sm" variant="outline" onClick={() => openEditDialog(profile)}>
                          <Pencil size={14} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>

        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Update user details and permissions</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={editForm.role}
                  onValueChange={(val) => setEditForm({ ...editForm, role: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {editForm.role === "student" && (
                <>
                  <div className="space-y-2">
                    <Label>Section</Label>
                    <Input
                      value={editForm.section}
                      onChange={(e) => setEditForm({ ...editForm, section: e.target.value })}
                      placeholder="e.g., A"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Stream</Label>
                    <Input
                      value={editForm.stream}
                      onChange={(e) => setEditForm({ ...editForm, stream: e.target.value })}
                      placeholder="e.g., Science"
                    />
                  </div>
                </>
              )}
              {editForm.role === "teacher" && (
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input
                    value={editForm.subject}
                    onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                    placeholder="e.g., Mathematics"
                  />
                </div>
              )}
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_approved"
                    checked={editForm.is_approved}
                    onChange={(e) => setEditForm({ ...editForm, is_approved: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="is_approved" className="text-sm">Approved</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={editForm.is_active}
                    onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="is_active" className="text-sm">Active</Label>
                </div>
              </div>
              <Button onClick={handleUpdate} className="w-full">
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MobileLayout>
  );
}
