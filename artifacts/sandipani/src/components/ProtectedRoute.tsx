import { useAuth } from "@/context/AuthContext";
import { Redirect } from "wouter";

function ProtectedRoute({ component: Component, role }: { component: React.ComponentType; role?: string }) {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (!user) return <Redirect to="/login" />;
    if (role && user.role !== role) return <Redirect to="/login" />;
    return <Component />;
  }

export default ProtectedRoute;
