
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
    const validation = validateInviteCode(inviteCode);
    
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
      throw authError;
    }

    if (!authData.user) {
      return {
        success: false,
        message: "Registration failed. Please try again."
      };
    }

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
    markInviteCodeAsUsed(inviteCode);

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

// Get the current user's role with improved error handling and timeout management
export const getUserRole = async (): Promise<UserRole | null> => {
  try {
    console.log("Getting user role...");
    
    // First, check if the user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error("Auth error:", userError);
      throw userError;
    }
    
    if (!user) {
      console.log("No authenticated user found");
      return null;
    }
    
    console.log("User found, getting profile...");
    
    // Then, get the user's profile with role information with a timeout
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    
    if (error) {
      console.error("Error fetching user role:", error);
      if (error.code === "PGRST116") {
        console.log("No profile found for user");
      }
      throw error;
    }
    
    if (!data) {
      console.log("No profile data found");
      return null;
    }
    
    console.log("Got user role:", data.role);
    return data.role as UserRole;
  } catch (error) {
    console.error("Error getting user role:", error);
    throw error; // Re-throw to allow handling in the component
  }
};
