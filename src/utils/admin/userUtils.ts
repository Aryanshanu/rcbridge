
import { supabase } from "@/integrations/supabase/client";
import { UserRole, UserProfile } from "@/types/user";
import { format } from "date-fns";

// Format date for display
export const formatDate = (dateString: string) => {
  if (!dateString) return "Unknown";
  try {
    return format(new Date(dateString), 'MMM d, yyyy');
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

// Get all users from the profiles table
export const getAllUsers = async (): Promise<UserProfile[]> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    return [];
  }
};

// Update a user's role in the profiles table
export const updateUserRole = async (userId: string, newRole: UserRole): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", userId);
    
    if (error) {
      console.error("Error updating user role:", error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error in updateUserRole:", error);
    return false;
  }
};
