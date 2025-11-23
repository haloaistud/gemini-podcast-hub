import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LiveDirectory = () => {
  const [liveChannels, setLiveChannels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadLiveChannels();
    
    // Subscribe to channel updates
    const channel = supabase
      .channel('live-channels')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'channels',
          filter: 'is_live=eq.true'
        },
        () => {
          loadLiveChannels();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadLiveChannels = async () => {
    try {
      const { data } = await supabase
        .from('channels')
        .select(`
          *,
          profiles!channels_user_id_fkey(username, display_name, avatar_url)
        `)
        .eq('is_live', true)
        .order('current_viewers', { ascending: false });

      setLiveChannels(data || []);
    } catch (error) {
      console.error('Error loading live channels:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="aspect-video bg-muted" />
            <CardContent className="p-4">
              <div className="h-4 bg-muted rounded mb-2" />
              <div className="h-3 bg-muted rounded w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (liveChannels.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Live Channels</h3>
          <p className="text-muted-foreground">
            No one is streaming right now. Check back soon!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {liveChannels.map((channel) => (
        <Card 
          key={channel.id} 
          className="glass-hover cursor-pointer"
          onClick={() => navigate(`/channel/${channel.channel_name}`)}
        >
          <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <div className="absolute top-3 left-3">
              <Badge className="bg-live/90 text-white border-0">
                <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse" />
                LIVE
              </Badge>
            </div>
            <div className="absolute bottom-3 right-3 bg-background/80 px-2 py-1 rounded-md flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span className="text-xs font-medium">{channel.current_viewers || 0}</span>
            </div>
            <Users className="w-16 h-16 text-muted-foreground" />
          </div>
          
          <CardContent className="p-4">
            <h3 className="font-semibold mb-1 line-clamp-1">{channel.display_name}</h3>
            <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
              {channel.profiles?.display_name || channel.profiles?.username}
            </p>
            {channel.category && (
              <Badge variant="outline" className="text-xs">
                {channel.category}
              </Badge>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LiveDirectory;