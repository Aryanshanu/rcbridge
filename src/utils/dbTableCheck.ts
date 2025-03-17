
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// This function provides a simpler way to check if data exists in a table
// without using information_schema queries which are causing errors
export const checkTableExists = async (tableName: string): Promise<boolean> => {
  try {
    // Instead of checking if table exists (which requires admin privileges),
    // we'll check if we can query the table without errors
    const { count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
    
    // If there's no error, the table exists
    return !error;
  } catch (error) {
    console.error(`Error checking table ${tableName}:`, error);
    return false;
  }
};

// Custom hook to provide table existence checking with toast functionality
export const useTableCheck = () => {
  const { toast } = useToast();
  
  const checkTable = async (tableName: string, errorMessage?: string): Promise<boolean> => {
    const exists = await checkTableExists(tableName);
    
    if (!exists && errorMessage) {
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
