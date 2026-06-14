import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { useSchoolSettings } from "@/hooks/useSettings";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Settings as SettingsIcon,
  School,
  Phone,
  Mail,
  Globe,
  MapPin,
  Calendar,
  FileText,
  Save,
  Loader2,
  User
} from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const navItems = [
  { icon: SettingsIcon, label: "Dashboard", href: "/admin" },
  { icon: SettingsIcon, label: "Students", href: "/admin/students" },
  { icon: SettingsIcon, label: "Teachers", href: "/admin/teachers" },
  { icon: SettingsIcon, label: "Classes", href: "/admin/classes" },
  { icon: SettingsIcon, label: "Settings", href: "/admin/settings" },
];

export default function AdminSettings() {
  const { user } = useAuth();
  const { settings, loading, updateSettings, refetch } = useSchoolSettings();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    school_name: "",
    principal_name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    email: "",
    website: "",
    established_year: "",
    board_affiliation: "",
    tagline: "",
    description: "",
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        school_name: settings.school_name || "",
        principal_name: settings.principal_name || "",
        address: settings.address || "",
        city: settings.city || "",
        state: settings.state || "",
        pincode: settings.pincode || "",
        phone: settings.phone || "",
        email: settings.email || "",
        website: settings.website || "",
        established_year: settings.established_year?.toString() || "",
        board_affiliation: settings.board_affiliation || "",
        tagline: settings.tagline || "",
        description: settings.description || "",
      });
    }
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    const success = await updateSettings({
      school_name: formData.school_name,
      principal_name: formData.principal_name,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      phone: formData.phone,
      email: formData.email,
      website: formData.website,
      established_year: formData.established_year ? parseInt(formData.established_year) : null,
      board_affiliation: formData.board_affiliation,
      tagline: formData.tagline,
      description: formData.description,
    });

    if (success) {
      toast({
        title: "Settings Saved",
        description: "School settings have been updated successfully.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save settings. Please try again.",
      });
    }
    setSaving(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <MobileLayout header={<Header />} bottomNav={<BottomNav items={navItems} />}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout header={<Header />} bottomNav={<BottomNav items={navItems} />}>
      <div className="p-4 space-y-5">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground">School Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your school information</p>
          </div>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={16} />}
            {saving ? "Saving..." : "Save"}
          </Button>
        </motion.div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <School size={18} /> School Information
                </CardTitle>
                <CardDescription>Basic school details and identification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="school_name">School Name</Label>
                  <Input
                    id="school_name"
                    value={formData.school_name}
                    onChange={(e) => handleInputChange("school_name", e.target.value)}
                    placeholder="Enter school name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="principal_name">Principal Name</Label>
                  <Input
                    id="principal_name"
                    value={formData.principal_name}
                    onChange={(e) => handleInputChange("principal_name", e.target.value)}
                    placeholder="Enter principal name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="established_year">Established Year</Label>
                    <Input
                      id="established_year"
                      type="number"
                      value={formData.established_year}
                      onChange={(e) => handleInputChange("established_year", e.target.value)}
                      placeholder="e.g., 2010"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="board_affiliation">Board Affiliation</Label>
                    <Input
                      id="board_affiliation"
                      value={formData.board_affiliation}
                      onChange={(e) => handleInputChange("board_affiliation", e.target.value)}
                      placeholder="e.g., CBSE"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Phone size={18} /> Contact Details
                </CardTitle>
                <CardDescription>Contact information and address</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Enter street address"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      placeholder="City"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      placeholder="State"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange("pincode", e.target.value)}
                    placeholder="PIN code"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+91 XXX XXX XXXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="info@school.edu"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    placeholder="www.school.edu"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText size={18} /> School Profile
                </CardTitle>
                <CardDescription>Public-facing content for your school</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={formData.tagline}
                    onChange={(e) => handleInputChange("tagline", e.target.value)}
                    placeholder="A short inspiring tagline"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Write a brief description about your school..."
                    rows={5}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Admin Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
}
