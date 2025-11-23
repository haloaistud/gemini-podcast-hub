import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import LiveChat from '@/components/LiveChat';
import { Users, Bell, BellOff, Eye } from 'lucide-react';

const ChannelView = () => {
  const { channelName } = useParams();
  const [channel, setChannel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadChannel();
    checkAuth();
  }, [channelName]);

  useEffect(() => {
    if (channel && user) {
      checkSubscription();
    }
  }, [channel, user]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const loadChannel = async () => {
    try {
      const { data } = await supabase
        .from('channels')
        .select(`
          *,
          profiles!channels_user_id_fkey(username, display_name, avatar_url)
        `)
        .eq('channel_name', channelName)
        .single();

      setChannel(data);
    } catch (error) {
      console.error('Error loading channel:', error);
      toast({
        title: 'Error',
        description: 'Channel not found',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const checkSubscription = async () => {
    if (!user || !channel) return;

    const { data } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', user.id)
      .eq('channel_id', channel.id)
      .single();

    setSubscribed(!!data);
  };

  const toggleSubscription = async () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to subscribe',
        variant: 'destructive'
      });
      return;
    }

    try {
      if (subscribed) {
        await supabase
          .from('subscriptions')
          .delete()
          .eq('user_id', user.id)
          .eq('channel_id', channel.id);

        await supabase
          .from('channels')
          .update({ subscriber_count: (channel.subscriber_count || 1) - 1 })
          .eq('id', channel.id);

        setSubscribed(false);
        toast({ title: 'Unsubscribed', description: 'You have unsubscribed from this channel' });
      } else {
        await supabase
          .from('subscriptions')
          .insert({
            user_id: user.id,
            channel_id: channel.id
          });

        await supabase
          .from('channels')
          .update({ subscriber_count: (channel.subscriber_count || 0) + 1 })
          .eq('id', channel.id);

        setSubscribed(true);
        toast({ title: 'Subscribed!', description: 'You are now subscribed to this channel' });
      }

      loadChannel(); // Reload to update counts
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading channel...</p>
        </div>
      </div>
    );
  }

  if (!channel) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-12 text-center">
          <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Channel Not Found</h3>
          <p className="text-muted-foreground">
            The channel you're looking for doesn't exist or has been removed.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container max-w-[1800px] mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Stream Player */}
          <Card>
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative">
              {channel.is_live ? (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-live text-white border-0">
                    <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse" />
                    LIVE
                  </Badge>
                </div>
              ) : (
                <div className="text-center">
                  <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-semibold">Channel Offline</p>
                  <p className="text-sm text-muted-foreground">This channel is not currently streaming</p>
                </div>
              )}
              
              {channel.is_live && (
                <div className="absolute bottom-4 right-4 bg-background/80 px-3 py-2 rounded-lg flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span className="font-medium">{channel.current_viewers || 0} watching</span>
                </div>
              )}
            </div>
          </Card>

          {/* Channel Info */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{channel.display_name}</h1>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span>{channel.profiles?.display_name || channel.profiles?.username}</span>
                    <span>•</span>
                    <span>{channel.subscriber_count || 0} subscribers</span>
                  </div>
                </div>

                <Button
                  onClick={toggleSubscription}
                  variant={subscribed ? 'outline' : 'default'}
                  className="flex items-center gap-2"
                >
                  {subscribed ? (
                    <>
                      <BellOff className="w-4 h-4" />
                      Unsubscribe
                    </>
                  ) : (
                    <>
                      <Bell className="w-4 h-4" />
                      Subscribe
                    </>
                  )}
                </Button>
              </div>

              {channel.description && (
                <div className="glass rounded-lg p-4">
                  <p className="text-sm">{channel.description}</p>
                </div>
              )}

              {channel.category && (
                <div className="mt-4">
                  <Badge variant="outline">{channel.category}</Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Chat Sidebar */}
        <div className="h-[600px] glass rounded-2xl overflow-hidden">
          <LiveChat channelId={channel.id} />
        </div>
      </div>
    </div>
  );
};

export default ChannelView;