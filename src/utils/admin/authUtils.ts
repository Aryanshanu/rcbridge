
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

// Simplified getUserRole function with better error handling
export const getUserRole = async (): Promise<UserRole | null> => {
  try {
    // Get current session
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;
    
    // If no session, return null immediately
    if (!session || !session.user) {
      console.log("No active session found");
      return null;
    }
    
    // Get user profile with role
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching user role:", error);
      return null;
    }
    
    if (!data) {
      console.log("No profile found for user");
      return null;
    }
    
    console.log("Retrieved user role:", data.role);
    return data.role as UserRole;
  } catch (error) {
    console.error("Error in getUserRole:", error);
    return null;
  }
};
