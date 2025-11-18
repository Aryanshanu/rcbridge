import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Logger } from '../_shared/logger.ts';
import { extractTraceContext } from '../_shared/tracer.ts';
import { runK2Mitigation } from '../_shared/k2Mitigation.ts';

const logger = new Logger('verify-admin');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const { traceId, spanId } = extractTraceContext(req);
  const startTime = Date.now();

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ authorized: false, error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ authorized: false, error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has admin, developer, or maintainer role
    const { data: roles, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    if (roleError) {
      return new Response(
        JSON.stringify({ authorized: false, error: 'Error checking roles' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let effectiveRoles = roles || [];

    // Allowlist check: if user has no role, check if email is in ADMIN_ALLOWLIST_EMAILS
    if (!effectiveRoles.length) {
      const allowlistEnv = Deno.env.get('ADMIN_ALLOWLIST_EMAILS');
      const allowedEmails = allowlistEnv 
        ? allowlistEnv.split(',').map(e => e.trim().toLowerCase())
        : [];

      const userEmail = user.email?.toLowerCase();

      if (userEmail && allowedEmails.includes(userEmail)) {
        console.log(`User ${userEmail} is in allowlist. Auto-assigning admin role.`);
        const { error: insertErr } = await supabase
          .from('user_roles')
          .insert({ user_id: user.id, role: 'admin', granted_by: user.id });
        
        if (!insertErr) {
          effectiveRoles = [{ role: 'admin' } as any];
        } else {
          console.error('Failed to auto-assign admin role:', insertErr);
        }
      }
    }

    const hasAdminRole = effectiveRoles?.some(r => 
      ['admin', 'developer', 'maintainer'].includes((r as any).role)
    );

    if (!hasAdminRole) {
      await logger.warn('admin_access_denied', traceId, {
        user_id: user.id,
        user_email: user.email,
        roles_found: effectiveRoles.map((r: any) => r.role)
      });

      // Run LLM analysis for access denial
      const mitigation = await runK2Mitigation({
        action: 'admin_access_denied',
        errorMessage: 'User lacks admin role',
        errorType: 'AuthorizationError',
        payload: { user_id: user.id, user_email: user.email },
        metadata: { roles_found: effectiveRoles, allowlist_checked: true }
      }, supabaseUrl, supabaseKey);

      await logger.log({
        action: 'admin_access_analysis',
        traceId,
        spanId,
        severity: 'WARN',
        userId: user.id,
        userEmail: user.email,
        metadata: { llm_reasoning: mitigation }
      });

      return new Response(
        JSON.stringify({ authorized: false, error: 'Insufficient permissions' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // User is authorized
    const userRole = (effectiveRoles as any).find((r: any) => r.role === 'admin')?.role || 
                     (effectiveRoles as any).find((r: any) => r.role === 'developer')?.role ||
                     (effectiveRoles as any).find((r: any) => r.role === 'maintainer')?.role;

    await logger.info('admin_access_granted', traceId, {
      user_id: user.id,
      user_email: user.email,
      role: userRole,
      duration_ms: Date.now() - startTime
    });

    return new Response(
      JSON.stringify({ authorized: true, role: userRole }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Verification error:', error);
    await logger.critical('verify_admin_failed', traceId, error as Error, {
      duration_ms: Date.now() - startTime
    });
    return new Response(
      JSON.stringify({ authorized: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
