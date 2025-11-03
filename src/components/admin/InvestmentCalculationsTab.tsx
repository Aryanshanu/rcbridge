import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Calculator } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface InvestmentCalculation {
  id: string;
  user_id: string | null;
  property_price: number;
  rental_income: number;
  property_type: string;
  location: string;
  timeframe: string;
  appreciation_rate: number;
  calculation_result: any;
  created_at: string;
}

export const InvestmentCalculationsTab = () => {
  const [calculations, setCalculations] = useState<InvestmentCalculation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCalculations();

    // Subscribe to new calculations
    const channel = supabase
      .channel('admin_calculations')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'investment_calculations' }, () => {
        fetchCalculations();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchCalculations = async () => {
    try {
      const { data, error } = await supabase
        .from('investment_calculations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setCalculations(data || []);
    } catch (error) {
      console.error('Error fetching calculations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center mb-6">
        <Calculator className="h-6 w-6 mr-3 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Investment Calculations</h2>
          <p className="text-muted-foreground">All ROI calculations performed by users</p>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date/Time</TableHead>
            <TableHead>Property Price</TableHead>
            <TableHead>Rental Income</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Total ROI</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {calculations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No calculations yet
              </TableCell>
            </TableRow>
          ) : (
            calculations.map((calc) => {
              const result = calc.calculation_result;
              const totalReturn = result?.totalReturn || 0;
              const meetsThreshold = totalReturn >= 12;

              return (
                <TableRow key={calc.id}>
                  <TableCell>
                    {format(new Date(calc.created_at), "MMM d, yyyy h:mm a")}
                  </TableCell>
                  <TableCell>₹{calc.property_price.toLocaleString()}</TableCell>
                  <TableCell>₹{calc.rental_income.toLocaleString()}/mo</TableCell>
                  <TableCell className="capitalize">{calc.location}</TableCell>
                  <TableCell className="font-bold">{totalReturn.toFixed(2)}%</TableCell>
                  <TableCell>
                    <Badge variant={meetsThreshold ? "default" : "secondary"}>
                      {meetsThreshold ? "Meets 12% Threshold" : "Below Threshold"}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </Card>
  );
};
