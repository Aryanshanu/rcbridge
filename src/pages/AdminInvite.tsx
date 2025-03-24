
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/sections/Footer";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { registerWithInviteCode, validateInviteCode } from "@/utils/admin";
import { Shield, KeyRound, Mail, User, Lock } from "lucide-react";

const AdminInvite = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    inviteCode: ""
  });
  const [codeValidated, setCodeValidated] = useState(false);
  const [roleType, setRoleType] = useState<string | null>(null);
  
  // If user is already logged in, redirect to admin
  React.useEffect(() => {
    if (user) {
      navigate("/admin");
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Reset validation when invite code changes
    if (name === "inviteCode") {
      setCodeValidated(false);
      setRoleType(null);
    }
  };

  const validateCode = () => {
    if (!formData.inviteCode.trim()) {
      toast.error("Please enter an invite code");
      return;
    }
    
    const result = validateInviteCode(formData.inviteCode);
    if (result.valid && result.role) {
      setCodeValidated(true);
      setRoleType(result.role);
      toast.success(`Valid invite code for ${result.role} role`);
    } else {
      toast.error(result.message || "Invalid invite code");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!codeValidated) {
      toast.error("Please validate your invite code first");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await registerWithInviteCode(
        formData.email,
        formData.password,
        formData.inviteCode,
        formData.fullName
      );
      
      if (result.success) {
        toast.success(result.message);
        navigate("/login");
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = () => {
    switch (roleType) {
      case "admin": return "text-red-600";
      case "developer": return "text-blue-600";
      case "maintainer": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title="Admin Invitation | RC Bridge" 
        description="Register with your admin invitation code" 
      />
      <Navbar />
      
      <main className="container py-12 px-4 mx-auto max-w-4xl">
        <Card className="w-full max-w-md mx-auto shadow-lg">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield size={28} className="text-primary" />
            </div>
            <CardTitle className="text-2xl">Admin Invitation</CardTitle>
            <CardDescription>
              Register with your invitation code to access the admin panel
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="inviteCode">Invitation Code</Label>
                  <div className="flex space-x-2 mt-1">
                    <div className="relative flex-1">
                      <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                      <Input
                        id="inviteCode"
                        name="inviteCode"
                        value={formData.inviteCode}
                        onChange={handleChange}
                        className="pl-9"
                        placeholder="Enter your invite code"
                        disabled={codeValidated}
                        required
                      />
                    </div>
                    <Button 
                      type="button" 
                      onClick={validateCode}
                      disabled={codeValidated || !formData.inviteCode.trim()}
                      variant="outline"
                    >
                      Verify
                    </Button>
                  </div>
                  
                  {codeValidated && roleType && (
                    <div className="mt-2 text-sm flex items-center">
                      <span>Role access: </span>
                      <span className={`font-medium ml-1 ${getRoleColor()}`}>
                        {roleType.charAt(0).toUpperCase() + roleType.slice(1)}
                      </span>
                    </div>
                  )}
                </div>
                
                {codeValidated && (
                  <>
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <div className="relative mt-1">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                        <Input
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          className="pl-9"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative mt-1">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="pl-9"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="pl-9"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="pl-9"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              {codeValidated && (
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating Account..." : "Create Admin Account"}
                </Button>
              )}
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center text-gray-500">
              Already have an account?{" "}
              <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/login")}>
                Sign in
              </Button>
            </div>
          </CardFooter>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminInvite;
