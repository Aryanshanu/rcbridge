
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types/user";

// Function to get user's role from profile
export const getUserRole = async (): Promise<UserRole | null> => {
  try {
    // Get the current session to get the user ID
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData?.session?.user) {
      console.log("No active session found");
      return null;
    }
    
    const userId = sessionData.session.user.id;
    
    // Check if role is cached in sessionStorage
    const cachedRole = sessionStorage.getItem('userRole');
    if (cachedRole) {
      console.log("Using cached role:", cachedRole);
      return cachedRole as UserRole;
    }
    
    // If no cached role, fetch from profile
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error("Error fetching user role:", error);
      return null;
    }
    
    if (!data) {
      console.log("No profile found for user");
      return null;
    }
    
    // Cache the role for subsequent checks
    sessionStorage.setItem('userRole', data.role);
    
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
