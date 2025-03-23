import { supabase } from "@/integrations/supabase/client";
import { UserRole, UserProfile } from "@/types/user";
import { toast } from "sonner";

// List of admin email addresses that always have full access
const ADMIN_EMAILS = [
  "ganeshgoud0023@gmail.com",
  "surakantichandrashekhar@gmail.com"
];

// Get the current user's role
export async function getUserRole(): Promise<UserRole | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null; // Return null instead of throwing error for better handling
    }
    
    // Check if user email is in the admin list
    if (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) {
      return "admin"; // Override role for specified emails
    }
    
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    
    if (error || !data) {
      console.error("Error fetching user role:", error);
      return "maintainer"; // Default fallback role
    }
    
    return data.role as UserRole;
  } catch (error) {
    console.error("Error in getUserRole:", error);
    return null; // Return null on error for better error handling
  }
}

// Update a user's role
export async function updateUserRole(userId: string, newRole: UserRole): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('update_user_role', {
      user_id: userId,
      new_role: newRole
    });
    
    if (error) {
      throw error;
    }
    
    toast.success(`User role updated to ${newRole}`);
    return true;
  } catch (error: any) {
    console.error("Error updating user role:", error);
    toast.error(`Failed to update role: ${error.message}`);
    return false;
  }
}

// Fetch all users - only for admin
export async function getAllUsers(): Promise<UserProfile[]> {
  try {
    // We need to fetch from the profiles table, not the auth.users table (which we can't access)
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Create user profiles with placeholder emails since we can't directly access the auth.users emails
    const usersWithEmail = (data || []).map((profile) => {
      // Generate a placeholder email based on the user ID
      // For the two special admin users, display their known emails if IDs match
      let email = `user-${profile.id.substring(0, 8)}@example.com`;
      
      // Special handling for admin emails
      if (profile.role === "admin") {
        // This is just a simplified way to show admin emails in the UI
        if (ADMIN_EMAILS.includes(email)) {
          email = profile.email || email;
        }
      }
      
      return {
        ...profile,
        email
      } as UserProfile;
    });
    
    return usersWithEmail;
  } catch (error: any) {
    console.error("Error fetching users:", error);
    toast.error(`Failed to fetch users: ${error.message}`);
    return [];
  }
}

// Format date for display
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Trigger Apify scraper (placeholder function)
export async function triggerApifyScraper(scraperType: string): Promise<boolean> {
  try {
    // This would call an edge function that triggers Apify
    toast.success(`Scraper triggered: ${scraperType}`);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return true;
  } catch (error: any) {
    console.error("Error triggering scraper:", error);
    toast.error(`Failed to trigger scraper: ${error.message}`);
    return false;
  }
}
