import React from "react";
import { useAuth } from "@/context/AuthContext";
import { LogOut, GraduationCap } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header({ title = "Sandipani Smart School" }: { title?: string }) {
  const { user, logout } = useAuth();

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-full">
          <GraduationCap size={20} className="text-white" />
        </div>
        <h1 className="font-semibold text-lg">{title}</h1>
      </div>
      {user && (
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8 border-2 border-white/20">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="bg-primary-foreground text-primary text-xs font-bold">{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <button onClick={logout} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <LogOut size={18} className="text-white" />
          </button>
        </div>
      )}
    </div>
  );
}