
import { supabase } from "@/integrations/supabase/client";
import { UserRole, UserProfile } from "@/types/user";
import { toast } from "sonner";

// List of admin email addresses that always have full access
const ADMIN_EMAILS = [
  "ganeshgoud0023@gmail.com",
  "surakantichandrashekhar@gmail.com"
];

// Static invite codes (in real app, these would be generated and stored in the database)
const INVITE_CODES = {
  "ADMIN-123456": { role: "admin", expiresAt: new Date("2025-12-31") },
  "DEV-789012": { role: "developer", expiresAt: new Date("2025-12-31") },
  "MAINT-345678": { role: "maintainer", expiresAt: new Date("2025-12-31") }
};

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
    
    // Create user profiles with email field
    const usersWithEmail = (data || []).map((profile) => {
      // Generate an email placeholder using the username or a part of the ID
      const emailPlaceholder = profile.username 
        ? `${profile.username}@example.com` 
        : `user-${profile.id.substring(0, 8)}@example.com`;
      
      // Special handling for admin emails
      let displayEmail = emailPlaceholder;
      if (profile.role === "admin" && ADMIN_EMAILS.length > 0) {
        // If this is likely one of our admin users, show a real admin email
        // This is just a UI convenience, not a security feature
        displayEmail = ADMIN_EMAILS[0]; // Show the first admin email as placeholder
      }
      
      return {
        ...profile,
        email: displayEmail
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

// Validate invite code
export function validateInviteCode(code: string): { 
  valid: boolean, 
  role?: UserRole, 
  message?: string 
} {
  // Check if the code exists
  if (!INVITE_CODES[code]) {
    return { valid: false, message: "Invalid invite code" };
  }
  
  // Check if the code has expired
  const inviteData = INVITE_CODES[code];
  if (new Date() > inviteData.expiresAt) {
    return { valid: false, message: "Invite code has expired" };
  }
  
  // Code is valid
  return {
    valid: true,
    role: inviteData.role
  };
}

// Register with invite code
export async function registerWithInviteCode(
  email: string, 
  password: string, 
  inviteCode: string, 
  fullName: string
): Promise<{ success: boolean, message: string }> {
  try {
    // Validate the invite code first
    const validation = validateInviteCode(inviteCode);
    if (!validation.valid) {
      return { 
        success: false, 
        message: validation.message || "Invalid invite code" 
      };
    }
    
    // Register the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: validation.role,
          invite_used: inviteCode
        }
      }
    });
    
    if (authError) {
      console.error("Error registering user:", authError);
      return { 
        success: false, 
        message: authError.message 
      };
    }
    
    // Update the user's role directly in profiles table
    if (authData.user) {
      const { error: roleError } = await supabase
        .from("profiles")
        .update({ 
          role: validation.role,
          invite_used: inviteCode 
        })
        .eq("id", authData.user.id);
      
      if (roleError) {
        console.error("Error updating user role:", roleError);
      }
    }
    
    return { 
      success: true, 
      message: "Successfully registered with invite code" 
    };
  } catch (error: any) {
    console.error("Error in registerWithInviteCode:", error);
    return { 
      success: false, 
      message: error.message || "Failed to register with invite code" 
    };
  }
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
