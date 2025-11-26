import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple RSS parser implementation
async function parseRSS(xmlText: string) {
  const items: any[] = [];
  const channelMatch = xmlText.match(/<channel>([\s\S]*?)<\/channel>/);
  if (!channelMatch) throw new Error('Invalid RSS feed');

  const channelContent = channelMatch[1];
  const title = channelContent.match(/<title>(.*?)<\/title>/)?.[1] || 'Unknown Feed';
  const description = channelContent.match(/<description>(.*?)<\/description>/)?.[1] || '';

  const itemMatches = channelContent.matchAll(/<item>([\s\S]*?)<\/item>/g);
  
  for (const match of itemMatches) {
    const itemContent = match[1];
    const item: any = {
      title: itemContent.match(/<title>(.*?)<\/title>/)?.[1] || 'Untitled',
      description: itemContent.match(/<description>(.*?)<\/description>/)?.[1] || '',
      pubDate: itemContent.match(/<pubDate>(.*?)<\/pubDate>/)?.[1],
      enclosureUrl: itemContent.match(/<enclosure[^>]+url="([^"]+)"/)?.[1],
      duration: itemContent.match(/<itunes:duration>(.*?)<\/itunes:duration>/)?.[1],
    };
    
    if (item.enclosureUrl) {
      items.push(item);
    }
  }

  return { title, description, items };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { rssUrl, channelId } = await req.json();

    if (!rssUrl || !channelId) {
      return new Response(
        JSON.stringify({ error: 'RSS URL and channel ID are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user from token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify channel ownership
    const { data: channel, error: channelError } = await supabase
      .from('channels')
      .select('*')
      .eq('id', channelId)
      .eq('user_id', user.id)
      .single();

    if (channelError || !channel) {
      return new Response(
        JSON.stringify({ error: 'Channel not found or unauthorized' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse RSS feed
    const feedResponse = await fetch(rssUrl);
    if (!feedResponse.ok) {
      throw new Error('Failed to fetch RSS feed');
    }

    const feedXML = await feedResponse.text();
    const feed = await parseRSS(feedXML);
    const imported: any[] = [];
    const failed: any[] = [];

    for (const item of feed.items) {
      try {
        // Extract audio URL
        const audioUrl = item.enclosureUrl;
        if (!audioUrl) {
          failed.push({ title: item.title, reason: 'No audio URL found' });
          continue;
        }

        // Parse duration
        let duration = 0;
        if (item.duration) {
          const parts = item.duration.toString().split(':');
          if (parts.length === 3) {
            duration = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
          } else if (parts.length === 2) {
            duration = parseInt(parts[0]) * 60 + parseInt(parts[1]);
          } else {
            duration = parseInt(item.duration.toString());
          }
        }

        // Create podcast record
        const { data: podcast, error: insertError } = await supabase
          .from('podcasts')
          .insert({
            user_id: user.id,
            channel_id: channelId,
            title: item.title || 'Untitled Episode',
            description: item.description || '',
            audio_url: audioUrl,
            duration,
            published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
            is_published: true,
            tags: []
          })
          .select()
          .single();

        if (insertError) {
          failed.push({ title: item.title, reason: insertError.message });
        } else {
          imported.push(podcast);
        }
      } catch (error) {
        failed.push({ 
          title: item.title, 
          reason: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          imported: imported.length,
          failed: failed.length,
          podcasts: imported,
          failures: failed,
          feedInfo: {
            title: feed.title,
            description: feed.description,
            totalItems: feed.items.length
          }
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('RSS import error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to import RSS feed' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
