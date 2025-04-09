
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
  | "chat_messages"
  | "chat_conversations"
  | "chat_user_info"
  | "conversations"
  | "customer_inquiries";

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
    "chat_messages",
    "chat_conversations",
    "chat_user_info",
    "conversations",
    "customer_inquiries"
  ];
  
  return validTables.includes(tableName as ValidTableName);
};

interface TableCheckOptions {
  silent?: boolean;
  customErrorMessage?: string;
  retries?: number;
  retryDelay?: number;
}

// This function provides a simpler way to check if a table can be accessed
export const checkTableExists = async (
  tableName: string, 
  options: TableCheckOptions = {}
): Promise<boolean> => {
  const { retries = 2, retryDelay = 1000 } = options;
  let attempts = 0;
  
  while (attempts <= retries) {
    try {
      // First, validate if the tableName is valid
      if (!isValidTableName(tableName)) {
        if (!options.silent) {
          console.error(`Invalid table name: ${tableName}`);
        }
        return false;
      }

      // Use type assertion to make TypeScript understand this is a valid table name
      // after we've validated it with isValidTableName
      const { error } = await supabase
        .from(tableName as any)
        .select('*', { count: 'exact', head: true });
      
      // If there's no error, the table exists and is accessible
      if (!error) {
        return true;
      }
      
      if (!options.silent) {
        console.warn(`Attempt ${attempts + 1}/${retries + 1} - Error accessing table ${tableName}:`, error.message);
      }
      
      attempts++;
      
      // If we've reached max retries, return false
      if (attempts > retries) {
        if (!options.silent) {
          console.error(`All ${retries + 1} attempts to access table ${tableName} failed`);
        }
        return false;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    } catch (error) {
      if (!options.silent) {
        console.error(`Error checking table ${tableName}:`, error);
      }
      return false;
    }
  }
  
  return false;
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
