import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

export function LoginHistoryTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Login History</CardTitle>
        <CardDescription>Admin login tracking has been migrated to standard authentication</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Info className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Login History Unavailable</h3>
          <p className="text-muted-foreground max-w-md">
            The master admin login history table has been removed as part of the migration to standard Supabase authentication. 
            Admin login activity is now tracked through the regular authentication system.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
