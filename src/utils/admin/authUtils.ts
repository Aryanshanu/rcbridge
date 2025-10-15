
import { supabase } from "@/integrations/supabase/client";
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
    
    // First create the user
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
    
    // Validate invite code with user ID
    const validation = await validateInviteCode(inviteCode, authData.user.id);
    console.log("Invite code validation result:", validation);
    
    if (!validation.valid) {
      // Delete the user if invite code is invalid
      await supabase.auth.admin.deleteUser(authData.user.id);
      return {
        success: false,
        message: validation.message
      };
    }

    // Update the user's profile with their name
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
      })
      .eq('id', authData.user.id);

    if (profileError) {
      console.error('Error updating profile:', profileError);
    }

    // SECURITY FIX: Use separate user_roles table instead of profiles
    // Insert role into user_roles table for secure role management
    const { error: updateError } = await supabase
      .from('user_roles')
      .insert({
        user_id: authData.user.id,
        role: validation.role,
        granted_at: new Date().toISOString()
      });

    if (updateError) {
      console.error("Error updating user role:", updateError);
      return {
        success: false,
        message: "Account created but role assignment failed."
      };
    }

    // Invite code is already marked as used by the database function
    console.log("User registered successfully with role:", validation.role);

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
