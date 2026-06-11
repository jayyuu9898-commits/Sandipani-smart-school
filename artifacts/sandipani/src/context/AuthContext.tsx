import React, { createContext, useContext, useState, useEffect } from "react";
import { User, mockUsers } from "@/data/mockData";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const login = (email: string, password: string, role: string) => {
    const foundUser = mockUsers.find(
      (u) => u.email === email && u.password === password && u.role === role
    );
    if (foundUser) {
      setUser(foundUser);
      toast({ title: "Login Successful", description: `Welcome back, ${foundUser.name}` });
      if (foundUser.role === "admin") setLocation("/admin");
      else if (foundUser.role === "teacher") setLocation("/teacher");
      else if (foundUser.role === "student") setLocation("/student");
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setLocation("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}