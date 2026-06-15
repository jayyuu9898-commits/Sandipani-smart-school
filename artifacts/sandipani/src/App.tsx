import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Splash from "@/pages/splash";
import Login from "@/pages/login";
import AboutPage from "@/pages/about";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminStudents from "@/pages/admin/Students";
import AdminTeachers from "@/pages/admin/Teachers";
import AdminClasses from "@/pages/admin/Classes";
import AdminSettings from "@/pages/admin/Settings";
import AdminNotices from "@/pages/admin/Notices";
import AdminTimetable from "@/pages/admin/Timetable";
import AdminUsers from "@/pages/admin/Users";
import TeacherDashboard from "@/pages/teacher/Dashboard";
import TeacherAttendance from "@/pages/teacher/Attendance";
import TeacherHomework from "@/pages/teacher/Homework";
import TeacherNotes from "@/pages/teacher/Notes";
import TeacherResults from "@/pages/teacher/Results";
import StudentDashboard from "@/pages/student/Dashboard";
import StudentHomework from "@/pages/student/Homework";
import StudentNotes from "@/pages/student/Notes";
import StudentAttendance from "@/pages/student/Attendance";
import StudentResults from "@/pages/student/Results";
import StudentTimetable from "@/pages/student/Timetable";
import StudentProfile from "@/pages/student/Profile";

const queryClient = new QueryClient();

function Router() {
  const { loading } = useAuth();
  if (loading) return <Splash />;
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/splash" component={Splash} />
      <Route path="/login" component={Login} />
      <Route path="/about" component={AboutPage} />
      <Route path="/admin">{() => <ProtectedRoute component={AdminDashboard} role="admin" />}</Route>
      <Route path="/admin/students">{() => <ProtectedRoute component={AdminStudents} role="admin" />}</Route>
      <Route path="/admin/teachers">{() => <ProtectedRoute component={AdminTeachers} role="admin" />}</Route>
      <Route path="/admin/classes">{() => <ProtectedRoute component={AdminClasses} role="admin" />}</Route>
      <Route path="/admin/settings">{() => <ProtectedRoute component={AdminSettings} role="admin" />}</Route>
      <Route path="/admin/notices">{() => <ProtectedRoute component={AdminNotices} role="admin" />}</Route>
      <Route path="/admin/timetable">{() => <ProtectedRoute component={AdminTimetable} role="admin" />}</Route>
      <Route path="/admin/users">{() => <ProtectedRoute component={AdminUsers} role="admin" />}</Route>
      <Route path="/teacher">{() => <ProtectedRoute component={TeacherDashboard} role="teacher" />}</Route>
      <Route path="/teacher/attendance">{() => <ProtectedRoute component={TeacherAttendance} role="teacher" />}</Route>
      <Route path="/teacher/homework">{() => <ProtectedRoute component={TeacherHomework} role="teacher" />}</Route>
      <Route path="/teacher/notes">{() => <ProtectedRoute component={TeacherNotes} role="teacher" />}</Route>
      <Route path="/teacher/results">{() => <ProtectedRoute component={TeacherResults} role="teacher" />}</Route>
      <Route path="/student">{() => <ProtectedRoute component={StudentDashboard} role="student" />}</Route>
      <Route path="/student/homework">{() => <ProtectedRoute component={StudentHomework} role="student" />}</Route>
      <Route path="/student/notes">{() => <ProtectedRoute component={StudentNotes} role="student" />}</Route>
      <Route path="/student/attendance">{() => <ProtectedRoute component={StudentAttendance} role="student" />}</Route>
      <Route path="/student/results">{() => <ProtectedRoute component={StudentResults} role="student" />}</Route>
      <Route path="/student/timetable">{() => <ProtectedRoute component={StudentTimetable} role="student" />}</Route>
      <Route path="/student/profile">{() => <ProtectedRoute component={StudentProfile} role="student" />}</Route>
      <Route component={NotFound} />
    </Switch>
  );
}
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
  <WouterRouter base="/">
    <AuthProvider>
      <Router />
      </AuthProvider>
     </WouterRouter>
     <Toaster />
  </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
