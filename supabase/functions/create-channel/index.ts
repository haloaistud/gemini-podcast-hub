import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has broadcaster or admin role
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .in('role', ['broadcaster', 'admin'])
      .single();

    if (!roleData) {
      return new Response(
        JSON.stringify({ error: 'Only broadcasters can create channels' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { displayName, description, category } = await req.json();

    if (!displayName) {
      return new Response(
        JSON.stringify({ error: 'Display name is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user already has a channel
    const { data: existingChannel } = await supabase
      .from('channels')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (existingChannel) {
      return new Response(
        JSON.stringify({ error: 'User already has a channel' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate channel name from display name
    let channelName = displayName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    // Check if channel name is unique
    const { data: nameCheck } = await supabase
      .from('channels')
      .select('id')
      .eq('channel_name', channelName)
      .single();

    if (nameCheck) {
      channelName = `${channelName}-${Date.now()}`;
    }

    // Generate stream key
    const streamKey = 'SS-' + crypto.randomUUID().replace(/-/g, '').toUpperCase().substring(0, 16);

    // Create channel
    const { data: channel, error: createError } = await supabase
      .from('channels')
      .insert({
        user_id: user.id,
        channel_name: channelName,
        display_name: displayName,
        description: description || null,
        category: category || 'other',
        stream_key: streamKey
      })
      .select()
      .single();

    if (createError) {
      throw createError;
    }

    return new Response(
      JSON.stringify({ success: true, data: channel }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'An error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});