export type Role = "admin" | "teacher" | "student";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  avatar?: string;
  classId?: string;
  subject?: string;
}

export interface Student {
  id: string;
  name: string;
  classId: string;
  rollNo: number;
  email: string;
  phone: string;
  avatar?: string;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  email: string;
  phone: string;
  classIds: string[];
}

export interface Class {
  id: string;
  name: string;
  section: string;
  teacherId: string;
  studentCount: number;
}

export interface AttendanceRecord {
  studentId: string;
  date: string;
  status: "present" | "absent" | "late";
}

export interface Homework {
  id: string;
  title: string;
  subject: string;
  classId: string;
  dueDate: string;
  description: string;
  teacherId: string;
  uploadedAt: string;
}

export interface Note {
  id: string;
  title: string;
  subject: string;
  classId: string;
  content: string;
  teacherId: string;
  uploadedAt: string;
  fileType: "pdf" | "doc" | "ppt";
}

export interface Result {
  id: string;
  studentId: string;
  subject: string;
  marks: number;
  totalMarks: number;
  grade: string;
  examType: string;
  date: string;
}

export interface TimetableEntry {
  day: string;
  period: number;
  subject: string;
  teacherName: string;
  time: string;
}

// Seed Data
export const mockUsers: User[] = [
  { id: "u1", name: "System Admin", email: "admin@sandipani.edu", password: "admin123", role: "admin" },
  { id: "u2", name: "Anjali Sharma", email: "teacher@sandipani.edu", password: "teacher123", role: "teacher", subject: "Mathematics" },
  { id: "u3", name: "Rahul Kumar", email: "student@sandipani.edu", password: "student123", role: "student", classId: "c1" },
];

export const mockClasses: Class[] = [
  { id: "c1", name: "Class 8", section: "A", teacherId: "t1", studentCount: 5 },
  { id: "c2", name: "Class 9", section: "B", teacherId: "t2", studentCount: 5 },
  { id: "c3", name: "Class 10", section: "C", teacherId: "t3", studentCount: 5 },
];

export const mockTeachers: Teacher[] = [
  { id: "t1", name: "Anjali Sharma", subject: "Mathematics", email: "anjali@sandipani.edu", phone: "9876543210", classIds: ["c1", "c2", "c3"] },
  { id: "t2", name: "Vikram Singh", subject: "Science", email: "vikram@sandipani.edu", phone: "9876543211", classIds: ["c1", "c2"] },
  { id: "t3", name: "Priya Desai", subject: "English", email: "priya@sandipani.edu", phone: "9876543212", classIds: ["c2", "c3"] },
  { id: "t4", name: "Ramesh Iyer", subject: "History", email: "ramesh@sandipani.edu", phone: "9876543213", classIds: ["c1"] },
  { id: "t5", name: "Kavita Rao", subject: "Geography", email: "kavita@sandipani.edu", phone: "9876543214", classIds: ["c3"] },
];

export const mockStudents: Student[] = [
  // Class 8A
  { id: "s1", name: "Rahul Kumar", classId: "c1", rollNo: 1, email: "rahul@student.edu", phone: "9988776655" },
  { id: "s2", name: "Sneha Patil", classId: "c1", rollNo: 2, email: "sneha@student.edu", phone: "9988776656" },
  { id: "s3", name: "Amit Verma", classId: "c1", rollNo: 3, email: "amit@student.edu", phone: "9988776657" },
  { id: "s4", name: "Pooja Reddy", classId: "c1", rollNo: 4, email: "pooja@student.edu", phone: "9988776658" },
  { id: "s5", name: "Karan Johar", classId: "c1", rollNo: 5, email: "karan@student.edu", phone: "9988776659" },
  // Class 9B
  { id: "s6", name: "Neha Gupta", classId: "c2", rollNo: 1, email: "neha@student.edu", phone: "9988776660" },
  { id: "s7", name: "Ravi Teja", classId: "c2", rollNo: 2, email: "ravi@student.edu", phone: "9988776661" },
  { id: "s8", name: "Simran Kaur", classId: "c2", rollNo: 3, email: "simran@student.edu", phone: "9988776662" },
  { id: "s9", name: "Aakash Singh", classId: "c2", rollNo: 4, email: "aakash@student.edu", phone: "9988776663" },
  { id: "s10", name: "Preeti Jain", classId: "c2", rollNo: 5, email: "preeti@student.edu", phone: "9988776664" },
  // Class 10C
  { id: "s11", name: "Vikas Dubey", classId: "c3", rollNo: 1, email: "vikas@student.edu", phone: "9988776665" },
  { id: "s12", name: "Megha Joshi", classId: "c3", rollNo: 2, email: "megha@student.edu", phone: "9988776666" },
  { id: "s13", name: "Suresh Pillai", classId: "c3", rollNo: 3, email: "suresh@student.edu", phone: "9988776667" },
  { id: "s14", name: "Ananya Panday", classId: "c3", rollNo: 4, email: "ananya@student.edu", phone: "9988776668" },
  { id: "s15", name: "Rishabh Pant", classId: "c3", rollNo: 5, email: "rishabh@student.edu", phone: "9988776669" },
];

export const mockAttendance: AttendanceRecord[] = [
  { studentId: "s1", date: new Date().toISOString().split("T")[0], status: "present" },
  { studentId: "s2", date: new Date().toISOString().split("T")[0], status: "absent" },
  { studentId: "s3", date: new Date().toISOString().split("T")[0], status: "present" },
  { studentId: "s4", date: new Date().toISOString().split("T")[0], status: "late" },
  { studentId: "s5", date: new Date().toISOString().split("T")[0], status: "present" },
  { studentId: "s1", date: new Date(Date.now() - 86400000).toISOString().split("T")[0], status: "present" },
  { studentId: "s2", date: new Date(Date.now() - 86400000).toISOString().split("T")[0], status: "present" },
  { studentId: "s3", date: new Date(Date.now() - 86400000).toISOString().split("T")[0], status: "absent" },
  { studentId: "s4", date: new Date(Date.now() - 86400000).toISOString().split("T")[0], status: "present" },
  { studentId: "s5", date: new Date(Date.now() - 86400000).toISOString().split("T")[0], status: "present" },
];

export const mockHomework: Homework[] = [
  { id: "hw1", title: "Algebra Exercises", subject: "Mathematics", classId: "c1", dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), description: "Complete exercises 1.1 to 1.5", teacherId: "t1", uploadedAt: new Date().toISOString() },
  { id: "hw2", title: "Newton's Laws", subject: "Science", classId: "c1", dueDate: new Date(Date.now() + 86400000 * 3).toISOString(), description: "Write short notes on all 3 laws", teacherId: "t2", uploadedAt: new Date().toISOString() },
  { id: "hw3", title: "Essay Writing", subject: "English", classId: "c2", dueDate: new Date(Date.now() + 86400000 * 1).toISOString(), description: "Write an essay on global warming", teacherId: "t3", uploadedAt: new Date().toISOString() },
  { id: "hw4", title: "Map Pointing", subject: "Geography", classId: "c3", dueDate: new Date(Date.now() - 86400000 * 1).toISOString(), description: "Mark capitals of Indian states", teacherId: "t5", uploadedAt: new Date().toISOString() },
  { id: "hw5", title: "Geometry Proofs", subject: "Mathematics", classId: "c2", dueDate: new Date(Date.now() + 86400000 * 4).toISOString(), description: "Prove theorems 1 to 5", teacherId: "t1", uploadedAt: new Date().toISOString() },
  { id: "hw6", title: "Cell Structure", subject: "Science", classId: "c2", dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), description: "Draw a labelled diagram of a plant cell", teacherId: "t2", uploadedAt: new Date().toISOString() },
];

export const mockNotes: Note[] = [
  { id: "n1", title: "Maths Formula Sheet", subject: "Mathematics", classId: "c1", content: "Contains all important algebra formulas.", teacherId: "t1", uploadedAt: new Date().toISOString(), fileType: "pdf" },
  { id: "n2", title: "Physics Chapter 1", subject: "Science", classId: "c1", content: "Detailed notes on motion.", teacherId: "t2", uploadedAt: new Date().toISOString(), fileType: "doc" },
  { id: "n3", title: "Grammar Rules", subject: "English", classId: "c2", content: "Tenses and punctuation rules.", teacherId: "t3", uploadedAt: new Date().toISOString(), fileType: "pdf" },
  { id: "n4", title: "World War II", subject: "History", classId: "c1", content: "Timeline and major events.", teacherId: "t4", uploadedAt: new Date().toISOString(), fileType: "ppt" },
  { id: "n5", title: "Climate Zones", subject: "Geography", classId: "c3", content: "Overview of global climate zones.", teacherId: "t5", uploadedAt: new Date().toISOString(), fileType: "pdf" },
  { id: "n6", title: "Geometry Basics", subject: "Mathematics", classId: "c3", content: "Introduction to angles and shapes.", teacherId: "t1", uploadedAt: new Date().toISOString(), fileType: "ppt" },
];

