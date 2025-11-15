/**
 * Monitoring Queries
 * Fetch observability metrics from system logs
 */

import { supabase } from "@/integrations/supabase/client";

export async function getErrorRate(timeRangeHours: number = 24) {
  const since = new Date(Date.now() - timeRangeHours * 60 * 60 * 1000).toISOString();

  const { data } = await supabase
    .from('system_logs')
    .select('severity')
    .gte('created_at', since);

  const total = data?.length || 0;
  const errors = data?.filter(log => log.severity === 'ERROR' || log.severity === 'CRITICAL').length || 0;

  return { total, errors, errorRate: total > 0 ? (errors / total) * 100 : 0 };
}

export async function getImportSuccessRate(timeRangeHours: number = 24) {
  const since = new Date(Date.now() - timeRangeHours * 60 * 60 * 1000).toISOString();

  const { data } = await supabase
    .from('scraping_jobs')
    .select('status')
    .gte('created_at', since);

  const total = data?.length || 0;
  const completed = data?.filter(job => job.status === 'completed').length || 0;

  return { total, completed, successRate: total > 0 ? (completed / total) * 100 : 0 };
}

export async function getLLMCorrectionCount(timeRangeHours: number = 24) {
  const since = new Date(Date.now() - timeRangeHours * 60 * 60 * 1000).toISOString();

  const { count } = await supabase
    .from('system_logs')
    .select('id', { count: 'exact', head: true })
    .eq('auto_fixed', true)
    .gte('created_at', since);

  return count || 0;
}

export async function getDuplicateDetectionRate(timeRangeHours: number = 24) {
  const since = new Date(Date.now() - timeRangeHours * 60 * 60 * 1000).toISOString();

  const { data: totalJobs } = await supabase
    .from('scraping_jobs')
    .select('properties_found, duplicates_found')
    .gte('created_at', since);

  const totalProperties = totalJobs?.reduce((sum, job) => sum + (job.properties_found || 0), 0) || 0;
  const totalDuplicates = totalJobs?.reduce((sum, job) => sum + (job.duplicates_found || 0), 0) || 0;

  return {
    totalProperties,
    totalDuplicates,
    duplicateRate: totalProperties > 0 ? (totalDuplicates / totalProperties) * 100 : 0,
  };
}

export async function getAdminAccessDenials(timeRangeHours: number = 24) {
  const since = new Date(Date.now() - timeRangeHours * 60 * 60 * 1000).toISOString();

  const { count } = await supabase
    .from('system_logs')
    .select('id', { count: 'exact', head: true })
    .eq('action', 'admin_access_denied')
    .gte('created_at', since);

  return count || 0;
}
