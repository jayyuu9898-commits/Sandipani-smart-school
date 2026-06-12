import { useState } from "react";
import { Link, useLocation } from "wouter";
import { GraduationCap, Menu, X, Users, UserCheck, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/#features" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Notices", href: "/#notices" },
  { label: "About Developer", href: "/about" },
  { label: "Contact", href: "/#contact" },
];

export function LandingHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#0d1b4b] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2.5 cursor-pointer flex-shrink-0">
              <div className="w-9 h-9 bg-amber-400 rounded-xl flex items-center justify-center shadow-md">
                <GraduationCap size={20} className="text-[#0d1b4b]" strokeWidth={2.5} />
              </div>
              <div className="hidden sm:block">
                <p className="text-white font-black text-sm leading-tight">SANDIPANI</p>
                <p className="text-amber-400 text-[9px] font-bold tracking-widest uppercase">Smart School</p>
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map(link => {
              const isActive = location === link.href || (link.href === "/about" && location === "/about");
              if (link.href.includes("#")) {
                const id = link.href.split("#")[1];
                return (
                  <button key={link.label} onClick={() => scrollTo(id)}
                    className={`text-sm font-medium transition-colors ${isActive ? "text-amber-400 border-b-2 border-amber-400 pb-0.5" : "text-white/80 hover:text-white"}`}>
                    {link.label}
                  </button>
                );
              }
              return (
                <Link key={link.label} href={link.href}>
                  <span className={`text-sm font-medium transition-colors cursor-pointer ${isActive ? "text-amber-400 border-b-2 border-amber-400 pb-0.5" : "text-white/80 hover:text-white"}`}>
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <Link href="/login">
              <button className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors">
                <Users size={13} /> Student Login
              </button>
            </Link>
            <Link href="/login">
              <button className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-[#0d1b4b] text-xs font-bold px-3 py-2 rounded-lg transition-colors">
                <UserCheck size={13} /> Teacher Login
              </button>
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button onClick={() => setMenuOpen(v => !v)} className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-[#0d1b4b] border-t border-white/10 overflow-hidden">
              <div className="px-4 py-3 space-y-1">
                {navLinks.map(link => {
                  if (link.href.includes("#")) {
                    const id = link.href.split("#")[1];
                    return (
                      <button key={link.label} onClick={() => scrollTo(id)}
                        className="w-full text-left text-sm text-white/80 hover:text-white hover:bg-white/5 rounded-lg px-3 py-2.5 transition-colors">
                        {link.label}
                      </button>
                    );
                  }
                  return (
                    <Link key={link.label} href={link.href}>
                      <span onClick={() => setMenuOpen(false)} className={`block text-sm rounded-lg px-3 py-2.5 transition-colors cursor-pointer ${location === link.href ? "text-amber-400 bg-white/5" : "text-white/80 hover:text-white hover:bg-white/5"}`}>
                        {link.label}
                      </span>
                    </Link>
                  );
                })}
                <div className="pt-2 grid grid-cols-2 gap-2">
                  <Link href="/login">
                    <button onClick={() => setMenuOpen(false)} className="w-full flex items-center justify-center gap-1.5 bg-primary text-white text-xs font-bold px-3 py-2.5 rounded-lg">
                      <Users size={12} /> Student Login
                    </button>
                  </Link>
                  <Link href="/login">
                    <button onClick={() => setMenuOpen(false)} className="w-full flex items-center justify-center gap-1.5 bg-amber-400 text-[#0d1b4b] text-xs font-bold px-3 py-2.5 rounded-lg">
                      <UserCheck size={12} /> Teacher Login
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
