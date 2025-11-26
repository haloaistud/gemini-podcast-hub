import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Play, Heart, Share2, Eye, Clock, Search } from 'lucide-react';

const ClipLibrary = () => {
  const [clips, setClips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadClips();
  }, []);

  const loadClips = async () => {
    try {
      const { data, error } = await supabase
        .from('clips')
        .select(`
          *,
          channel:channels(display_name, thumbnail_url),
          creator:profiles(display_name, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClips(data || []);
    } catch (error) {
      console.error('Error loading clips:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClips = clips.filter(clip =>
    clip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    clip.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading clips...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="glass-strong p-8 rounded-3xl border-2 border-white/20 text-center mesh-bg">
        <h1 className="text-4xl font-bold gradient-text-rainbow mb-3">
          Clip Library
        </h1>
        <p className="text-lg text-muted-foreground">
          Browse and discover the best moments from streams and podcasts
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search clips..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-14 text-lg glass-strong border-2 border-white/20 rounded-2xl"
        />
      </div>

      {/* Clips Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredClips.map((clip) => (
          <Card
            key={clip.id}
            className="glass-strong border-2 border-white/20 overflow-hidden hover-lift hover:glow-secondary transition-smooth group"
          >
            <div className="relative aspect-video overflow-hidden">
              {clip.channel?.thumbnail_url ? (
                <img
                  src={clip.channel.thumbnail_url}
                  alt={clip.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-dark flex items-center justify-center">
                  <Play className="w-16 h-16 text-white/30" />
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
              
              <Button
                size="icon"
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-gradient-primary opacity-0 group-hover:opacity-100 transition-smooth hover:glow-primary scale-90 group-hover:scale-100"
              >
                <Play className="w-6 h-6 ml-0.5" />
              </Button>

              <div className="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-black/70 backdrop-blur text-xs font-semibold">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDuration(clip.duration || 0)}
                </div>
              </div>
            </div>

            <CardContent className="p-4 space-y-3">
              <h3 className="font-bold text-white line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-primary transition-smooth">
                {clip.title}
              </h3>

              {clip.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {clip.description}
                </p>
              )}

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {clip.creator?.avatar_url && (
                  <img
                    src={clip.creator.avatar_url}
                    alt={clip.creator.display_name}
                    className="w-6 h-6 rounded-full"
                  />
                )}
                <span className="truncate">
                  {clip.channel?.display_name || 'Unknown Channel'}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{clip.views || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{clip.likes || 0}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 rounded-full hover:bg-gradient-accent hover:text-white"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClips.length === 0 && (
        <div className="text-center py-12">
          <Play className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">No clips found</p>
          <p className="text-sm text-muted-foreground mt-2">
            Clips will appear here as content is created
          </p>
        </div>
      )}
    </div>
  );
};

export default ClipLibrary;
