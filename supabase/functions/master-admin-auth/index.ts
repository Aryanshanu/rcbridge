import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LoginRequest {
  username: string;
  password: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { username, password }: LoginRequest = await req.json();

    if (!username || !password) {
      return new Response(
        JSON.stringify({ error: 'Username and password required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Master admin login attempt for: ${username}`);

    // Get admin record
    const { data: adminData, error: fetchError } = await supabase
      .from('master_admin')
      .select('*')
      .eq('username', username)
      .single();

    if (fetchError || !adminData) {
      console.error('Admin not found:', fetchError);
      
      // Log failed login attempt
      const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
      const userAgent = req.headers.get('user-agent') || 'unknown';
      
      await supabase
        .from('admin_login_history')
        .insert({
          username,
          ip_address: ipAddress,
          user_agent: userAgent,
          login_status: 'failed',
          failure_reason: 'Admin not found',
        });
      
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify password using bcryptjs (sync) with robust import handling
    const bcryptMod = await import('https://esm.sh/bcryptjs@2.4.3');
    const bcrypt = (bcryptMod as any).default ?? (bcryptMod as any);
    const isValidPassword = bcrypt.compareSync(password, adminData.password_hash);


    if (!isValidPassword) {
      console.error('Invalid password');
      
      // Log failed login attempt
      const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
      const userAgent = req.headers.get('user-agent') || 'unknown';
      
      await supabase
        .from('admin_login_history')
        .insert({
          admin_id: adminData.id,
          username,
          ip_address: ipAddress,
          user_agent: userAgent,
          login_status: 'failed',
          failure_reason: 'Invalid password',
        });
      
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate session token
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour session

    // Update admin record with session token
    const { error: updateError } = await supabase
      .from('master_admin')
      .update({
        session_token: sessionToken,
        token_expires_at: expiresAt.toISOString(),
        last_login: new Date().toISOString(),
      })
      .eq('id', adminData.id);

    if (updateError) {
      console.error('Failed to create session:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to create session' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Master admin login successful');

    // Log successful login to admin_login_history
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    
    await supabase
      .from('admin_login_history')
      .insert({
        admin_id: adminData.id,
        username: adminData.username,
        ip_address: ipAddress,
        user_agent: userAgent,
        login_status: 'success',
        session_token: sessionToken,
      });

    return new Response(
      JSON.stringify({
        success: true,
        sessionToken,
        expiresAt: expiresAt.toISOString(),
        username: adminData.username,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Master admin auth error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
