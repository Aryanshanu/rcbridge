import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AdminDataRequest {
  sessionToken: string;
  dataType: 'analytics' | 'contacts' | 'assistance' | 'properties' | 'chats';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { sessionToken, dataType }: AdminDataRequest = await req.json();

    if (!sessionToken) {
      return new Response(
        JSON.stringify({ error: 'Session token required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate session token
    const { data: validationData, error: validationError } = await supabase
      .rpc('validate_master_admin_session', { session_token: sessionToken });

    if (validationError || !validationData?.valid) {
      console.error('Session validation failed:', validationError);
      return new Response(
        JSON.stringify({ error: 'Invalid or expired session' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Admin data request: ${dataType} by ${validationData.username}`);

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
