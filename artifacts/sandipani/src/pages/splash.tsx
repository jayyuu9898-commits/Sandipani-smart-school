import { useEffect } from "react";
import { useLocation } from "wouter";
import { GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

export default function Splash() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLocation("/login");
    }, 2500);
    return () => clearTimeout(timer);
  }, [setLocation]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary text-primary-foreground">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div className="bg-white/10 p-6 rounded-full mb-6 backdrop-blur-sm">
          <GraduationCap size={80} className="text-white" strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Sandipani</h1>
        <p className="text-primary-foreground/80 font-medium tracking-widest uppercase text-sm">SMART SCHOOL</p>
      </motion.div>
    </div>
  );
}