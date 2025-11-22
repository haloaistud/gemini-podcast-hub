import { Radio, Users, Shield } from "lucide-react";

interface HeaderProps {
  activeRole: "listener" | "broadcaster" | "admin" | null;
  onRoleSelect: (role: "listener" | "broadcaster" | "admin") => void;
}

const Header = ({ activeRole, onRoleSelect }: HeaderProps) => {
  return (
    <header className="relative mb-10 overflow-hidden rounded-3xl glass p-8 md:p-12">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 animate-rotate bg-[conic-gradient(from_0deg,transparent,hsl(var(--primary-start)/0.2),transparent,hsl(var(--secondary-start)/0.2),transparent)]" />
      </div>

      <div className="relative z-10 text-center">
        <h1 className="mb-4 text-5xl md:text-7xl font-black gradient-text">
          Superstar Podcast Hub
        </h1>
        <p className="text-xl md:text-2xl opacity-90 font-light mb-8">
          Professional Live Broadcasting Platform
        </p>

        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full gradient-warning animate-pulse">
          <div className="w-3 h-3 rounded-full bg-white animate-glow" />
          <span className="font-bold text-sm tracking-wide">LIVE NOW</span>
        </div>

        {/* Role selector */}
        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <RoleButton
            icon={<Users className="w-5 h-5" />}
            label="Listener"
            role="listener"
            active={activeRole === "listener"}
            onClick={() => onRoleSelect("listener")}
            gradient="gradient-primary"
          />
          <RoleButton
            icon={<Radio className="w-5 h-5" />}
            label="Broadcaster"
            role="broadcaster"
            active={activeRole === "broadcaster"}
            onClick={() => onRoleSelect("broadcaster")}
            gradient="gradient-secondary"
          />
          <RoleButton
            icon={<Shield className="w-5 h-5" />}
            label="Admin"
            role="admin"
            active={activeRole === "admin"}
            onClick={() => onRoleSelect("admin")}
            gradient="gradient-warning"
          />
        </div>
      </div>
    </header>
  );
};

interface RoleButtonProps {
  icon: React.ReactNode;
  label: string;
  role: string;
  active: boolean;
  onClick: () => void;
  gradient: string;
}

const RoleButton = ({ icon, label, role, active, onClick, gradient }: RoleButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative overflow-hidden px-8 py-4 rounded-full font-semibold
        transition-all duration-300 hover:-translate-y-1
        ${active 
          ? `${gradient} shadow-primary` 
          : 'glass glass-hover border border-glass-border'
        }
      `}
    >
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity">
        <div className="absolute inset-0 -translate-x-full animate-[slideRight_0.5s_ease-out] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
      <div className="relative flex items-center gap-2">
        {icon}
        <span>{label}</span>
      </div>
    </button>
  );
};

export default Header;