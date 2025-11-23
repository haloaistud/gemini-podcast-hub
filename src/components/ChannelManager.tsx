import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Radio, Copy, Eye, Upload } from 'lucide-react';

const ChannelManager = () => {
  const [channel, setChannel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadChannel();
  }, []);

  const loadChannel = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('channels')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setChannel(data);
    } catch (error) {
      console.error('Error loading channel:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChannel = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreating(true);

    const formData = new FormData(e.currentTarget);
    const displayName = formData.get('displayName') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-channel`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ displayName, description, category })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create channel');
      }

      toast({
        title: 'Success!',
        description: 'Channel created successfully',
      });

      setChannel(result.data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setCreating(false);
    }
  };

  const copyStreamKey = () => {
    if (channel?.stream_key) {
      navigator.clipboard.writeText(channel.stream_key);
      toast({
        title: 'Copied!',
        description: 'Stream key copied to clipboard',
      });
    }
  };

  const toggleLive = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/update-stream-status`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            channelId: channel.id,
            isLive: !channel.is_live
          })
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      setChannel(result.data);
      toast({
        title: result.data.is_live ? 'You are now live!' : 'Stream ended',
        description: result.data.is_live ? 'Viewers can now watch your stream' : 'Your stream has ended',
      });
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
        <CardHeader>
          <CardTitle className="gradient-text">Create Your Channel</CardTitle>
          <CardDescription>Set up your broadcasting channel to start streaming</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateChannel} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Channel Name</Label>
              <Input
                id="displayName"
                name="displayName"
                placeholder="My Awesome Channel"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Tell viewers about your channel..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select name="category" defaultValue="other">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="gaming">Gaming</SelectItem>
                  <SelectItem value="music">Music</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="news">News</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full" disabled={creating}>
              {creating ? 'Creating...' : 'Create Channel'}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radio className="w-6 h-6" />
            {channel.display_name}
          </CardTitle>
          <CardDescription>Channel: {channel.channel_name}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 glass rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium flex items-center gap-2">
                {channel.is_live ? (
                  <>
                    <span className="w-2 h-2 bg-live rounded-full animate-glow"></span>
                    LIVE
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 bg-muted rounded-full"></span>
                    Offline
                  </>
                )}
              </p>
            </div>
            <Button onClick={toggleLive} variant={channel.is_live ? 'destructive' : 'default'}>
              {channel.is_live ? 'End Stream' : 'Go Live'}
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Stream Key</Label>
            <div className="flex gap-2">
              <Input
                type="password"
                value={channel.stream_key}
                readOnly
                className="font-mono"
              />
              <Button onClick={copyStreamKey} variant="outline" size="icon">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Keep this key private! Use it in your streaming software (OBS, etc.)
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 glass rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-primary" />
                <p className="text-sm text-muted-foreground">Current Viewers</p>
              </div>
              <p className="text-2xl font-bold">{channel.current_viewers || 0}</p>
            </div>

            <div className="p-4 glass rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Upload className="w-4 h-4 text-accent" />
                <p className="text-sm text-muted-foreground">Subscribers</p>
              </div>
              <p className="text-2xl font-bold">{channel.subscriber_count || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Streaming Setup</CardTitle>
          <CardDescription>Configure your streaming software</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Server URL (RTMP)</Label>
            <Input
              value="rtmp://your-server.com/live"
              readOnly
              className="font-mono text-sm"
            />
          </div>

          <div>
            <Label>Stream Key</Label>
            <Input
              type="password"
              value={channel.stream_key}
              readOnly
              className="font-mono text-sm"
            />
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Quick Setup Guide:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Open your streaming software (OBS Studio recommended)</li>
              <li>Go to Settings → Stream</li>
              <li>Copy the Server URL and Stream Key above</li>
              <li>Paste them into your streaming software</li>
              <li>Click "Go Live" button above to start broadcasting</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChannelManager;