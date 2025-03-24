
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { LockIcon, KeyIcon, UserIcon, AtSignIcon, ShieldCheckIcon } from "lucide-react";
import { validateInviteCode, registerWithInviteCode } from "@/utils/admin";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const AdminInvite = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'invite' | 'register'>('invite');
  const [isLoading, setIsLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [validatedRole, setValidatedRole] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate the invite code
      const validation = validateInviteCode(inviteCode);
      
      if (!validation.valid) {
        toast.error(validation.message || "Invalid invite code");
        setIsLoading(false);
        return;
      }
      
      // Store the validated role and move to registration step
      setValidatedRole(validation.role);
      setStep('register');
      toast.success(`Invite code accepted! Role: ${validation.role}`);
      
    } catch (error) {
      console.error("Error validating invite code:", error);
      toast.error("Error validating invite code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        setIsLoading(false);
        return;
      }
      
      // Validate password length
      if (formData.password.length < 8) {
        toast.error("Password must be at least 8 characters long");
        setIsLoading(false);
        return;
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error("Please enter a valid email address");
        setIsLoading(false);
        return;
      }
      
      // Register with invite code
      const result = await registerWithInviteCode(
        formData.email,
        formData.password,
        inviteCode,
        formData.fullName
      );
      
      if (result.success) {
        toast.success("Registration successful! You can now log in.");
        
        // Navigate to login page
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        toast.error(result.message || "Registration failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen py-8">
      <div className="w-full max-w-md">
        {step === 'invite' ? (
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-2">
                <div className="p-3 rounded-full bg-primary/10">
                  <KeyIcon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">Admin Access</CardTitle>
              <CardDescription className="text-center">
                Enter your invite code to create an admin account
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleInviteSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="inviteCode">Invite Code</Label>
                  <div className="relative">
                    <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input 
                      id="inviteCode"
                      name="inviteCode"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value)}
                      placeholder="Enter your invite code"
                      className="pl-9"
                      required
                    />
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                  <p className="text-sm text-amber-800">
                    <span className="font-semibold">Note:</span> Invite codes are required for admin access. If you don't have an invite code, please contact the system administrator.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Validating..." : "Continue"}
                </Button>
              </CardFooter>
            </form>
            <div className="px-6 pb-6 text-center">
              <Button variant="link" onClick={() => navigate("/login")}>
                Return to Login
              </Button>
            </div>
          </Card>
        ) : (
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-2">
                <div className="p-3 rounded-full bg-primary/10">
                  <ShieldCheckIcon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">Create Admin Account</CardTitle>
              <CardDescription className="text-center">
                Complete your registration with invite code
              </CardDescription>
            </CardHeader>
            
            <Alert className="mx-6 bg-blue-50 border-blue-200">
              <AlertTitle className="text-blue-800">Invite Code Verified</AlertTitle>
              <AlertDescription className="text-blue-700">
                Role: <span className="font-semibold capitalize">{validatedRole}</span>
              </AlertDescription>
            </Alert>
            
            <form onSubmit={handleRegistrationSubmit}>
              <CardContent className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input 
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <AtSignIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input 
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input 
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-9"
                      required
                      minLength={8}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters long</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
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
              </CardContent>
              
              <CardFooter className="flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Register"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setStep('invite')}
                  disabled={isLoading}
                >
                  Back to Invite Code
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminInvite;
