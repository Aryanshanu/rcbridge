/**
 * Observability Dashboard
 * Real-time monitoring of system health, errors, and LLM self-healing
 */

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertTriangle, CheckCircle, Zap, Shield, TrendingUp } from "lucide-react";
import * as queries from "@/utils/monitoring/queries";

export function ObservabilityDashboard() {
  const [metrics, setMetrics] = useState({
    errorRate: 0,
    importSuccessRate: 0,
    llmCorrections: 0,
    duplicateRate: 0,
    adminDenials: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [errorRate, importSuccess, llmCorrections, duplicateDetection, adminDenials] = await Promise.all([
          queries.getErrorRate(24),
          queries.getImportSuccessRate(24),
          queries.getLLMCorrectionCount(24),
          queries.getDuplicateDetectionRate(24),
          queries.getAdminAccessDenials(24),
        ]);

        setMetrics({
          errorRate: errorRate.errorRate,
          importSuccessRate: importSuccess.successRate,
          llmCorrections,
          duplicateRate: duplicateDetection.duplicateRate,
          adminDenials,
        });
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading observability metrics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight mb-2">System Observability</h2>
        <p className="text-muted-foreground">Real-time monitoring with LLM-assisted self-healing</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate (24h)</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.errorRate.toFixed(1)}%</div>
            <Badge variant={metrics.errorRate < 5 ? "default" : "destructive"} className="mt-2">
              {metrics.errorRate < 5 ? "Healthy" : "Alert"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Import Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.importSuccessRate.toFixed(1)}%</div>
            <Badge variant={metrics.importSuccessRate > 90 ? "default" : "secondary"} className="mt-2">
              {metrics.importSuccessRate > 90 ? "Excellent" : "Needs Review"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">LLM Auto-Fixes (24h)</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.llmCorrections}</div>
            <p className="text-xs text-muted-foreground mt-2">Self-healing actions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duplicate Detection Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.duplicateRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-2">Properties flagged as duplicates</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Access Denials (24h)</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.adminDenials}</div>
            <Badge variant={metrics.adminDenials === 0 ? "default" : "destructive"} className="mt-2">
              {metrics.adminDenials === 0 ? "No Issues" : "Investigate"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.errorRate < 5 && metrics.importSuccessRate > 90 ? "✓" : "⚠"}
            </div>
            <Badge 
              variant={metrics.errorRate < 5 && metrics.importSuccessRate > 90 ? "default" : "secondary"}
              className="mt-2"
            >
              {metrics.errorRate < 5 && metrics.importSuccessRate > 90 ? "All Systems Operational" : "Monitoring"}
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
