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
    const { podcastId } = await req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get podcast details
    const { data: podcast, error: podcastError } = await supabase
      .from('podcasts')
      .select('*')
      .eq('id', podcastId)
      .single();

    if (podcastError || !podcast) {
      throw new Error('Podcast not found');
    }

    // Call Lovable AI for content analysis
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
            role: 'system',
            content: 'You are a podcast content analyst. Generate a summary, extract topics, and create an SEO description.'
          },
          {
            role: 'user',
            content: `Analyze this podcast:
Title: ${podcast.title}
Description: ${podcast.description || 'No description provided'}

Provide JSON with:
{
  "summary": "2-3 sentence overview",
  "topics": ["topic1", "topic2", "topic3"],
  "seoDescription": "150 char SEO description",
  "sentiment": "positive/neutral/negative"
}`
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const error = await aiResponse.text();
      console.error('AI Error:', error);
      throw new Error('AI processing failed');
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices[0].message.content;
    
    let aiResults;
    try {
      aiResults = JSON.parse(content);
    } catch {
      aiResults = { summary: content, topics: [], seoDescription: content.slice(0, 150), sentiment: 'neutral' };
    }

    // Update podcast with AI-generated data
    const { error: updateError } = await supabase
      .from('podcasts')
      .update({
        description: aiResults.summary || podcast.description,
        tags: aiResults.topics || [],
        is_published: true,
        published_at: new Date().toISOString(),
      })
      .eq('id', podcastId);

    if (updateError) {
      console.error('Update error:', updateError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          podcastId,
          aiResults,
          status: 'processed'
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Process podcast error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
