
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types/user";
import { validateInviteCode, markInviteCodeAsUsed } from "./inviteUtils";

// Function to register a new user with an invite code
export const registerWithInviteCode = async (
  email: string,
  password: string,
  inviteCode: string,
  fullName?: string
) => {
  try {
    console.log("Starting registration with invite code:", { email, inviteCode, hasFullName: !!fullName });
    
    const validation = validateInviteCode(inviteCode);
    console.log("Invite code validation result:", validation);
    
    if (!validation.valid) {
      return {
        success: false,
        message: validation.message
      };
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || "",
        }
      }
    });

    if (authError) {
      console.error("Auth signup error:", authError);
      throw authError;
    }

    if (!authData.user) {
      console.warn("No user returned from signUp");
      return {
        success: false,
        message: "Registration failed. Please try again."
      };
    }

    console.log("User created successfully:", authData.user.id);

    // Update the profile with role information
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ 
        role: validation.role,
        invite_used: inviteCode
      })
      .eq("id", authData.user.id);

    if (updateError) {
      console.error("Error updating user role:", updateError);
      return {
        success: false,
        message: "Account created but role assignment failed."
      };
    }

    // Mark the invite code as used
    const inviteMarked = markInviteCodeAsUsed(inviteCode);
    console.log("Invite code marked as used:", inviteMarked);

    return {
      success: true,
      message: "Registration successful",
      user: authData.user
    };
  } catch (error: any) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: error.message || "An error occurred during registration"
    };
  }
};

// Improved, more reliable getUserRole function
export const getUserRole = async (): Promise<UserRole | null> => {
  try {
    console.log("getUserRole: Starting role check");
    
    // Get current session with retry logic
    let session = null;
    let retries = 3;
    
    while (retries > 0 && !session) {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error getting session:", error);
        retries--;
        if (retries > 0) {
          console.log(`Retrying session check, ${retries} attempts left`);
          await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms before retry
        }
        continue;
      }
      
      session = data.session;
      break;
    }
    
    if (!session || !session.user) {
      console.log("getUserRole: No active session found after retries");
      return null;
    }
    
    const userId = session.user.id;
    console.log("getUserRole: Checking role for user ID:", userId);
    
    // Try to get the user role with retry logic
    let profile = null;
    retries = 3;
    
    while (retries > 0 && !profile) {
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .maybeSingle();
      
      if (error) {
        console.error("getUserRole: Error fetching user role:", error);
        retries--;
        if (retries > 0) {
          console.log(`Retrying profile fetch, ${retries} attempts left`);
          await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms before retry
        }
        continue;
      }
      
      profile = data;
      break;
    }
    
    if (!profile) {
      console.log("getUserRole: No profile found for user after retries");
      return null;
    }
    
    console.log("getUserRole: Retrieved user role:", profile.role);
    return profile.role as UserRole;
  } catch (error) {
    console.error("getUserRole: Error in function:", error);
    return null;
  }
};
