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
  // First, check if the user is authenticated without waiting for too long
  const VERIFICATION_TIMEOUT = 5000; // 5 seconds timeout, reduced from 8 seconds
  
  try {
    console.log("Getting user role - starting auth check");
    
    // Create a timeout promise
    const timeoutPromise = new Promise<null>((_, reject) => 
      setTimeout(() => reject(new Error("Authentication verification timed out")), VERIFICATION_TIMEOUT)
    );
    
    // Get the user with timeout
    const userPromise = supabase.auth.getUser();
    const raceResult = await Promise.race([
      userPromise,
      timeoutPromise
    ]);
    
    // If we hit the timeout, raceResult will be from the rejected timeoutPromise
    // Otherwise, it will be the result from userPromise
    const { data: { user }, error: userError } = raceResult as Awaited<typeof userPromise>;
    
    if (userError) {
      console.error("Authentication error:", userError);
      throw userError;
    }
    
    if (!user) {
      console.log("No authenticated user found");
      return null;
    }
    
    console.log("User found, getting profile...");
    
    // Then, get the user's profile with role information with a timeout
    const profilePromise = supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle(); // Using maybeSingle instead of single to prevent errors if no profile is found
    
    const profileRaceResult = await Promise.race([
      profilePromise,
      new Promise<null>((_, reject) => 
        setTimeout(() => reject(new Error("Profile fetch timed out")), VERIFICATION_TIMEOUT)
      )
    ]);
    
    const { data, error } = profileRaceResult as Awaited<typeof profilePromise>;
    
    if (error) {
      console.error("Error fetching user role:", error);
      // If it's a 404/not found error, log it separately
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
  } catch (error: any) {
    // Improved error logging with more context
    console.error("Error getting user role:", {
      message: error.message,
      name: error.name,
      code: error.code,
      stack: error.stack?.slice(0, 200) // Truncate stack for readability
    });
    
    // Re-throw the error to allow handling in the component
    throw error;
  }
};
