import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, ShieldCheck, User, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const { login } = useAuth();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email, password, role);
    if (!success) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid credentials for the selected role. Hint: role@sandipani.edu / role123",
      });
    }
  };

  const roles = [
    { id: "student", label: "Student", icon: User },
    { id: "teacher", label: "Teacher", icon: Users },
    { id: "admin", label: "Admin", icon: ShieldCheck },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <div className="mx-auto bg-primary w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <GraduationCap size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Sandipani Smart School</h1>
          <p className="text-muted-foreground mt-1 text-sm">Sign in to your account</p>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
        >
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-3">
              <Label>Select Role</Label>
              <RadioGroup value={role} onValueChange={setRole} className="grid grid-cols-3 gap-2">
                {roles.map((r) => {
                  const Icon = r.icon;
                  return (
                    <Label
                      key={r.id}
                      className={cn(
                        "flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer transition-all duration-200",
                        role === r.id ? "border-primary bg-primary/5 text-primary" : "border-gray-200 hover:bg-gray-50 text-gray-500"
                      )}
                    >
                      <RadioGroupItem value={r.id} className="sr-only" />
                      <Icon size={20} className="mb-1" />
                      <span className="text-xs font-medium">{r.label}</span>
                    </Label>
                  );
                })}
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder={`${role}@sandipani.edu`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder={`${role}123`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-base font-semibold rounded-xl">
              Sign In
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}