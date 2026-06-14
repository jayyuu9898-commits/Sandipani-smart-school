import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { supabase, TimetableEntry, ClassRecord } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Plus, Pencil, Trash2, Loader as Loader2, Clock } from "lucide-react";
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
  { icon: null, label: "Students", href: "/admin/students" },
  { icon: null, label: "Teachers", href: "/admin/teachers" },
  { icon: null, label: "Timetable", href: "/admin/timetable" },
  { icon: null, label: "Settings", href: "/admin/settings" },
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function AdminTimetable() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [classes, setClasses] = useState<ClassRecord[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);
  const [formData, setFormData] = useState({
    day: "Monday",
    period: 1,
    subject: "",
    start_time: "08:00",
    end_time: "08:45",
    room: "",
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchTimetable();
    }
  }, [selectedClass]);

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase.from("classes").select("*").order("name");
      if (error) throw error;
      setClasses(data || []);
      if (data && data.length > 0) {
        setSelectedClass(data[0].id);
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch classes",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTimetable = async () => {
    if (!selectedClass) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("timetables")
        .select("*")
        .eq("class_id", selectedClass)
        .order("day")
        .order("period");

      if (error) throw error;
      setTimetable(data || []);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch timetable",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedClass) {
      toast({ variant: "destructive", title: "Error", description: "Please select a class" });
      return;
    }

    try {
      if (editingEntry) {
        const { error } = await supabase
          .from("timetables")
          .update({
            ...formData,
            period: parseInt(formData.period.toString()),
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingEntry.id);

        if (error) throw error;
        toast({ title: "Entry Updated", description: "Timetable entry has been updated" });
      } else {
        const { error } = await supabase.from("timetables").insert({
          ...formData,
          class_id: selectedClass,
          period: parseInt(formData.period.toString()),
        });

        if (error) throw error;
        toast({ title: "Entry Added", description: "New timetable entry created" });
      }

      setDialogOpen(false);
      setEditingEntry(null);
      setFormData({ day: "Monday", period: 1, subject: "", start_time: "08:00", end_time: "08:45", room: "" });
      fetchTimetable();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save entry",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this timetable entry?")) return;

    try {
      const { error } = await supabase.from("timetables").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Entry Deleted" });
      fetchTimetable();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete entry",
      });
    }
  };

  const getEntryForSlot = (day: string, period: number) => {
    return timetable.find((t) => t.day === day && t.period === period);
  };

  const openEditDialog = (entry: TimetableEntry) => {
    setEditingEntry(entry);
    setFormData({
      day: entry.day,
      period: entry.period,
      subject: entry.subject,
      start_time: entry.start_time,
      end_time: entry.end_time,
      room: entry.room || "",
    });
    setDialogOpen(true);
  };

  const getClassName = () => {
    const cls = classes.find((c) => c.id === selectedClass);
    return cls ? `${cls.name} - ${cls.section}` : "Select Class";
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
            <h1 className="text-2xl font-bold text-foreground">Timetable</h1>
            <p className="text-sm text-muted-foreground">Manage class schedules</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingEntry(null);
                  setFormData({ day: "Monday", period: 1, subject: "", start_time: "08:00", end_time: "08:45", room: "" });
                }}
                className="gap-2"
              >
                <Plus size={16} /> Add Period
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingEntry ? "Edit Period" : "Add New Period"}</DialogTitle>
                <DialogDescription>
                  {getClassName()} - {formData.day} Period {formData.period}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Day</Label>
                    <Select
                      value={formData.day}
                      onValueChange={(val) => setFormData({ ...formData, day: val })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DAYS.map((day) => (
                          <SelectItem key={day} value={day}>{day}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Period</Label>
                    <Select
                      value={formData.period.toString()}
                      onValueChange={(val) => setFormData({ ...formData, period: parseInt(val) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PERIODS.map((p) => (
                          <SelectItem key={p} value={p.toString()}>Period {p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g., Mathematics"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="start_time">Start Time</Label>
                    <Input
                      id="start_time"
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_time">End Time</Label>
                    <Input
                      id="end_time"
                      type="time"
                      value={formData.end_time}
                      onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="room">Room (Optional)</Label>
                  <Input
                    id="room"
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    placeholder="e.g., Room 101"
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingEntry ? "Update Entry" : "Add Entry"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Select Class</CardTitle>
              {selectedClass && (
                <span className="text-sm text-muted-foreground">{getClassName()}</span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name} - {cls.section}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !selectedClass ? (
          <div className="text-center py-12">
            <Calendar size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Select a class to view timetable</p>
          </div>
        ) : (
          <div className="space-y-4">
            <Tabs defaultValue="Monday">
              <TabsList className="w-full overflow-x-auto">
                {DAYS.map((day) => (
                  <TabsTrigger key={day} value={day} className="flex-1 min-w-[60px]">
                    {day.slice(0, 3)}
                  </TabsTrigger>
                ))}
              </TabsList>
              {DAYS.map((day) => (
                <TabsContent key={day} value={day} className="space-y-2 mt-4">
                  {PERIODS.map((period) => {
                    const entry = getEntryForSlot(day, period);
                    return (
                      <div
                        key={period}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          entry ? "bg-white border-border" : "bg-muted/30 border-dashed"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Clock size={16} className="text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {entry ? entry.subject : `Period ${period}`}
                            </p>
                            {entry ? (
                              <p className="text-xs text-muted-foreground">
                                {entry.start_time} - {entry.end_time}
                                {entry.room && ` | ${entry.room}`}
                              </p>
                            ) : (
                              <p className="text-xs text-muted-foreground">No class scheduled</p>
                            )}
                          </div>
                        </div>
                        {entry && (
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(entry)}>
                              <Pencil size={14} />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(entry.id)}>
                              <Trash2 size={14} className="text-destructive" />
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
