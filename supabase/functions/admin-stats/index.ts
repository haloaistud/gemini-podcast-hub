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

    // Check if user has admin role
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (!roleData) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Gather platform stats
    const [
      { count: totalUsers },
      { count: totalChannels },
      { count: liveChannels },
      { count: totalPodcasts },
      { count: totalClips }
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('channels').select('*', { count: 'exact', head: true }),
      supabase.from('channels').select('*', { count: 'exact', head: true }).eq('is_live', true),
      supabase.from('podcasts').select('*', { count: 'exact', head: true }),
      supabase.from('clips').select('*', { count: 'exact', head: true })
    ]);

    // Get active users (logged in last 24h)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count: activeUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('last_login_at', yesterday);

    // Get total views across all content
    const { data: viewsData } = await supabase
      .from('podcasts')
      .select('views');
    
    const totalViews = viewsData?.reduce((sum, p) => sum + (p.views || 0), 0) || 0;

    const stats = {
      totalUsers: totalUsers || 0,
      activeUsers: activeUsers || 0,
      totalChannels: totalChannels || 0,
      liveChannels: liveChannels || 0,
      totalPodcasts: totalPodcasts || 0,
      totalClips: totalClips || 0,
      totalViews
    };

    return new Response(
      JSON.stringify({ success: true, data: stats }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'An error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});