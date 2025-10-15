import { UserRole } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";

interface InviteValidationResponse {
  valid: boolean;
  message: string;
  role?: string;
}

// Secure database-backed invite code validation
export const validateInviteCode = async (code: string, userId: string) => {
  try {
    const { data, error } = await supabase
      .rpc('validate_and_consume_invite_code', {
        _code: code,
        _user_id: userId
      });

    if (error) {
      console.error("Error validating invite code:", error);
      return {
        valid: false,
        message: "Failed to validate invite code",
        role: null
      };
    }

    // Type guard to ensure data is in the expected format
    if (typeof data === 'object' && data !== null && 'valid' in data && 'message' in data) {
      const response = data as unknown as InviteValidationResponse;
      return {
        valid: response.valid,
        message: response.message,
        role: response.role as UserRole | null
      };
    }

    return {
      valid: false,
      message: "Unexpected response format",
      role: null
    };
  } catch (error) {
    console.error("Error in validateInviteCode:", error);
    return {
      valid: false,
      message: "An error occurred",
      role: null
    };
  }
};

// No longer needed - handled by database
export const markInviteCodeAsUsed = async (code: string) => {
  // This function is deprecated - the database handles marking codes as used
  // automatically through validate_and_consume_invite_code function
  return true;
};
