import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

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
      return new Response(
        JSON.stringify({ authorized: false, error: 'Insufficient permissions' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // User is authorized
    const userRole = (effectiveRoles as any).find((r: any) => r.role === 'admin')?.role || 
                     (effectiveRoles as any).find((r: any) => r.role === 'developer')?.role ||
                     (effectiveRoles as any).find((r: any) => r.role === 'maintainer')?.role;

    return new Response(
      JSON.stringify({ authorized: true, role: userRole }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Verification error:', error);
    return new Response(
      JSON.stringify({ authorized: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
