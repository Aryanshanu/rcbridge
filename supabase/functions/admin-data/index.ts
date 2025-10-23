import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AdminDataRequest {
  dataType: 'analytics' | 'contacts' | 'assistance' | 'properties' | 'chats' | 'customer_activity';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Authorization token required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract and validate JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error('JWT validation failed:', authError);
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check admin role using security definer function
    const { data: hasAdmin, error: roleError } = await supabase
      .rpc('has_role', { _user_id: user.id, _role: 'admin' });

    if (roleError || !hasAdmin) {
      console.error('❌ Admin access denied:', {
        userEmail: user.email,
        userId: user.id,
        roleError: roleError?.message,
        reason: 'No admin/developer/maintainer role found'
      });
      return new Response(
        JSON.stringify({ error: 'Insufficient privileges' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { dataType }: { dataType: AdminDataRequest['dataType'] } = await req.json();
    
    console.log('📊 Admin data request received:', {
      dataType,
      userEmail: user.email,
      userId: user.id,
      timestamp: new Date().toISOString()
    });

    console.log('✅ Admin access granted:', {
      userEmail: user.email,
      dataType
    });

    let responseData: any = {};

    switch (dataType) {
      case 'analytics': {
        const [users, conversations, properties, contacts, assistance] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('chat_conversations').select('id', { count: 'exact', head: true }),
          supabase.from('properties').select('id', { count: 'exact', head: true }),
          supabase.from('contact_messages').select('id', { count: 'exact', head: true }),
          supabase.from('assistance_requests').select('id', { count: 'exact', head: true }),
        ]);

        responseData = {
          totalUsers: users.count || 0,
          activeConversations: conversations.count || 0,
          totalProperties: properties.count || 0,
          contactMessages: contacts.count || 0,
          assistanceRequests: assistance.count || 0,
        };
        break;
      }

      case 'contacts': {
        const { data, error } = await supabase
          .from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        responseData = { messages: data };
        break;
      }

      case 'assistance': {
        const { data, error } = await supabase
          .from('assistance_requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        responseData = { requests: data };
        break;
      }

      case 'chats': {
        const { data: conversations, error } = await supabase
          .from('chat_conversations')
          .select(`
            id,
            created_at,
            updated_at,
            user_id,
            chat_messages (
              id,
              content,
              sender_type,
              created_at
            )
          `)
          .order('updated_at', { ascending: false });

        if (error) throw error;
        responseData = { conversations };
        break;
      }

      case 'properties': {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        responseData = { properties: data };
        break;
      }
      
      case 'customer_activity': {
        const { data, error } = await supabase
          .from('customer_activity_history')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);

        if (error) throw error;
        responseData = data;
        break;
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid data type' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    return new Response(
      JSON.stringify({ success: true, data: responseData }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Admin data fetch error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
