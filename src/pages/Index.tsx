import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import StreamPlayer from "@/components/StreamPlayer";
import ChatBox from "@/components/ChatBox";
import Dashboard from "@/components/Dashboard";
import AdminPanel from "@/components/AdminPanel";
import Auth from "@/components/Auth";
import ChannelManager from "@/components/ChannelManager";
import LiveDirectory from "@/components/LiveDirectory";
import LiveChat from "@/components/LiveChat";

const Index = () => {
  const [activeRole, setActiveRole] = useState<"listener" | "broadcaster" | "admin" | null>(null);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        loadUserRole(session.user.id);
      } else {
        setUser(null);
        setUserRole(null);
        setActiveRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      await loadUserRole(session.user.id);
    }
    setLoading(false);
  };

  const loadUserRole = async (userId: string) => {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();
    
    if (data) {
      setUserRole(data.role);
      // Auto-select role based on user's role
      if (data.role === 'admin') {
        setActiveRole('admin');
      } else if (data.role === 'broadcaster') {
        setActiveRole('broadcaster');
      } else {
        setActiveRole('listener');
      }
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserRole(null);
    setActiveRole(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth onSuccess={checkUser} />;
  }

  return (
    <div className="min-h-screen" lang="en">
      <div className="container max-w-[1800px] mx-auto px-4 py-6">
        <Header 
          activeRole={activeRole} 
          onRoleSelect={setActiveRole}
          userRole={userRole}
          onSignOut={handleSignOut}
        />

        {/* Content based on role */}
        {activeRole === "listener" && (
          <main className="animate-fadeIn" id="main-content">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Live Now</h2>
              <LiveDirectory />
            </div>
          </main>
        )}

        {activeRole === "broadcaster" && (
          <main className="animate-fadeIn" id="main-content">
            <ChannelManager />
          </main>
        )}

        {activeRole === "admin" && (
          <main className="animate-fadeIn" id="main-content">
            <AdminPanel />
          </main>
        )}

        {!activeRole && (
          <main className="text-center py-20 animate-fadeIn" id="main-content">
            <div className="glass rounded-3xl p-12 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Choose Your Role</h2>
              <p className="text-lg text-muted-foreground">
                Select a role above to access the platform features
              </p>
            </div>
          </main>
        )}
      </div>
    </div>
  );
};

export default Index;