
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/sections/Footer";
import { SEO } from "@/components/SEO";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Home, User, Lock, Bell, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { logActivity } from "@/utils/activityLogger";

const Profile = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    fullName: user?.user_metadata?.full_name || "",
    email: user?.email || "",
    phone: user?.user_metadata?.phone || "",
    address: user?.user_metadata?.address || ""
  });

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Log profile update activity
      await logActivity('profile_update', {
        updated_fields: ['fullName', 'phone', 'address'],
        timestamp: new Date().toISOString()
      }, {
        customer_id: user?.id,
        customer_email: user?.email,
        customer_name: personalInfo.fullName
      });

      toast({
        title: "Profile Updated",
        description: "Your personal information has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New passwords do not match. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO title="Profile | RC Bridge" description="Manage your RC Bridge profile" />
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <Home className="h-4 w-4 mr-1" />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Profile</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-2">Your Profile</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Manage your account settings and preferences
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-4 bg-gray-100 p-0 h-auto border-b border-gray-200">
              <TabsTrigger value="personal" className="flex items-center gap-2 py-4 rounded-none data-[state=active]:bg-white data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                <User className="h-4 w-4" /> Personal
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2 py-4 rounded-none data-[state=active]:bg-white data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                <Lock className="h-4 w-4" /> Security
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2 py-4 rounded-none data-[state=active]:bg-white data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                <Bell className="h-4 w-4" /> Notifications
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2 py-4 rounded-none data-[state=active]:bg-white data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                <Clock className="h-4 w-4" /> Activity
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="p-6">
              <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
              <form onSubmit={handlePersonalInfoSubmit} className="space-y-4 max-w-2xl">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={personalInfo.fullName}
                    onChange={handlePersonalInfoChange}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={personalInfo.email}
                    onChange={handlePersonalInfoChange}
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <Input
                    id="phone"
                    name="phone"
                    value={personalInfo.phone}
                    onChange={handlePersonalInfoChange}
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <Input
                    id="address"
                    name="address"
                    value={personalInfo.address}
                    onChange={handlePersonalInfoChange}
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="security" className="p-6">
              <h2 className="text-xl font-semibold mb-4">Change Password</h2>
              <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-2xl">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                  />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="notifications" className="p-6">
              <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-start space-x-3">
                  <input
                    id="email-notif"
                    type="checkbox"
                    className="h-4 w-4 mt-1 rounded border-gray-300 text-primary focus:ring-primary"
                    defaultChecked
                  />
                  <div>
                    <label htmlFor="email-notif" className="font-medium">Email Notifications</label>
                    <p className="text-sm text-gray-600">Receive updates about new properties, price changes, and inquiries.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <input
                    id="marketing-notif"
                    type="checkbox"
                    className="h-4 w-4 mt-1 rounded border-gray-300 text-primary focus:ring-primary"
                    defaultChecked
                  />
                  <div>
                    <label htmlFor="marketing-notif" className="font-medium">Marketing Emails</label>
                    <p className="text-sm text-gray-600">Receive promotional offers, news, and updates from RC Bridge.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <input
                    id="property-alerts"
                    type="checkbox"
                    className="h-4 w-4 mt-1 rounded border-gray-300 text-primary focus:ring-primary"
                    defaultChecked
                  />
                  <div>
                    <label htmlFor="property-alerts" className="font-medium">Property Alerts</label>
                    <p className="text-sm text-gray-600">Get notified when new properties match your saved searches.</p>
                  </div>
                </div>
                <Button>Save Preferences</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="activity" className="p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="p-4 border border-gray-200 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{item === 1 ? "Profile Updated" : item === 2 ? "Property Viewed" : item === 3 ? "Search Saved" : item === 4 ? "Login Activity" : "Inquiry Sent"}</h3>
                        <p className="text-sm text-gray-600">
                          {item === 1 
                            ? "You updated your profile information" 
                            : item === 2 
                              ? "You viewed 'Luxury Villa in Banjara Hills'" 
                              : item === 3 
                                ? "You saved a search for '3BHK in Gachibowli'" 
                                : item === 4 
                                  ? "New login from Chrome on Windows" 
                                  : "You sent an inquiry about 'Modern Office Space'"
                          }
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {item === 1 
                          ? "2 hours ago" 
                          : item === 2 
                            ? "Yesterday" 
                            : item === 3 
                              ? "3 days ago" 
                              : item === 4 
                                ? "1 week ago" 
                                : "2 weeks ago"
                        }
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
