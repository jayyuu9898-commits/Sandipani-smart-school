import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  GraduationCap, BookOpen, CalendarCheck, Trophy, FileText, Bell,
  Users, UserCheck, Brain, Sparkles, Star, CheckCircle2, ChevronRight,
  Building2, FlaskConical, Library, Dumbbell, Music, Camera,
  MessageSquare, Shield, Smartphone, Zap, ArrowRight, Code2,
  ClipboardList, BarChart3, Clock, Send, MapPin, Phone, Mail,
  Lightbulb, Target, Rocket, Bot, Cpu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

const notices = [
  { tag: "Admission", color: "bg-blue-50 border-blue-200 text-blue-700", badge: "bg-blue-100 text-blue-700", text: "Admissions Open for Session 2026-27", date: "Jun 2026" },
  { tag: "Holiday", color: "bg-amber-50 border-amber-200 text-amber-700", badge: "bg-amber-100 text-amber-700", text: "School Summer Holidays: 15 Jun – 30 Jun 2026", date: "Jun 2026" },
  { tag: "Exam", color: "bg-rose-50 border-rose-200 text-rose-700", badge: "bg-rose-100 text-rose-700", text: "Unit Test III Schedule Released — Check Dashboard", date: "Jul 2026" },
  { tag: "Event", color: "bg-emerald-50 border-emerald-200 text-emerald-700", badge: "bg-emerald-100 text-emerald-700", text: "Annual Science Exhibition: Registrations Open", date: "Aug 2026" },
];

const whyCards = [
  { icon: Brain, label: "Smart Learning", desc: "AI-powered personalized learning experience" },
  { icon: BookOpen, label: "Digital Homework", desc: "Assign and submit homework digitally" },
  { icon: CalendarCheck, label: "Attendance Tracking", desc: "Real-time attendance monitoring" },
  { icon: BarChart3, label: "Academic Progress", desc: "Visual performance analytics" },
  { icon: Library, label: "Resource Library", desc: "Digital notes and study materials" },
  { icon: Smartphone, label: "Mobile Friendly", desc: "Access from any device, anywhere" },
  { icon: Shield, label: "Secure Platform", desc: "Role-based access & privacy protected" },
  { icon: Sparkles, label: "Future AI Support", desc: "AI study assistant coming soon" },
];

const campusCards = [
  { icon: BookOpen, label: "Homework Management", color: "bg-violet-100 text-violet-600" },
  { icon: CalendarCheck, label: "Attendance Tracking", color: "bg-blue-100 text-blue-600" },
  { icon: Clock, label: "Timetable", color: "bg-emerald-100 text-emerald-600" },
  { icon: Trophy, label: "Results & Report Cards", color: "bg-amber-100 text-amber-600" },
  { icon: FileText, label: "Digital Notes Library", color: "bg-rose-100 text-rose-600" },
  { icon: BarChart3, label: "Student Progress", color: "bg-indigo-100 text-indigo-600" },
  { icon: Bell, label: "Notifications", color: "bg-orange-100 text-orange-600" },
  { icon: Library, label: "Study Resources", color: "bg-teal-100 text-teal-600" },
];

const studentBenefits = [
  { icon: BookOpen, label: "Homework Access", color: "text-violet-600" },
  { icon: FileText, label: "Study Notes", color: "text-emerald-600" },
  { icon: CalendarCheck, label: "Attendance Monitoring", color: "text-blue-600" },
  { icon: Trophy, label: "Results Tracking", color: "text-amber-600" },
  { icon: Library, label: "Digital Learning Resources", color: "text-rose-600" },
  { icon: Bot, label: "Future AI Study Assistant", color: "text-indigo-600" },
];

const teacherBenefits = [
  { icon: BookOpen, label: "Homework Upload", color: "text-violet-600" },
  { icon: FileText, label: "Notes Sharing", color: "text-emerald-600" },
  { icon: CalendarCheck, label: "Attendance Management", color: "text-blue-600" },
  { icon: Trophy, label: "Result Management", color: "text-amber-600" },
  { icon: BarChart3, label: "Academic Monitoring", color: "text-rose-600" },
];

