import { Users, Mic, Clock, TrendingUp } from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  gradient: string;
}

const StatCard = ({ icon, label, value, gradient }: StatCardProps) => {
  return (
    <div className="glass-card animate-fadeIn" role="article" aria-label={label}>
      <div className={`w-12 h-12 rounded-xl ${gradient} flex items-center justify-center mb-4 shadow-primary`} aria-hidden="true">
        {icon}
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="space-y-6" id="main-content">
      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" aria-label="Statistics">
        <StatCard
          icon={<Users className="w-6 h-6" />}
          label="Active Listeners"
          value="1,247"
          gradient="gradient-primary"
        />
        <StatCard
          icon={<Mic className="w-6 h-6" />}
          label="Live Broadcasts"
          value="8"
          gradient="gradient-secondary"
        />
        <StatCard
          icon={<Clock className="w-6 h-6" />}
          label="Stream Duration"
          value="3h 24m"
          gradient="gradient-accent"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="Engagement Rate"
          value="94%"
          gradient="gradient-success"
        />
      </section>

      {/* Recent Activity */}
      <section className="glass-card animate-scaleIn" aria-label="Recent activity">
        <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { user: "Sarah joined the stream", time: "2 minutes ago", type: "join" },
            { user: "Mike sent a super chat", time: "5 minutes ago", type: "chat" },
            { user: "Jessica shared the stream", time: "8 minutes ago", type: "share" },
            { user: "Alex became a subscriber", time: "12 minutes ago", type: "subscribe" },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-xl glass-hover hover:scale-[1.02] transition-all"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    activity.type === "join"
                      ? "bg-success animate-pulse"
                      : activity.type === "chat"
                      ? "bg-primary"
                      : activity.type === "share"
                      ? "bg-accent"
                      : "bg-secondary"
                  }`}
                />
                <span className="font-medium">{activity.user}</span>
              </div>
              <span className="text-sm text-muted-foreground">{activity.time}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="glass-card animate-scaleIn" aria-label="Quick actions">
        <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
        <nav className="grid grid-cols-2 md:grid-cols-4 gap-3" role="navigation">
          <button className="p-4 rounded-xl gradient-primary btn-interactive shadow-primary font-semibold focus-ring" aria-label="Start stream">
            Start Stream
          </button>
          <button className="p-4 rounded-xl gradient-secondary btn-interactive shadow-secondary font-semibold focus-ring" aria-label="Schedule broadcast">
            Schedule
          </button>
          <button className="p-4 rounded-xl gradient-accent btn-interactive shadow-accent font-semibold focus-ring" aria-label="View analytics">
            Analytics
          </button>
          <button className="p-4 rounded-xl gradient-success btn-interactive font-semibold focus-ring" aria-label="Open settings">
            Settings
          </button>
        </nav>
      </section>
    </div>
  );
};

export default Dashboard;