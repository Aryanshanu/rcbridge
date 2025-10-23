
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types/user";

// Function to get user's role from the secure user_roles table
// Handles users with multiple roles by returning the highest privilege
export const getUserRole = async (): Promise<UserRole | null> => {
  try {
    // Get the current session to get the user ID
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData?.session?.user) {
      console.log("No active session found");
      return null;
    }
    
    const userId = sessionData.session.user.id;
    
    // SECURITY: Call verify-admin edge function to check authorization
    // This triggers allowlist auto-assignment and validates role server-side
    console.log("🔐 Verifying admin status via edge function...");
    const { data: verifyData, error: verifyError } = await supabase.functions.invoke('verify-admin', {
      headers: {
        Authorization: `Bearer ${sessionData.session.access_token}`
      }
    });
    
    if (verifyError) {
      console.error("Error verifying admin status:", verifyError);
      return null;
    }
    
    if (!verifyData?.authorized) {
      console.log("User not authorized:", verifyData?.error);
      return null;
    }
    
    console.log("✅ Admin status verified:", verifyData.role);
    
    // Return the role from verify-admin response
    return verifyData.role as UserRole;
    
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
