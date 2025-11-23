import { useState, useEffect } from 'react';
import { BarChart3, Users, Radio, TrendingUp, Shield, Settings, AlertTriangle, CheckCircle, Activity, Database, Server, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AdminPanel = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    liveChannels: 0,
    totalStreams: 0,
    totalBandwidth: '0 TB',
    avgConcurrentViewers: 0,
    growth: { users: 0, streams: 0, revenue: 0 }
  });
  const [topChannels, setTopChannels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadAdminData();
  }, [timeRange]);

  const loadAdminData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Load stats from edge function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-stats`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        }
      );

      const result = await response.json();
      
      if (result.success && result.data) {
        setStats({
          totalUsers: result.data.totalUsers || 0,
          activeUsers: result.data.activeUsers || 0,
          liveChannels: result.data.liveChannels || 0,
          totalStreams: result.data.totalPodcasts || 0,
          totalBandwidth: '2.4 TB',
          avgConcurrentViewers: 0,
          growth: { users: 12.5, streams: 8.3, revenue: 15.7 }
        });
      }

      // Load top live channels
      const { data: channels } = await supabase
        .from('channels')
        .select(`
          *,
          profiles!channels_user_id_fkey(username, display_name)
        `)
        .eq('is_live', true)
        .order('current_viewers', { ascending: false })
        .limit(5);

      setTopChannels(channels || []);
      setLoading(false);
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load admin data',
        variant: 'destructive'
      });
    }
  };

  const recentActivity = [
    { id: 1, type: 'user', action: 'New user registration', user: 'john_doe123', time: '2 min ago', status: 'success' },
    { id: 2, type: 'stream', action: 'Live stream started', user: 'TechTalks', time: '5 min ago', status: 'info' },
    { id: 3, type: 'report', action: 'Content reported', user: 'Anonymous', time: '12 min ago', status: 'warning' },
    { id: 4, type: 'system', action: 'Database backup completed', user: 'System', time: '30 min ago', status: 'success' },
    { id: 5, type: 'stream', action: 'Stream ended', user: 'GamingHub', time: '45 min ago', status: 'info' }
  ];

  const systemHealth = [
    { name: 'API Server', status: 'healthy', uptime: '99.99%', latency: '45ms' },
    { name: 'Database', status: 'healthy', uptime: '99.98%', latency: '12ms' },
    { name: 'Stream Server', status: 'warning', uptime: '98.50%', latency: '180ms' },
    { name: 'CDN', status: 'healthy', uptime: '100%', latency: '8ms' }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'success': return 'text-success bg-success/20 border-success/50';
      case 'warning': return 'text-warning bg-warning/20 border-warning/50';
      case 'error': return 'text-destructive bg-destructive/20 border-destructive/50';
      case 'info': return 'text-primary bg-primary/20 border-primary/50';
      default: return 'text-muted-foreground bg-muted/20 border-muted/50';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">
            Admin Control Panel
          </h2>
          <p className="text-muted-foreground mt-1">Platform analytics and management</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-background border border-border text-foreground px-4 py-2 rounded-lg focus:outline-none focus:border-primary/50"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass rounded-2xl p-6 border border-primary/30 shadow-glow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-primary/20 p-3 rounded-xl">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">vs last period</p>
              <p className="text-sm font-bold text-success">+{stats.growth.users}%</p>
            </div>
          </div>
          <h3 className="text-sm text-muted-foreground mb-1">Total Users</h3>
          <p className="text-3xl font-bold">{stats.totalUsers.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-2">{stats.activeUsers.toLocaleString()} active today</p>
        </div>

        <div className="glass rounded-2xl p-6 border border-accent/30 shadow-glow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-accent/20 p-3 rounded-xl">
              <Radio className="w-6 h-6 text-accent" />
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">vs last period</p>
              <p className="text-sm font-bold text-success">+{stats.growth.streams}%</p>
            </div>
          </div>
          <h3 className="text-sm text-muted-foreground mb-1">Live Channels</h3>
          <p className="text-3xl font-bold">{stats.liveChannels}</p>
          <p className="text-xs text-muted-foreground mt-2">{stats.totalStreams.toLocaleString()} total streams</p>
        </div>

        <div className="glass rounded-2xl p-6 border border-live/30 shadow-glow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-live/20 p-3 rounded-xl">
              <Activity className="w-6 h-6 text-live" />
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">peak today</p>
              <p className="text-sm font-bold text-live">8.9K</p>
            </div>
          </div>
          <h3 className="text-sm text-muted-foreground mb-1">Concurrent Viewers</h3>
          <p className="text-3xl font-bold">{stats.avgConcurrentViewers.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-2">avg concurrent</p>
        </div>

        <div className="glass rounded-2xl p-6 border border-success/30 shadow-glow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-success/20 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">vs last period</p>
              <p className="text-sm font-bold text-success">+{stats.growth.revenue}%</p>
            </div>
          </div>
          <h3 className="text-sm text-muted-foreground mb-1">Bandwidth Used</h3>
          <p className="text-3xl font-bold">{stats.totalBandwidth}</p>
          <p className="text-xs text-muted-foreground mt-2">this period</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass rounded-2xl p-6 border border-border shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Recent Activity</h3>
              <button className="text-sm text-primary hover:text-primary/80 transition-colors">
                View All
              </button>
            </div>
            
            <div className="space-y-3">
              {recentActivity.map(activity => (
                <div key={activity.id} className="flex items-start gap-3 p-3 glass-hover rounded-lg border border-border">
                  <div className={`p-2 rounded-lg border ${getStatusColor(activity.status)}`}>
                    {activity.status === 'success' && <CheckCircle className="w-4 h-4" />}
                    {activity.status === 'warning' && <AlertTriangle className="w-4 h-4" />}
                    {activity.status === 'info' && <Activity className="w-4 h-4" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.user} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-6 border border-border shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Top Channels</h3>
              <button className="text-sm text-primary hover:text-primary/80 transition-colors">
                Manage All
              </button>
            </div>
            
            <div className="space-y-3">
              {topChannels.map((channel, idx) => (
                <div key={channel.id} className="flex items-center justify-between p-4 glass-hover rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold">#{idx + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-medium">{channel.display_name}</h4>
                      <p className="text-xs text-muted-foreground">{channel.profiles?.display_name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span className="text-sm font-medium">{channel.current_viewers}</span>
                    </div>
                    {channel.is_live && (
                      <div className="flex items-center gap-1 bg-live/20 px-2 py-1 rounded-full border border-live/50">
                        <div className="w-2 h-2 bg-live rounded-full animate-glow" />
                        <span className="text-xs text-live font-bold">LIVE</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {topChannels.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No live channels</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass rounded-2xl p-6 border border-border shadow-soft">
            <div className="flex items-center gap-3 mb-4">
              <Server className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold">System Health</h3>
            </div>
            
            <div className="space-y-3">
              {systemHealth.map((system, idx) => (
                <div key={idx} className="p-3 glass rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium">{system.name}</h4>
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${
                      system.status === 'healthy' 
                        ? 'bg-success/20 text-success border-success/50' 
                        : 'bg-warning/20 text-warning border-warning/50'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        system.status === 'healthy' ? 'bg-success' : 'bg-warning'
                      }`} />
                      {system.status}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Uptime</p>
                      <p className="font-medium">{system.uptime}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Latency</p>
                      <p className="font-medium">{system.latency}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-6 border border-border shadow-soft">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-accent" />
              <h3 className="text-xl font-bold">Quick Actions</h3>
            </div>
            
            <div className="space-y-2">
              <button className="w-full bg-primary/20 hover:bg-primary/30 text-primary px-4 py-3 rounded-lg font-medium transition-colors border border-primary/50 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Moderate Content
              </button>
              
              <button className="w-full bg-accent/20 hover:bg-accent/30 text-accent px-4 py-3 rounded-lg font-medium transition-colors border border-accent/50 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Manage Users
              </button>
              
              <button className="w-full bg-live/20 hover:bg-live/30 text-live px-4 py-3 rounded-lg font-medium transition-colors border border-live/50 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Export Analytics
              </button>
              
              <button className="w-full bg-muted hover:bg-muted/80 px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Platform Settings
              </button>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 border border-border shadow-soft">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-success" />
              <h3 className="text-xl font-bold">Database</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Storage Used</span>
                <span className="font-medium">842 GB</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="gradient-primary h-2 rounded-full" style={{width: '68%'}} />
              </div>
              
              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Total Records</p>
                  <p className="text-lg font-bold">2.4M</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Last Backup</p>
                  <p className="text-lg font-bold">30m ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;