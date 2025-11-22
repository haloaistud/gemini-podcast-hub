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
    <div className="glass-card animate-scaleIn" role="region" aria-label="Stream player">
      {/* Video container */}
      <div className="relative video-container bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
        {/* Placeholder for video stream */}
        <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
        
        {/* Live indicator */}
        {isLive && (
          <div className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 rounded-full gradient-warning shadow-glow animate-slideInLeft live-indicator" role="status" aria-live="polite">
            <div className="w-2 h-2 rounded-full bg-white" aria-hidden="true" />
            <span className="font-bold text-sm">LIVE</span>
          </div>
        )}

        {/* Viewer count */}
        <div className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-full glass animate-slideInRight" role="status" aria-label={`${viewerCount} viewers`}>
          <Eye className="w-4 h-4" aria-hidden="true" />
          <span className="font-semibold text-sm">{viewerCount.toLocaleString()}</span>
        </div>

        {/* Play/Pause overlay */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          aria-label={isPlaying ? "Pause stream" : "Play stream"}
          className="relative z-10 w-20 h-20 rounded-full glass-hover flex items-center justify-center btn-interactive group focus-ring"
        >
          {isPlaying ? (
            <Pause className="w-10 h-10 group-hover:scale-110 transition-transform" aria-hidden="true" />
          ) : (
            <Play className="w-10 h-10 ml-1 group-hover:scale-110 transition-transform" aria-hidden="true" />
          )}
        </button>

        {/* Waveform visualization */}
        <div className="absolute bottom-0 left-0 right-0 h-16 flex items-end justify-center gap-1 px-4 pb-4" aria-hidden="true">
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
      <div className="p-6 space-y-4" role="group" aria-label="Playback controls">
        <div>
          <h3 className="text-2xl font-bold mb-1">The Superstar Podcast</h3>
          <p className="text-muted-foreground">Episode 127 - Building the Future</p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center btn-interactive shadow-primary focus-ring"
          >
            {isPlaying ? <Pause className="w-5 h-5" aria-hidden="true" /> : <Play className="w-5 h-5 ml-0.5" aria-hidden="true" />}
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            aria-label={isMuted ? "Unmute" : "Mute"}
            className="w-10 h-10 rounded-full glass glass-hover flex items-center justify-center btn-interactive focus-ring"
          >
            {isMuted ? <VolumeX className="w-5 h-5" aria-hidden="true" /> : <Volume2 className="w-5 h-5" aria-hidden="true" />}
          </button>

          {/* Volume slider */}
          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden" role="progressbar" aria-label="Volume" aria-valuenow={75} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full w-3/4 gradient-accent rounded-full transition-smooth" />
          </div>

          <button 
            aria-label="Fullscreen"
            className="w-10 h-10 rounded-full glass glass-hover flex items-center justify-center btn-interactive focus-ring"
          >
            <Maximize className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="h-2 rounded-full bg-muted overflow-hidden" role="progressbar" aria-label="Playback progress" aria-valuenow={28} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full w-1/3 gradient-primary rounded-full transition-smooth" />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground" aria-live="off">
            <time>12:34</time>
            <time>45:28</time>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamPlayer;