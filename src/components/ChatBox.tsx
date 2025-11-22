import { Send, Smile } from "lucide-react";
import { useState } from "react";

interface Message {
  id: number;
  user: string;
  text: string;
  timestamp: string;
  color: string;
}

const ChatBox = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, user: "Sarah", text: "This is amazing! 🎉", timestamp: "2:34 PM", color: "hsl(var(--primary))" },
    { id: 2, user: "Mike", text: "Great content as always", timestamp: "2:35 PM", color: "hsl(var(--accent))" },
    { id: 3, user: "Jessica", text: "Can't wait for the next episode!", timestamp: "2:36 PM", color: "hsl(var(--secondary))" },
    { id: 4, user: "Alex", text: "Love the energy here! 💪", timestamp: "2:37 PM", color: "hsl(var(--success))" },
  ]);

  const handleSend = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        user: "You",
        text: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        color: "hsl(var(--warning))",
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  return (
    <div className="glass rounded-3xl overflow-hidden shadow-accent h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-glass-border">
        <h3 className="text-xl font-bold">Live Chat</h3>
        <p className="text-sm text-muted-foreground">1,247 viewers active</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-glass-border scrollbar-track-transparent">
        {messages.map((msg) => (
          <div key={msg.id} className="animate-fadeIn">
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                style={{ background: msg.color }}
              >
                {msg.user[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-semibold text-sm">{msg.user}</span>
                  <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                </div>
                <p className="text-sm break-words">{msg.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-glass-border">
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-full glass glass-hover flex items-center justify-center hover:scale-105 transition-transform">
            <Smile className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-full glass border border-glass-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center hover:scale-105 transition-transform shadow-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;