export const mockResults: Result[] = [
  { id: "r1", studentId: "s1", subject: "Mathematics", marks: 85, totalMarks: 100, grade: "A", examType: "Mid Term", date: new Date().toISOString() },
  { id: "r2", studentId: "s1", subject: "Science", marks: 78, totalMarks: 100, grade: "B+", examType: "Mid Term", date: new Date().toISOString() },
  { id: "r3", studentId: "s1", subject: "English", marks: 92, totalMarks: 100, grade: "A+", examType: "Mid Term", date: new Date().toISOString() },
  { id: "r4", studentId: "s2", subject: "Mathematics", marks: 65, totalMarks: 100, grade: "B", examType: "Mid Term", date: new Date().toISOString() },
  { id: "r5", studentId: "s2", subject: "Science", marks: 70, totalMarks: 100, grade: "B+", examType: "Mid Term", date: new Date().toISOString() },
  { id: "r6", studentId: "s3", subject: "Mathematics", marks: 95, totalMarks: 100, grade: "A+", examType: "Mid Term", date: new Date().toISOString() },
  { id: "r7", studentId: "s4", subject: "Mathematics", marks: 45, totalMarks: 100, grade: "C", examType: "Mid Term", date: new Date().toISOString() },
  { id: "r8", studentId: "s5", subject: "Mathematics", marks: 88, totalMarks: 100, grade: "A", examType: "Mid Term", date: new Date().toISOString() },
  { id: "r9", studentId: "s6", subject: "Science", marks: 82, totalMarks: 100, grade: "A", examType: "Mid Term", date: new Date().toISOString() },
  { id: "r10", studentId: "s7", subject: "English", marks: 75, totalMarks: 100, grade: "B+", examType: "Mid Term", date: new Date().toISOString() },
  { id: "r11", studentId: "s8", subject: "History", marks: 68, totalMarks: 100, grade: "B", examType: "Mid Term", date: new Date().toISOString() },
  { id: "r12", studentId: "s9", subject: "Geography", marks: 90, totalMarks: 100, grade: "A+", examType: "Mid Term", date: new Date().toISOString() },
  { id: "r13", studentId: "s10", subject: "Mathematics", marks: 72, totalMarks: 100, grade: "B+", examType: "Mid Term", date: new Date().toISOString() },
  { id: "r14", studentId: "s11", subject: "Science", marks: 88, totalMarks: 100, grade: "A", examType: "Mid Term", date: new Date().toISOString() },
  { id: "r15", studentId: "s12", subject: "English", marks: 95, totalMarks: 100, grade: "A+", examType: "Mid Term", date: new Date().toISOString() },
  { id: "r16", studentId: "s13", subject: "Mathematics", marks: 80, totalMarks: 100, grade: "A", examType: "Mid Term", date: new Date().toISOString() },
  { id: "r17", studentId: "s14", subject: "History", marks: 85, totalMarks: 100, grade: "A", examType: "Mid Term", date: new Date().toISOString() },
  { id: "r18", studentId: "s15", subject: "Geography", marks: 78, totalMarks: 100, grade: "B+", examType: "Mid Term", date: new Date().toISOString() },
  { id: "r19", studentId: "s1", subject: "Mathematics", marks: 90, totalMarks: 100, grade: "A+", examType: "Unit Test 1", date: new Date(Date.now() - 86400000 * 30).toISOString() },
  { id: "r20", studentId: "s1", subject: "Science", marks: 85, totalMarks: 100, grade: "A", examType: "Unit Test 1", date: new Date(Date.now() - 86400000 * 30).toISOString() },
];

export const mockTimetable: TimetableEntry[] = [
  { day: "Monday", period: 1, subject: "Mathematics", teacherName: "Anjali Sharma", time: "08:00 - 08:45" },
  { day: "Monday", period: 2, subject: "Science", teacherName: "Vikram Singh", time: "08:45 - 09:30" },
  { day: "Monday", period: 3, subject: "English", teacherName: "Priya Desai", time: "09:45 - 10:30" },
  { day: "Monday", period: 4, subject: "History", teacherName: "Ramesh Iyer", time: "10:30 - 11:15" },
  { day: "Monday", period: 5, subject: "Mathematics", teacherName: "Anjali Sharma", time: "11:30 - 12:15" },
  { day: "Monday", period: 6, subject: "Geography", teacherName: "Kavita Rao", time: "12:15 - 13:00" },
  { day: "Monday", period: 7, subject: "Games", teacherName: "PT Teacher", time: "13:30 - 14:15" },
  { day: "Monday", period: 8, subject: "Library", teacherName: "Librarian", time: "14:15 - 15:00" },
  { day: "Tuesday", period: 1, subject: "Science", teacherName: "Vikram Singh", time: "08:00 - 08:45" },
  { day: "Tuesday", period: 2, subject: "Mathematics", teacherName: "Anjali Sharma", time: "08:45 - 09:30" },
  { day: "Wednesday", period: 1, subject: "English", teacherName: "Priya Desai", time: "08:00 - 08:45" },
  { day: "Thursday", period: 1, subject: "History", teacherName: "Ramesh Iyer", time: "08:00 - 08:45" },
  { day: "Friday", period: 1, subject: "Geography", teacherName: "Kavita Rao", time: "08:00 - 08:45" },
  { day: "Saturday", period: 1, subject: "Mathematics", teacherName: "Anjali Sharma", time: "08:00 - 08:45" },
];.ts