const parentBenefits = [
  { icon: CalendarCheck, label: "Attendance Monitoring", color: "text-blue-600" },
  { icon: Trophy, label: "Result Tracking", color: "text-amber-600" },
  { icon: BookOpen, label: "Homework Updates", color: "text-violet-600" },
  { icon: Bell, label: "School Notices", color: "text-rose-600" },
  { icon: BarChart3, label: "Academic Progress Tracking", color: "text-emerald-600" },
];

const aiFeatures = [
  { icon: Bot, label: "AI Study Assistant" },
  { icon: BookOpen, label: "AI Homework Helper" },
  { icon: ClipboardList, label: "AI Quiz Generator" },
  { icon: FileText, label: "AI Notes Explainer" },
  { icon: BarChart3, label: "AI Learning Analytics" },
  { icon: Target, label: "AI Weak Topic Detection" },
  { icon: Lightbulb, label: "AI Personalized Practice" },
];

const galleryItems = [
  { icon: Building2, label: "School Building", color: "from-blue-400 to-blue-600" },
  { icon: Users, label: "Classrooms", color: "from-violet-400 to-violet-600" },
  { icon: FlaskConical, label: "Science Lab", color: "from-emerald-400 to-emerald-600" },
  { icon: Library, label: "Library", color: "from-amber-400 to-amber-600" },
  { icon: Dumbbell, label: "Sports Activities", color: "from-rose-400 to-rose-600" },
  { icon: Music, label: "Annual Functions", color: "from-indigo-400 to-indigo-600" },
];

