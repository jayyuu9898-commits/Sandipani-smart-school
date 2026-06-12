import { Link } from "wouter";
import { motion } from "framer-motion";
import { LandingHeader } from "@/components/layout/LandingHeader";
import {
  GraduationCap, BookOpen, CalendarCheck, Trophy, Code2,
  Lightbulb, Rocket, Target, CheckCircle2, Star, Mail,
  UserCheck, ChevronRight
} from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

const roadmap = [
  "Homework Management",
  "Notes & Study Material",
  "Attendance Tracking",
  "Results & Progress Reports",
  "Parent Portal",
  "AI Study Assistant",
  "AI Quiz Generator",
  "PDF Learning Assistant",
  "Smart Analytics",
  "School Mobile App",
];

const techStack = [
  { name: "React", color: "text-cyan-600 bg-cyan-50 border-cyan-200" },
  { name: "TypeScript", color: "text-blue-600 bg-blue-50 border-blue-200" },
  { name: "Tailwind CSS", color: "text-teal-600 bg-teal-50 border-teal-200" },
  { name: "Vite", color: "text-violet-600 bg-violet-50 border-violet-200" },
  { name: "Framer Motion", color: "text-rose-600 bg-rose-50 border-rose-200" },
  { name: "Express.js", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { name: "Replit", color: "text-orange-600 bg-orange-50 border-orange-200" },
  { name: "Git & GitHub", color: "text-gray-700 bg-gray-50 border-gray-200" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingHeader />

      {/* Page Hero */}
      <section className="bg-[#0d1b4b] text-white py-10 px-5 text-center">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black mb-2">About Developer</h1>
          <div className="flex items-center justify-center gap-1.5 text-white/60 text-sm">
            <Link href="/"><span className="hover:text-white/90 cursor-pointer">Home</span></Link>
            <ChevronRight size={13} />
            <span className="text-amber-400 font-medium">About Developer</span>
          </div>
        </motion.div>
      </section>

      {/* Main Developer Card */}
      <section className="px-4 py-10 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left — Photo */}
          <motion.div {...fadeUp()} className="flex flex-col items-center md:items-start">
            <div className="relative">
              <div className="w-64 h-72 md:w-full md:h-80 rounded-2xl overflow-hidden border-4 border-amber-400 shadow-xl">
                <img
                  src="/developer.jpg"
                  alt="Jay Soni — Founder & Developer"
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    const el = e.currentTarget;
                    el.style.display = "none";
                    const parent = el.parentElement;
                    if (parent) {
                      parent.className = "w-64 h-72 md:w-full md:h-80 rounded-2xl border-4 border-amber-400 shadow-xl bg-gradient-to-br from-primary to-indigo-700 flex items-center justify-center";
                      const span = document.createElement("span");
                      span.className = "text-6xl font-black text-white";
                      span.textContent = "JS";
                      parent.appendChild(span);
                    }
                  }}
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-[#0d1b4b]/90 backdrop-blur-sm rounded-b-2xl px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <UserCheck size={14} className="text-[#0d1b4b]" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Jay Soni</p>
                  <p className="text-amber-400 text-[11px] font-medium">Founder &amp; Developer</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Center — Details */}
          <motion.div {...fadeUp(0.1)} className="space-y-4">
            <div>
              <span className="inline-block bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full border border-amber-200 mb-3">Founder &amp; Developer</span>
              <h2 className="text-4xl font-black text-foreground mb-4">Jay Soni</h2>
            </div>
            {[
              { icon: GraduationCap, label: "Class", value: "12th Science" },
              { icon: CalendarCheck, label: "Academic Session", value: "2026-27" },
              { icon: Code2, label: "Role", value: "Founder & Developer" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0d1b4b] rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Icon size={17} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-sm font-bold text-foreground">{value}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Right — Quote */}
          <motion.div {...fadeUp(0.2)} className="bg-amber-50 border border-amber-200 rounded-2xl p-5 relative">
            <div className="text-amber-400 text-5xl font-black leading-none mb-3">"</div>
            <p className="text-foreground text-sm leading-relaxed">
              This project was created to make school education{" "}
              <span className="text-primary font-semibold">smarter</span>,{" "}
              <span className="text-amber-600 font-semibold">simpler</span>,{" "}
              and more <span className="text-amber-600 font-semibold">accessible</span> through technology.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed mt-3">
              My vision is to help students, teachers, and parents connect through a modern digital platform that improves learning, communication, and school management.
            </p>
            <p className="text-foreground text-sm leading-relaxed mt-3 font-medium">
              Sandipani Smart School is not just an application, but a step toward a smarter future of education."
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision / Mission / Goal */}
      <section className="bg-[#0d1b4b] px-4 py-10">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: Lightbulb,
              title: "My Vision",
              desc: "To build intelligent digital solutions that make education more effective, organized, and accessible for everyone.",
            },
            {
              icon: Rocket,
              title: "My Mission",
              desc: "To empower schools, teachers, students and parents with technology that simplifies school management and enhances learning.",
            },
            {
              icon: Target,
              title: "My Goal",
              desc: "To continue learning, building and innovating new features that can make education smarter with AI and technology.",
            },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div key={card.title} {...fadeUp(i * 0.08)}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 text-white">
                <div className="w-11 h-11 bg-amber-400 rounded-xl flex items-center justify-center mb-3">
                  <Icon size={20} className="text-[#0d1b4b]" />
                </div>
                <h3 className="font-black text-base mb-2">{card.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{card.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* About App + Tech */}
      <section className="px-4 py-10 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* About App */}
          <motion.div {...fadeUp()}>
            <h3 className="text-xl font-black mb-1">About Sandipani Smart School</h3>
            <div className="w-12 h-1 bg-amber-400 rounded-full mb-4" />
            <p className="text-muted-foreground text-sm leading-relaxed mb-5">
              Sandipani Smart School is a digital school management platform designed to simplify academic activities, improve communication and enhance the overall learning experience.
            </p>
            <div className="space-y-2.5">
              {["Smart & Secure Platform", "Easy to Use", "Helpful for Students, Teachers & Parents", "Built for the Future of Education"].map(p => (
                <div key={p} className="flex items-center gap-2.5">
                  <CheckCircle2 size={15} className="text-amber-500 flex-shrink-0" />
                  <span className="text-sm text-foreground">{p}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tech Stack */}
          <motion.div {...fadeUp(0.1)}>
            <h3 className="text-xl font-black mb-1">Technologies Used</h3>
            <div className="w-12 h-1 bg-amber-400 rounded-full mb-4" />
            <div className="grid grid-cols-2 gap-2.5">
              {techStack.map((t) => (
                <div key={t.name} className={`border rounded-xl px-3 py-2.5 flex items-center gap-2 ${t.color}`}>
                  <Code2 size={14} />
                  <span className="text-sm font-semibold">{t.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="bg-muted/40 px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeUp()}>
            <h3 className="text-xl font-black mb-1 text-center">Future Roadmap</h3>
            <div className="w-12 h-1 bg-amber-400 rounded-full mx-auto mb-6" />
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
            {roadmap.map((r, i) => (
              <motion.div key={r} {...fadeUp(i * 0.04)} className="flex items-center gap-2.5 bg-white border border-border rounded-xl px-4 py-3 shadow-sm">
                <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                <span className="text-sm font-medium">{r}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dark Commitment Banner */}
      <section className="bg-[#0d1b4b] px-4 py-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div {...fadeUp()} className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-400 rounded-xl flex items-center justify-center flex-shrink-0">
              <Star size={22} className="text-[#0d1b4b]" />
            </div>
            <div>
              <p className="text-white font-bold text-sm mb-1">Built with Dedication</p>
              <p className="text-white/60 text-sm leading-relaxed">Developed with dedication and a vision to bring smart digital education to every school.</p>
            </div>
          </motion.div>
          <motion.div {...fadeUp(0.1)} className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-400 rounded-xl flex items-center justify-center flex-shrink-0">
              <Mail size={22} className="text-[#0d1b4b]" />
            </div>
            <div>
              <p className="text-white font-bold text-sm mb-1">Have any suggestions or feedback?</p>
              <a href="mailto:sandipanismartschool@gmail.com" className="text-amber-400 text-sm font-semibold hover:underline">Contact me anytime!</a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Rich Footer */}
      <footer className="bg-[#060e2a] text-white px-4 pt-10 pb-5">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pb-8 border-b border-white/10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center">
                  <GraduationCap size={20} className="text-[#0d1b4b]" />
                </div>
                <div>
                  <p className="text-white font-black text-sm">SANDIPANI</p>
                  <p className="text-amber-400 text-[9px] font-bold tracking-widest">SMART SCHOOL</p>
                </div>
              </div>
              <p className="text-white/50 text-xs leading-relaxed italic">Learning Today, Leading Tomorrow</p>
            </div>
            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-black mb-3 text-amber-400">Quick Links</h4>
              <div className="space-y-1.5">
                {[["Home", "/"], ["Features", "/"], ["Gallery", "/"], ["Notices", "/"], ["About Developer", "/about"], ["Contact", "/"]].map(([label, href]) => (
                  <Link key={label} href={href}>
                    <span className={`block text-xs cursor-pointer transition-colors ${label === "About Developer" ? "text-amber-400 font-semibold" : "text-white/60 hover:text-white"}`}>{label}</span>
                  </Link>
                ))}
              </div>
            </div>
            {/* Contact */}
            <div>
              <h4 className="text-sm font-black mb-3 text-amber-400">Connect With Us</h4>
              <div className="space-y-2">
                {[
                  { icon: Mail, text: "sandipanismartschool@gmail.com" },
                  { icon: Trophy, text: "+91 00000 00000" },
                  { icon: GraduationCap, text: "Sandipani Smart School, India" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-2 text-white/60">
                    <Icon size={12} className="mt-0.5 flex-shrink-0" />
                    <span className="text-xs">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-white/40 text-xs">
            <p>© 2026 Sandipani Smart School. All Rights Reserved.</p>
            <p>Developed by <span className="text-amber-400 font-semibold">Jay Soni</span> | Class 12<sup>th</sup> Science</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
