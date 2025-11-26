import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, limit = 10 } = await req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user's listening history
    const { data: history } = await supabase
      .from('podcasts')
      .select('title, tags, channel_id')
      .eq('user_id', userId)
      .limit(5);

    const userTags = history?.flatMap(p => p.tags || []) || [];
    const uniqueTags = [...new Set(userTags)];

    // Use Lovable AI for personalized recommendations
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'user',
            content: `Based on these podcast interests: ${uniqueTags.join(', ')}
            
Suggest 5 related podcast topics or categories. Return as JSON array: ["topic1", "topic2", ...]`
          }
        ],
      }),
    });

    const aiData = await aiResponse.json();
    const recommendedTopics = JSON.parse(aiData.choices[0].message.content);

    // Find podcasts matching recommended topics
    const { data: recommendations } = await supabase
      .from('podcasts')
      .select('*, channel:channels(*), creator:profiles(*)')
      .is('is_published', true)
      .or(recommendedTopics.map((tag: string) => `tags.cs.{${tag}}`).join(','))
      .limit(limit);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          recommendations: recommendations || [],
          basedOn: uniqueTags,
          suggestedTopics: recommendedTopics
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Recommendations error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
