import { useState } from "react";
import Header from "@/components/Header";
import StreamPlayer from "@/components/StreamPlayer";
import ChatBox from "@/components/ChatBox";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  const [activeRole, setActiveRole] = useState<"listener" | "broadcaster" | "admin" | null>(null);

  return (
    <div className="min-h-screen">
      <div className="container max-w-[1800px] mx-auto px-4 py-6">
        <Header activeRole={activeRole} onRoleSelect={setActiveRole} />

        {/* Content based on role */}
        {activeRole === "listener" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            <div className="lg:col-span-2">
              <StreamPlayer />
            </div>
            <div className="h-[600px]">
              <ChatBox />
            </div>
          </div>
        )}

        {activeRole === "broadcaster" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            <div className="lg:col-span-2 space-y-6">
              <StreamPlayer isLive={true} viewerCount={1247} />
              <Dashboard />
            </div>
            <div className="h-[600px]">
              <ChatBox />
            </div>
          </div>
        )}

        {activeRole === "admin" && (
          <div className="animate-fadeIn">
            <Dashboard />
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass rounded-3xl p-6 shadow-primary">
                <h3 className="text-xl font-bold mb-4">System Status</h3>
                <div className="space-y-3">
                  {[
                    { service: "Stream Server", status: "Operational", color: "gradient-success" },
                    { service: "Chat Service", status: "Operational", color: "gradient-success" },
                    { service: "CDN", status: "High Load", color: "gradient-warning" },
                    { service: "Database", status: "Operational", color: "gradient-success" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-xl glass-hover"
                    >
                      <span className="font-medium">{item.service}</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${item.color}`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass rounded-3xl p-6 shadow-accent">
                <h3 className="text-xl font-bold mb-4">User Management</h3>
                <div className="space-y-3">
                  {[
                    { name: "Sarah Miller", role: "Broadcaster", status: "Live" },
                    { name: "Mike Johnson", role: "Moderator", status: "Active" },
                    { name: "Jessica Lee", role: "Broadcaster", status: "Offline" },
                    { name: "Alex Wong", role: "Premium User", status: "Active" },
                  ].map((user, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-xl glass-hover"
                    >
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.role}</div>
                      </div>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          user.status === "Live"
                            ? "bg-live animate-glow"
                            : user.status === "Active"
                            ? "bg-success"
                            : "bg-muted"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {!activeRole && (
          <div className="text-center py-20 animate-fadeIn">
            <div className="glass rounded-3xl p-12 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Choose Your Role</h2>
              <p className="text-lg text-muted-foreground">
                Select a role above to access the platform features
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;