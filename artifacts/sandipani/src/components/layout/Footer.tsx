import { Link } from "wouter";
import { GraduationCap, Info } from "lucide-react";

export function Footer() {
  return (
    <div className="bg-white border-t border-border mx-0 px-4 py-5 mt-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-2">
          <GraduationCap size={16} className="text-primary" />
          <span className="text-sm font-bold text-foreground tracking-wide">Sandipani Smart School</span>
        </div>
        <p className="text-xs text-muted-foreground">© 2025 All rights reserved</p>
        <p className="text-xs text-muted-foreground">Developed by <span className="font-semibold text-foreground">Jay Soni</span> | Class 12th Science</p>
        <Link href="/about">
          <span className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline mt-1 cursor-pointer">
            <Info size={11} /> About Developer
          </span>
        </Link>
      </div>
    </div>
  );
}
