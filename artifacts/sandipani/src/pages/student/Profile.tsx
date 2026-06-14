import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { supabase, StudentRecord, ExamResult } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, MapPin, Calendar, GraduationCap, BookOpen, Award, Loader as Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const navItems = [
  { icon: User, label: "Dashboard", href: "/student" },
  { icon: BookOpen, label: "Notes", href: "/student/notes" },
  { icon: Calendar, label: "Timetable", href: "/student/timetable" },
  { icon: User, label: "Profile", href: "/student/profile" },
];

export default function StudentProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [student, setStudent] = useState<StudentRecord | null>(null);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStudentData();
    }
  }, [user]);

  const fetchStudentData = async () => {
    if (!user) return;

    try {
      const { data: studentData, error: studentError } = await supabase
        .from("students")
        .select("*")
        .eq("email", user.email)
        .single();

      if (studentError && studentError.code !== "PGRST116") throw studentError;
      setStudent(studentData);

      if (studentData) {
        const { data: resultsData } = await supabase
          .from("exam_results")
          .select("*")
          .eq("student_id", studentData.id)
          .order("exam_date", { ascending: false });

        setResults(resultsData || []);
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch profile data",
      });
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade: string | null) => {
    if (!grade) return "bg-gray-100 text-gray-700";
    if (["A+", "A"].includes(grade)) return "bg-green-100 text-green-700";
    if (["B+", "B"].includes(grade)) return "bg-blue-100 text-blue-700";
    if (["C+", "C"].includes(grade)) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  if (loading) {
    return (
      <MobileLayout header={<Header />} bottomNav={<BottomNav items={navItems} />}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout header={<Header />} bottomNav={<BottomNav items={navItems} />}>
      <div className="p-4 space-y-5">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <User size={32} />
              </div>
              <div>
                <h2 className="text-xl font-bold">{student?.full_name || user?.name}</h2>
                <p className="text-white/80 text-sm">{student?.class_name} - {student?.section}</p>
                <p className="text-white/60 text-xs mt-1">Roll No: {student?.roll_no || "N/A"}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Mail size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{student?.email || user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <Phone size={18} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium">{student?.phone || student?.parent_mobile || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                    <MapPin size={18} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Address</p>
                    <p className="text-sm font-medium">{student?.address || "N/A"}</p>
                  </div>
                </div>
                {student?.date_of_birth && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                      <Calendar size={18} className="text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Date of Birth</p>
                      <p className="text-sm font-medium">{student.date_of_birth}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center">
                    <User size={18} className="text-pink-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Parent/Guardian</p>
                    <p className="text-sm font-medium">{student?.parent_name || "N/A"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <GraduationCap size={18} /> Academic Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Class</p>
                    <p className="text-sm font-medium">{student?.class_name || "N/A"}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Section</p>
                    <p className="text-sm font-medium">{student?.section || "N/A"}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Stream</p>
                    <p className="text-sm font-medium">{student?.stream || "N/A"}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Roll No</p>
                    <p className="text-sm font-medium">{student?.roll_no || "N/A"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="mt-4">
            {results.length === 0 ? (
              <div className="text-center py-12">
                <Award size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No results found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {results.map((result) => (
                  <Card key={result.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{result.subject}</p>
                          <p className="text-xs text-muted-foreground">{result.exam_type}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">
                            {result.marks_obtained}/{result.max_marks}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded-full ${getGradeColor(result.grade)}`}>
                              {result.grade || "-"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {((result.marks_obtained / result.max_marks) * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
}