const events = [
  { icon: CalendarCheck, label: "Unit Test III", date: "15 Jul 2026", type: "Exam", color: "text-rose-600 bg-rose-50 border-rose-100" },
  { icon: Star, label: "Science Exhibition", date: "18 Aug 2026", type: "Event", color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
  { icon: Trophy, label: "Sports Day", date: "5 Sep 2026", type: "Sports", color: "text-amber-600 bg-amber-50 border-amber-100" },
  { icon: GraduationCap, label: "Founder's Day", date: "12 Oct 2026", type: "Celebration", color: "text-blue-600 bg-blue-50 border-blue-100" },
];

const achievements = [
  { icon: Trophy, label: "District Science Olympiad", value: "1st Place", sub: "Academic Excellence" },
  { icon: Star, label: "National Debate Championship", value: "2nd Place", sub: "Cultural Achievement" },
  { icon: Dumbbell, label: "State Athletics Meet", value: "Gold Medal", sub: "Sports Excellence" },
  { icon: Users, label: "Student Enrollment", value: "500+", sub: "Growing Community" },
];

const roadmap = [
  { label: "Public School Portal", done: true },
  { label: "Student Dashboard", done: true },
  { label: "Teacher Dashboard", done: true },
  { label: "Homework Management", done: true },
  { label: "Notes Management", done: true },
  { label: "Attendance System", done: true },
  { label: "Results System", done: true },
  { label: "Excel Import", done: true },
  { label: "Parent Portal", done: false },
  { label: "AI Study Assistant", done: false },
  { label: "AI Quiz Generator", done: false },
  { label: "Smart School Analytics", done: false },
];

export default function Landing() {
  const [tab, setTab] = useState<"student" | "teacher" | "parent">("student");
  const [admissionForm, setAdmissionForm] = useState({ studentName: "", parentName: "", mobile: "", interestedClass: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleAdmission = () => {
    if (!admissionForm.studentName || !admissionForm.mobile) {
      toast({ title: "Required Fields", description: "Please fill student name and mobile number.", variant: "destructive" });
      return;
    }
    setSubmitted(true);
    toast({ title: "Inquiry Submitted!", description: "We will contact you shortly. Thank you!" });
    setAdmissionForm({ studentName: "", parentName: "", mobile: "", interestedClass: "", message: "" });
    setTimeout(() => setSubmitted(false), 4000);
  };

  const benefitsMap = { student: studentBenefits, teacher: teacherBenefits, parent: parentBenefits };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_60%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-background rounded-t-[2.5rem]" />
        <div className="relative px-5 pt-14 pb-24 text-center max-w-lg mx-auto">
          <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }}>
            <div className="w-20 h-20 bg-white/15 border-2 border-white/30 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-xl">
              <GraduationCap size={40} className="text-white" strokeWidth={1.5} />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
            <h1 className="text-3xl font-black tracking-tight mb-1">Sandipani Smart School</h1>
            <p className="text-white/90 text-lg font-semibold italic mb-3">"Learning Today, Leading Tomorrow"</p>
            <p className="text-white/70 text-sm leading-relaxed mb-7">A Smart Digital School Platform for Students, Teachers and Parents.</p>
            <div className="flex flex-col gap-2.5">
              <Link href="/login">
                <Button className="w-full bg-white text-primary hover:bg-white/90 font-bold h-12 rounded-2xl text-base shadow-lg">
                  <Users size={17} className="mr-2" /> Student Login
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="w-full border-white/40 text-white hover:bg-white/10 font-semibold h-11 rounded-2xl backdrop-blur-sm">
                  <UserCheck size={17} className="mr-2" /> Teacher Login
                </Button>
              </Link>
              <button
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                className="text-white/80 text-sm font-medium flex items-center justify-center gap-1.5 mt-1 hover:text-white transition-colors"
              >
                Explore Features <ChevronRight size={14} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── WELCOME ── */}
      <section className="px-5 py-10 max-w-lg mx-auto">
        <motion.div {...fadeUp()}>
          <Badge className="mb-3 bg-primary/10 text-primary hover:bg-primary/10">Welcome</Badge>
          <h2 className="text-2xl font-black mb-3">Welcome to the Future of <span className="text-primary">Education</span></h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-5">
            Sandipani Smart School brings digital learning, smart school management, and student success under one platform. Empower teachers with efficient tools and give students the resources they need to excel.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Digital Learning", icon: Brain, color: "bg-blue-50 text-blue-600" },
              { label: "Smart Management", icon: Cpu, color: "bg-violet-50 text-violet-600" },
              { label: "Student Success", icon: Trophy, color: "bg-amber-50 text-amber-600" },
              { label: "Teacher Tools", icon: Zap, color: "bg-emerald-50 text-emerald-600" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className={`${item.color} rounded-2xl p-3 flex items-center gap-2`}>
                  <Icon size={18} />
                  <span className="text-xs font-semibold">{item.label}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* ── LATEST NOTICES ── */}
      <section className="px-5 pb-10 max-w-lg mx-auto">
        <motion.div {...fadeUp()}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <Badge className="mb-1 bg-rose-100 text-rose-700 hover:bg-rose-100">Notice Board</Badge>
              <h2 className="text-xl font-black">Latest Notices</h2>
            </div>
            <Bell size={20} className="text-primary" />
          </div>
          <div className="space-y-2.5">
            {notices.map((n, i) => (
              <motion.div key={i} {...fadeUp(i * 0.07)}
                className={`border rounded-2xl p-3.5 flex items-start gap-3 ${n.color}`}>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5 ${n.badge}`}>{n.tag}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{n.text}</p>
                  <p className="text-xs opacity-70 mt-0.5">{n.date}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section id="features" className="bg-muted/40 px-5 py-10 max-w-lg mx-auto rounded-none">
        <motion.div {...fadeUp()}>
          <Badge className="mb-3 bg-primary/10 text-primary hover:bg-primary/10">Why Us</Badge>
          <h2 className="text-xl font-black mb-5">Why Choose Sandipani Smart School?</h2>
        </motion.div>
        <div className="grid grid-cols-2 gap-3">
          {whyCards.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div key={c.label} {...fadeUp(i * 0.05)}
                className="bg-white rounded-2xl p-4 border border-border shadow-sm">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-2.5">
                  <Icon size={18} className="text-primary" />
                </div>
                <p className="text-sm font-bold leading-tight">{c.label}</p>
                <p className="text-[11px] text-muted-foreground mt-1 leading-tight">{c.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── INSIDE DIGITAL CAMPUS ── */}
      <section className="px-5 py-10 max-w-lg mx-auto">
        <motion.div {...fadeUp()}>
          <Badge className="mb-3 bg-indigo-100 text-indigo-700 hover:bg-indigo-100">Digital Campus</Badge>
          <h2 className="text-xl font-black mb-2">Inside Sandipani Smart School</h2>
          <p className="text-sm text-muted-foreground mb-5">Login to unlock all these powerful features.</p>
        </motion.div>
        <div className="grid grid-cols-2 gap-3">
          {campusCards.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div key={c.label} {...fadeUp(i * 0.05)}
                className="bg-white rounded-2xl p-4 border border-border shadow-sm">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2.5 ${c.color}`}>
                  <Icon size={18} />
                </div>
                <p className="text-sm font-bold leading-tight mb-1.5">{c.label}</p>
                <span className="inline-flex items-center gap-1 text-[10px] bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">
                  <Shield size={8} /> Available After Login
                </span>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className="bg-gradient-to-br from-primary/5 to-indigo-50 px-5 py-10 max-w-lg mx-auto">
        <motion.div {...fadeUp()}>
          <Badge className="mb-3 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Benefits</Badge>
          <h2 className="text-xl font-black mb-5">Built for Everyone</h2>
        </motion.div>
        <div className="flex gap-2 mb-5 bg-white rounded-2xl p-1 shadow-sm border border-border">
          {(["student", "teacher", "parent"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all ${tab === t ? "bg-primary text-white shadow-sm" : "text-muted-foreground"}`}>
              {t === "student" ? "👨‍🎓" : t === "teacher" ? "👩‍🏫" : "👨‍👩‍👧"} {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-2.5">
          {benefitsMap[tab].map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div key={b.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white rounded-2xl px-4 py-3 flex items-center gap-3 border border-border shadow-sm">
                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className={b.color} />
                </div>
                <p className="text-sm font-semibold">{b.label}</p>
                <CheckCircle2 size={15} className="text-emerald-500 ml-auto flex-shrink-0" />
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── FUTURE AI ── */}
      <section className="px-5 py-10 max-w-lg mx-auto">
        <motion.div {...fadeUp()}>
          <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 rounded-3xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-white/20 rounded-full px-2.5 py-1 text-[10px] font-bold mb-2">
                  <Sparkles size={10} /> Coming Soon
                </div>
                <h2 className="text-xl font-black">Future AI Learning System</h2>
                <p className="text-white/70 text-xs mt-1">Powered by Artificial Intelligence</p>
              </div>
              <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center">
                <Brain size={30} className="text-white" />
              </div>
            </div>
            <div className="space-y-2.5">
              {aiFeatures.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div key={f.label} {...fadeUp(i * 0.05)}
                    className="flex items-center gap-3 bg-white/10 rounded-xl px-3 py-2.5">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon size={15} className="text-white" />
                    </div>
                    <span className="text-sm font-medium">{f.label}</span>
                    <span className="ml-auto text-[9px] bg-white/20 px-1.5 py-0.5 rounded-full font-bold">SOON</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── GALLERY ── */}
      <section className="bg-muted/40 px-5 py-10 max-w-lg mx-auto">
        <motion.div {...fadeUp()}>
          <Badge className="mb-3 bg-amber-100 text-amber-700 hover:bg-amber-100">Gallery</Badge>
          <h2 className="text-xl font-black mb-5">School Gallery</h2>
        </motion.div>
        <div className="grid grid-cols-3 gap-2.5">
          {galleryItems.map((g, i) => {
            const Icon = g.icon;
            return (
              <motion.div key={g.label} {...fadeUp(i * 0.07)}
                className={`aspect-square rounded-2xl bg-gradient-to-br ${g.color} flex flex-col items-center justify-center shadow-sm`}>
                <Icon size={24} className="text-white mb-1" />
                <p className="text-white text-[9px] font-semibold text-center px-1 leading-tight">{g.label}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── EVENTS & CALENDAR ── */}
      <section className="px-5 py-10 max-w-lg mx-auto">
        <motion.div {...fadeUp()}>
          <Badge className="mb-3 bg-blue-100 text-blue-700 hover:bg-blue-100">Events</Badge>
          <h2 className="text-xl font-black mb-5">Upcoming Events & Calendar</h2>
        </motion.div>
        <div className="space-y-2.5">
          {events.map((e, i) => {
            const Icon = e.icon;
            return (
              <motion.div key={e.label} {...fadeUp(i * 0.07)}
                className={`border rounded-2xl px-4 py-3.5 flex items-center gap-3 ${e.color}`}>
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Icon size={18} className={e.color.split(" ")[0]} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">{e.label}</p>
                  <p className="text-xs opacity-70">{e.date}</p>
                </div>
                <span className="text-[10px] bg-white/60 font-bold px-2 py-0.5 rounded-full">{e.type}</span>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── ACHIEVEMENTS ── */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 px-5 py-10 max-w-lg mx-auto">
        <motion.div {...fadeUp()}>
          <Badge className="mb-3 bg-amber-200 text-amber-800 hover:bg-amber-200">Achievements</Badge>
          <h2 className="text-xl font-black mb-5">Our Achievements</h2>
        </motion.div>
        <div className="grid grid-cols-2 gap-3">
          {achievements.map((a, i) => {
            const Icon = a.icon;
            return (
              <motion.div key={a.label} {...fadeUp(i * 0.07)}
                className="bg-white rounded-2xl p-4 border border-amber-100 shadow-sm text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <Icon size={22} className="text-amber-600" />
                </div>
                <p className="text-xl font-black text-amber-600">{a.value}</p>
                <p className="text-xs font-bold text-foreground leading-tight mt-0.5">{a.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{a.sub}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── ADMISSION FORM ── */}
      <section className="px-5 py-10 max-w-lg mx-auto">
        <motion.div {...fadeUp()}>
          <Badge className="mb-3 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Admissions</Badge>
          <h2 className="text-xl font-black mb-2">Admission Inquiry</h2>
          <p className="text-sm text-muted-foreground mb-5">Fill the form below and our team will contact you shortly.</p>
        </motion.div>
        {submitted ? (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center">
            <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-3" />
            <h3 className="font-black text-emerald-700 text-lg">Inquiry Submitted!</h3>
            <p className="text-emerald-600 text-sm mt-1">Thank you! We will contact you within 24 hours.</p>
          </motion.div>
        ) : (
          <motion.div {...fadeUp(0.1)} className="bg-white rounded-3xl border border-border p-5 shadow-sm space-y-3">
            <div className="space-y-1"><Label>Student Name *</Label><Input placeholder="Full name of student" value={admissionForm.studentName} onChange={e => setAdmissionForm(f => ({ ...f, studentName: e.target.value }))} /></div>
            <div className="space-y-1"><Label>Parent Name</Label><Input placeholder="Father / Mother name" value={admissionForm.parentName} onChange={e => setAdmissionForm(f => ({ ...f, parentName: e.target.value }))} /></div>
            <div className="space-y-1"><Label>Mobile Number *</Label><Input type="tel" placeholder="10-digit mobile number" value={admissionForm.mobile} onChange={e => setAdmissionForm(f => ({ ...f, mobile: e.target.value }))} /></div>
            <div className="space-y-1">
              <Label>Interested Class</Label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm bg-white" value={admissionForm.interestedClass} onChange={e => setAdmissionForm(f => ({ ...f, interestedClass: e.target.value }))}>
                <option value="">Select Class</option>
                {["Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <Label>Message</Label>
              <textarea className="w-full border rounded-lg px-3 py-2 text-sm bg-white min-h-[80px] resize-none" placeholder="Any questions or additional info..." value={admissionForm.message} onChange={e => setAdmissionForm(f => ({ ...f, message: e.target.value }))} />
            </div>
            <Button className="w-full h-11 rounded-2xl gap-2" onClick={handleAdmission}>
              <Send size={15} /> Submit Inquiry
            </Button>
          </motion.div>
        )}
      </section>

      {/* ── DEVELOPER SECTION ── */}
      <section className="bg-gradient-to-br from-primary/5 to-indigo-50 px-5 py-10 max-w-lg mx-auto">
        <motion.div {...fadeUp()}>
          <Badge className="mb-3 bg-indigo-100 text-indigo-700 hover:bg-indigo-100">Team</Badge>
          <h2 className="text-xl font-black mb-5">Founder & Developer</h2>
        </motion.div>
        <motion.div {...fadeUp(0.1)} className="bg-white rounded-3xl border border-border p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-3xl font-black text-white">JS</span>
            </div>
            <div>
              <h3 className="text-xl font-black">Jay Soni</h3>
              <p className="text-sm text-muted-foreground">Founder & Developer</p>
              <div className="flex flex-col gap-0.5 mt-1.5">
                <span className="text-xs text-primary font-semibold">Class: 12th Science</span>
                <span className="text-xs text-muted-foreground">Academic Session: 2026-27</span>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-primary/5 border border-primary/10 rounded-2xl p-4 mb-4">
            <p className="text-[10px] text-primary font-bold uppercase tracking-wider mb-2">Message from the Developer</p>
            <p className="text-sm text-foreground leading-relaxed italic">
              "This project was created to make school education smarter, simpler, and more accessible through technology.
            </p>
            <p className="text-sm text-foreground leading-relaxed italic mt-2">
              My vision is to help students, teachers, and parents connect through a modern digital platform that improves learning, communication, and school management.
            </p>
            <p className="text-sm text-foreground leading-relaxed italic mt-2">
              Sandipani Smart School is not just an application, but a step toward a smarter future of education."
            </p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Designed and Developed by Jay Soni with the vision of bringing smart digital education and school management solutions to students, teachers and parents.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {["React", "TypeScript", "Vite", "Tailwind CSS", "Framer Motion"].map(t => (
              <span key={t} className="text-[10px] bg-primary/10 text-primary font-medium px-2 py-0.5 rounded-full">{t}</span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── ROADMAP ── */}
      <section className="px-5 py-10 max-w-lg mx-auto">
        <motion.div {...fadeUp()}>
          <Badge className="mb-3 bg-violet-100 text-violet-700 hover:bg-violet-100">Roadmap</Badge>
          <h2 className="text-xl font-black mb-5">Future Roadmap</h2>
        </motion.div>
        <div className="relative">
          <div className="absolute left-[18px] top-0 bottom-0 w-0.5 bg-border" />
          <div className="space-y-3">
            {roadmap.map((r, i) => (
              <motion.div key={r.label} {...fadeUp(i * 0.04)} className="flex items-center gap-4 relative">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 z-10 shadow-sm border-2 ${r.done ? "bg-emerald-500 border-emerald-500" : "bg-white border-border"}`}>
                  {r.done
                    ? <CheckCircle2 size={16} className="text-white" />
                    : <div className="w-3 h-3 rounded-full bg-border" />}
                </div>
                <div className={`flex-1 bg-white border rounded-xl px-3 py-2 shadow-sm ${r.done ? "border-emerald-100" : "border-border"}`}>
                  <p className={`text-sm font-semibold ${r.done ? "text-foreground" : "text-muted-foreground"}`}>{r.label}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${r.done ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
                  {r.done ? "Done" : "Soon"}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-5 py-10 max-w-lg mx-auto">
        <motion.div {...fadeUp()}>
          <div className="bg-gradient-to-br from-primary to-indigo-700 rounded-3xl p-7 text-white text-center shadow-xl">
            <Rocket size={36} className="mx-auto mb-3 text-white/90" />
            <h2 className="text-2xl font-black mb-2">Join the Digital Learning Experience</h2>
            <p className="text-white/70 text-sm mb-6">Start your journey with Sandipani Smart School today.</p>
            <div className="flex flex-col gap-2.5">
              <Link href="/login">
                <Button className="w-full bg-white text-primary hover:bg-white/90 font-bold h-11 rounded-2xl shadow-md">
                  <Users size={16} className="mr-2" /> Student Login
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="w-full border-white/40 text-white hover:bg-white/10 font-semibold h-11 rounded-2xl">
                  <UserCheck size={16} className="mr-2" /> Teacher Login
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-foreground text-background px-5 pt-8 pb-6 max-w-full">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center">
              <GraduationCap size={16} className="text-white" />
            </div>
            <span className="font-black text-sm">Sandipani Smart School</span>
          </div>
          <p className="text-xs text-background/60 mb-4">© 2026 Sandipani Smart School. All rights reserved.</p>
          <p className="text-xs text-background/60 mb-4">Developed by <span className="text-background/90 font-semibold">Jay Soni</span> | Class 12th Science · Version 1.0</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-white/10 pt-4">
            {[
              { label: "Home", href: "/" },
              { label: "About School", href: "/" },
              { label: "About Developer", href: "/about" },
              { label: "Login", href: "/login" },
            ].map(link => (
              <Link key={link.label} href={link.href}>
                <span className="text-xs text-background/60 hover:text-background transition-colors cursor-pointer">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
