
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Define a type that lists all valid table names in our database
export type ValidTableName = 
  | "assistance_requests" 
  | "community_posts" 
  | "contact_messages" 
  | "demo_requests" 
  | "investment_calculations" 
  | "profiles" 
  | "properties" 
  | "property_alerts" 
  | "property_images" 
  | "search_queries" 
  | "user_rewards"
  | "chat_conversations"
  | "chat_messages"
  | "chat_user_info"
  | "customer_inquiries"
  | "conversations";

// This function validates if the provided string is a valid table name
export const isValidTableName = (tableName: string): tableName is ValidTableName => {
  const validTables: ValidTableName[] = [
    "assistance_requests",
    "community_posts",
    "contact_messages",
    "demo_requests",
    "investment_calculations",
    "profiles",
    "properties",
    "property_alerts",
    "property_images",
    "search_queries",
    "user_rewards",
    "chat_conversations",
    "chat_messages",
    "chat_user_info",
    "customer_inquiries",
    "conversations"
  ];
  
  return validTables.includes(tableName as ValidTableName);
};

interface TableCheckOptions {
  silent?: boolean;
  customErrorMessage?: string;
}

// This function provides a simpler way to check if a table can be accessed
export const checkTableExists = async (
  tableName: string, 
  options: TableCheckOptions = {}
): Promise<boolean> => {
  try {
    // First, validate if the tableName is valid
    if (!isValidTableName(tableName)) {
      if (!options.silent) {
        console.error(`Invalid table name: ${tableName}`);
      }
      return false;
    }

    // Now that we've validated the table name, we need to safely type it for the Supabase client
    const { error } = await supabase
      .from(tableName as any)
      .select('*', { count: 'exact', head: true });
    
    // If there's no error, the table exists and is accessible
    if (error && !options.silent) {
      console.error(`Error accessing table ${tableName}:`, error.message);
    }
    
    return !error;
  } catch (error) {
    if (!options.silent) {
      console.error(`Error checking table ${tableName}:`, error);
    }
    return false;
  }
};

// Function to provide feedback for table existence
export const checkTableWithFeedback = async (
  tableName: string, 
  feedbackMessage?: string,
  options: TableCheckOptions = {}
): Promise<boolean> => {
  const exists = await checkTableExists(tableName, { ...options, silent: true });
  
  if (!exists && !options.silent) {
    const message = feedbackMessage || options.customErrorMessage || 
      `The table '${tableName}' may not be accessible.`;
    
    toast({
      title: "Database Information",
      description: message,
      variant: "default"
    });
    
    console.warn(message);
  }
  
  return exists;
};

// Custom hook for component-level table checking
export const useTableCheck = () => {
  const checkTable = async (
    tableName: string, 
    errorMessage?: string, 
    options: TableCheckOptions = {}
  ): Promise<boolean> => {
    return checkTableWithFeedback(tableName, errorMessage, options);
  };
  
  return { checkTable };
};
