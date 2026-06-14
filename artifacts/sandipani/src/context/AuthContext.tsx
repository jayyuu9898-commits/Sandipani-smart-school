import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export interface UserProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  mobile_number: string | null;
  role: string;
  avatar_url: string | null;
  class_id: string | null;
  subject: string | null;
  section: string | null;
  stream: string | null;
  is_active: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<boolean>;
  signUpWithEmail: (email: string, password: string, fullName: string, role: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Check active session
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchProfile(session.user.id);
      }
    } catch (err) {
      console.error("Session check error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;

      if (data) {
        // Check if user is approved
        if (!data.is_approved && data.role !== "admin") {
          toast({
            title: "Account Pending Approval",
            description: "Your account is awaiting admin approval. Please contact the school administrator.",
          });
          await supabase.auth.signOut();
          setUser(null);
          return;
        }

        // Check if user is active
        if (!data.is_active) {
          toast({
            variant: "destructive",
            title: "Account Deactivated",
            description: "Your account has been deactivated. Please contact the administrator.",
          });
          await supabase.auth.signOut();
          setUser(null);
          return;
        }

        setUser(data);

        // Redirect based on role
        if (window.location.pathname === "/login" || window.location.pathname === "/splash") {
          redirectBasedOnRole(data.role);
        }
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      // Profile might not exist yet for new users
      // Try to get user metadata and create profile
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        // Wait for trigger to create profile, then retry
        await new Promise(resolve => setTimeout(resolve, 1000));
        const { data: newProfile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single();

        if (newProfile) {
          if (!newProfile.is_approved && newProfile.role !== "admin") {
            toast({
              title: "Account Pending Approval",
              description: "Your account is awaiting admin approval.",
            });
            await supabase.auth.signOut();
            setUser(null);
            return;
          }
          setUser(newProfile);
          redirectBasedOnRole(newProfile.role);
        }
      }
    }
  };

  const redirectBasedOnRole = (role: string) => {
    if (role === "admin") {
      setLocation("/admin");
    } else if (role === "teacher") {
      setLocation("/teacher");
    } else if (role === "student") {
      setLocation("/student");
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to sign in with Google";
      toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: message,
      });
    }
  };

  const signInWithEmail = async (email: string, password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Invalid credentials";
      toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: message,
      });
      return false;
    }
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    fullName: string,
    role: string
  ): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });

      if (error) throw error;

      // Update the role in profiles after signup
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        await supabase
          .from("profiles")
          .update({ role: role, full_name: fullName })
          .eq("id", authUser.id);
      }

      toast({
        title: "Account Created",
        description: role === "admin"
          ? "Admin account created successfully."
          : "Your account has been created and is pending admin approval.",
      });

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create account";
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: message,
      });
      return false;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setLocation("/login");
      toast({
        title: "Signed Out",
        description: "You have been signed out successfully.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out",
      });
    }
  };

  const refreshProfile = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      await fetchProfile(authUser.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        refreshProfile,
      }}
    >
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
