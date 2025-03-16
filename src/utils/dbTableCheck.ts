
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// This function checks if a table exists in the Supabase database
export const checkTableExists = async (tableName: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', tableName)
      .single();
    
    if (error) {
      console.error(`Error checking if table ${tableName} exists:`, error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
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
        title: "Database Error",
        description: errorMessage || `The required table '${tableName}' doesn't exist in the database.`,
        variant: "destructive"
      });
    }
    
    return exists;
  };
  
  return { checkTable };
};
