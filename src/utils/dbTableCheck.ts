
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  | "user_rewards";

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
    "user_rewards"
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

    // Now that we've validated the table name, we can safely query it
    const { error } = await supabase
      .from(tableName)
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

// Custom hook to provide table existence checking with toast functionality
export const useTableCheck = () => {
  const { toast } = useToast();
  
  const checkTable = async (
    tableName: string, 
    errorMessage?: string, 
    options: TableCheckOptions = {}
  ): Promise<boolean> => {
    const exists = await checkTableExists(tableName, options);
    
    if (!exists && errorMessage && !options.silent) {
      toast({
        title: "Database Information",
        description: errorMessage || `The table '${tableName}' may not be accessible.`,
        variant: "default"
      });
    }
    
    return exists;
  };
  
  return { checkTable };
};
