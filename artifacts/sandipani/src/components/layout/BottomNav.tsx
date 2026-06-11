import React from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

export function BottomNav({ items }: { items: NavItem[] }) {
  const [location] = useLocation();

  return (
    <div className="flex items-center justify-around px-2 py-2 h-16 pb-safe">
      {items.map((item) => {
        const isActive = location === item.href || (location.startsWith(item.href) && item.href !== "/admin" && item.href !== "/teacher" && item.href !== "/student");
        const Icon = item.icon;
        
        return (
          <Link key={item.href} href={item.href} className="flex-1">
            <div className={cn(
              "flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all duration-200",
              isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-primary/70 hover:bg-primary/5"
            )}>
              <Icon size={22} className={cn(isActive && "fill-primary/20")} />
              <span className={cn("text-[10px] font-medium", isActive ? "font-bold" : "")}>{item.label}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}