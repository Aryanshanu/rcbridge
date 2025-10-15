
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types/user";

// Function to get user's role from the secure user_roles table
export const getUserRole = async (): Promise<UserRole | null> => {
  try {
    // Get the current session to get the user ID
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData?.session?.user) {
      console.log("No active session found");
      return null;
    }
    
    const userId = sessionData.session.user.id;
    
    // SECURITY FIX: Always fetch from database - no client-side caching
    // This prevents privilege escalation attacks via browser storage manipulation
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error("Error fetching user role:", error);
      return null;
    }
    
    if (!data) {
      console.log("No role found for user");
      return null;
    }
    
    return data.role as UserRole;
  } catch (error) {
    console.error("Error in getUserRole:", error);
    return null;
  }
};

// Function to check if current user has admin permissions
export const isAdminUser = async (): Promise<boolean> => {
  const role = await getUserRole();
  return role === "admin" || role === "developer" || role === "maintainer";
};
