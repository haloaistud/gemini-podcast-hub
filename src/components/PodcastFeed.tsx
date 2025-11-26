import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Clock, TrendingUp, Search, Filter } from 'lucide-react';
import { PodcastPlayer } from './PodcastPlayer';

export const PodcastFeed = () => {
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedPodcast, setSelectedPodcast] = useState<any>(null);

  useEffect(() => {
    loadPodcasts();
  }, [categoryFilter]);

  const loadPodcasts = async () => {
    try {
      let query = supabase
        .from('podcasts')
        .select(`
          *,
          channel:channels(display_name, thumbnail_url, category),
          creator:profiles(display_name, avatar_url)
        `)
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (categoryFilter !== 'all') {
        query = query.eq('channel.category', categoryFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPodcasts(data || []);
    } catch (error) {
      console.error('Error loading podcasts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPodcasts = podcasts.filter(podcast =>
    podcast.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    podcast.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading podcasts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Fixed Player */}
      {selectedPodcast && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 glass-strong border-t-2 border-white/20">
          <div className="container mx-auto">
            <PodcastPlayer
              title={selectedPodcast.title}
              artist={selectedPodcast.creator?.display_name || 'Unknown Artist'}
              audioUrl={selectedPodcast.audio_url}
              thumbnailUrl={selectedPodcast.channel?.thumbnail_url}
            />
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search podcasts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 glass border-white/20"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[200px] glass border-white/20">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="technology">Technology</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="gaming">Gaming</SelectItem>
            <SelectItem value="music">Music</SelectItem>
            <SelectItem value="education">Education</SelectItem>
            <SelectItem value="entertainment">Entertainment</SelectItem>
            <SelectItem value="news">News</SelectItem>
            <SelectItem value="sports">Sports</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Podcast Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPodcasts.map((podcast) => (
          <Card 
            key={podcast.id}
            className="glass-strong border-2 border-white/20 overflow-hidden hover-lift hover:glow-primary transition-smooth cursor-pointer"
            onClick={() => setSelectedPodcast(podcast)}
          >
            {podcast.channel?.thumbnail_url && (
              <div className="relative h-48 overflow-hidden">
                <img
                  src={podcast.channel.thumbnail_url}
                  alt={podcast.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <Button
                  size="icon"
                  className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-gradient-primary hover:glow-primary"
                >
                  <Play className="w-5 h-5 ml-0.5" />
                </Button>
              </div>
            )}
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg line-clamp-2">{podcast.title}</CardTitle>
                {podcast.channel?.category && (
                  <Badge className="bg-gradient-accent text-white border-0 flex-shrink-0">
                    {podcast.channel.category}
                  </Badge>
                )}
              </div>
              <CardDescription className="line-clamp-2">
                {podcast.description || 'No description available'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatDuration(podcast.duration || 0)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>{podcast.views || 0} views</span>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                {podcast.creator?.avatar_url && (
                  <img
                    src={podcast.creator.avatar_url}
                    alt={podcast.creator.display_name}
                    className="w-6 h-6 rounded-full"
                  />
                )}
                <span className="text-sm text-muted-foreground">
                  {podcast.channel?.display_name || 'Unknown Channel'}
                </span>
              </div>
              {podcast.tags && podcast.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {podcast.tags.slice(0, 3).map((tag: string, idx: number) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPodcasts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No podcasts found</p>
        </div>
      )}
    </div>
  );
};
