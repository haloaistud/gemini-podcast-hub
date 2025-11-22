import { Play, Pause, Volume2, VolumeX, Maximize, Eye } from "lucide-react";
import { useState } from "react";

interface StreamPlayerProps {
  isLive?: boolean;
  viewerCount?: number;
}

const StreamPlayer = ({ isLive = true, viewerCount = 1247 }: StreamPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  return (
    <div className="glass rounded-3xl overflow-hidden shadow-primary">
      {/* Video container */}
      <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
        {/* Placeholder for video stream */}
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Live indicator */}
        {isLive && (
          <div className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 rounded-full gradient-warning shadow-glow">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="font-bold text-sm">LIVE</span>
          </div>
        )}

        {/* Viewer count */}
        <div className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-full glass">
          <Eye className="w-4 h-4" />
          <span className="font-semibold text-sm">{viewerCount.toLocaleString()}</span>
        </div>

        {/* Play/Pause overlay */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="relative z-10 w-20 h-20 rounded-full glass-hover flex items-center justify-center hover:scale-110 transition-transform duration-300 group"
        >
          {isPlaying ? (
            <Pause className="w-10 h-10 group-hover:scale-110 transition-transform" />
          ) : (
            <Play className="w-10 h-10 ml-1 group-hover:scale-110 transition-transform" />
          )}
        </button>

        {/* Waveform visualization */}
        <div className="absolute bottom-0 left-0 right-0 h-16 flex items-end justify-center gap-1 px-4 pb-4">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded-t gradient-accent opacity-60"
              style={{
                height: `${isPlaying ? Math.random() * 100 : 20}%`,
                transition: "height 0.1s ease",
                animation: isPlaying ? `pulse ${0.5 + Math.random()}s ease-in-out infinite` : "none",
              }}
            />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-2xl font-bold mb-1">The Superstar Podcast</h3>
          <p className="text-muted-foreground">Episode 127 - Building the Future</p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center hover:scale-105 transition-transform shadow-primary"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-10 h-10 rounded-full glass glass-hover flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* Volume slider */}
          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full w-3/4 gradient-accent rounded-full" />
          </div>

          <button className="w-10 h-10 rounded-full glass glass-hover flex items-center justify-center hover:scale-105 transition-transform">
            <Maximize className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full w-1/3 gradient-primary rounded-full" />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>12:34</span>
            <span>45:28</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamPlayer;