import { Users, Mic, Clock, TrendingUp } from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  gradient: string;
}

const StatCard = ({ icon, label, value, gradient }: StatCardProps) => {
  return (
    <div className="glass rounded-2xl p-6 hover:scale-105 transition-transform duration-300 shadow-primary">
      <div className={`w-12 h-12 rounded-xl ${gradient} flex items-center justify-center mb-4 shadow-primary`}>
        {icon}
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
      </div>

      {/* Recent Activity */}
      <div className="glass rounded-3xl p-6 shadow-accent">
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
      </div>

      {/* Quick Actions */}
      <div className="glass rounded-3xl p-6 shadow-secondary">
        <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="p-4 rounded-xl gradient-primary hover:scale-105 transition-transform shadow-primary font-semibold">
            Start Stream
          </button>
          <button className="p-4 rounded-xl gradient-secondary hover:scale-105 transition-transform shadow-secondary font-semibold">
            Schedule
          </button>
          <button className="p-4 rounded-xl gradient-accent hover:scale-105 transition-transform shadow-accent font-semibold">
            Analytics
          </button>
          <button className="p-4 rounded-xl gradient-success hover:scale-105 transition-transform font-semibold">
            Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;